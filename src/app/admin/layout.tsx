import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import Link from "next/link";
import { LayoutDashboard, KeyRound, Users, LogOut, Package } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // 🛡️ BARREIRA ZERO TRUST: Verifica se está logado e se é o e-mail do dono
  const user = await getSessionUser();
  
  // ⚠️ IMPORTANTE: Coloque o seu e-mail de acesso aqui!
  const adminEmail = "chriscarvalho2017@gmail.com"; 

  if (!user || user.email !== adminEmail) {
    // Se for um visitante não autorizado, expulsa de volta para a página inicial
    redirect("/"); 
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      
      {/* Navegação Mobile (Aparece apenas em telas pequenas) */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 sticky top-0 z-10 shadow-sm">
        <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
          Admin Painel
        </h2>
        <div className="flex gap-4">
          <Link href="/admin" className="text-slate-500 hover:text-blue-600 transition"><LayoutDashboard size={24} /></Link>
          <Link href="/admin/chaves" className="text-slate-500 hover:text-blue-600 transition"><KeyRound size={24} /></Link>
          <Link href="/admin/produtos" className="text-slate-500 hover:text-blue-600 transition"><Package size={24} /></Link>
          <Link href="/admin/vendas" className="text-slate-500 hover:text-blue-600 transition"><Users size={24} /></Link>
        </div>
      </div>

      {/* Sidebar Desktop (Oculta no mobile, Modo Claro) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            Admin Painel
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition font-medium">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/chaves" className="flex items-center gap-3 px-4 py-3 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition font-medium">
            <KeyRound size={20} /> Gerenciar Chaves
          </Link>
          <Link href="/admin/produtos" className="flex items-center gap-3 px-4 py-3 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition font-medium">
            <Package size={20} /> Produtos
          </Link>
          <Link href="/admin/vendas" className="flex items-center gap-3 px-4 py-3 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition font-medium">
            <Users size={20} /> Vendas / Clientes
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition font-medium">
            <LogOut size={20} /> Sair do Admin
          </Link>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}