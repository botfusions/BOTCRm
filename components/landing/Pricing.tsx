
import React from 'react';
import { Check, Sparkles, Zap, Shield, Instagram, MessageCircle, Send, LogIn } from 'lucide-react';
import { cn } from '../../utils';

interface PricingProps {
  language: 'TR' | 'EN';
  onAction?: () => void;
  onLogin?: () => void;
}

const Pricing: React.FC<PricingProps> = ({ language, onAction, onLogin }) => {
  
  const content = {
    EN: {
      title: "Simple, Transparent Pricing",
      subtitle: "Start your automated journey today. No hidden fees.",
      trial: {
        name: "Starter Trial",
        price: "Free",
        period: "3 Days",
        desc: "Perfect for testing the waters.",
        features: ["Full Bot Access", "Basic Analytics", "1 Active Flow", "Community Support"],
        cta: "Start Free Trial"
      },
      monthly: {
        name: "Pro Monthly",
        price: "$50",
        period: "/month",
        desc: "Flexibility for growing businesses.",
        features: ["Everything in Trial", "Unlimited Flows", "Priority Support", "Advanced Analytics", "No Watermark"],
        cta: "Subscribe Monthly"
      },
      annual: {
        name: "Pro Annual",
        price: "$500",
        period: "/year",
        desc: "Maximum savings for long-term power.",
        features: ["Everything in Pro", "2 Months Free", "Dedicated Account Mgr", "Early Feature Access", "API Access"],
        cta: "Go Annual & Save",
        badge: "2 MONTHS FREE"
      },
      footerCta: "Already have an account?",
      loginBtn: "Login here"
    },
    TR: {
      title: "Basit, Şeffaf Fiyatlandırma",
      subtitle: "Otomasyon yolculuğunuza bugün başlayın. Gizli ücret yok.",
      trial: {
        name: "Deneme Sürümü",
        price: "Ücretsiz",
        period: "3 Gün",
        desc: "Sistemi test etmek için mükemmel.",
        features: ["Tam Bot Erişimi", "Temel Analitik", "1 Aktif Akış", "Topluluk Desteği"],
        cta: "Ücretsiz Dene"
      },
      monthly: {
        name: "Pro Aylık",
        price: "$50",
        period: "/ay",
        desc: "Büyüyen işletmeler için esneklik.",
        features: ["Denemedeki Her Şey", "Sınırsız Akış", "Öncelikli Destek", "Gelişmiş Analitik", "Marka Kaldırma"],
        cta: "Aylık Abone Ol"
      },
      annual: {
        name: "Pro Yıllık",
        price: "$500",
        period: "/yıl",
        desc: "Uzun vadeli güç için maksimum tasarruf.",
        features: ["Pro'daki Her Şey", "2 Ay Bedava", "Özel Müşteri Temsilcisi", "Erken Erişim", "API Erişimi"],
        cta: "Yıllık Al & Tasarruf Et",
        badge: "2 AY BEDAVA"
      },
      footerCta: "Zaten bir hesabınız var mı?",
      loginBtn: "Buradan giriş yapın"
    }
  };

  const txt = content[language];

  return (
    <section className="bg-[#030303] py-24 px-6 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            {txt.title}
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            {txt.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-20">
          {/* Trial Card */}
          <div className="relative group rounded-3xl bg-zinc-900/40 border border-white/5 p-8 backdrop-blur-sm hover:border-white/10 transition-all duration-300 hover:-translate-y-2">
            <div className="mb-6">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-4 text-white">
                    <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{txt.trial.name}</h3>
                <p className="text-zinc-500 text-sm">{txt.trial.desc}</p>
            </div>
            <div className="mb-8">
                <span className="text-4xl font-bold text-white">{txt.trial.price}</span>
                <span className="text-zinc-500 ml-2">{txt.trial.period}</span>
            </div>
            <ul className="space-y-4 mb-8">
                {txt.trial.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                        <Check className="w-5 h-5 text-zinc-500 shrink-0" />
                        {feat}
                    </li>
                ))}
            </ul>
            <button 
              onClick={onAction}
              className="w-full py-3.5 rounded-xl border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 hover:border-amber-500/50 hover:text-amber-500 transition-all"
            >
                {txt.trial.cta}
            </button>
          </div>

          {/* Pro Monthly Card */}
          <div className="relative group rounded-3xl bg-zinc-900/40 border border-white/5 p-8 backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-2">
            <div className="mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-900/30 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
                    <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{txt.monthly.name}</h3>
                <p className="text-zinc-500 text-sm">{txt.monthly.desc}</p>
            </div>
            <div className="mb-8">
                <span className="text-4xl font-bold text-white">{txt.monthly.price}</span>
                <span className="text-zinc-500 ml-2">{txt.monthly.period}</span>
            </div>
            <ul className="space-y-4 mb-8">
                {txt.monthly.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                        <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                        {feat}
                    </li>
                ))}
            </ul>
            <button 
              onClick={onAction}
              className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:border-amber-500/50 hover:text-amber-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all"
            >
                {txt.monthly.cta}
            </button>
          </div>

          {/* Pro Annual Card */}
          <div className="relative group rounded-3xl bg-gradient-to-b from-zinc-900/80 to-black border border-amber-500/30 p-8 backdrop-blur-md transition-all duration-300 transform md:-translate-y-4 hover:-translate-y-6 shadow-[0_0_50px_-20px_rgba(245,158,11,0.3)]">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg tracking-wider">
                {txt.annual.badge}
            </div>
            <div className="mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400">
                    <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{txt.annual.name}</h3>
                <p className="text-zinc-400 text-sm">{txt.annual.desc}</p>
            </div>
            <div className="mb-8">
                <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-white tracking-tight">{txt.annual.price}</span>
                    <span className="text-zinc-400 ml-2">{txt.annual.period}</span>
                </div>
            </div>
            <ul className="space-y-4 mb-8">
                {txt.annual.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-200 text-sm font-medium">
                        <div className="p-0.5 rounded-full bg-amber-500/20 text-amber-500">
                            <Check className="w-3.5 h-3.5" />
                        </div>
                        {feat}
                    </li>
                ))}
            </ul>
            <button 
              onClick={onAction}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs uppercase tracking-widest hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all active:scale-[0.98]"
            >
                {txt.annual.cta}
            </button>
          </div>
        </div>

        {/* New Social & Login Footer-Lite */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
                <a href="#" className="p-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-amber-500/30 transition-all">
                    <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="p-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-emerald-500/30 transition-all">
                    <MessageCircle className="w-5 h-5" />
                </a>
                <a href="#" className="p-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-sky-500/30 transition-all">
                    <Send className="w-5 h-5" />
                </a>
            </div>

            <div className="flex items-center gap-4 bg-zinc-900/50 p-2 pl-6 rounded-2xl border border-white/5">
                <span className="text-sm text-zinc-500 font-medium">{txt.footerCta}</span>
                <button 
                  onClick={onLogin}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-amber-500/10 hover:border-amber-500/50 hover:text-amber-500 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)] transition-all"
                >
                    <LogIn className="w-3.5 h-3.5" /> {txt.loginBtn}
                </button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
