"use client";

import { ShoppingCart, Tv, Zap, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore"; // Vamos criar este store em seguida

export default function HomePage() {
  const addItem = useCartStore((state) => state.addItem);

  const planos = [
    { id: "unitv-mensal", name: "Mensal UniTV", price: 25.00, duration: "30 dias" },
    { id: "unitv-anual", name: "Anual UniTV", price: 149.90, duration: "365 dias", highlight: true },
    { id: "unitv-trimestral", name: "Trimestral UniTV", price: 65.00, duration: "90 dias" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">
            Sua diversão sem interrupções com <span className="text-blue-600">UniTV</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Adquira suas chaves de ativação de forma rápida, segura e com entrega imediata diretamente no seu e-mail.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center gap-2">
              Ver Planos <Zap size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Planos Section */}
      <section id="planos" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Escolha seu plano de ativação</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {planos.map((plano) => (
              <div 
                key={plano.id} 
                className={`p-8 rounded-3xl border ${plano.highlight ? 'border-blue-600 ring-2 ring-blue-100 shadow-xl' : 'border-slate-200 shadow-sm'} flex flex-col`}
              >
                {plano.highlight && <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full self-start mb-4">MAIS VENDIDO</span>}
                <h3 className="text-xl font-bold mb-2">{plano.name}</h3>
                <p className="text-slate-500 mb-6">Validade de {plano.duration}</p>
                <div className="text-4xl font-black mb-8">
                  R$ {plano.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                
                <ul className="space-y-4 mb-10 flex-grow text-sm text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Entrega imediata via E-mail</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Suporte 24h prioritário</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Ativação em 1 dispositivo</li>
                </ul>

                <button 
                  onClick={() => addItem({ ...plano, quantity: 1 })}
                  className="w-full py-4 rounded-2xl font-bold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2"
                >
                  Adicionar ao Carrinho <ShoppingCart size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais Section */}
      <section className="py-20 px-6 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-white/10 rounded-2xl mb-6"><Zap size={32} /></div>
            <h4 className="text-xl font-bold mb-3">Envio Instantâneo</h4>
            <p className="text-blue-100">Comprou, pagou, recebeu. O sistema envia sua chave automaticamente.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-4 bg-white/10 rounded-2xl mb-6"><ShieldCheck size={32} /></div>
            <h4 className="text-xl font-bold mb-3">Pagamento Seguro</h4>
            <p className="text-blue-100">Processamos seus dados com criptografia de ponta a ponta.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-4 bg-white/10 rounded-2xl mb-6"><Tv size={32} /></div>
            <h4 className="text-xl font-bold mb-3">Chaves Oficiais</h4>
            <p className="text-blue-100">Garantimos a procedência e validade de todas as nossas chaves.</p>
          </div>
        </div>
      </section>
    </div>
  );
}