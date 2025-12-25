
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag, Activity, Building2, TrendingUp, MessageCircle, BarChart3 } from 'lucide-react';
import { cn } from '../../utils';

interface IndustryShowcaseProps {
    language: 'TR' | 'EN';
    onAction?: () => void;
}

const IndustryShowcase: React.FC<IndustryShowcaseProps> = ({ language, onAction }) => {
    
    const content = {
        EN: {
            headline: "Perfect Fit For",
            headlineHighlight: "Every Industry",
            sub: "Our AI agents adapt to your specific business needs, automating the complex workflows unique to your sector.",
            cta: "Try Now"
        },
        TR: {
            headline: "Her Sektör İçin",
            headlineHighlight: "Mükemmel Uyum",
            sub: "Yapay zeka ajanlarımız, sektörünüze özgü karmaşık iş akışlarını otomatikleştirerek özel iş ihtiyaçlarınıza uyum sağlar.",
            cta: "Hemen Dene"
        }
    };

    const industries = [
        {
            id: 'ecommerce',
            label: language === 'TR' ? 'E-Ticaret' : 'E-Commerce',
            description: language === 'TR' 
                ? 'Terk edilmiş sepetleri kurtarın, sipariş durumlarını otomatik bildirin ve satış sonrası desteği 7/24 sağlayın.' 
                : 'Automate abandoned cart recovery, order status notifications, and provide 24/7 post-purchase support.',
            icon: ShoppingBag,
            secondaryIcon: TrendingUp,
            color: 'text-amber-500',
            bgGradient: 'from-amber-500/20 to-orange-600/20',
            glowColor: 'shadow-amber-500/50',
            borderColor: 'border-amber-500/30'
        },
        {
            id: 'clinic',
            label: language === 'TR' ? 'Klinik & Sağlık' : 'Clinic & Health',
            description: language === 'TR' 
                ? 'Randevu hatırlatmaları, hasta takibi ve tedavi sonrası bakım talimatlarını otomatikleştirin.' 
                : 'Streamline appointment reminders, patient follow-ups, and automate post-treatment care instructions.',
            icon: Activity,
            secondaryIcon: MessageCircle,
            color: 'text-cyan-500',
            bgGradient: 'from-cyan-400/20 to-blue-600/20',
            glowColor: 'shadow-cyan-500/50',
            borderColor: 'border-cyan-500/30'
        },
        {
            id: 'realestate',
            label: language === 'TR' ? 'Emlak & Konut' : 'Real Estate',
            description: language === 'TR' 
                ? 'Potansiyel müşterilere anında portföy sunumu yapın ve randevu takvimini yönetin.' 
                : 'Instantly present portfolios to new leads, qualify prospects, and manage viewing schedules automatically.',
            icon: Building2,
            secondaryIcon: BarChart3,
            color: 'text-emerald-500',
            bgGradient: 'from-emerald-400/20 to-green-600/20',
            glowColor: 'shadow-emerald-500/50',
            borderColor: 'border-emerald-500/30'
        }
    ];

    const [activeTab, setActiveTab] = useState(industries[0]);

    return (
        <section className="bg-[#030303] py-24 px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-12 relative z-10">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                {content[language].headline} <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                                    {content[language].headlineHighlight}
                                </span>
                            </h2>
                            <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
                                {content[language].sub}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {industries.map((item) => {
                                const isActive = activeTab.id === item.id;
                                return (
                                    <div key={item.id} className="relative">
                                        <button
                                            onClick={() => setActiveTab(item)}
                                            className={cn(
                                                "w-full text-left p-6 rounded-2xl transition-all duration-300 border group relative overflow-hidden",
                                                isActive 
                                                    ? `bg-zinc-900/80 ${item.borderColor} shadow-[0_0_30px_-10px_rgba(0,0,0,0.5)]` 
                                                    : "bg-transparent border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/30"
                                            )}
                                        >
                                            <div className="flex items-center justify-between relative z-10">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "p-3 rounded-xl transition-all duration-300",
                                                        isActive ? `${item.color} bg-white/5 shadow-[0_0_15px_-3px_currentColor]` : "bg-zinc-900 text-zinc-500 group-hover:text-zinc-300"
                                                    )}>
                                                        <item.icon className="w-6 h-6" />
                                                    </div>
                                                    <span className={cn(
                                                        "text-xl font-semibold transition-colors duration-300",
                                                        isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                                                    )}>
                                                        {item.label}
                                                    </span>
                                                </div>
                                                {isActive && (
                                                    <motion.div layoutId="activeArrow" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                                                        <ArrowRight className={cn("w-5 h-5", item.color)} />
                                                    </motion.div>
                                                )}
                                            </div>

                                            <AnimatePresence>
                                                {isActive && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <p className="pt-4 pl-[4.5rem] text-zinc-400 leading-relaxed text-sm md:text-base">
                                                            {item.description}
                                                        </p>
                                                        <div className="pt-4 pl-[4.5rem]">
                                                          <button 
                                                            onClick={(e) => { e.stopPropagation(); onAction?.(); }}
                                                            className={cn("px-4 py-2 rounded-lg text-xs font-bold border transition-all", item.borderColor, item.color, "hover:bg-white hover:text-black")}
                                                          >
                                                            {content[language].cta}
                                                          </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="relative h-[600px] w-full flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={activeTab.id + "-bg"}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 0.5, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.2 }}
                                className={cn("absolute inset-0 w-full h-full blur-[120px] opacity-30 rounded-full bg-gradient-to-tr", activeTab.bgGradient)}
                            />
                        </AnimatePresence>
                        <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab.id + "-scene"}
                                    initial={{ opacity: 0, rotateY: -20, scale: 0.9 }}
                                    animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotateY: 20, scale: 0.9 }}
                                    className="relative w-full h-full"
                                >
                                    <div className={cn(
                                        "absolute inset-0 m-auto w-64 h-64 md:w-80 md:h-80 rounded-[3rem]",
                                        "bg-gradient-to-br from-white/[0.08] to-white/[0.01]",
                                        "border border-white/10 backdrop-blur-2xl",
                                        "shadow-2xl flex flex-col items-center justify-center gap-6 z-20",
                                        activeTab.glowColor
                                    )}>
                                        <div className={cn("p-8 rounded-full bg-black/20 border border-white/5 shadow-[0_0_50px_-10px_currentColor]", activeTab.color)}>
                                            <activeTab.icon className="w-20 h-20 md:w-24 md:h-24 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IndustryShowcase;
