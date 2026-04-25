"use server";

import { createClient } from "@/lib/supabase/server";
import { verificarEstoqueNoBanco } from "@/lib/estoque"; // 🌟 Importamos o nosso novo utilitário!

interface CartItemPayload {
  id: string;
  price: number; 
  quantity: number;
}

// 🛡️ 1. TABELA DE PREÇOS NO SERVIDOR (A Fonte da Verdade)
const PRECOS_REAIS: Record<string, number> = {
  'unitv-mensal': 25.00,
  'unitv-trimestral': 70.00, 
  'unitv-anual': 200.00,     
};

export async function processarPedido(
  formData: FormData, 
  items: CartItemPayload[], 
  _totalAmountFrontEnd: number // 🌟 Underline avisa o TypeScript que é ignorado de propósito
) {
  try {
    const supabase = await createClient();

    // 1. VALIDAÇÃO DE SEGURANÇA (CLOUDFLARE TURNSTILE)
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

    // 2. EXTRAÇÃO DOS DADOS
    const nome = formData.get("nome") as string;
    const email = formData.get("email") as string;
    const whatsapp = formData.get("whatsapp") as string;

    if (!nome || !email || !whatsapp || items.length === 0) {
      return { erro: "Preencha todos os campos obrigatórios." };
    }

    // 🛡️ 3. A DUPLA VALIDAÇÃO (ESTOQUE + RECALCULO DE PREÇO)
    let valorTotalCalculadoNoServidor = 0;

    for (const item of items) {
      
      // A) Verifica o estoque com o nosso utilitário limpo (1 linha de código!)
      const estoqueDisponivel = await verificarEstoqueNoBanco(item.id);

      if (estoqueDisponivel < item.quantity) {
        return { 
          erro: `Infelizmente não temos estoque suficiente para o plano selecionado. Por favor, ajuste seu carrinho.` 
        };
      }

      // B) Recalcula o preço blindado
      const precoCorreto = PRECOS_REAIS[item.id];
      
      if (precoCorreto === undefined) {
        return { erro: "Produto inválido ou não reconhecido pelo sistema." };
      }

      valorTotalCalculadoNoServidor += (precoCorreto * item.quantity);
    }

    const { data: { user } } = await supabase.auth.getUser();
    const novoOrderId = crypto.randomUUID();

    // 4. INSERÇÃO NO BANCO (Usando o valor blindado)
    const { error: orderError } = await supabase
      .from("orders")
      .insert({
        id: novoOrderId,
        user_id: user?.id || null, 
        customer_email: email,
        customer_whatsapp: whatsapp,
        total_amount: valorTotalCalculadoNoServidor, 
        status: "pending" 
      });

    if (orderError) {
      console.error("Erro Supabase:", orderError);
      return { erro: "Ocorreu um erro ao salvar o pedido." };
    }

    return { 
      sucesso: true, 
      orderId: novoOrderId,
      mensagem: "Pedido registrado com sucesso!" 
    };

  } catch (error) {
    console.error("Erro interno:", error);
    return { erro: "Erro interno do servidor." };
  }
}