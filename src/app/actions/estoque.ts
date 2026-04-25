"use server";

import { createClient } from "@/lib/supabase/server";

export async function consultarEstoqueTotal() {
  const supabase = await createClient();
  
  // count: 'exact', head: true -> Traz apenas o número, não faz o download dos códigos
  const { count: mensal } = await supabase
    .from('chaves')
    .select('*', { count: 'exact', head: true })
    .eq('plano_id', 'unitv-mensal')
    .eq('status', 'disponivel');

  const { count: trimestral } = await supabase
    .from('chaves')
    .select('*', { count: 'exact', head: true })
    .eq('plano_id', 'unitv-trimestral')
    .eq('status', 'disponivel');

  const { count: anual } = await supabase
    .from('chaves')
    .select('*', { count: 'exact', head: true })
    .eq('plano_id', 'unitv-anual')
    .eq('status', 'disponivel');

  return {
    'unitv-mensal': mensal || 0,
    'unitv-trimestral': trimestral || 0,
    'unitv-anual': anual || 0,
  };
}

// NOVA FUNÇÃO: Consulta ultrarrápida para validar acréscimo de itens no carrinho
export async function verificarEstoqueItem(plano_id: string) {
  const supabase = await createClient();
  
  const { count } = await supabase
    .from('chaves')
    .select('*', { count: 'exact', head: true })
    .eq('plano_id', plano_id)
    .eq('status', 'disponivel');

  return count || 0;
}