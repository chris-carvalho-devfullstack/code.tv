"use client";

// Configurações para a Cloudflare aceitar o POST da Server Action
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { processarPedido } from "./actions";
import { useCartStore } from "@/store/useCartStore";
import { Lock, ChevronRight, ShieldCheck, Mail, User, CreditCard, ArrowLeft, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";

export default function CheckoutPage() {
  const { items, getTotal } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [isErro, setIsErro] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleCheckout = async (formData: FormData) => {
    setLoading(true);
    setMensagem("");
    setIsErro(false);
    
    const resultado = await processarPedido(formData, items, getTotal());
    
    if (resultado?.erro) {
      setMensagem(resultado.erro);
      setIsErro(true);
      setLoading(false);
    } else if (resultado?.sucesso) {
      setMensagem(resultado.mensagem || "Pedido registrado! Redirecionando...");
      setIsErro(false);
      
      // Simula o tempo de processamento antes de ir para a página de pagamento
      setTimeout(() => {
        router.push(`/checkout/pagamento/${resultado.orderId}`);
      }, 1500);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Seu carrinho está vazio</h1>
        <Link href="/" className="text-blue-600 font-medium hover:underline flex items-center gap-2 cursor-pointer">
          Voltar para a loja <ChevronRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200 py-4 mb-8">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition text-sm font-medium cursor-pointer">
            <ArrowLeft size={16} /> 
            Continuar Comprando
          </Link>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Lock size={14} />
            <span>Checkout Seguro</span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6">
        <form action={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">1</div>
                <h2 className="text-lg font-bold text-slate-800">Seus Dados</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      name="nome"
                      required
                      placeholder="Ex: João Silva"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">E-mail para entrega</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        name="email"
                        required
                        placeholder="seu@email.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input 
                        type="tel" 
                        name="whatsapp"
                        required
                        placeholder="(11) 99999-9999"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">2</div>
                <h2 className="text-lg font-bold text-slate-800">Pagamento</h2>
              </div>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 rounded-xl border-2 border-blue-600 bg-blue-50 cursor-pointer transition">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-100 italic font-black text-blue-600 text-xs">PIX</div>
                    <div>
                      <p className="font-bold text-slate-800">Pix - Aprovação Instantânea</p>
                      <p className="text-xs text-slate-500 uppercase">Receba sua chave em segundos</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-4 border-blue-600 bg-white"></div>
                </label>

                <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 cursor-not-allowed opacity-50">
                  <div className="flex items-center gap-4">
                    <CreditCard className="text-slate-400" />
                    <div>
                      <p className="font-bold text-slate-800">Cartão de Crédito</p>
                      <p className="text-xs text-slate-500 italic">Disponível em breve</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border border-slate-200 bg-white"></div>
                </label>
              </div>
            </section>

            <div className="flex justify-center">
              <Turnstile siteKey="0x4AAAAAAC_YPcOthUeQyb-C" />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-24">
              <div className="p-6 bg-slate-50 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Resumo do Pedido</h3>
              </div>
              
              <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-[10px] font-bold text-slate-500">{item.quantity}x</span>
                      <span className="text-slate-700 font-medium">{item.name}</span>
                    </div>
                    <span className="text-slate-900 font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-white border-t border-slate-100 space-y-4">
                <div className="flex justify-between text-slate-500 text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(getTotal())}</span>
                </div>
                <div className="flex justify-between text-slate-800 font-bold text-lg pt-2 border-t border-dashed border-slate-200">
                  <span>Total a pagar</span>
                  <span className="text-blue-600">{formatCurrency(getTotal())}</span>
                </div>

                {mensagem && (
                  <div className={`p-3 rounded-lg text-sm font-medium text-center ${isErro ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                    {mensagem}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg shadow-green-600/20 mt-4 uppercase text-sm tracking-wider"
                >
                  <ShieldCheck size={20} />
                  {loading ? "Processando..." : "Finalizar e Gerar Pix"}
                </button>
                
                <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed italic">
                  Ao clicar em finalizar, você concorda com nossos termos de uso. <br />
                  Sua conexão é protegida por criptografia de ponta a ponta.
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}