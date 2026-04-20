"use client";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { processarPedido } from "./actions";
import { useCartStore } from "@/store/useCartStore"; 
import { createClient } from "@/lib/supabase/client"; 
import { 
  Lock, ChevronRight, ShieldCheck, Mail, User as UserIcon, 
  CreditCard, ArrowLeft, Phone, AlertCircle, X, LogOut 
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile"; 
import { User } from "@supabase/supabase-js"; 

export default function CheckoutPage() {
  const { items, getTotal } = useCartStore(); 
  const router = useRouter();
  const supabase = createClient();
  
  const [mounted, setMounted] = useState(false);
  const [userAuth, setUserAuth] = useState<User | null>(null); 
  
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    whatsapp: ""
  });

  const [modalErro, setModalErro] = useState({
    aberto: false,
    titulo: "",
    mensagem: ""
  });

  useEffect(() => {
    setMounted(true);

    async function checkUserSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserAuth(user);
        const nomeCompleto = user.user_metadata?.full_name || user.email?.split('@')[0] || "";
        const telefone = user.user_metadata?.whatsapp || "";
        
        setFormData({
          nome: nomeCompleto,
          email: user.email || "",
          whatsapp: telefone
        });
      }
    }

    checkUserSession();
  }, [supabase.auth]);

  // NOVA FUNÇÃO: Logout + Redirecionamento
  const handleTrocarConta = async () => {
    await supabase.auth.signOut();
    router.push('/login?returnUrl=/checkout');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const validarEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validarWhatsAppBR = (telefone: string) => {
    const numeros = telefone.replace(/\D/g, '');
    return numeros.length === 11 && numeros[2] === '9';
  };

  const handleMascaraTelefone = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, ''); 
    if (valor.length > 11) valor = valor.slice(0, 11);
    if (valor.length > 2) valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    if (valor.length > 10) valor = `${valor.slice(0, 10)}-${valor.slice(10)}`;
    setFormData(prev => ({ ...prev, whatsapp: valor }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    
    if (!validarEmail(formData.email)) {
      setModalErro({ aberto: true, titulo: "E-mail Inválido", mensagem: "Por favor, insira um endereço de e-mail válido para receber sua licença." });
      return;
    }

    if (!validarWhatsAppBR(formData.whatsapp)) {
      setModalErro({ aberto: true, titulo: "WhatsApp Inválido", mensagem: "Insira um celular válido com DDD (Ex: 11 99999-9999). O nono dígito é obrigatório." });
      return;
    }

    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 90) {
          clearInterval(interval);
          return 90;
        }
        return old + Math.floor(Math.random() * 15) + 5; 
      });
    }, 150);
    
    const nativeFormData = new FormData(e.currentTarget); 
    const resultado = await processarPedido(nativeFormData, items, getTotal()); 
    
    clearInterval(interval); 
    
    if (resultado?.erro) {
      setProgress(0); 
      setModalErro({ aberto: true, titulo: "Erro no Pedido", mensagem: resultado.erro });
      setLoading(false);
    } else if (resultado?.sucesso) {
      setProgress(100); 
      
      setTimeout(() => {
        router.push(`/checkout/pagamento/${resultado.orderId}`); 
      }, 1500);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">O seu carrinho está vazio</h1>
        <Link href="/" className="text-blue-600 font-medium hover:underline flex items-center gap-2 cursor-pointer">
          Voltar para a loja <ChevronRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 pb-20 font-sans">
        
        <div className="bg-white border-b border-slate-200 py-4 mb-8">
          <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition text-sm font-medium cursor-pointer">
              <ArrowLeft size={16} /> 
              Continuar a Comprar
            </Link>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Lock size={14} />
              <span>Checkout Seguro</span>
            </div>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-7 space-y-8">
              <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                    <h2 className="text-lg font-bold text-slate-800">Os Seus Dados</h2>
                  </div>
                  
                  {userAuth ? (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <UserIcon size={16} className="text-blue-600" />
                        <span className="text-sm font-black text-slate-900">
                          {userAuth.user_metadata?.full_name?.split(' ')[0] || "Cliente"}
                        </span>
                      </div>
                      
                      {/* NOVO BOTÃO COM TOOLTIP (title) */}
                      <button 
                        type="button"
                        onClick={handleTrocarConta}
                        title="Faz logout da conta atual e vai para a tela de login para entrar com outra conta. Será redirecionado para o carrinho automaticamente."
                        className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-red-50"
                      >
                        <LogOut size={12} />
                        Trocar Conta
                      </button>
                    </div>
                  ) : (
                    <Link href="/login?returnUrl=/checkout" className="text-xs font-black text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors cursor-pointer text-center">
                      ou Entre com a sua conta
                    </Link>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                      <input 
                        type="text" 
                        name="nome"
                        required
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        placeholder="Ex: João Silva"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail de entrega</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input 
                          type="email" 
                          name="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="o-seu-email@exemplo.com"
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp</label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input 
                          type="tel" 
                          name="whatsapp"
                          required
                          value={formData.whatsapp}
                          onChange={handleMascaraTelefone}
                          placeholder="(11) 99999-9999"
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">2</div>
                  <h2 className="text-lg font-bold text-slate-800">Pagamento</h2>
                </div>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 rounded-2xl border-2 border-blue-600 bg-blue-50 cursor-pointer transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 italic font-black text-blue-600 text-xs shadow-sm">PIX</div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Pix - Aprovação Instantânea</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Receba a chave em segundos</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-4 border-blue-600 bg-white shadow-sm"></div>
                  </label>

                  <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 cursor-not-allowed opacity-50 bg-slate-50">
                    <div className="flex items-center gap-4">
                      <CreditCard className="text-slate-400" />
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Cartão de Crédito</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Disponível em breve</p>
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
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden sticky top-24">
                <div className="p-6 bg-slate-50 border-b border-slate-100">
                  <h3 className="font-black text-slate-800">Resumo do Pedido</h3>
                </div>
                
                <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-slate-200 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-600">{item.quantity}x</span>
                        <span className="text-slate-700 font-bold">{item.name}</span>
                      </div>
                      <span className="text-slate-900 font-black">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-white border-t border-slate-100 space-y-4">
                  <div className="flex justify-between text-slate-500 text-sm font-medium">
                    <span>Subtotal</span>
                    <span>{formatCurrency(getTotal())}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-black text-lg pt-4 border-t border-dashed border-slate-200">
                    <span>Total a pagar</span>
                    <span className="text-blue-600">{formatCurrency(getTotal())}</span>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className={`relative overflow-hidden w-full bg-emerald-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all mt-6 uppercase text-xs tracking-widest cursor-pointer border-none shadow-lg shadow-emerald-600/20 ${!loading ? 'hover:bg-emerald-700 hover:scale-[1.02]' : 'cursor-wait'}`}
                  >
                    <div 
                      className="absolute left-0 top-0 h-full bg-black/20 transition-all duration-300 ease-out z-0"
                      style={{ width: `${progress}%` }}
                    />
                    
                    <div className="relative z-10 flex items-center gap-2">
                      <ShieldCheck size={20} className={loading && progress < 100 ? "animate-spin-slow opacity-80" : ""} />
                      {loading 
                        ? (progress === 100 ? "Pedido Gerado!" : `A Processar... ${progress}%`) 
                        : "Finalizar e Gerar Pix"}
                    </div>
                  </button>
                  
                  <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed font-medium">
                    Ao finalizar, concorda com os nossos termos de uso. <br />
                    Ambiente protegido por encriptação 256-bit.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>

      {modalErro.aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-4xl max-w-sm w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <button 
              onClick={() => setModalErro({ ...modalErro, aberto: false })}
              className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <div className="flex flex-col items-center text-center mt-2">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">{modalErro.titulo}</h3>
              <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed">
                {modalErro.mensagem}
              </p>
              
              <button
                onClick={() => setModalErro({ ...modalErro, aberto: false })}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl transition-all cursor-pointer"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}