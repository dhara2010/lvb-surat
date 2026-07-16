import React from 'react';
import { motion } from 'framer-motion';
import ScrollReveal3D from '../../../components/animations/ScrollReveal3D';
import LuxuryCard from '../../../components/ui/LuxuryCard';
import GlassSection from '../../../components/ui/GlassSection';
import { pillars } from '../../../data';

export default function PillarsSection() {
  return (
    <GlassSection>
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 w-full flex-grow">

        {/* Header Section */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 md:mb-20">
          <ScrollReveal3D delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-4xl font-extrabold text-white tracking-tight leading-[1.2] lg:leading-[1.1] mb-4 md:mb-6">
              The Foundation of Our <span style={{ color: '#4FA3D1' }}>Community</span>
            </h2>
          </ScrollReveal3D>
          <ScrollReveal3D delay={0.2}>
            <p className="text-sm md:text-lg lg:text-xl font-light mx-auto max-w-[600px] leading-relaxed drop-shadow px-2" style={{ color: '#CBD5E1' }}>
              Every connection we build is anchored by these five fundamental principles, ensuring our professional network remains exceptional.
            </p>
          </ScrollReveal3D>
        </div>

        {/* Single Row Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 * index, ease: [0.16, 1, 0.3, 1] }}
            >
              <LuxuryCard className="group flex sm:flex-col items-center sm:text-center p-5 md:p-6 h-full gap-4 sm:gap-0 min-h-[220px]">
                {/* Giant Transparent Number */}
                <div className="absolute top-2 right-4 sm:top-4 sm:right-4 font-black text-4xl sm:text-[3.5rem] leading-none text-white/[0.05] select-none transition-transform duration-500 group-hover:scale-105 group-hover:text-white/[0.15]">
                  {index + 1}
                </div>

                {/* Icon Container */}
                <div className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 shrink-0 rounded-full flex items-center justify-center sm:mb-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[8deg]" style={{ background: 'rgba(255,255,255,0.05)', color: '#7DD3FC' }}>
                  <pillar.icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.5] group-hover:text-white transition-colors" />
                </div>

                {/* Text Content */}
                <div className="relative z-10 flex flex-col sm:items-center sm:mt-2 text-left sm:text-center w-full">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 transition-colors duration-300">
                    {pillar.title}
                  </h3>

                  {/* Animated Accent Line */}
                  <div className="w-0 h-[2px] rounded-full mt-2 sm:mt-4 group-hover:w-12 transition-all duration-500 ease-out hidden sm:block group-hover:bg-white" style={{ backgroundColor: '#4FA3D1' }}></div>
                </div>
              </LuxuryCard>
            </motion.div>
          ))}
        </div>

      </div>
    </GlassSection>
  );
}
