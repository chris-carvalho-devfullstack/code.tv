'use client';

import { useState } from 'react';
import { revelarChaveAction } from '@/app/minha-conta/actions';

interface BotaoRevelarChaveProps {
  orderId: string;
  planoId: string;
  chaveJaRevelada?: string; // Caso a chave já tenha sido revelada anteriormente
}

export default function BotaoRevelarChave({ orderId, planoId, chaveJaRevelada }: BotaoRevelarChaveProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chave, setChave] = useState<string | null>(chaveJaRevelada || null);
  const [erro, setErro] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  const handleRevelar = async () => {
    setIsLoading(true);
    setErro(null);

    const result = await revelarChaveAction(orderId, planoId);

    if (result.sucesso && result.chave) {
      setChave(result.chave);
      setIsOpen(false);
    } else {
      setErro(result.erro || 'Erro desconhecido ao revelar chave.');
    }

    setIsLoading(false);
  };

  const copiarChave = () => {
    if (chave) {
      navigator.clipboard.writeText(chave);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  // Se a chave já foi revelada, mostra diretamente o painel da chave
  if (chave) {
    return (
      <div className="mt-4 p-4 bg-zinc-900 border border-zinc-700 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-center sm:text-left">
          <span className="block text-xs text-zinc-400 uppercase font-bold tracking-wider mb-1">Sua Chave de Ativação</span>
          <code className="text-lg md:text-xl font-mono text-emerald-400 font-bold tracking-widest bg-zinc-950 px-3 py-1 rounded">
            {chave}
          </code>
        </div>
        <button
          onClick={copiarChave}
          className="w-full sm:w-auto px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-zinc-600"
        >
          {copiado ? (
            <>
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copiado!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copiar
            </>
          )}
        </button>
      </div>
    );
  }

  // Estado inicial: Botão bloqueado
  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20 transition-all active:scale-[0.98]"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Revelar Chave de Ativação
      </button>

      {/* Modal / Bottom Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-0">
          <div 
            className="bg-zinc-900 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200"
          >
            <div className="p-6">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Atenção: Ação Irreversível</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Ao clicar em confirmar, a sua chave exclusiva será revelada e atrelada definitivamente à sua conta. Como se trata de um produto digital consumível, <strong>você perderá o direito de solicitar o reembolso por arrependimento</strong> após esta ação.
              </p>

              {erro && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-400 text-sm">
                  {erro}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRevelar}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    'Li e Aceito, Revelar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}