import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Stethoscope, Building, Truck } from 'lucide-react';

interface GoldenMarqueeProps {
  language: 'TR' | 'EN';
}

const GoldenMarquee: React.FC<GoldenMarqueeProps> = ({ language }) => {
  
  const SECTORS = [
    { 
        id: 1, 
        title: language === 'TR' ? "E-TİCARET" : "E-COMMERCE", 
        subtitle: language === 'TR' ? "Satış Botu" : "Sales Bot", 
        icon: ShoppingBag,
        desc: language === 'TR' ? "Sipariş takibi ve ürün önerileri." : "Order tracking and product recommendations."
    },
    { 
        id: 2, 
        title: language === 'TR' ? "KLİNİK" : "CLINIC", 
        subtitle: language === 'TR' ? "Randevu Asistanı" : "Booking Assistant", 
        icon: Stethoscope,
        desc: language === 'TR' ? "7/24 randevu planlama." : "24/7 appointment scheduling."
    },
    { 
        id: 3, 
        title: language === 'TR' ? "EMLAK" : "REAL ESTATE", 
        subtitle: language === 'TR' ? "Portföy Sunumu" : "Portfolio Showcase", 
        icon: Building,
        desc: language === 'TR' ? "Müşteri kriterine uygun evler." : "Homes matching client criteria."
    },
    { 
        id: 4, 
        title: language === 'TR' ? "LOJİSTİK" : "LOGISTICS", 
        subtitle: language === 'TR' ? "Kargo Takibi" : "Cargo Tracking", 
        icon: Truck,
        desc: language === 'TR' ? "Anlık konum ve teslimat bilgisi." : "Instant location and delivery info."
    }
  ];

  // Duplicate for infinite loop
  const MARQUEE_ITEMS = [...SECTORS, ...SECTORS, ...SECTORS];

  return (
    <div className="h-screen bg-[#030303] flex flex-col md:flex-row items-center justify-center gap-12 px-8 py-20 border-t border-white/5 relative z-20">
      
      {/* Left Content */}
      <div className="flex-1 max-w-xl">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          {language === 'TR' ? 'Her Sektör İçin' : 'Perfect Fit For'} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">
            {language === 'TR' ? 'Mükemmel Uyum' : 'Every Industry'}
          </span>
        </h2>
        <p className="text-white/40 text-lg leading-relaxed">
            {language === 'TR' 
                ? 'Botlarımız esnek mimarisi sayesinde her iş modeline entegre olur. "Altın Standart"ta hizmet kalitesi için tasarlanmış modüllerimizi keşfedin.'
                : 'Our bots integrate into any business model thanks to their flexible architecture. Discover modules designed for "Gold Standard" service quality.'}
        </p>
      </div>

      {/* Right Marquee (The Golden Biscuit) */}
      <div className="relative h-[600px] w-full max-w-md overflow-hidden bg-zinc-950/50 rounded-[3rem] border border-white/10 shadow-2xl shadow-black">
        
        {/* Gradient Fade Top/Bottom */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#030303] to-transparent z-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#030303] to-transparent z-20 pointer-events-none"></div>

        <motion.div
            className="flex flex-col gap-6 p-6"
            animate={{
                y: [0, -1000], // Adjust based on height of items
            }}
            transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
            }}
        >
            {MARQUEE_ITEMS.map((item, idx) => (
                <div 
                    key={`${item.id}-${idx}`}
                    className="group relative h-32 w-full shrink-0 rounded-3xl bg-zinc-900/50 border border-white/10 transition-all duration-500 hover:border-amber-500/50 hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)] overflow-hidden cursor-default backdrop-blur-sm"
                >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-amber-500/10 to-transparent z-10" />

                    <div className="relative z-20 h-full flex items-center px-8 gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center group-hover:border-amber-500/30 group-hover:bg-amber-500/10 transition-colors">
                            <item.icon className="w-6 h-6 text-zinc-500 group-hover:text-amber-500 transition-colors" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors tracking-wide">
                                {item.title}
                            </h3>
                            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider group-hover:text-amber-500/70 transition-colors">
                                {item.subtitle}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </motion.div>
      </div>
    </div>
  );
};

export default GoldenMarquee;