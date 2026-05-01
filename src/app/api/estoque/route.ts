import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; 

export const runtime = 'edge'; 
export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Condição mágica: Pega chaves livres ou aquelas em que a reserva de 10 minutos já "venceu"
const regraDeEstoque = 'status.eq.DISPONIVEL,and(status.eq.RESERVADA,reserva_expira_em.lt.now())';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plano_id = searchParams.get('plano_id');

  try {
    // 1. Busca por um plano específico (se o parâmetro for passado na URL)
    if (plano_id) {
      const { count } = await supabaseAdmin
        .from('chaves')
        .select('*', { count: 'exact', head: true })
        .eq('plano_id', plano_id)
        .or(regraDeEstoque);

      return NextResponse.json({ count: count || 0 });
    }

    // 2. Busca o estoque de todos os planos de uma vez (para carregar a vitrine inteira)
    const { count: mensal } = await supabaseAdmin
      .from('chaves')
      .select('*', { count: 'exact', head: true })
      .eq('plano_id', 'unitv-mensal')
      .or(regraDeEstoque);

    const { count: trimestral } = await supabaseAdmin
      .from('chaves')
      .select('*', { count: 'exact', head: true })
      .eq('plano_id', 'unitv-trimestral')
      .or(regraDeEstoque);

    const { count: anual } = await supabaseAdmin
      .from('chaves')
      .select('*', { count: 'exact', head: true })
      .eq('plano_id', 'unitv-anual')
      .or(regraDeEstoque);

    return NextResponse.json({
      'unitv-mensal': mensal || 0,
      'unitv-trimestral': trimestral || 0,
      'unitv-anual': anual || 0,
    });
    
  } catch (error) {
    console.error("Erro na API de estoque:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}