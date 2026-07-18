import React from'react';
import ScrollReveal3D from'../../../components/animations/ScrollReveal3D';
import TextReveal from'../../../components/animations/TextReveal';
import TypingHeading from'../../../components/animations/TypingHeading';
import TiltCard from'../../../components/animations/TiltCard';
import LuxuryCard from'../../../components/ui/LuxuryCard';
import { stats1 } from'../../../data';
import { CheckCircle } from'lucide-react';
import { motion } from'framer-motion';
import GlassSection from'../../../components/ui/GlassSection';
import VerticalRiverStraps from'../../../components/effects/VerticalRiverStraps';

export default function AboutSection() {
  return (
    <div className="relative">
      <VerticalRiverStraps className="absolute inset-y-0 w-full h-[150%] opacity-20 pointer-events-none" />
      <GlassSection id="about">
        {/* Soft animated gradient background & lighting */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        
        

        {/* Subtle Blue/White Particles (CSS) */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-secondary/60 animate-[float_4s_ease-in-out_infinite] shadow-[0_0_10px_rgba(18,59,93,0.8)]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-secondary/40 animate-[float_6s_ease-in-out_infinite_1s] shadow-[0_0_15px_rgba(18,59,93,0.6)]"></div>
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-primary/40 animate-[float_5s_ease-in-out_infinite_0.5s]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24 items-center">

          {/* LEFT CONTENT */}
          <div className="flex flex-col z-10 w-full">
            <ScrollReveal3D delay={0.1}>
              <span className="inline-flex items-center gap-4 font-bold tracking-[0.25em] uppercase  text-sm">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: 48 }}
                  transition={{ duration: 1, ease:"easeOut" }}
                  className="h-[2px] bg-secondary"
                ></motion.div>
                About Chapter
              </span>
            </ScrollReveal3D>

            <TypingHeading delay={0.2} el="h2" className="mt-8 font-extrabold leading-[1.1] tracking-tight" style={{ fontSize:"clamp(42px, 5vw, 72px)" }}>
              Building Powerful
              <br className="max-sm:hidden" />
              <span className="bg-clip-text bg-gradient-to-r from-[#4FA3D1] to-[#7DD3FC] text-transparent"> Business Connections</span>.
            </TypingHeading>

            <TextReveal delay={0.5} splitBy="word" el="p" className="mt-8 font-medium max-w-2xl leading-[1.8]" style={{ fontSize:"18px" }}>
              Our Platinum Chapter brings together visionary entrepreneurs, manufacturers, traders, and professionals under one exclusive ecosystem designed to generate quality referrals and long-term relationships.
            </TextReveal>

            {/* Feature Cards - Stacked Layout */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
              {[
                { title:"One Business Category Per Member", desc:"Exclusive category rights outperforming ordinary networks." },
                { title:"Verified Referral Management", desc:"Seamless and secure tracking of high-quality business leads." },
                { title:"Premium Business Networking", desc:"Elite gatherings prioritizing substantial business growth." }
              ].map((item, index) => (
                <ScrollReveal3D key={index} delay={0.4 + index * 0.1}>
                  <LuxuryCard className="h-full p-6">
                    <div className="shrink-0 w-14 h-14 rounded-[16px] flex items-center justify-center transition-all duration-500 group-hover:bg-transparent group-hover:text-primary mb-6" >
                      <CheckCircle className="w-7 h-7" strokeWidth={2.5} />
                    </div>
                    <h4 className="font-bold leading-tight group-hover:text-white transition-colors duration-500" style={{ fontSize:"22px", }}>
                      {item.title}
                    </h4>
                    <p className="mt-3 font-medium leading-relaxed transition-colors duration-500" style={{ fontSize:"16px", }}>
                      {item.desc}
                    </p>
                  </LuxuryCard>
                </ScrollReveal3D>
              ))}
            </div>
          </div>
          <div className="relative h-full w-full lg:pl-12 flex justify-center items-center perspective-[2000px] mt-16 lg:mt-0">
            <ScrollReveal3D delay={0.4} className="w-full flex flex-col gap-6 sm:gap-8 preserve-3d">
              {stats1[0] && (
                <motion.div
                  initial={{ rotateX: 20, rotateY: -10, translateZ: -100, opacity: 0 }}
                  whileInView={{ rotateX: 0, rotateY: 0, translateZ: 50, opacity: 1 }}
                  transition={{ duration: 1, type:"spring", bounce: 0.3 }}
                  style={{ transformStyle:"preserve-3d" }}
                  className="w-full relative"
                >
                  <LuxuryCard className="w-full min-h-[320px] p-10 sm:p-14 flex flex-col justify-between group">
                    <div className="w-20 h-20 rounded-[20px] flex items-center justify-center mb-10 relative z-20 group-hover:bg-transparent group-hover:text-primary transition-all duration-500" >
                      {React.createElement(stats1[0].icon, { className:"w-10 h-10 group-hover:scale-[1.15]", strokeWidth: 2 })}
                    </div>
                    <div className="relative z-10 flex flex-col">
                      <h2 className="font-extrabold tabular-nums tracking-tight leading-none group-hover:drop-shadow-[0_0_20px_rgba(18,59,93,0.6)] transition-all duration-500" style={{ fontSize:"clamp(20px, 2vw, 38px)", }}>
                        {stats1[0].value}
                      </h2>
                      <p className="uppercase tracking-[0.25em] mt-4 font-bold transition-colors duration-500 group-hover:text-white" style={{ fontSize:"14px", }}>
                        {stats1[0].label}
                      </p>
                    </div>
                  </LuxuryCard>
                </motion.div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 w-full preserve-3d">
                {stats1.slice(1, 3).map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ rotateX: 10, rotateY: -15, translateZ: -50, opacity: 0 }}
                    whileInView={{ rotateX: 0, rotateY: 0, translateZ: 20, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 + index * 0.1, type:"spring", bounce: 0.3 }}
                    style={{ transformStyle:"preserve-3d" }}
                    className="w-full relative"
                  >
                    <LuxuryCard className="w-full min-h-[260px] p-8 flex flex-col justify-between group">
                      <div className="w-16 h-16 rounded-[16px] flex items-center justify-center mb-8 relative z-20 group-hover:bg-transparent group-hover:text-primary transition-all duration-500" >
                        <item.icon className="w-8 h-8 group-hover:scale-[1.15]" strokeWidth={2} />
                      </div>

                      <div className="relative z-10 flex flex-col">
                        <h2 className="font-extrabold tabular-nums tracking-tight leading-none group-hover:drop-shadow-[0_0_20px_rgba(18,59,93,0.6)] transition-all duration-500" style={{ fontSize:"clamp(20px, 2vw, 38px)", }}>
                          {item.value}
                        </h2>
                        <p className="uppercase tracking-[0.2em] mt-3 font-bold text-xs group-hover:text-white transition-colors duration-500" >
                          {item.label}
                        </p>
                      </div>
                    </LuxuryCard>
                  </motion.div>
                ))}
              </div>

            </ScrollReveal3D>
          </div>

        </div>
      </div>
    </GlassSection>
  </div>
);
}
