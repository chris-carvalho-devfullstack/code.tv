import Link from "next/link";
import { LayoutDashboard, KeyRound, Users, LogOut } from "lucide-react";



export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar Lateral */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            Admin Painel
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/chaves" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition">
            <KeyRound size={20} /> Gerenciar Chaves
          </Link>
          <Link href="/admin/vendas" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition">
            <Users size={20} /> Vendas / Clientes
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg transition">
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