"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  CheckCircle2, Loader2, Copy, QrCode, 
  ArrowLeft, ShieldCheck, Clock, Smartphone 
} from "lucide-react";
import Link from "next/link";

// Criamos uma interface para substituir o "any" e tipar corretamente o pedido
interface PedidoType {
  id: string;
  status: string;
  total_amount: number;
  customer_email: string;
}

export default function PagamentoPage() {
  const { id } = useParams();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [pedido, setPedido] = useState<PedidoType | null>(null);
  const [copiado, setCopiado] = useState(false);

  // 1. Buscar dados do pedido
  useEffect(() => {
    async function fetchPedido() {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Erro ao buscar pedido:", error);
        return;
      }

      setPedido(data as PedidoType);
      setLoading(false);
    }

    if (id) fetchPedido();
  }, [id, supabase]);

  // 2. Escutar mudanças em tempo real (Realtime)
  useEffect(() => {
    const channel = supabase
      .channel(`pedido-${id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` },
        (payload) => {
          setPedido(payload.new as PedidoType);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id, supabase]);

  const handleCopyPix = () => {
    navigator.clipboard.writeText("00020101021226870014br.gov.bcb.pix..."); // Placeholder do Copia e Cola
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 animate-pulse">A carregar detalhes do pagamento...</p>
      </div>
    );
  }

  const isPago = pedido?.status === 'paid';

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-2xl mx-auto px-6 pt-12">
        
        {/* Card Principal */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          {/* Header do Status */}
          <div className={`p-8 text-center ${isPago ? 'bg-emerald-50' : 'bg-blue-50'}`}>
            {isPago ? (
              <div className="flex flex-col items-center animate-in zoom-in duration-500">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
                  <CheckCircle2 size={32} />
                </div>
                <h1 className="text-2xl font-black text-emerald-900">Pagamento Confirmado!</h1>
                <p className="text-emerald-700 text-sm mt-1">Sua chave UniTV foi enviada para o seu e-mail.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-200 relative">
                   <Loader2 size={32} className="animate-spin opacity-20 absolute" />
                   <QrCode size={32} />
                </div>
                <h1 className="text-2xl font-black text-slate-900">Aguardando Pagamento</h1>
                <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
                  <Clock size={14} /> O seu código Pix expira em 30 minutos
                </p>
              </div>
            )}
          </div>

          <div className="p-8">
            {!isPago ? (
              <div className="space-y-8">
                {/* Simulador de QR Code */}
                <div className="flex flex-col items-center">
                  <div className="w-48 h-48 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200 relative group">
                    <QrCode size={80} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                       <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">QR Code de Teste</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-4 text-center max-w-62.5">
                    Abra o app do seu banco e aponte a câmera para o QR Code acima.
                  </p>
                </div>

                {/* Botão Copia e Cola */}
                <button 
                  onClick={handleCopyPix}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="text-slate-400 group-hover:text-blue-600" size={20} />
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-400 uppercase">Pix Copia e Cola</p>
                      <p className="text-sm font-medium text-slate-600 truncate max-w-50">00020101021226870014br.gov...</p>
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                    {copiado ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} className="text-slate-400" />}
                  </div>
                </button>

                {/* Info do Pedido */}
                <div className="pt-6 border-t border-slate-100 flex justify-between items-center text-sm">
                  <div>
                    <p className="text-slate-400">Total a pagar</p>
                    <p className="text-xl font-black text-blue-600">R$ {pedido?.total_amount?.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400">Pedido</p>
                    <p className="text-slate-800 font-mono text-xs">#{pedido?.id.split('-')[0]}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-center">
                <p className="text-slate-600 leading-relaxed">
                  Tudo certo! Verificámos o seu pagamento. <br />
                  A sua licença UniTV foi gerada e enviada para <strong>{pedido?.customer_email}</strong>.
                </p>
                <div className="flex flex-col gap-3">
                  <Link href="/" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer">
                    Voltar para a Loja
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer de Segurança */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 opacity-40">
            <ShieldCheck size={20} />
            <div className="h-4 w-px bg-slate-300"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Pagamento Processado com Segurança</p>
          </div>
          
          <Link href="/" className="text-slate-400 hover:text-blue-600 text-xs flex items-center gap-1 transition-colors cursor-pointer">
            <ArrowLeft size={12} /> Sair desta página
          </Link>
        </div>

        {/* --- SIMULADOR APENAS PARA TESTES --- */}
        <div className="mt-12 p-4 bg-amber-50 border border-amber-100 rounded-xl">
           <p className="text-[10px] font-bold text-amber-600 uppercase mb-2">Painel de Teste (Sandbox)</p>
           <button 
             onClick={async () => {
                await supabase.from("orders").update({ status: 'paid' }).eq('id', id);
             }}
             className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-amber-700 cursor-pointer"
           >
             Simular Pagamento Confirmado
           </button>
        </div>
      </div>
    </div>
  );
}