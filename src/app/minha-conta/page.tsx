"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; 
import { buscarDadosDoCliente } from "./actions"; // 🌟 Importamos a nossa Action Segura
import { 
  User, Package, Key, ChevronRight, 
  Copy, CheckCircle2, ExternalLink,
  LogOut, Settings, PlayCircle, Loader2, X, Save,
  Camera, Mail, Phone, AlertCircle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  created_at: string;
  status: 'pending' | 'paid' | 'cancelled';
  total_amount: number;
  items?: OrderItem[];
}

interface ActivationKey {
  id: string;
  product_name: string;
  key_code: string;
  order_id: string;
  expires_at?: string;
}

export default function MinhaContaPage() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados de Exibição Principal
  const [activeTab, setActiveTab] = useState<'pedidos' | 'chaves'>('pedidos');
  const [orders, setOrders] = useState<Order[]>([]);
  const [keys, setKeys] = useState<ActivationKey[]>([]);
  const [userName, setUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // Estados do Modal de Edição
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [originalEmail, setOriginalEmail] = useState("");
  
  // Estados de Controle
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [copiado, setCopiado] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{type: 'success' | 'error' | 'warning', text: string} | null>(null);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const full = user.user_metadata?.full_name || user.email?.split('@')[0] || "Cliente";
        const wpp = user.user_metadata?.whatsapp || "";
        const photo = user.user_metadata?.avatar_url || null;
        
        setFullName(full);
        setUserName(full.trim().split(' ')[0]);
        setEmail(user.email || "");
        setOriginalEmail(user.email || "");
        setWhatsapp(wpp);
        setAvatarUrl(photo);
        setPreviewAvatar(photo);

        // 🛡️ MUDANÇA DE SEGURANÇA: Chama o servidor em vez de expor o Supabase no navegador
        const respostaServidor = await buscarDadosDoCliente();
        
        if (respostaServidor.sucesso) {
          setOrders(respostaServidor.orders || []);
          setKeys(respostaServidor.keys || []);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [supabase.auth]);

  const handleMascaraTelefone = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, ''); 
    if (valor.length > 11) valor = valor.slice(0, 11);
    if (valor.length > 2) valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    if (valor.length > 10) valor = `${valor.slice(0, 10)}-${valor.slice(10)}`;
    setWhatsapp(valor);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewAvatarFile(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateMessage(null);
    
    let finalAvatarUrl = avatarUrl;

    try {
      if (newAvatarFile) {
        const fileExt = newAvatarFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${userName}-${fileName}`;

        const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, newAvatarFile, { upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
          finalAvatarUrl = data.publicUrl;
          setAvatarUrl(finalAvatarUrl);
        }
      }

      const { error: metaError } = await supabase.auth.updateUser({
        data: { 
          full_name: fullName,
          whatsapp: whatsapp,
          avatar_url: finalAvatarUrl
        }
      });

      if (metaError) throw metaError;

      setUserName(fullName.trim().split(' ')[0]);

      if (email !== originalEmail) {
        const { error: emailError } = await supabase.auth.updateUser({ email: email });
        if (emailError) throw emailError;
        
        setUpdateMessage({
          type: 'warning',
          text: 'Perfil salvo! Verifique a caixa de entrada do seu novo e-mail para confirmar a alteração.'
        });
      } else {
        setIsSettingsOpen(false); 
      }

    } catch (error: unknown) {
      const err = error as Error;
      setUpdateMessage({ type: 'error', text: err.message || 'Erro ao atualizar o perfil.' });
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh(); 
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiado(code);
    setTimeout(() => setCopiado(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
        <p className="text-slate-400 font-medium">A carregar o seu perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans">
      <div className="bg-white border-b border-slate-200 pt-16 pb-12 px-6">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
          
          <div className="w-24 h-24 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-200 mb-6 relative overflow-hidden">
            {avatarUrl ? (
              <Image 
                src={avatarUrl} 
                alt="Perfil" 
                fill 
                className="object-cover" 
                unoptimized 
              />
            ) : (
              <User size={48} className="text-white" />
            )}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full z-10"></div>
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Olá, {userName}!</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Gerencie seus pedidos e chaves de ativação.</p>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-3 text-slate-400 mb-3">
              <Package size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Pedidos</span>
            </div>
            <p className="text-3xl font-black text-slate-900">{orders.length}</p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-3 text-blue-500 mb-3">
              <Key size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Chaves</span>
            </div>
            <p className="text-3xl font-black text-blue-600">{keys.length}</p>
          </div>
        </div>

        <div className="flex p-1.5 bg-slate-200/60 backdrop-blur-md rounded-2xl mb-8">
          <button 
            onClick={() => setActiveTab('pedidos')}
            className={`flex-1 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'pedidos' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500'}`}
          >
            Meus Pedidos
          </button>
          <button 
            onClick={() => setActiveTab('chaves')}
            className={`flex-1 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'chaves' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500'}`}
          >
            Minhas Chaves
          </button>
        </div>

        <div className="space-y-4">
          {activeTab === 'pedidos' ? (
             orders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded">#{order.id.split('-')[0]}</span>
                    <p className="text-sm font-bold text-slate-800">Comprado em {new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <p className="font-black text-xl text-slate-900">R$ {order.total_amount.toFixed(2)}</p>
                </div>
                <Link href={`/checkout/pagamento/${order.id}`} className="w-full flex items-center justify-center gap-2 py-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded-2xl text-xs font-black transition-all border border-slate-100">
                  VER COMPROVANTE <ExternalLink size={14} />
                </Link>
              </div>
            ))
          ) : (
            keys.map(key => (
              <div key={key.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <PlayCircle className="absolute -right-4 -bottom-4 text-blue-50/50" size={120} />
                <div className="relative z-10">
                  <h3 className="text-xl font-black text-slate-900 mb-5">{key.product_name}</h3>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <code className="text-sm font-mono font-black text-slate-700 tracking-widest">{key.key_code}</code>
                    <button onClick={() => handleCopy(key.key_code)} className={`p-3 rounded-xl transition-all cursor-pointer ${copiado === key.key_code ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>
                      {copiado === key.key_code ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          {((activeTab === 'pedidos' && orders.length === 0) || (activeTab === 'chaves' && keys.length === 0)) && (
             <EmptyState 
               icon={activeTab === 'pedidos' ? <Package size={48} /> : <Key size={48} />} 
               title={activeTab === 'pedidos' ? "Nenhum pedido" : "Sem chaves"} 
               subtitle="Efetue uma compra para visualizar os seus dados." 
             />
          )}
        </div>

        <div className="mt-12 space-y-4">
          <h4 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Preferências</h4>
          
          <MenuOption 
            icon={<Settings size={18} />} 
            label="Gerenciar Perfil" 
            onClick={() => setIsSettingsOpen(true)}
          />
          
          <button 
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-between p-5 bg-red-50 hover:bg-red-100 text-red-600 rounded-3xl font-black text-sm transition-all cursor-pointer border-none"
          >
            <div className="flex items-center gap-4">
              {loggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
              Sair da Conta
            </div>
          </button>
        </div>
      </main>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-4xl max-w-sm w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
            
            <button onClick={() => {
              setIsSettingsOpen(false);
              setUpdateMessage(null);
            }} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer z-10">
              <X size={24} />
            </button>
            
            <h3 className="text-xl font-black text-slate-900 mb-6 text-center">Editar Perfil</h3>

            {updateMessage && (
              <div className={`p-4 rounded-2xl text-xs font-bold mb-6 flex gap-2 items-start ${updateMessage.type === 'warning' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                 <AlertCircle size={16} className="shrink-0 mt-0.5" />
                 <p>{updateMessage.text}</p>
              </div>
            )}
            
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              
              <div className="flex flex-col items-center justify-center mb-2">
                <input 
                  type="file" 
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-24 h-24 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors group overflow-hidden"
                >
                  {previewAvatar ? (
                    <Image 
                      src={previewAvatar} 
                      alt="Preview" 
                      fill 
                      className="object-cover" 
                      unoptimized 
                    />
                  ) : (
                    <User size={32} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-3">Alterar Foto</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="tel"
                    value={whatsapp}
                    onChange={handleMascaraTelefone}
                    placeholder="(11) 99999-9999"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={updating}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-slate-900/20 mt-4 disabled:opacity-70"
              >
                {updating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Salvar Alterações
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuOption({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-5 bg-white border border-slate-200 rounded-3xl hover:bg-slate-50 transition-all cursor-pointer shadow-sm group"
    >
      <div className="flex items-center gap-4 text-slate-700 font-black text-sm group-hover:text-blue-600 transition-colors">
        {icon} {label}
      </div>
      <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600" />
    </button>
  );
}

function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="py-20 flex flex-col items-center text-center px-8 bg-white rounded-3xl border border-dashed border-slate-200">
      <div className="text-slate-200 mb-6">{icon}</div>
      <h3 className="text-xl font-black text-slate-800">{title}</h3>
      <p className="text-slate-400 text-sm font-medium mt-2 max-w-55">{subtitle}</p>
    </div>
  );
}