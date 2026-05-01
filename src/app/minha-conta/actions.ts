"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Busca todos os pedidos e chaves vinculados ao e-mail do usuário autenticado.
 */
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

    // 2. Busca as chaves vinculadas a esses pedidos (Filtrando por order_id)
    let chaves = [];
    const pedidosIds = pedidos.map(p => p.id);

    if (pedidosIds.length > 0) {
      const { data: keysData, error: keysError } = await supabase
        .from('chaves')
        .select('*')
        .in('order_id', pedidosIds); 

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

/**
 * Action responsável pelo resgate seguro da chave (Estilo Eneba).
 * Esta função chama a RPC no banco para garantir que a revelação seja atômica.
 */
export async function revelarChaveAction(orderId: string, planoId: string) {
  try {
    const supabase = await createClient();

    // Chamada para a RPC que gerencia a transação segura no banco
    const { data, error } = await supabase.rpc('revelar_chave_comprada', {
      p_order_id: orderId,
      p_plano_id: planoId,
    });

    if (error) {
      console.error("[ERRO SEGURANÇA]: Falha ao revelar chave:", error.message);
      return { 
        sucesso: false, 
        erro: "Não foi possível resgatar a chave. Verifique o status do pagamento ou estoque." 
      };
    }

    // Força a atualização das páginas para refletir o status 'REVELADA' e exibir o código
    revalidatePath('/minha-conta');
    revalidatePath(`/checkout/pagamento/${orderId}`);

    return { 
      sucesso: true, 
      chave: data.chave 
    };
    
  } catch (error) {
    console.error("Erro interno ao revelar chave:", error);
    return { 
      sucesso: false, 
      erro: "Erro interno do servidor ao processar o resgate." 
    };
  }
}