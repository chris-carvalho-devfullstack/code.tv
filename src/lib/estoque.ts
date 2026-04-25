import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

// Utilitário centralizado para checar estoque com a Chave Mestra
export async function verificarEstoqueNoBanco(planoId: string) {
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { count, error } = await supabaseAdmin
    .from('chaves')
    .select('*', { count: 'exact', head: true })
    .eq('plano_id', planoId)
    .eq('status', 'disponivel');

  if (error) {
    console.error("Erro ao checar estoque:", error);
    return 0;
  }

  return count || 0;
}