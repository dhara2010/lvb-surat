import React from 'react';
import { motion } from 'framer-motion';
import { SlideUp } from '../../../components/animations/SlideUp';
import { pillars } from '../../../data';



export default function PillarsSection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full flex-grow">

        {/* Header Section */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
          <SlideUp delay={0.1}>
            <h2 className="text-4xl md:text-5xl lg:text-[3.2rem] font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
              The Foundation of Our <span className="text-teal-500">Community </span>
            </h2>
          </SlideUp>
          <SlideUp delay={0.2}>
            <p className="text-gray-300 text-lg md:text-xl font-light mx-auto max-w-[600px] leading-relaxed drop-shadow">
              Every connection we build is anchored by these five fundamental principles, ensuring our professional network remains exceptional.
            </p>
          </SlideUp>
        </div>

        {/* Single Row Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 * index, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col items-center text-center bg-white/30 backdrop-blur-xl rounded-[24px] p-6 border border-white/10 shadow-2xl hover:shadow-[0_20px_50px_rgba(20,184,166,0.3)] hover:-translate-y-2 hover:border-[#14B8A6]/60 hover:bg-[#0B1F3A]/60 transition-all duration-300 relative overflow-hidden h-full"
            >
              {/* Giant Transparent Number */}
              <div className="absolute top-4 right-4 font-black text-[3.5rem] leading-none text-black/[0.15] select-none transition-transform duration-500 group-hover:scale-105 group-hover:text-[#14B8A6]/[0.15]">
                {index + 1}
              </div>

              {/* Icon Container */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-[#14B8A6]/10 to-[#0F766E]/5 flex items-center justify-center text-[#14B8A6] mb-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[8deg] group-hover:shadow-[0_0_24px_rgba(20,184,166,0.25)]">
                <pillar.icon className="w-7 h-7 stroke-[1.5]" />
              </div>

              {/* Text Content */}
              <div className="relative z-10 flex flex-col items-center mt-2">
                <h3 className="text-xl font-bold text-white mb-2 transition-colors duration-300 group-hover:text-[#14B8A6]">
                  {pillar.title}
                </h3>

                {/* Animated Accent Line */}
                <div className="w-0 h-[2px] rounded-full bg-[#14B8A6] mt-4 group-hover:w-12 transition-all duration-500 ease-out"></div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
