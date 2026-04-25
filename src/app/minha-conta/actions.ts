"use server";

import { createClient } from "@/lib/supabase/server";

export async function buscarDadosDoCliente() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return { sucesso: false, erro: "Usuário não autenticado." };
    }

    // 1. Busca os pedidos usando o e-mail do cliente
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', user.email)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error("Erro ao buscar pedidos:", ordersError);
      return { sucesso: false, erro: "Erro ao carregar pedidos." };
    }

    const pedidos = ordersData || [];

    // 2. Busca as chaves vinculadas a esses pedidos (CORREÇÃO DO ERRO 400)
    let chaves = [];
    const pedidosIds = pedidos.map(p => p.id);

    if (pedidosIds.length > 0) {
      const { data: keysData, error: keysError } = await supabase
        .from('chaves')
        .select('*')
        .in('order_id', pedidosIds); // Busca chaves onde o order_id pertence ao usuário

      if (keysError) {
        console.error("Erro ao buscar chaves:", keysError);
      } else {
        chaves = keysData || [];
      }
    }

    return {
      sucesso: true,
      orders: pedidos,
      keys: chaves
    };
    
  } catch (error) {
    console.error("Erro interno ao buscar dados:", error);
    return { sucesso: false, erro: "Erro interno do servidor." };
  }
}