"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; //
import Link from "next/link";
import { 
  User, Mail, Lock, Eye, EyeOff, 
  ArrowRight, AlertCircle, PlayCircle, Loader2, CheckCircle2 
} from "lucide-react";

export default function CadastroPage() {
  const router = useRouter();
  const supabase = createClient();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validação básica de palavra-passe
    if (password !== confirmPassword) {
      setError("As palavras-passe não coincidem.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A palavra-passe deve ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    // Registo via Supabase com metadados
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: nome, // Guarda o nome do utilizador
        }
      }
    });

    if (signUpError) {
      setLoading(false);
      if (signUpError.message.includes("already registered")) {
        setError("Este e-mail já está registado. Tente fazer login.");
      } else {
        setError("Ocorreu um erro ao criar a conta. Tente novamente.");
      }
      return;
    }

    // O Supabase pode exigir confirmação de e-mail ou fazer login automático
    if (data?.session) {
      // Login automático ativado
      router.push("/minha-conta");
      router.refresh();
    } else {
      // Exige confirmação de e-mail (Comportamento padrão seguro do Supabase)
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center relative overflow-hidden selection:bg-blue-500/30 py-12">
      
      {/* EFEITOS DE FUNDO */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md mx-auto px-6 relative z-10">
        
        {/* LOGO & CABEÇALHO */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 mb-6 group cursor-pointer transition-transform hover:scale-105">
            <PlayCircle size={32} className="text-blue-600 group-hover:text-indigo-600 transition-colors" />
          </Link>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Criar Conta</h1>
          <p className="text-slate-500 text-sm font-medium">
            Junte-se a nós para aceder às suas chaves UniTV.
          </p>
        </div>

        {/* CARTÃO DE CADASTRO */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
          
          {success ? (
            <div className="text-center animate-in zoom-in duration-500 py-6">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Quase lá!</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Enviamos um link de confirmação para <strong>{email}</strong>. Por favor, verifique a sua caixa de entrada para ativar a conta.
              </p>
              <Link href="/login" className="inline-block w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors cursor-pointer">
                Ir para o Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              
              {/* ALERTA DE ERRO */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-semibold border border-red-100 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {/* INPUT NOME */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input 
                    type="text" 
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: James Gordon"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              {/* INPUT EMAIL */}
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

              {/* INPUT PASSWORD */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Senha</label>
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

              {/* INPUT CONFIRMAR PASSWORD */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Confirmar Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              {/* BOTÃO SUBMIT */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-linear-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> 
                    A criar conta...
                  </>
                ) : (
                  <>
                    Criar Conta <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* RODAPÉ DO CARTÃO (LOGIN) */}
          {!success && (
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500 font-medium">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-blue-600 font-black hover:underline underline-offset-4 cursor-pointer">
                  Fazer Login
                </Link>
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
           <Link href="/" className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors cursor-pointer">
              Voltar para a página inicial
           </Link>
        </div>
      </div>
    </div>
  );
}