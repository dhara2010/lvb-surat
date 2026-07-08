import React from 'react';
import { motion } from 'framer-motion';
import { SlideUp } from '../../../components/animations/SlideUp';
import { pillars } from '../../../data';

// Helper for the asymmetrical bento grid sizing
const getCardSizeClass = (index) => {
  switch (index) {
    case 0: return "lg:col-span-7"; // Integrity - Wider
    case 1: return "lg:col-span-5"; // People Development - Narrower
    case 2: return "lg:col-span-5"; // Trust - Narrower
    case 3: return "lg:col-span-7"; // Generosity - Wider
    case 4: return "lg:col-span-8 lg:col-start-3"; // Loyalty - Centered and slightly wider
    default: return "lg:col-span-6";
  }
};

export default function PillarsSection() {
  return (
    <section className="bg-[#FFFFFF] bg-gradient-to-b from-white to-gray-50/50 py-24 lg:py-32 relative overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full flex-grow">

        {/* Header Section */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
          <SlideUp delay={0.1}>
            <h2 className="text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-[#0A1120] tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
              The Foundation of Our <span className="text-teal-500">Community </span>
            </h2>
          </SlideUp>
          <SlideUp delay={0.2}>
            <p className="text-gray-500 text-lg md:text-xl font-light mx-auto max-w-[600px] leading-relaxed">
              Every connection we build is anchored by these five fundamental principles, ensuring our professional network remains exceptional.
            </p>
          </SlideUp>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 auto-rows-fr gap-6 lg:gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 * index, ease: [0.16, 1, 0.3, 1] }}
              className={`group flex flex-col bg-white rounded-[28px] p-8 md:p-[32px] border border-[#E5E7EB] shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:border-[#14B8A6]/40 transition-all duration-300 relative overflow-hidden md:col-span-1 col-span-1 ${getCardSizeClass(index)}`}
            >
              {/* Giant Transparent Number */}
              <div className="absolute top-6 right-8 font-black text-[5rem] lg:text-[7rem] leading-none text-[#0A1120]/[0.03] select-none transition-transform duration-500 group-hover:scale-105 group-hover:text-[#14B8A6]/[0.05]">
                0{index + 1}
              </div>

              {/* Icon Container */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-[#14B8A6]/10 to-[#0F766E]/5 flex items-center justify-center text-[#14B8A6] mb-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[8deg] group-hover:shadow-[0_0_24px_rgba(20,184,166,0.25)]">
                <pillar.icon className="w-7 h-7 stroke-[1.5]" />
              </div>

              {/* Text Content */}
              <div className="relative z-10 mt-auto flex flex-col items-start">
                <h3 className="text-2xl font-bold text-[#0A1120] mb-3 transition-colors duration-300">
                  {pillar.title}
                </h3>
                <p className="text-gray-500 text-[15px] md:text-base leading-relaxed pr-4 md:pr-10 lg:pr-16 max-w-full lg:max-w-[500px]">
                  {pillar.desc}
                </p>

                {/* Animated Accent Line */}
                <div className="w-0 h-[2px] rounded-full bg-[#14B8A6] mt-8 group-hover:w-16 transition-all duration-500 ease-out origin-left"></div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
