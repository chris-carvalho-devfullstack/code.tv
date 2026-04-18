"use client";

import { useState, useEffect } from "react";
import { 
  ShoppingCart, Tv, Zap, ShieldCheck, CheckCircle2, 
  PlayCircle, Info, Lock, MailCheck, MonitorPlay, 
  Smartphone, ChevronDown, HelpCircle 
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function HomePage() {
  const addItem = useCartStore((state) => state.addItem);
  
  const [badgeIndex, setBadgeIndex] = useState(0);
  const badgeItems = [
    { text: "Entretenimento sem interrupções", icon: <PlayCircle size={18} className="text-blue-600" /> },
    { text: "Envio instantâneo 24/7", icon: <Zap size={18} className="text-blue-600" /> }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBadgeIndex((prev) => (prev + 1) % badgeItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [badgeItems.length]);

  const planos = [
    { id: "unitv-mensal", name: "Mensal UniTV", price: 25.00, duration: "30 dias" },
    { id: "unitv-anual", name: "Anual UniTV", price: 149.90, duration: "365 dias", highlight: true },
    { id: "unitv-trimestral", name: "Trimestral UniTV", price: 65.00, duration: "90 dias" },
  ];

  const scrollToPlanos = () => {
    document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      
      {/* Hero Section - O Visual Ambilight Original Restaurado */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200 overflow-hidden bg-white/50 backdrop-blur-3xl">
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px]"></div>
          <div className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-400/20 blur-[150px]"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-500/15 blur-[120px]"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-slate-700 text-sm font-semibold mb-8 shadow-sm backdrop-blur-md min-w-[280px] justify-center transition-all duration-500 cursor-default">
            <span className="flex items-center gap-2 animate-in fade-in duration-700" key={badgeIndex}>
              {badgeItems[badgeIndex].icon}
              {badgeItems[badgeIndex].text}
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900">
            Sua diversão garantida com <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-blue-500 to-cyan-500">
              UniTV
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Licenças oficiais de ativação para a sua plataforma favorita. 
            Acesso instantâneo, segurança total e entrega direta no seu e-mail.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={scrollToPlanos}
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer border-none"
            >
              Ver Planos de Acesso
            </button>
          </div>
        </div>
      </section>

      {/* Planos Section */}
      <section id="planos" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Escolha seu plano
            </h2>
            <p className="text-slate-500 text-lg">Ativação imediata para 1 dispositivo</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
            {planos.map((plano) => (
              <div 
                key={plano.id} 
                className={`p-6 sm:p-8 rounded-4xl flex flex-col transition-all duration-300 relative bg-white
                  ${plano.highlight 
                    ? 'border-2 border-blue-600 shadow-2xl shadow-blue-900/10 md:-translate-y-4 z-10' 
                    : 'border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md'
                  }`}
              >
                {plano.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                    Mais Escolhido
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2 text-slate-900 mt-2">{plano.name}</h3>
                <p className="text-slate-500 mb-6 font-medium border-b border-slate-100 pb-6">Acesso total por {plano.duration}</p>
                
                <div className="text-5xl font-black mb-8 text-slate-900 tracking-tight">
                  <span className="text-xl font-bold text-slate-400 mr-1 inline-block align-top mt-2">R$</span>
                  {plano.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                
                <ul className="space-y-4 mb-10 grow text-slate-600">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-blue-500 shrink-0" /> 
                    <span>Envio imediato via E-mail</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-blue-500 shrink-0" /> 
                    <span>Garantia de estabilidade</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-blue-500 shrink-0" /> 
                    <span>Suporte prioritário via WhatsApp</span>
                  </li>
                </ul>

                <button 
                  onClick={() => addItem({ ...plano, quantity: 1 })}
                  className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border-none
                    ${plano.highlight 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200'
                    }`}
                >
                  Adicionar ao Carrinho <ShoppingCart size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais Section */}
      <section className="pt-20 pb-16 md:pt-24 md:pb-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-600/15 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-cyan-600/15 blur-[120px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-slate-800/80 border border-slate-700/50 text-cyan-400 rounded-2xl mb-6 backdrop-blur-md shadow-xl">
              <Zap size={32} />
            </div>
            <h4 className="text-xl font-bold mb-3 text-slate-50">Liberação Imediata</h4>
            <p className="text-slate-400 leading-relaxed">
              Sem espera. Assim que o pagamento for confirmado, sua chave de acesso chega direto na sua caixa de entrada.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-4 bg-slate-800/80 border border-slate-700/50 text-blue-400 rounded-2xl mb-6 backdrop-blur-md shadow-xl">
              <ShieldCheck size={32} />
            </div>
            <h4 className="text-xl font-bold mb-3 text-slate-50">Compra 100% Segura</h4>
            <p className="text-slate-400 leading-relaxed">
              Ambiente protegido com criptografia de ponta a ponta. Seus dados estão completamente isolados e seguros.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-4 bg-slate-800/80 border border-slate-700/50 text-indigo-400 rounded-2xl mb-6 backdrop-blur-md shadow-xl">
              <Tv size={32} />
            </div>
            <h4 className="text-xl font-bold mb-3 text-slate-50">Código Original</h4>
            <p className="text-slate-400 leading-relaxed">
              Fornecemos apenas licenciamento oficial. Estabilidade, qualidade e a certeza de que seu app vai funcionar.
            </p>
          </div>
        </div>
      </section>

      {/* SEO Section 1: Passo a Passo */}
      <section className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Como funciona a recarga da sua UniTV?
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Comprar sua licença digital é um processo simples e 100% automatizado. Siga os passos abaixo e comece a aproveitar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-100 z-0"></div>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                <ShoppingCart size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Escolha o Plano</h3>
              <p className="text-slate-600">
                Seleccione entre nossas opções de códigos de ativação: mensal, trimestral ou anual, de acordo com a sua necessidade.
              </p>
            </div>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Pagamento Seguro</h3>
              <p className="text-slate-600">
                Finalize sua compra utilizando nossos métodos de pagamento seguros. Aprovação instantânea via PIX ou Cartão.
              </p>
            </div>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
                <MailCheck size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">3. Receba a Chave</h3>
              <p className="text-slate-600">
                Acesse o aplicativo UniTV, insira o código de 16 dígitos que enviamos para o seu e-mail e pronto!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Section 2: Dispositivos Compatíveis */}
      <section className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Assista onde quiser, quando quiser
            </h2>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              As licenças oficiais UniTV são perfeitamente compatíveis com os principais dispositivos do mercado. Não importa onde você está, o aplicativo proporciona a melhor experiência em entretenimento digital.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <MonitorPlay className="text-blue-600 shrink-0" size={28} />
                <div>
                  <h4 className="font-bold text-slate-900">TV Box e Smart TVs</h4>
                  <p className="text-sm text-slate-500">Aparelhos com sistema Android TV.</p>
                </div>
              </li>
              <li className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <Smartphone className="text-blue-600 shrink-0" size={28} />
                <div>
                  <h4 className="font-bold text-slate-900">Smartphones Android</h4>
                  <p className="text-sm text-slate-500">Compatibilidade nativa com o aplicativo móvel.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="md:w-1/2 w-full flex justify-center">
            <div className="relative w-full max-w-md aspect-square bg-linear-to-tr from-blue-100 to-cyan-50 rounded-full flex items-center justify-center p-8">
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full border border-slate-100 rotate-[-2deg] z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                </div>
                <div className="h-32 bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
                  <PlayCircle className="text-slate-300" size={48} />
                </div>
                <div className="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Section 3: FAQ */}
      <section className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-4">
              <HelpCircle size={16} /> Central de Dúvidas
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-4">
            <details className="group bg-slate-50 p-6 rounded-2xl border border-slate-200 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between font-bold text-slate-900 text-lg cursor-pointer">
                Como recebo minha chave de acesso UniTV?
                <ChevronDown className="transition duration-300 group-open:-rotate-180 text-blue-600" size={24} />
              </summary>
              <p className="text-slate-600 mt-4 leading-relaxed cursor-text">
                Assim que o pagamento é aprovado, nosso sistema gera automaticamente um código oficial de 16 dígitos. Esta chave de recarga é enviada instantaneamente para o e-mail cadastrado na hora da compra e também fica disponível no seu painel de cliente.
              </p>
            </details>

            <details className="group bg-slate-50 p-6 rounded-2xl border border-slate-200 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between font-bold text-slate-900 text-lg cursor-pointer">
                O código de ativação tem prazo de validade?
                <ChevronDown className="transition duration-300 group-open:-rotate-180 text-blue-600" size={24} />
              </summary>
              <p className="text-slate-600 mt-4 leading-relaxed cursor-text">
                A validade do seu plano (30, 90 ou 365 dias) só começa a contar a partir do momento em que você insere a chave e faz a ativação no aplicativo da UniTV. Você pode comprar hoje e ativar apenas no mês que vem, sem perder nenhum dia.
              </p>
            </details>

            <details className="group bg-slate-50 p-6 rounded-2xl border border-slate-200 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between font-bold text-slate-900 text-lg cursor-pointer">
                Posso usar a licença em mais de uma tela ao mesmo tempo?
                <ChevronDown className="transition duration-300 group-open:-rotate-180 text-blue-600" size={24} />
              </summary>
              <p className="text-slate-600 mt-4 leading-relaxed cursor-text">
                Cada chave de recarga que fornecemos é válida para 1 (um) dispositivo ativo. Para utilizar o aplicativo em múltiplos dispositivos simultaneamente, será necessário adquirir chaves de ativação adicionais.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer Premium */}
      <footer className="bg-black text-slate-400 pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-cyan-400 mb-4 inline-block">
                UniTV Digital
              </span>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm mb-6">
                Revenda oficial de licenças digitais. Processamento instantâneo e suporte dedicado para a melhor experiência em entretenimento.
              </p>
              <div className="flex items-center gap-2 text-sm text-emerald-500 font-medium bg-emerald-500/10 w-max px-3 py-1.5 rounded-full border border-emerald-500/20">
                <Lock size={14} /> Site Blindado
              </div>
            </div>
            
            <div>
              <h3 className="text-slate-200 font-semibold mb-5 text-sm uppercase tracking-wider">Institucional</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-cyan-400 transition-colors cursor-pointer block">Políticas de Privacidade</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors cursor-pointer block">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors cursor-pointer block">Política de Reembolso</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-slate-200 font-semibold mb-5 text-sm uppercase tracking-wider">Suporte</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-cyan-400 transition-colors cursor-pointer block">Como ativar minha chave?</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors cursor-pointer block">Dúvidas Frequentes (FAQ)</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors cursor-pointer block">Fale Conosco</a></li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800 mb-12">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="p-4 bg-slate-800/80 rounded-xl shrink-0 hidden sm:block border border-slate-700/50">
                <Info size={28} className="text-slate-400" />
              </div>
              <div className="text-xs md:text-sm leading-relaxed text-slate-400 text-justify sm:text-left cursor-default">
                <strong className="flex items-center gap-2 text-slate-200 text-base font-semibold mb-3">
                  <Info size={18} className="sm:hidden text-blue-500" /> 
                  Aviso Legal e Transparência
                </strong>
                A plataforma atua de forma rigorosa e exclusiva como revendedora independente de chaves e códigos de ativação (gift cards) para aplicativos de reprodução de mídia e entretenimento. Declaramos expressamente que não produzimos, não hospedamos, não retransmitimos e não possuímos direitos sobre qualquer conteúdo audiovisual que possa ser acessado pelos usuários finais, não configurando nenhuma prática que fira as diretrizes de direitos autorais. Ademais, esclarecemos que não somos os desenvolvedores, proprietários ou responsáveis pela infraestrutura de hospedagem de nenhum dos aplicativos cujas licenças são aqui comercializadas. O uso das ferramentas e a natureza dos conteúdos reproduzidos por meio delas são de inteira, estrita e exclusiva responsabilidade do usuário final.
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-linear-to-r from-transparent via-slate-800 to-transparent mb-8"></div>

          <div className="text-center text-xs text-slate-600 flex flex-col md:flex-row justify-between items-center gap-4 cursor-default">
            <p>© {new Date().getFullYear()} UniTV Digital. Todos os direitos reservados.</p>
            <p>Protegido por reCAPTCHA e sujeito às Políticas do Google.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}