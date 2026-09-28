
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, X, Sparkles, ShieldCheck, AlertCircle, Play } from 'lucide-react';
import { supabase, clearDemoMode } from '../../services/client';

interface AuthFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language: 'TR' | 'EN';
}

const AuthForm: React.FC<AuthFormProps> = ({ isOpen, onClose, onSuccess, language }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const t = {
    TR: {
      login: "Giriş Yap",
      demo: "Demo Girişi",
      email: "E-posta Adresi",
      pass: "Şifre",
      welcome: "Tekrar Hoş Geldin",
      error: "Giriş bilgileri hatalı. Lütfen bilgileri kontrol edin.",
      confirmEmail: "Lütfen e-postanıza gelen onay linkine tıklayın.",
      inviteOnly: "Hesaplar davetle açılır — erişim için bize yazın."
    },
    EN: {
      login: "Login",
      demo: "Demo Access",
      email: "Email Address",
      pass: "Password",
      welcome: "Welcome Back",
      error: "Invalid credentials. Please check your info.",
      confirmEmail: "Please confirm your email address via the link sent.",
      inviteOnly: "Accounts are invite-only — contact us for access."
    }
  }[language];

  // Yalnızca giriş: herkese açık kayıt güvenlik nedeniyle kaldırıldı;
  // hesaplar davetle açılır ve ekip üyeliği sunucu tarafında (bots_team_members) denetlenir.
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError, data } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        // Supabase hata mesajlarını yakala
        if (signInError.message.includes("Email not confirmed")) {
          throw new Error(t.confirmEmail);
        }
        if (signInError.message.includes("Invalid login credentials")) {
          throw new Error(t.error);
        }
        throw signInError;
      }

      if (data.session) {
        // Gerçek oturum açıldıysa önceki demo bayrağı temizlenir
        clearDemoMode();
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = () => {
    // Demo oturumu: servisler bu bayrak varken veritabanına hiç istek atmaz, örnek veri gösterir
    try {
      sessionStorage.setItem('botscrm_demo_mode', 'true');
      sessionStorage.setItem('botscrm_demo_started', new Date().toISOString());
    } catch {
      // sessionStorage kullanılamıyorsa demo modu açılamaz
      return;
    }

    console.info('🎮 Demo mode activated - Limited access session');
    onSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-2xl"
          >
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/20 blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-amber-500/10 blur-[80px]" />

            <button onClick={onClose} className="absolute right-6 top-6 text-white/40 hover:text-white transition-colors">
              <X className="h-6 w-6" />
            </button>

            <div className="relative z-10 text-center mb-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 mb-4 shadow-inner">
                <Sparkles className="h-7 w-7 text-amber-500" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
                {t.welcome}
              </h2>
              <p className="text-xs text-zinc-500">
                {language === 'TR' ? "BOTSCRm paneline güvenli erişim sağlayın." : "Secure access to the BOTSCRm panel."}
              </p>
            </div>

            <form onSubmit={handleAuth} className="relative z-10 space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">{t.email}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  <input
                    required
                    autoFocus
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-white/5 bg-black/40 py-3.5 pl-12 pr-4 text-sm text-white focus:border-amber-500/50 focus:outline-none transition-all"
                    placeholder="email@adresiniz.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">{t.pass}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/5 bg-black/40 py-3.5 pl-12 pr-4 text-sm text-white focus:border-amber-500/50 focus:outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[11px] font-medium text-center flex items-center justify-center gap-2 animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error}
                </div>
              )}

              <div className="space-y-3 pt-2">
                <button
                  disabled={loading}
                  type="submit"
                  className="group relative w-full overflow-hidden rounded-2xl bg-white py-4 text-sm font-bold text-black transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.login}
                    {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleDemoMode}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-amber-500/10 hover:border-amber-500/50 hover:text-amber-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all"
                >
                  <Play className="w-3.5 h-3.5" /> {t.demo}
                </button>
              </div>
            </form>

            <div className="relative z-10 mt-6 text-center">
              <p className="text-xs text-zinc-500">{t.inviteOnly}</p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 pt-4 border-t border-white/5 opacity-40">
              <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
              <span className="text-[9px] font-medium tracking-widest text-zinc-400 uppercase">BOTSCRm Secure Node</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthForm;
