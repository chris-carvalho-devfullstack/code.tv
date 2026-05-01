// src/app/admin/produtos/page.tsx

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { PackagePlus, ImageIcon, Trash2, Box, Upload } from "lucide-react";

export const runtime = 'edge';

export default async function GerenciarProdutos() {
  const supabase = await createClient();
  
  const { data: produtos } = await supabase.from('produtos').select('*').order('nome');

  // CORREÇÃO: status em MAIÚSCULO para bater com o banco de dados
  const { data: chavesDisponiveis } = await supabase
    .from('chaves')
    .select('plano_id')
    .eq('status', 'DISPONIVEL');

  const estoque = {
    'unitv-mensal': 0,
    'unitv-trimestral': 0,
    'unitv-anual': 0,
  };

  chavesDisponiveis?.forEach((chave) => {
    if (chave.plano_id in estoque) {
      estoque[chave.plano_id as keyof typeof estoque] += 1;
    }
  });

  // Action atualizada para processar o Upload
  async function handleProduto(formData: FormData) {
    "use server";
    try {
      const nome = formData.get('nome') as string;
      const precoStr = (formData.get('preco') as string).replace(',', '.');
      const preco = parseFloat(precoStr);
      const plano_id = formData.get('plano_id') as string;
      const arquivoImagem = formData.get('imagem') as File; // Captura o arquivo

      const supabase = await createClient();
      let imagem_url = "";

      // Lógica de Upload para o Supabase Storage
      if (arquivoImagem && arquivoImagem.size > 0) {
        const fileExt = arquivoImagem.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `capas/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('produtos')
          .upload(filePath, arquivoImagem);

        if (uploadError) {
          console.error("Erro no upload da imagem:", uploadError.message);
          return;
        }

        // Obtém a URL pública
        const { data: publicUrlData } = supabase.storage
          .from('produtos')
          .getPublicUrl(filePath);
          
        imagem_url = publicUrlData.publicUrl;
      }

      // Insere no banco com a URL gerada
      const { error } = await supabase
        .from('produtos')
        .insert([{ nome, preco, imagem_url, plano_id }]);

      if (error) {
        console.error("ERRO DO SUPABASE:", error.message);
        return; 
      }

      revalidatePath('/admin/produtos');

    } catch (err) {
      console.error("ERRO GERAL NO SERVIDOR:", err);
    }
  }

  async function deleteProduto(formData: FormData) {
    "use server";
    const id = formData.get('id') as string;
    const supabase = await createClient();
    
    // Opcional: Você pode adicionar aqui a lógica para deletar o arquivo do Storage também
    
    await supabase.from('produtos').delete().eq('id', id);
    revalidatePath('/admin/produtos');
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Gestão de Produtos</h1>

      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
          <PackagePlus size={20} className="text-blue-600"/> Novo Produto
        </h2>
        <form action={handleProduto} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Produto</label>
            <input name="nome" type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Ex: UniTV Mensal" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Preço (R$)</label>
            <input name="preco" type="text" inputMode="decimal" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="59,90" />
          </div>
          
          {/* CAMPO DE UPLOAD ATUALIZADO */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Capa do Produto</label>
            <div className="relative">
              <input 
                name="imagem" 
                type="file" 
                accept="image/*" 
                required 
                className="w-full px-4 py-1.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vincular Estoque</label>
            <select name="plano_id" required className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 transition">
              <option value="unitv-mensal">Mensal ({estoque['unitv-mensal']} chaves)</option>
              <option value="unitv-trimestral">Trimestral ({estoque['unitv-trimestral']} chaves)</option>
              <option value="unitv-anual">Anual ({estoque['unitv-anual']} chaves)</option>
            </select>
          </div>
          <button type="submit" className="lg:col-span-4 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 mt-2 flex items-center justify-center gap-2">
            <Upload size={18} /> Cadastrar Produto
          </button>
        </form>
      </div>

      {/* Listagem permanece similar, exibindo a imagem vinda do Storage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {produtos?.map((prod) => {
          const estoqueAtual = estoque[prod.plano_id as keyof typeof estoque] || 0;
          return (
            <div key={prod.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 hover:shadow-md transition relative group">
              <img src={prod.imagem_url} alt={prod.nome} className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200" />
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 line-clamp-1">{prod.nome}</h4>
                <p className="text-sm text-blue-600 font-bold">R$ {Number(prod.preco).toFixed(2)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Box size={14} className="text-slate-400" />
                  <span className={`text-xs font-semibold ${estoqueAtual > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {estoqueAtual > 0 ? `${estoqueAtual} em estoque` : 'Esgotado'}
                  </span>
                </div>
              </div>
              <form action={deleteProduto}>
                <input type="hidden" name="id" value={prod.id} />
                <button type="submit" className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                  <Trash2 size={18}/>
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}