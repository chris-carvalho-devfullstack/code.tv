"use server";

import { createClient } from "@/lib/supabase/server";

interface CartItemPayload {
  id: string;
  price: number;
  quantity: number;
}

export async function processarPedido(
  formData: FormData, 
  items: CartItemPayload[], 
  totalAmount: number
) {
  try {
    const supabase = await createClient();

    // 1. VALIDAÇÃO DE SEGURANÇA (CLOUDFLARE TURNSTILE)
    const turnstileToken = formData.get("cf-turnstile-response") as string;
    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    if (!turnstileToken) {
      return { erro: "Por favor, complete a verificação de segurança." };
    }

    // Valida o token com a API da Cloudflare
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

    const { data: { user } } = await supabase.auth.getUser();

    // 3. GERAÇÃO DE ID (Web Crypto API compatível com Edge)
    const novoOrderId = crypto.randomUUID();

    // 4. INSERÇÃO NO BANCO
    const { error: orderError } = await supabase
      .from("orders")
      .insert({
        id: novoOrderId,
        user_id: user?.id || null, 
        customer_email: email,
        customer_whatsapp: whatsapp,
        total_amount: totalAmount,
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