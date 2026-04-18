"use server";

import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto"; // Ferramenta nativa do Node.js para gerar IDs

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

    // 1. Extrair os dados do formulário
    const nome = formData.get("nome") as string;
    const email = formData.get("email") as string;
    const whatsapp = formData.get("whatsapp") as string;

    // Validação básica
    if (!nome || !email || !whatsapp || items.length === 0) {
      return { erro: "Por favor, preencha todos os campos obrigatórios e adicione itens." };
    }

    // 2. Verificar se o utilizador tem sessão iniciada
    const { data: { user } } = await supabase.auth.getUser();

    // 3. GERAR O ID AQUI NO SERVIDOR (Evita o erro de leitura do RLS)
    const novoOrderId = randomUUID();

    // 4. Inserir o pedido na tabela orders (SEM usar o .select())
    const { error: orderError } = await supabase
      .from("orders")
      .insert({
        id: novoOrderId, // Passamos o ID gerado por nós
        user_id: user?.id || null, 
        customer_email: email,
        customer_whatsapp: whatsapp,
        total_amount: totalAmount,
        status: "pending" 
      });

    if (orderError) {
      console.error("Erro Supabase:", orderError);
      return { erro: "Ocorreu um erro ao guardar o pedido no banco. Verifique as permissões (RLS)." };
    }

    // SUCESSO - MODO TESTE 
    console.log("✅ TESTE BEM SUCEDIDO! Pedido salvo com ID:", novoOrderId);
    
    return { 
      sucesso: true, 
      orderId: novoOrderId, // Retornamos o ID que nós mesmos criamos
      mensagem: "Teste: Pedido registado no banco com sucesso!" 
    };

  } catch (error) {
    console.error("Erro interno:", error);
    return { erro: "Erro interno do servidor." };
  }
}