import { createClient } from "@/lib/supabase/server";

export const runtime = 'edge';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Buscar contagem de chaves
  const { count: chavesDisponiveis } = await supabase
    .from('chaves')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'disponivel');

  const { count: chavesVendidas } = await supabase
    .from('chaves')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'vendida');

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Visão Geral</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 font-medium mb-2">Chaves Disponíveis</h3>
          <p className="text-4xl font-black text-blue-600">{chavesDisponiveis || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 font-medium mb-2">Chaves Vendidas</h3>
          <p className="text-4xl font-black text-emerald-600">{chavesVendidas || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 font-medium mb-2">Total no Estoque</h3>
          <p className="text-4xl font-black text-slate-900">
            {(chavesDisponiveis || 0) + (chavesVendidas || 0)}
          </p>
        </div>
      </div>
    </div>
  );
}