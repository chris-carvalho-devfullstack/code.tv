"use client";

import Link from "next/link";
import { ShoppingCart, Tv, User as UserIcon } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // Adicionado cliente Supabase

export default function Navbar() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  
  // Novos estados para autenticação
  const [userName, setUserName] = useState<string | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);

    // 1. Busca o utilizador atual ao carregar a página
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const full = user.user_metadata?.full_name || user.email?.split('@')[0] || "Cliente";
        setUserName(full.trim().split(' ')[0]); // Pega apenas o primeiro nome
      }
      setIsCheckingUser(false);
    }

    getUser();

    // 2. Fica "à escuta" de logins/logouts para atualizar o menu em tempo real
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const full = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "Cliente";
        setUserName(full.trim().split(' ')[0]);
      } else {
        setUserName(null); // Remove o nome se fizer logout
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <Tv /> <span>CODE-TV</span>
        </Link>

        <div className="flex items-center gap-6">
          
          {/* LÓGICA DO MENU DO UTILIZADOR */}
          {!isCheckingUser ? (
            <Link 
              href={userName ? "/minha-conta" : "/login"} 
              className="text-sm font-bold text-slate-600 hover:text-blue-600 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <UserIcon size={16} className={userName ? "text-blue-500" : "text-slate-400"} />
              {userName ? `Olá, ${userName}` : "Logar ou Criar Conta"}
            </Link>
          ) : (
            // Skeleton de carregamento para evitar que o texto pisque
            <div className="h-5 w-32 bg-slate-100 rounded-md animate-pulse"></div>
          )}
          
          <button onClick={() => useCartStore.getState().toggleCart()} className="relative p-2 bg-slate-100 rounded-full hover:bg-blue-100 transition cursor-pointer border-none">
            <ShoppingCart size={20} className="text-slate-700" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}