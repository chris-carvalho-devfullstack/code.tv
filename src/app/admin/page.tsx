import { createClient } from "@/lib/supabase/server";

export const runtime = 'edge';

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { count: chavesDisponiveis } = await supabase
    .from('chaves')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'disponivel');

  const { count: chavesVendidas } = await supabase
    .from('chaves')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'vendida');

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 md:mb-8">Visão Geral</h1>
      
      {/* Os cards já são mobile-first graças ao grid-cols-1 md:grid-cols-3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <h3 className="text-slate-500 font-medium mb-2 text-sm md:text-base">Chaves Disponíveis</h3>
          <p className="text-3xl md:text-4xl font-black text-blue-600">{chavesDisponiveis || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <h3 className="text-slate-500 font-medium mb-2 text-sm md:text-base">Chaves Vendidas</h3>
          <p className="text-3xl md:text-4xl font-black text-emerald-600">{chavesVendidas || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <h3 className="text-slate-500 font-medium mb-2 text-sm md:text-base">Total no Estoque</h3>
          <p className="text-3xl md:text-4xl font-black text-slate-900">
            {(chavesDisponiveis || 0) + (chavesVendidas || 0)}
          </p>
        </div>
      </div>
    </div>
  );
}