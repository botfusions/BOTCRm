
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Send, Loader2, CheckCircle2, Zap } from 'lucide-react';
import { supabase } from '../../services/client';

interface QuickContactFormProps {
  language: 'TR' | 'EN';
  id?: string;
}

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted static content outside the component body
 * to prevent re-allocation on every render.
 */
const FORM_CONTENT = {
    TR: {
      title: "Hemen Başlayalım",
      subtitle: "Bilgilerinizi bırakın, botlarınızı birlikte tasarlayalım.",
      name: "Adınız Soyadınız",
      email: "E-posta Adresiniz",
      phone: "Telefon Numaranız",
      btn: "Gönder ve Başlat",
      success: "Mesajınız alındı! Ekibimiz sizinle iletişime geçecek.",
      rateLimited: "Çok fazla deneme, lütfen biraz sonra tekrar deneyin.",
      invalid: "Lütfen bilgileri kontrol edin.",
      failed: "Gönderilemedi, lütfen tekrar deneyin."
    },
    EN: {
      title: "Get Started Now",
      subtitle: "Leave your info, let's design your bots together.",
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      btn: "Submit and Start",
      success: "Message received! Our team will contact you shortly.",
      rateLimited: "Too many attempts, please try again later.",
      invalid: "Please check your details.",
      failed: "Could not send, please try again."
    }
};

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Memoized QuickContactForm component to prevent re-renders
 * when the parent (LandingPage) state (like isAuthOpen) changes.
 */
const QuickContactForm: React.FC<QuickContactFormProps> = React.memo(({ language, id }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });
  // Honeypot: gerçek kullanıcılar görmez/doldurmaz; bot doldurursa sunucu sessizce yok sayar
  const [honeypot, setHoneypot] = useState('');

  const t = FORM_CONTENT[language];

  // Herkese açık form: doğrudan tabloya yazmaz; 'submit-lead' Edge Function
  // (hız sınırı + doğrulama + service role) üzerinden kayıt oluşturur.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('submit-lead', {
        body: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          website: honeypot
        }
      });

      if (fnError) {
        const status: number | undefined = (fnError as any)?.context?.status;
        if (status === 429) setError(t.rateLimited);
        else if (status === 400) setError(t.invalid);
        else setError(t.failed);
        return;
      }

      // Başarı mesajı yalnızca sunucu açıkça ok: true döndüğünde gösterilir
      if (data && (data as any).ok === true) {
        setSuccess(true);
        setFormData({ fullName: '', email: '', phone: '' });
        setHoneypot('');
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(t.failed);
      }
    } catch {
      setError(t.failed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id={id} className="py-24 px-8 bg-[#030303] relative overflow-hidden flex justify-center border-t border-white/5">
      {/* Arka plan ışığı tamamen kaldırıldı, sadece saf siyah zemin ve form sınırları kaldı */}
      
      <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black tracking-widest uppercase mb-6">
            <Zap className="w-3 h-3 fill-amber-500" /> BOTSCRm Connect
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tighter leading-none">
            {t.title} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">
              Saniyeler İçinde.
            </span>
          </h2>
          <p className="text-zinc-500 text-lg leading-relaxed max-w-sm">
            {t.subtitle}
          </p>
        </div>

        <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-2xl relative group transition-all hover:border-amber-500/20">
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <p className="text-white font-bold text-xl">{t.success}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot alanı: ekran dışında, erişilebilirlik ağacından ve sekme sırasından çıkarılmış */}
              <div
                aria-hidden="true"
                style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}
              >
                <label htmlFor="qcf-website">Website</label>
                <input
                  id="qcf-website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={e => setHoneypot(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{t.name}</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input 
                    required
                    type="text" 
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Ad Soyad"
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-amber-500/50 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{t.email}</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="E-posta"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-amber-500/50 transition-all text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{t.phone}</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="Telefon"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-amber-500/50 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <p role="alert" className="text-center text-xs font-bold text-rose-500">{error}</p>
              )}

              <button 
                disabled={loading}
                className="w-full relative overflow-hidden group bg-white/5 border border-white/10 text-white font-black py-5 rounded-2xl hover:border-amber-500/50 hover:text-amber-500 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-200/0 via-amber-200/10 to-amber-200/0 -translate-x-full group-hover:animate-shimmer" />
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4 transition-transform group-hover:translate-x-1" /> {t.btn}</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
});

export default QuickContactForm;
