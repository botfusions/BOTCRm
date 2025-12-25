
import React, { useEffect, useState } from 'react';
import Hero from './Hero';
import IndustryShowcase from './IndustryShowcase';
import BentoGrid from './BentoGrid';
import Pricing from './Pricing';
import AuthForm from './AuthForm';
import QuickContactForm from './QuickContactForm';
import { Globe } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  language: 'TR' | 'EN';
  setLanguage: (lang: 'TR' | 'EN') => void;
}

const BrandLogo = () => {
  const LOGO_URL = "https://qlcbobvbircjhlglhfhr.supabase.co/storage/v1/object/public/image/cmr%20logo.png";

  return (
    <div className="flex items-center gap-4 cursor-pointer pointer-events-auto select-none group">
      <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-500/40 blur-[20px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-125"></div>
          <img 
              src={LOGO_URL} 
              alt="Lumina Logo" 
              className="relative z-10 w-full h-full object-contain mix-blend-screen drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-transform duration-500 group-hover:scale-105" 
          />
      </div>
      <div className="relative h-8 md:h-10 flex items-center">
          <span className="text-2xl md:text-3xl font-bold tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-zinc-500 to-zinc-700 transition-all duration-500 group-hover:opacity-0 absolute left-0 font-sans uppercase">
              BOTSCRm
          </span>
          <span className="text-2xl md:text-3xl font-bold tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-600 absolute left-0 opacity-0 group-hover:opacity-100 transition-all duration-700 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)] font-sans uppercase">
              BOTSCRm
          </span>
      </div>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, language, setLanguage }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const openAuth = () => setIsAuthOpen(true);

  const scrollToContact = () => {
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] font-sans selection:bg-rose-500/30 selection:text-rose-500">
      
      <AuthForm 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onSuccess={onLogin} 
        language={language} 
      />

      <nav className="fixed top-0 left-0 w-full z-40 px-8 py-6 flex justify-between items-center pointer-events-none">
        <BrandLogo />
        <div className="flex items-center gap-4 pointer-events-auto">
            <button 
                onClick={() => setLanguage(language === 'EN' ? 'TR' : 'EN')} 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/70 text-xs font-medium hover:text-white transition-colors"
            >
                <Globe className="w-4 h-4" /> <span>{language}</span>
            </button>
            <button 
              onClick={openAuth}
              className="px-8 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest backdrop-blur-md hover:bg-amber-500/10 hover:border-amber-500/50 hover:text-amber-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all"
            >
              {language === 'TR' ? 'Giriş Yap' : 'Login'}
            </button>
        </div>
      </nav>

      <main>
        <Hero onStart={scrollToContact} language={language} />
        <IndustryShowcase language={language} onAction={scrollToContact} />
        <BentoGrid language={language} />
        <QuickContactForm id="contact-form" language={language} />
        <Pricing language={language} onAction={scrollToContact} onLogin={openAuth} />
      </main>

      <footer className="bg-[#030303] py-12 border-t border-white/5 text-center text-white/20 text-sm">
        <p>© 2024 botsCRM. {language === 'EN' ? 'All rights reserved.' : 'Tüm hakları saklıdır.'}</p>
      </footer>
    </div>
  );
};

export default LandingPage;
