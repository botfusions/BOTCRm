import React from 'react';
import { Webhook, Smartphone, Database, Zap, Lock, Globe } from 'lucide-react';

interface BentoGridProps {
    language: 'TR' | 'EN';
}

const BentoGrid: React.FC<BentoGridProps> = ({ language }) => {
  const titles = {
      tech: language === 'TR' ? 'Teknolojik Üstünlük' : 'Tech Superiority',
      sub: language === 'TR' ? 'Geleceğin altyapısı ile bugünden tanışın.' : 'Meet the infrastructure of the future today.',
      webhook: language === 'TR' ? 'Webhook & n8n Entegrasyonu' : 'Webhook & n8n Integration',
      webhookDesc: language === 'TR' 
        ? 'Herhangi bir tetikleyici ile iş akışlarını bağlayın. Kod yazmadan API bağlantıları kurun.' 
        : 'Connect workflows with any trigger. Build API connections without coding.',
      rag: language === 'TR' ? 'RAG Mimarisi' : 'RAG Architecture',
      ragDesc: language === 'TR' ? 'Verilerinizle konuşan akıllı vektör veritabanı.' : 'Smart vector database that talks to your data.',
      mobile: language === 'TR' ? 'Mobil Uyumlu' : 'Mobile Ready',
      mobileDesc: language === 'TR' ? 'Yönetim paneli her an cebinizde.' : 'Admin panel in your pocket anytime.',
      security: language === 'TR' ? 'Kurumsal Güvenlik' : 'Enterprise Security',
      securityDesc: language === 'TR' ? 'Uçtan uca şifreleme ve GDPR uyumluluğu.' : 'End-to-end encryption and GDPR compliance.',
      scale: language === 'TR' ? 'Global Ölçek' : 'Global Scale',
      scaleDesc: language === 'TR' ? 'Dünyanın her yerinden erişim.' : 'Access from anywhere in the world.'
  };

  return (
    <section className="bg-[#030303] py-24 px-8 border-t border-white/5 relative z-20">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">{titles.tech}</h2>
            <p className="text-zinc-500">{titles.sub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
            
            {/* Feature 1 - Large */}
            <div className="md:col-span-2 row-span-2 rounded-3xl bg-white/[0.03] border border-white/10 p-8 flex flex-col justify-between hover:border-white/20 transition-colors group backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center mb-4">
                    <Webhook className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{titles.webhook}</h3>
                    <p className="text-zinc-400">
                        {titles.webhookDesc}
                    </p>
                </div>
                <div className="w-full h-24 bg-black rounded-xl border border-white/10 mt-6 relative overflow-hidden">
                    <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-zinc-800"></div>
                    <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-indigo-500 rounded-full -translate-y-1/2 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-pulse"></div>
                    <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-emerald-500 rounded-full -translate-y-1/2"></div>
                </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-6 flex flex-col justify-center hover:border-white/20 transition-colors backdrop-blur-sm">
                <Database className="w-8 h-8 text-amber-500 mb-4" />
                <h3 className="text-lg font-bold text-white mb-1">{titles.rag}</h3>
                <p className="text-sm text-zinc-500">{titles.ragDesc}</p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-6 flex flex-col justify-center hover:border-white/20 transition-colors backdrop-blur-sm">
                <Smartphone className="w-8 h-8 text-emerald-500 mb-4" />
                <h3 className="text-lg font-bold text-white mb-1">{titles.mobile}</h3>
                <p className="text-sm text-zinc-500">{titles.mobileDesc}</p>
            </div>

             {/* Feature 4 */}
             <div className="md:col-span-2 rounded-3xl bg-white/[0.03] border border-white/10 p-6 flex items-center justify-between hover:border-white/20 transition-colors backdrop-blur-sm">
                <div className="max-w-sm">
                    <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-rose-500" />
                        {titles.security}
                    </h3>
                    <p className="text-sm text-zinc-500">{titles.securityDesc}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-yellow-400" />
                </div>
            </div>

             {/* Feature 5 */}
             <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-6 flex flex-col justify-center hover:border-white/20 transition-colors relative overflow-hidden backdrop-blur-sm">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                    <Globe className="w-32 h-32 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{titles.scale}</h3>
                <p className="text-sm text-zinc-500">{titles.scaleDesc}</p>
            </div>

        </div>
      </div>
    </section>
  );
};

export default BentoGrid;