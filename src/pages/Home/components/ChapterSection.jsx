import React from 'react';
import { ScrollReveal3D } from '../../../components/animations/ScrollReveal3D';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { stats2 } from '../../../data';

import { TiltCard } from '../../../components/animations/TiltCard';

export default function ChapterSection() {
  return (
    <div className="py-16 md:py-20 lg:py-24">
      <div className="container-xl px-4 mx-auto w-full max-w-[100vw] overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 mb-16 md:mb-24">
          <ScrollReveal3D className="flex-1 w-full relative">
            <TiltCard tiltMax={10} scaleMax={1.02}>
              <img loading="lazy" decoding="async" src="/29-1.webp"
                alt="LVB Meeting"
                className="w-full h-[300px] sm:h-[400px] md:h-[500px] aspect-video object-cover rounded-xl shadow-lg border-2 border-white"
              />
            </TiltCard>
          </ScrollReveal3D>
          <ScrollReveal3D delay={0.2} className="flex-1 w-full">
            <h2 className="text-3xl md:text-5xl font-extrabold text-heading mb-4 md:mb-5 leading-tight">LVB Surat Platinum Chapter</h2>
            <div className="w-16 h-[5px] bg-secondary mb-6 md:mb-7 rounded-sm"></div>
            <p className="text-gray-200 mb-6 md:mb-8 leading-relaxed text-sm md:text-base lg:text-lg drop-shadow font-light">Established on 17 October 2020, LVB Surat Platinum Chapter is a premium business networking community under LVB that brings together entrepreneurs, professionals, and business leaders on a trusted platform. The chapter focuses on meaningful connections, quality referrals, and collaborative growth, helping members expand their business through strong relationships and structured networking.</p>
            <p className="text-gray-200 leading-relaxed text-sm md:text-base lg:text-lg drop-shadow font-light mb-8">Over the years, the chapter has built a vibrant ecosystem where members exchange ideas, share opportunities, and support each other's success. Through regular networking meetings, knowledge-sharing sessions, and business collaborations, LVB Surat Platinum empowers its members to strengthen their professional presence, unlock new opportunities, and achieve sustainable business growth while contributing to a stronger business community.</p>
            <Link to="/about" className="btn-primary mt-3 sm:mt-5 text-sm sm:text-base relative overflow-hidden group">
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 block">Learn More</span>
            </Link>
          </ScrollReveal3D>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {stats2.map((s, i) => (
            <ScrollReveal3D delay={i * 0.15} key={i}>
              <TiltCard tiltMax={15} scaleMax={1.05}>
                <div className="border border-primary/10 bg-white shadow-lg text-body rounded-[24px] md:rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center group h-full hover:shadow-xl transition-all duration-300">
                  <s.icon className="w-8 h-8 md:w-10 md:h-10 mb-4 transition-colors duration-300 text-secondary group-hover:text-primary" strokeWidth={1.5} />
                  <div className="text-3xl md:text-4xl font-extrabold mb-1 tracking-tight">{s.value}</div>
                  <div className="text-[10px] md:text-xs opacity-70 group-hover:opacity-100 transition-opacity uppercase tracking-widest font-bold">{s.label}</div>
                </div>
              </TiltCard>
            </ScrollReveal3D>
          ))}
        </div>
      </div>
    </div>
  );
}
