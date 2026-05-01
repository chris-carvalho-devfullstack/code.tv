"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod"; 

interface CartItemPayload {
  id: string;         // plano_id (ex: unitv-mensal)
  produto_id: string; // ID real da tabela 'produtos'
  price: number; 
  quantity: number;
}

const PRECOS_REAIS: Record<string, number> = {
  'unitv-mensal': 25.00,
  'unitv-trimestral': 70.00, 
  'unitv-anual': 200.00,     
};

// 🛡️ ESQUEMA DE VALIDAÇÃO ZOD ATUALIZADO
const checkoutSchema = z.object({
  nome: z.string()
    .trim() 
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(100, "O nome é muito longo.")
    .refine((val) => val.split(/\s+/).length >= 2, {
      message: "Por favor, insira o seu nome completo (nome e sobrenome).",
    }),
  
  email: z.string()
    .trim() 
    .toLowerCase() 
    .email("Por favor, forneça um e-mail válido.")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Formato de e-mail inválido. Verifique o final (ex: .com, .com.br).")
    .max(150, "O e-mail é muito longo."),
  
  whatsapp: z.string()
    .transform((val) => val.replace(/\D/g, '')) 
    .pipe(
      z.string()
        .length(11, "O WhatsApp deve ter exatamente 11 números (DDD + 9 dígitos).")
        .regex(/^[1-9]{2}9[0-9]{8}$/, "Formato inválido. Insira um DDD válido seguido do 9º dígito.")
    )
});

/**
 * 1. FASE DE CHECKOUT (RESERVA)
 * Cria o pedido pendente e reserva a chave por 10 minutos.
 */
export async function processarPedido(
  formData: FormData, 
  items: CartItemPayload[], 
  totalAmountFrontEnd: number 
) {
  void totalAmountFrontEnd;

  try {
    const supabase = await createClient();

    const turnstileToken = formData.get("cf-turnstile-response") as string;
    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    if (!turnstileToken) {
      return { erro: "Por favor, complete a verificação de segurança." };
    }

    const verificado = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${turnstileToken}`,
    });

    const resultadoVerificacao = await verificado.json();
    if (!resultadoVerificacao.success) {
      return { erro: "Falha na verificação de segurança. Tente novamente." };
    }

    const rawData = {
      nome: formData.get("nome"),
      email: formData.get("email"),
      whatsapp: formData.get("whatsapp"),
    };

    if (items.length === 0) {
      return { erro: "O seu carrinho está vazio." };
    }

    const validatedFields = checkoutSchema.safeParse(rawData);

    if (!validatedFields.success) {
      const errorMessage = validatedFields.error.issues[0].message;
      return { erro: errorMessage };
    }

    const { nome, email, whatsapp } = validatedFields.data;

    let valorTotalCalculadoNoServidor = 0;

    for (const item of items) {
      const precoCorreto = PRECOS_REAIS[item.id];
      
      if (precoCorreto === undefined) {
        return { erro: "Produto inválido ou não reconhecido pelo sistema." };
      }

      valorTotalCalculadoNoServidor += (precoCorreto * item.quantity);
    }

    const { data: { user } } = await supabase.auth.getUser();
    const novoOrderId = crypto.randomUUID();

    const { error: orderError } = await supabase
      .from("orders")
      .insert({
        id: novoOrderId,
        user_id: user?.id || null, 
        customer_email: email,
        customer_name: nome, 
        customer_whatsapp: whatsapp,
        total_amount: valorTotalCalculadoNoServidor, 
        status: "pending" 
      });

    if (orderError) {
      console.error("Erro Supabase (Orders):", orderError);
      return { erro: "Ocorreu um erro ao salvar o pedido principal." };
    }

    const orderItemsData = items.map(item => ({
      order_id: novoOrderId,
      produto_id: item.produto_id,
      quantidade: item.quantity,
      preco_unitario: PRECOS_REAIS[item.id]
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsData);

    if (itemsError) {
      console.error("Erro ao salvar itens do pedido:", itemsError);
      await supabase.from("orders").update({ status: 'cancelled' }).eq('id', novoOrderId);
      return { erro: "Erro ao registrar os produtos do pedido." };
    }

    // AÇÃO CRÍTICA: Reservar as chaves
    for (const item of items) {
      const { error: rpcError } = await supabase
        .rpc('reservar_chaves_seguro', {
          p_order_id: novoOrderId,
          p_plano_id: item.id,
          p_quantidade: item.quantity,
          p_tempo_minutos: 10
        });

      if (rpcError) {
        await supabase.from("orders").update({ status: 'cancelled' }).eq('id', novoOrderId);
        return { erro: `Houve um conflito de estoque para o plano selecionado. Por favor, tente novamente.` };
      }
    }

    return { 
      sucesso: true, 
      orderId: novoOrderId,
      mensagem: "Pedido registrado com sucesso e chaves reservadas!" 
    };

  } catch (error) {
    console.error("Erro interno:", error);
    return { erro: "Erro interno do servidor." };
  }
}

/**
 * 2. FASE DE PAGAMENTO (BLINDAGEM DA CHAVE)
 * 🌟 NOVA AÇÃO: Transforma a chave de RESERVADA para VENDIDA.
 */
export async function confirmarPagamentoAction(orderId: string) {
  try {
    const supabase = await createClient();

    // Chama a RPC que criamos para garantir as chaves (status = 'VENDIDA') 
    // e atualizar o pedido para 'paid' em uma transação única
    const { error: rpcError } = await supabase.rpc('confirmar_pagamento_chave', {
      p_order_id: orderId
    });

    if (rpcError) {
      console.error("[ERRO CRÍTICO] Falha ao transitar chave para VENDIDA:", rpcError);
      return { 
        sucesso: false, 
        erro: "O pagamento foi reconhecido, mas houve um erro ao processar a chave. Contate o suporte." 
      };
    }

    // Força a atualização do cache do Next.js
    revalidatePath(`/checkout/pagamento/${orderId}`);
    revalidatePath('/minha-conta');

    return { 
      sucesso: true,
      mensagem: "Pagamento confirmado e chave garantida com sucesso!"
    };

  } catch (error) {
    console.error("Erro interno ao confirmar pagamento:", error);
    return { sucesso: false, erro: "Erro interno do servidor." };
  }
}