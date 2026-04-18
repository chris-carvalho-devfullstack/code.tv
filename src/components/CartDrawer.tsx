"use client";

import { useCartStore } from "@/store/useCartStore";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, addItem, decreaseQuantity, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Evita problemas de hidratação (SSR vs Client)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Função moderna nativa do JavaScript para formatar em Reais
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <>
      {/* Overlay escuro (Fundo) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={toggleCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer (Carrinho) */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header do Carrinho */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">Seu Carrinho</h2>
          </div>
          <button 
            onClick={toggleCart}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition border-none cursor-pointer"
            aria-label="Fechar carrinho"
          >
            <X size={20} />
          </button>
        </div>

        {/* Lista de Produtos (Scrollável) */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
              <ShoppingBag size={48} className="opacity-20" />
              <p>O seu carrinho está vazio.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-slate-50 pb-4">
                {/* Imagem do Produto (Placeholder) - AQUI FOI ALTERADO PARA shrink-0 */}
                <div className="w-20 h-20 bg-slate-100 rounded-lg shrink-0 relative overflow-hidden">
                  {item.image ? (
                     <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">Img</div>
                  )}
                </div>

                {/* Detalhes e Controles */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800 line-clamp-2">{item.name}</h3>
                    <p className="text-blue-600 font-bold mt-1">{formatCurrency(item.price)}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 bg-slate-100 rounded-full px-2 py-1">
                      <button onClick={() => decreaseQuantity(item.id)} className="text-slate-600 hover:text-slate-900 border-none cursor-pointer bg-transparent">
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button onClick={() => addItem(item)} className="text-slate-600 hover:text-slate-900 border-none cursor-pointer bg-transparent">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 p-1 border-none cursor-pointer bg-transparent">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer (Total e Checkout) */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 p-4 bg-slate-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="text-xl font-bold text-slate-800">{formatCurrency(getTotal())}</span>
            </div>
            <Link 
              href="/checkout" 
              onClick={toggleCart} // Fecha o carrinho ao ir para o checkout
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg flex justify-center items-center hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
            >
              Finalizar Compra
            </Link>
          </div>
        )}
      </div>
    </>
  );
}