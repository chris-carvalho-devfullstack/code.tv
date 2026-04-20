import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { PackagePlus, ImageIcon, Trash2, Box } from "lucide-react";

export const runtime = 'edge';

export default async function GerenciarProdutos() {
  const supabase = await createClient();
  
  // 1. Busca os produtos cadastrados
  const { data: produtos } = await supabase.from('produtos').select('*').order('nome');

  // 2. Busca apenas as chaves disponíveis para calcular o estoque
  const { data: chavesDisponiveis } = await supabase
    .from('chaves')
    .select('plano_id')
    .eq('status', 'disponivel');

  // 3. Agrupa a contagem por plano
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

  // Action para criar produto com correção de preço e logs
  async function handleProduto(formData: FormData) {
    "use server";
    try {
      const nome = formData.get('nome') as string;
      
      // Pega o preço, troca vírgula por ponto (caso o usuário digite 59,90) e converte para número
      const precoStr = (formData.get('preco') as string).replace(',', '.');
      const preco = parseFloat(precoStr);
      
      const imagem_url = formData.get('imagem_url') as string;
      const plano_id = formData.get('plano_id') as string;

      console.log("Tentando salvar:", { nome, preco, imagem_url, plano_id });

      const supabase = await createClient();
      
      // Faz o insert
      const { error } = await supabase
        .from('produtos')
        .insert([{ nome, preco, imagem_url, plano_id }]);

      if (error) {
        console.error("ERRO DO SUPABASE:", error.message);
        return; 
      }

      console.log("Produto salvo com sucesso!");
      revalidatePath('/admin/produtos');

    } catch (err) {
      console.error("ERRO GERAL NO SERVIDOR:", err);
    }
  }

  // Action para deletar produto
  async function deleteProduto(formData: FormData) {
    "use server";
    const id = formData.get('id') as string;
    const supabase = await createClient();
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
            {/* type="text" permite que o usuário digite a vírgula sem o navegador bloquear */}
            <input name="preco" type="text" inputMode="decimal" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="59,90" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL da Imagem</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400"><ImageIcon size={16}/></span>
              <input name="imagem_url" type="url" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vincular ao Plano / Estoque</label>
            <select name="plano_id" required className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 transition">
              <option value="unitv-mensal">Mensal ({estoque['unitv-mensal']} chaves disp.)</option>
              <option value="unitv-trimestral">Trimestral ({estoque['unitv-trimestral']} chaves disp.)</option>
              <option value="unitv-anual">Anual ({estoque['unitv-anual']} chaves disp.)</option>
            </select>
          </div>
          <button type="submit" className="lg:col-span-4 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 mt-2">
            Cadastrar Produto
          </button>
        </form>
      </div>

      {/* Listagem de Produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {produtos?.map((prod) => {
          // Pega o estoque atual do plano vinculado a este produto
          const estoqueAtual = estoque[prod.plano_id as keyof typeof estoque] || 0;
          
          return (
            <div key={prod.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 hover:shadow-md transition relative group">
              <img src={prod.imagem_url} alt={prod.nome} className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200" />
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 line-clamp-1">{prod.nome}</h4>
                {/* Number() garante que o toFixed funcione mesmo se o banco devolver string */}
                <p className="text-sm text-blue-600 font-bold">R$ {Number(prod.preco).toFixed(2)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Box size={14} className="text-slate-400" />
                  <span className={`text-xs font-semibold ${estoqueAtual > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {estoqueAtual > 0 ? `${estoqueAtual} em estoque` : 'Esgotado'}
                  </span>
                </div>
              </div>
              <form action={deleteProduto} className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <input type="hidden" name="id" value={prod.id} />
                <button type="submit" className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                  <Trash2 size={18}/>
                </button>
              </form>
            </div>
          );
        })}
        {(!produtos || produtos.length === 0) && (
          <div className="col-span-full p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 border-dashed">
            Nenhum produto cadastrado. Adicione o primeiro acima!
          </div>
        )}
      </div>
    </div>
  );
}