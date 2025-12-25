
import React, { useState, useEffect } from 'react';
import { 
    User, 
    LogOut, 
    Key, 
    Mail, 
    MessageSquare, 
    Save, 
    Globe, 
    Database, 
    Smartphone,
    Send,
    Check,
    Type,
    Loader2,
    Webhook,
    Zap,
    Terminal,
    Settings as SettingsIcon
} from 'lucide-react';
import { fetchSettings, saveSettings, BOTS_Settings } from '../services/settingsService';

interface SettingsProps {
  darkMode: boolean;
  language?: 'TR' | 'EN';
  onLogout: () => void;
}

type SettingsTab = 'general' | 'integrations' | 'automation' | 'communication';

const Settings: React.FC<SettingsProps> = ({ darkMode, language = 'TR', onLogout }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [errorType, setErrorType] = useState<string | null>(null);

  const [formData, setFormData] = useState<BOTS_Settings>({
    full_name: '',
    email: '',
    openai_key: '',
    supabase_url: '',
    supabase_key: '',
    telegram_bot_token: '',
    telegram_chat_id: '',
    instagram_token: '',
    phone: '+90 ',
    whatsapp_id: '',
    smtp_host: 'smtp.gmail.com',
    smtp_port: '587',
    sender_name: 'BOTSCRm Team',
    sender_email: 'no-reply@botscrm.com',
    welcome_subject: 'Hoş Geldin {{name}}!',
    welcome_body: 'Merhaba {{name}}, BOTSCRm dünyasına hoş geldin!',
    n8n_webhook_url: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    setErrorType(null);
    try {
      const data = await fetchSettings();
      if (data) {
        setFormData(data);
      }
    } catch (err: any) {
      if (err.message === 'SETTINGS_TABLE_NOT_FOUND') {
        setErrorType('SETTINGS_TABLE_NOT_FOUND');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof BOTS_Settings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    const success = await saveSettings(formData);
    if (success) {
      setSaveMessage(language === 'TR' ? 'Ayarlar kaydedildi!' : 'Settings saved!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
    setIsSaving(false);
  };

  const bgCard = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const textMain = darkMode ? 'text-white' : 'text-slate-900';
  const textSub = darkMode ? 'text-slate-400' : 'text-slate-500';
  const inputClass = `w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-4 focus:ring-indigo-500/10 ${darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'}`;
  const labelClass = `text-[10px] font-black uppercase tracking-[0.15em] mb-2 block ${darkMode ? 'text-slate-500' : 'text-slate-400'}`;

  const renderContent = () => {
    if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

    switch (activeTab) {
        case 'integrations':
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className={`p-8 rounded-[2rem] border shadow-xl ${bgCard}`}>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20"><Key className="w-6 h-6 text-white" /></div>
                            <h2 className={`text-xl font-bold ${textMain}`}>Sistem API Anahtarları</h2>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className={labelClass}>Google Gemini API Key (Zorunlu)</label>
                                <input type="password" value={process.env.API_KEY || ''} disabled className={`${inputClass} opacity-50 cursor-not-allowed`} placeholder="Env dosyasından okunuyor..." />
                                <p className="text-[10px] text-zinc-500 mt-2 font-medium italic">Gemini API Key güvenlik nedeniyle sistem değişkeni olarak tanımlanmıştır.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>Supabase URL</label>
                                    <input type="text" value={formData.supabase_url} onChange={(e) => handleChange('supabase_url', e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Supabase Service Role Key</label>
                                    <input type="password" value={formData.supabase_key} onChange={(e) => handleChange('supabase_key', e.target.value)} className={inputClass} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        case 'automation':
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className={`p-8 rounded-[2rem] border shadow-xl ${bgCard}`}>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-rose-600 rounded-2xl shadow-lg shadow-rose-600/20"><Webhook className="w-6 h-6 text-white" /></div>
                            <h2 className={`text-xl font-bold ${textMain}`}>n8n & Otomasyon Köprüsü</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                                <p className="text-sm text-indigo-500 font-bold mb-2 flex items-center gap-2"><Zap className="w-4 h-4 fill-indigo-500" /> Otomasyon Nasıl Çalışır?</p>
                                <p className="text-xs text-slate-500 leading-relaxed">n8n üzerinde bir "Webhook" oluşturun ve bu URL'yi aşağıya yapıştırın. Sistem, kritik olayları (yeni aday, form dolumu vb.) bu URL'ye POST ederek tam otomasyonu tetikler.</p>
                            </div>
                            <div>
                                <label className={labelClass}>n8n Webhook Production URL</label>
                                <input type="text" value={formData.n8n_webhook_url} onChange={(e) => handleChange('n8n_webhook_url', e.target.value)} className={inputClass} placeholder="https://n8n.sirketiniz.com/webhook/..." />
                            </div>
                        </div>
                    </div>
                </div>
            );
        case 'communication':
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className={`p-8 rounded-[2rem] border shadow-xl ${bgCard}`}>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-sky-500 rounded-2xl shadow-lg shadow-sky-600/20"><Send className="w-6 h-6 text-white" /></div>
                            <h2 className={`text-xl font-bold ${textMain}`}>Sosyal Medya Botları</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className={labelClass}>Telegram Bot Token</label>
                                <input type="password" value={formData.telegram_bot_token} onChange={(e) => handleChange('telegram_bot_token', e.target.value)} className={inputClass} placeholder="58129..." />
                            </div>
                            <div>
                                <label className={labelClass}>Instagram Access Token</label>
                                <input type="password" value={formData.instagram_token} onChange={(e) => handleChange('instagram_token', e.target.value)} className={inputClass} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        default:
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className={`p-8 rounded-[2rem] border shadow-xl ${bgCard}`}>
                        <div className="flex items-center gap-8">
                            <div className="relative group">
                                <img src={`https://ui-avatars.com/api/?name=${formData.full_name}&background=6366f1&color=fff&size=128`} alt="Avatar" className="w-32 h-32 rounded-[2.5rem] border-4 border-white dark:border-slate-800 shadow-2xl" />
                                <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                    <SettingsIcon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="flex-1 grid grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>Ad Soyad</label>
                                    <input type="text" value={formData.full_name} onChange={(e) => handleChange('full_name', e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Yönetici E-posta</label>
                                    <input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className={inputClass} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={onLogout} className="w-full py-4 rounded-2xl border border-rose-500/30 text-rose-500 text-sm font-black uppercase tracking-widest hover:bg-rose-500/5 transition-all flex items-center justify-center gap-2">
                        <LogOut className="w-4 h-4" /> Oturumu Güvenli Kapat
                    </button>
                </div>
            );
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#F3F4F6] dark:bg-slate-950">
      <header className={`px-10 py-8 border-b shrink-0 flex items-center justify-between ${darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'}`}>
        <div>
            <h1 className={`text-2xl font-black tracking-tighter uppercase ${textMain}`}>Yönetici Kontrol Paneli</h1>
            <p className={`mt-1 text-xs font-bold ${textSub} uppercase tracking-widest`}>Sistem Mimarisi ve API Entegrasyonları</p>
        </div>
        <div className="flex items-center gap-6">
            {saveMessage && (
                <div className="flex items-center gap-2 text-emerald-500 text-xs font-black uppercase tracking-widest animate-in fade-in slide-in-from-right-2">
                    <Check className="w-4 h-4" /> {saveMessage}
                </div>
            )}
            <button onClick={handleSave} disabled={isSaving || loading} className="px-10 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-2xl shadow-indigo-600/30 disabled:opacity-50">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Buluta İşle</>}
            </button>
        </div>
      </header>
      <div className="flex-1 flex overflow-hidden">
          <aside className={`w-72 shrink-0 border-r p-8 space-y-3 ${darkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-slate-50/50'}`}>
              <NavButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={User} label="Profil" darkMode={darkMode} />
              <NavButton active={activeTab === 'integrations'} onClick={() => setActiveTab('integrations')} icon={Globe} label="API / Supabase" darkMode={darkMode} />
              <NavButton active={activeTab === 'automation'} onClick={() => setActiveTab('automation')} icon={Zap} label="n8n Otomasyon" darkMode={darkMode} />
              <NavButton active={activeTab === 'communication'} onClick={() => setActiveTab('communication')} icon={MessageSquare} label="Mesajlaşma" darkMode={darkMode} />
              
              <div className="pt-10">
                  <div className="p-6 rounded-3xl bg-indigo-600/5 border border-indigo-500/10">
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">Sistem Durumu</p>
                      <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-[11px] font-bold text-slate-500">Cloud Sync: OK</span>
                      </div>
                  </div>
              </div>
          </aside>
          <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
              <div className="max-w-4xl mx-auto">{renderContent()}</div>
          </main>
      </div>
    </div>
  );
};

const NavButton = ({active, onClick, icon: Icon, label, darkMode}: any) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : `text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800 ${darkMode ? 'hover:text-slate-200' : 'hover:text-slate-900'}`}`}>
        <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} /> {label}
    </button>
);

export default Settings;
