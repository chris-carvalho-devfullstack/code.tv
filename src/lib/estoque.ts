import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

export async function verificarEstoqueNoBanco(planoId: string) {
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // A MÁGICA: Conta chaves disponíveis OU reservadas cujo tempo já expirou
  const { count, error } = await supabaseAdmin
    .from('chaves')
    .select('id', { count: 'exact', head: true })
    .eq('plano_id', planoId)
    .or(`status.eq.disponivel,and(status.eq.reservada,reserva_expira_em.lt.now())`);

  if (error) {
    console.error("Erro ao checar estoque:", error);
    return 0;
  }

  return count || 0;
}