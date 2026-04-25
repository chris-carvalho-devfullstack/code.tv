import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // Mudamos a importação para o pacote puro

export const runtime = 'edge'; 
export const dynamic = 'force-dynamic';

// Criamos um cliente administrador que "pula" o RLS para poder fazer a contagem.
// Isso é seguro porque fica restrito ao servidor.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plano_id = searchParams.get('plano_id');

  try {
    // Usamos o supabaseAdmin em vez do supabase comum
    if (plano_id) {
      const { count } = await supabaseAdmin
        .from('chaves')
        .select('*', { count: 'exact', head: true })
        .eq('plano_id', plano_id)
        .eq('status', 'disponivel');

      return NextResponse.json({ count: count || 0 });
    }

    const { count: mensal } = await supabaseAdmin
      .from('chaves')
      .select('*', { count: 'exact', head: true })
      .eq('plano_id', 'unitv-mensal')
      .eq('status', 'disponivel');

    const { count: trimestral } = await supabaseAdmin
      .from('chaves')
      .select('*', { count: 'exact', head: true })
      .eq('plano_id', 'unitv-trimestral')
      .eq('status', 'disponivel');

    const { count: anual } = await supabaseAdmin
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