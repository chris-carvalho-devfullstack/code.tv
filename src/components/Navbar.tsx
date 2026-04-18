"use client";

import Link from "next/link";
import { ShoppingCart, Tv } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";

export default function Navbar() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  // Evita erro de hidratação com o Zustand persist
  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <Tv /> <span>CODE-TV</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600">
            Minha Conta
          </Link>
          
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