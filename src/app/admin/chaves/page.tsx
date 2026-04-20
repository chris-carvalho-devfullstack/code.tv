import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Trash2, Plus } from "lucide-react";

export const runtime = 'edge';

export default async function GerenciarChaves() {
  const supabase = await createClient();
  const { data: chaves } = await supabase.from('chaves').select('*').order('created_at', { ascending: false });

  // Server Action para adicionar chave
  async function addChave(formData: FormData) {
    "use server";
    const codigo = formData.get('codigo') as string;
    const plano = formData.get('plano') as string;
    const supabase = await createClient();
    
    await supabase.from('chaves').insert([{ codigo, plano_id: plano, status: 'disponivel' }]);
    revalidatePath('/admin/chaves');
  }

  // Server Action para deletar chave
  async function deleteChave(formData: FormData) {
    "use server";
    const id = formData.get('id') as string;
    const supabase = await createClient();
    
    await supabase.from('chaves').delete().eq('id', id);
    revalidatePath('/admin/chaves');
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Estoque de Chaves</h1>

      {/* Formulário de Adição */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <h2 className="text-lg font-bold mb-4">Adicionar Nova Chave</h2>
        <form action={addChave} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Código (16 dígitos)</label>
            <input type="text" name="codigo" required maxLength={16}
                   className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                   placeholder="ABCD-EFGH-IJKL-MNOP" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Plano</label>
            <select name="plano" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none bg-white">
              <option value="unitv-mensal">Mensal UniTV</option>
              <option value="unitv-trimestral">Trimestral UniTV</option>
              <option value="unitv-anual">Anual UniTV</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 h-[42px]">
            <Plus size={18} /> Adicionar
          </button>
        </form>
      </div>

      {/* Tabela de Listagem */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-600">Código</th>
              <th className="p-4 font-semibold text-slate-600">Plano</th>
              <th className="p-4 font-semibold text-slate-600">Status</th>
              <th className="p-4 font-semibold text-slate-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {chaves?.map((chave) => (
              <tr key={chave.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="p-4 font-mono text-sm">{chave.codigo}</td>
                <td className="p-4 text-slate-600">{chave.plano_id}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    chave.status === 'disponivel' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {chave.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <form action={deleteChave}>
                    <input type="hidden" name="id" value={chave.id} />
                    <button type="submit" className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition">
                      <Trash2 size={18} />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(!chaves || chaves.length === 0) && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">Nenhuma chave cadastrada ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}