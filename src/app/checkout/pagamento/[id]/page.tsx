"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  CheckCircle2, Loader2, Copy, QrCode, 
  ArrowLeft, ShieldCheck, Clock, Smartphone,
  Zap, Check
} from "lucide-react";
import Link from "next/link";

export const runtime = 'edge';

interface PedidoType {
  id: string;
  status: string;
  total_amount: number;
  customer_email: string;
}

type UIState = 'loading' | 'awaiting' | 'processing' | 'success';

export default function PagamentoPage() {
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();
  
  const [uiState, setUiState] = useState<UIState>('loading');
  const [pedido, setPedido] = useState<PedidoType | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800);

  // Timer do QRCode
  useEffect(() => {
    if (uiState !== 'awaiting') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [uiState]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Monitoramento Híbrido: Realtime ou Polling
  useEffect(() => {
    if (!id) return;

    let intervalId: NodeJS.Timeout;
    let channel: ReturnType<typeof supabase.channel>;

    function atualizarTela(dadosPedido: PedidoType) {
      setPedido(dadosPedido);
      
      if (dadosPedido.status === 'paid') {
        if (intervalId) clearInterval(intervalId); // Para o relógio se for anônimo
        
        setUiState((currentState) => {
          // Só inicia a animação de 'processing' se ainda não estiver no processo
          if (currentState !== 'processing' && currentState !== 'success') {
            setTimeout(() => setUiState('success'), 1500);
            return 'processing';
          }
          return currentState;
        });
      } else {
        // Se ainda não foi pago, sai do 'loading' para o 'awaiting'
        setUiState((currentState) => currentState === 'loading' ? 'awaiting' : currentState);
      }
    }

    async function iniciarMonitoramento() {
      const { data: { session } } = await supabase.auth.getSession();

      // --- MODO 1: REALTIME (Usuários Logados) ---
      if (session) {
        console.log("Modo Híbrido: Usando Realtime WebSocket");
        
        const { data: inicial } = await supabase.from("orders").select("*").eq("id", id).single();
        if (inicial) atualizarTela(inicial as PedidoType);

        channel = supabase
          .channel(`pedido-${id}`)
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` },
            (payload) => atualizarTela(payload.new as PedidoType)
          )
          .subscribe();
      } 
      // --- MODO 2: POLLING SEGURO VIA RPC (Visitantes Anônimos) ---
      else {
        console.log("Modo Híbrido: Usando Polling via RPC");
        
        const checkPaymentStatus = async () => {
          const { data, error } = await supabase.rpc('buscar_pedido_anonimo', { p_id: id }).single();
          if (data) atualizarTela(data as PedidoType);
          if (error) console.error("Erro no polling:", error);
        };

        checkPaymentStatus(); // Roda a primeira vez imediatamente
        intervalId = setInterval(checkPaymentStatus, 3000); // Depois fica perguntando a cada 3 segundos
      }
    }

    iniciarMonitoramento();

    // Limpeza ao desmontar o componente (fechar a página)
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (channel) supabase.removeChannel(channel);
    };
  }, [id, supabase]);

  const handleCopyPix = () => {
    navigator.clipboard.writeText("00020101021226870014br.gov.bcb.pix..."); 
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  if (uiState === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium animate-pulse">A preparar o seu pagamento...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 font-sans">
      <div className="max-w-xl mx-auto px-6 pt-12">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2 text-sm font-semibold">
            <ArrowLeft size={16} /> Voltar para a loja
          </Link>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm">
            <ShieldCheck size={14} className="text-blue-600" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pagamento Seguro</span>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="flex items-center justify-between mb-10 px-4 relative">
          <div className="absolute left-10 right-10 top-[20px] h-[2px] bg-slate-200 -z-0">
             <div className={`h-full bg-blue-600 transition-all duration-1000 ease-out ${uiState === 'awaiting' ? 'w-0' : uiState === 'processing' ? 'w-1/2' : 'w-full'}`} />
          </div>
          <StepIndicator active={true} completed={uiState !== 'awaiting'} icon={<QrCode size={16} />} label="Pagamento" />
          <StepIndicator active={uiState !== 'awaiting'} completed={uiState === 'success'} icon={<Loader2 size={16} className={uiState === 'processing' ? 'animate-spin' : ''} />} label="Processando" />
          <StepIndicator active={uiState === 'success'} completed={uiState === 'success'} icon={<Check size={16} />} label="Concluído" />
        </div>

        {/* CARD PRINCIPAL */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden relative transition-all duration-500">
          
          {/* BARRA DE STATUS SUPERIOR */}
          <div className={`h-1.5 transition-colors duration-500 ${
            uiState === 'awaiting' ? 'bg-blue-500' : 
            uiState === 'processing' ? 'bg-amber-500' : 
            'bg-emerald-500'
          }`} />

          <div className="p-8">
            {/* AGUARDANDO PAGAMENTO */}
            {uiState === 'awaiting' && (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center space-y-1">
                  <h1 className="text-2xl font-black text-slate-900">Aguardando Pagamento</h1>
                  <p className="text-slate-500 text-sm">Escaneie o código abaixo no app do seu banco.</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative p-4 bg-slate-50 rounded-3xl border border-slate-100 group">
                    <div className="bg-white p-3 rounded-2xl shadow-inner border border-slate-100">
                      <QrCode size={160} className="text-slate-900" />
                    </div>
                    {/* Badge de tempo flutuante */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                      <Clock size={14} className="text-amber-500 animate-pulse" />
                      <span className="text-xs font-bold text-slate-600 font-mono">{formatTime(timeLeft)}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleCopyPix}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all group active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-xl text-slate-400 group-hover:text-blue-600 shadow-sm border border-slate-100 transition-colors">
                      <Smartphone size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pix Copia e Cola</p>
                      <p className="text-sm font-semibold text-slate-700 truncate max-w-[180px]">00020101021226870014br.gov...</p>
                    </div>
                  </div>
                  <div className={`p-2 rounded-xl transition-all ${copiado ? 'bg-emerald-50 text-emerald-600' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'}`}>
                    {copiado ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                  </div>
                </button>

                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Valor Total</p>
                    <p className="text-3xl font-black text-slate-900">R$ {pedido?.total_amount?.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">PEDIDO #{pedido?.id.split('-')[0]}</span>
                  </div>
                </div>
              </div>
            )}

            {/* PROCESSANDO */}
            {uiState === 'processing' && (
              <div className="py-12 flex flex-col items-center text-center animate-in zoom-in duration-300">
                <div className="relative mb-6">
                  <div className="w-20 h-20 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
                  <Zap size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 animate-pulse" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Pagamento Recebido!</h2>
                <p className="text-slate-500">Estamos a processar o seu pedido em tempo real...</p>
              </div>
            )}

            {/* SUCESSO */}
            {uiState === 'success' && (
              <div className="py-8 flex flex-col items-center text-center animate-in slide-in-from-bottom-8 duration-700">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-100 shadow-lg shadow-emerald-100/50">
                  <CheckCircle2 size={48} className="animate-in zoom-in-50 duration-500" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">Pagamento Concluído!</h2>
                <p className="text-slate-500 leading-relaxed mb-10 max-w-sm">
                  Obrigado! A sua licença UniTV foi gerada com sucesso e enviada para o e-mail: <br/>
                  <span className="font-bold text-slate-900 underline decoration-blue-500 underline-offset-4">{pedido?.customer_email}</span>
                </p>
                
                <Link href="/" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
                  Voltar para a Loja
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* FEEDBACK DE SEGURANÇA */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            Ambiente 100% Criptografado <ShieldCheck size={12} />
          </p>
        </div>

        {/* SIMULADOR DE TESTE */}
        {uiState === 'awaiting' && (
          <div className="mt-8 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
             <div className="flex items-center justify-between">
               <div className="flex flex-col">
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider">Modo Simulação</p>
                 <p className="text-[10px] text-blue-500">Apenas Admins logados podem usar este botão</p>
               </div>
               <button 
                 onClick={async () => {
                    await supabase.from("orders").update({ status: 'paid' }).eq('id', id);
                 }}
                 className="text-[10px] bg-white text-blue-600 px-3 py-1.5 rounded-lg font-bold border border-blue-200 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
               >
                 Confirmar Pagamento
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepIndicator({ active, completed, icon, label }: { active: boolean, completed: boolean, icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 z-10">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-sm ${
        completed ? 'bg-blue-600 border-blue-600 text-white' : 
        active ? 'bg-white border-blue-600 text-blue-600' : 
        'bg-white border-slate-200 text-slate-300'
      }`}>
        {icon}
      </div>
      <span className={`text-[9px] font-black uppercase tracking-wider transition-colors duration-500 ${active || completed ? 'text-slate-700' : 'text-slate-300'}`}>
        {label}
      </span>
    </div>
  );
}