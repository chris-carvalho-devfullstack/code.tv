import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// 🚀 Otimizações obrigatórias para a Cloudflare
export const runtime = 'edge'; 
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const supabase = await createClient();
  
  // Pega a URL e verifica se veio algum "plano_id" específico (usado no Carrinho)
  const { searchParams } = new URL(request.url);
  const plano_id = searchParams.get('plano_id');

  try {
    // CENÁRIO 1: O Carrinho perguntando de um único item
    if (plano_id) {
      const { count } = await supabase
        .from('chaves')
        .select('*', { count: 'exact', head: true })
        .eq('plano_id', plano_id)
        .eq('status', 'disponivel');

      return NextResponse.json({ count: count || 0 });
    }

    // CENÁRIO 2: A Página Inicial perguntando o total de tudo
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

    return NextResponse.json({
      'unitv-mensal': mensal || 0,
      'unitv-trimestral': trimestral || 0,
      'unitv-anual': anual || 0,
    });
    
  } catch (error) {
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}