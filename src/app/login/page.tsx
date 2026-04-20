"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; 
import Link from "next/link";
import { 
  Mail, Lock, Eye, EyeOff, 
  ArrowRight, AlertCircle, PlayCircle, Loader2 
} from "lucide-react";

// Separamos o conteúdo do login para o Suspense do Next.js funcionar corretamente
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Puxa o returnUrl da barra de endereço. Se não existir, vai para /minha-conta por padrão.
  const returnUrl = searchParams.get('returnUrl') || '/minha-conta';

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      if (error.message.includes("Invalid login credentials")) {
        setError("E-mail ou palavra-passe incorretos.");
      } else {
        setError("Ocorreu um erro ao fazer login. Tente novamente.");
      }
      return;
    }

    // MÁGICA AQUI: Redireciona para o returnUrl (que será o /checkout)
    router.push(returnUrl);
    router.refresh(); 
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 relative z-10">
      
      <div className="text-center mb-10">
        <Link href="/" className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 mb-6 group cursor-pointer transition-transform hover:scale-105">
          <PlayCircle size={32} className="text-blue-600 group-hover:text-indigo-600 transition-colors" />
        </Link>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Bem-vindo de volta</h1>
        <p className="text-slate-500 text-sm font-medium">
          Aceda à sua conta para continuar.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
        <form onSubmit={handleLogin} className="space-y-6">
          
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-semibold border border-red-100 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">E-mail</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="o-seu-email@exemplo.com"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Palavra-passe</label>
              <Link href="/recuperar-senha" className="text-xs font-bold text-blue-600 hover:text-indigo-600 transition-colors cursor-pointer">
                Esqueceu-se?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-linear-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <><Loader2 size={20} className="animate-spin" /> A entrar...</>
            ) : (
              <>Entrar na Conta <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Ainda não tem conta?{' '}
            {/* Repassa o returnUrl para a página de cadastro também! */}
            <Link href={`/cadastro?returnUrl=${returnUrl}`} className="text-blue-600 font-black hover:underline underline-offset-4 cursor-pointer">
              Criar uma agora
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
         <Link href="/" className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors cursor-pointer">
            Voltar para a página inicial
         </Link>
      </div>
    </div>
  );
}

// O Componente Principal empacota tudo com Suspense (Regra do Next.js para o useSearchParams)
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center relative overflow-hidden selection:bg-blue-500/30">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none" />
      
      <Suspense fallback={<div className="flex justify-center w-full relative z-10"><Loader2 className="animate-spin text-blue-600" size={40} /></div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}