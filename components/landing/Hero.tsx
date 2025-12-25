
import React from 'react';
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "../../utils";

interface HeroProps {
  onStart: () => void;
  language: 'TR' | 'EN';
}

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
    title = "",
    cycleDuration = 8,
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
    title?: string;
    cycleDuration?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 150, rotate: rotate - 15 }}
            animate={{ opacity: 1, y: 0, rotate: rotate }}
            transition={{ duration: 2.4, delay, ease: [0.23, 0.86, 0.39, 0.96] }}
            className={cn("absolute cursor-default pointer-events-auto", className)} 
        >
            <motion.div
                animate={{
                    y: [0, -60, 0], 
                    borderColor: ["rgba(255,255,255,0.15)", "rgba(245,158,11,1)", "rgba(255,255,255,0.15)"],
                    backgroundColor: ["rgba(255,255,255,0)", "rgba(245,158,11,0.1)", "rgba(255,255,255,0)"],
                    boxShadow: ["0 0 0px rgba(0,0,0,0)", "0 0 40px rgba(245,158,11,0.6)", "0 0 0px rgba(0,0,0,0)"]
                }}
                transition={{ duration: cycleDuration, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
                style={{ width, height }}
                className={cn("relative flex items-center justify-center rounded-full bg-gradient-to-r to-transparent", gradient, "backdrop-blur-[2px] border-2")}
            >
                <motion.div 
                    animate={{ opacity: [0, 1, 0], scale: [0.8, 1.1, 0.8] }}
                    transition={{ duration: cycleDuration, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <span className="text-white font-bold tracking-[0.2em] text-sm md:text-lg uppercase drop-shadow-[0_0_15px_rgba(255,255,255,1)]">
                        {title}
                    </span>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

const Hero: React.FC<HeroProps> = ({ onStart, language }) => {
    const fadeUpVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 1, delay: 0.5 + i * 0.2, ease: [0.25, 0.4, 0.25, 1] },
        }),
    };

    const content = {
        EN: {
            title1: "Elevate Your",
            title2: "Revenue Flow",
            desc: "Crafting exceptional automated experiences. Let bots handle the grunt work while you focus on scaling your business vision.",
            cta: "Get Started",
            shapes: { ecommerce: "E-Commerce", clinic: "Clinic", logistics: "Logistics", realestate: "Real Estate", corporate: "Corporate" }
        },
        TR: {
            title1: "İşinizi",
            title2: "Otomatize Edin",
            desc: "Sıradışı otomatik deneyimler tasarlayın. Botlar operasyonel işleri hallederken, siz vizyonunuzu büyütmeye odaklanın.",
            cta: "Hemen Başla",
            shapes: { ecommerce: "E-Ticaret", clinic: "Klinik", logistics: "Lojistik", realestate: "Emlak", corporate: "Kurumsal" }
        }
    };

    const txt = content[language];

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
            <div className="absolute inset-0 overflow-hidden">
                <ElegantShape delay={0.3} width={600} height={140} rotate={12} gradient="from-indigo-500/[0.15]" className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]" title={txt.shapes.ecommerce} cycleDuration={10.5} />
                <ElegantShape delay={0.5} width={500} height={120} rotate={-15} gradient="from-rose-500/[0.15]" className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]" title={txt.shapes.clinic} cycleDuration={8.4} />
                <ElegantShape delay={0.4} width={300} height={80} rotate={-8} gradient="from-violet-500/[0.15]" className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]" title={txt.shapes.logistics} cycleDuration={7.4} />
                <ElegantShape delay={0.6} width={200} height={60} rotate={20} gradient="from-amber-500/[0.15]" className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]" title={txt.shapes.realestate} cycleDuration={9.5} />
                <ElegantShape delay={0.7} width={150} height={40} rotate={-25} gradient="from-cyan-500/[0.15]" className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]" title={txt.shapes.corporate} cycleDuration={6.3} />
            </div>
            
            <div className="relative z-10 container mx-auto px-4 md:px-6 pointer-events-none">
                <div className="max-w-3xl mx-auto text-center pointer-events-auto">
                    <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">{txt.title1}</span><br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">{txt.title2}</span>
                        </h1>
                    </motion.div>
                    <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
                        <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">{txt.desc}</p>
                    </motion.div>
                    <motion.div custom={3} variants={fadeUpVariants} initial="hidden" animate="visible">
                         <button onClick={onStart} className="group relative inline-flex items-center gap-2 px-10 py-5 bg-white/5 border border-white/10 text-white rounded-full text-sm font-black uppercase tracking-widest overflow-hidden hover:border-amber-500/50 hover:text-amber-500 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] transition-all duration-300">
                            <span>{txt.cta}</span> <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-amber-500/10 to-transparent skew-x-12 group-hover:animate-shimmer" />
                         </button>
                    </motion.div>
                </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
        </div>
    );
}

export default Hero;
