import React from 'react';
import ScrollReveal3D from '../../../components/animations/ScrollReveal3D';
import TextReveal from '../../../components/animations/TextReveal';
import TypingHeading from '../../../components/animations/TypingHeading';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { stats2 } from '../../../data';
import TiltCard from '../../../components/animations/TiltCard';
import LuxuryCard from '../../../components/ui/LuxuryCard';
import GlassSection from '../../../components/ui/GlassSection';
import FlowingStraps from '../../../components/effects/FlowingStraps';
import FoldingImage from '../../../components/effects/FoldingImage';

export default function ChapterSection() {
  return (
    <div className="relative">
      <FlowingStraps className="absolute inset-y-1/3 h-1/3 opacity-40 z-0 pointer-events-none" />
      <GlassSection>
        <div className="container-xl mx-auto relative z-10 w-full flex-grow">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-20">
            <ScrollReveal3D className="flex-1 w-full relative">
              <TiltCard tiltMax={8} scaleMax={1.03}>
                <div className="relative rounded-[32px] overflow-hidden transition-all duration-500">
                  <FoldingImage src="/29-1.webp" alt="LVB Meeting" className="w-full h-[400px] md:h-[500px] rounded-[24px] overflow-hidden" />
                  <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
                    <MapPin className="w-5 h-5" />
                    <span className="text-sm font-semibold tracking-wider uppercase">Surat, Gujarat</span>
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal3D>

            <ScrollReveal3D delay={0.2} className="flex-1 w-full">
              <span className="inline-flex items-center gap-3 font-bold tracking-[0.2em] uppercase text-xs mb-4" >
                <div className="w-8 h-[2px]" style={{ backgroundColor: '#4FA3D1' }}></div>
                Chapter Network
              </span>
              <TypingHeading el="h2" className="text-section font-bold mb-6 leading-[1.1] tracking-tight">
                LVB Surat <br />Platinum Chapter
              </TypingHeading>
              <div className="space-y-6 font-sans font-light opacity-90 leading-relaxed">
                <TextReveal delay={0.2} splitBy="word" el="p">Established on 17 October 2020, LVB Surat Platinum Chapter is a premium business networking community under LVB that brings together entrepreneurs, professionals, and business leaders on a trusted platform. The chapter focuses on meaningful connections, quality referrals, and collaborative growth, helping members expand their business through strong relationships and structured networking.</TextReveal>
                <TextReveal delay={0.4} splitBy="word" el="p">Over the years, the chapter has built a vibrant ecosystem where members exchange ideas, share opportunities, and support each other's success. Through regular networking meetings, knowledge-sharing sessions, and business collaborations, LVB Surat Platinum empowers its members to strengthen their professional presence, unlock new opportunities, and achieve sustainable business growth while contributing to a stronger business community.</TextReveal>
              </div>

              <Link to="/about">
                <div className="inline-flex items-center justify-center rounded-[12px] font-bold text-[13px] md:text-sm uppercase tracking-widest transition-all duration-300 text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] shadow-sm hover:shadow-md hover:scale-105 xl:py-3.5 xl:px-10 py-3 px-8">
                 Explore More
                </div>
              </Link>
            </ScrollReveal3D>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {stats2.map((s, i) => (
              <ScrollReveal3D delay={i * 0.15} key={i}>
                <TiltCard tiltMax={10}>
                  <LuxuryCard className="p-8 flex flex-col items-center justify-center text-center group h-full">
                    <s.icon className="w-10 h-10 mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:text-gray-400" strokeWidth={1.5} />
                    <div className="text-section  font-display font-black mb-2 tracking-tight">{s.value}</div>
                    <div className="text-xs uppercase tracking-[0.2em] font-bold transition-colors group-hover:text-gray-400" >{s.label}</div>
                  </LuxuryCard>
                </TiltCard>
              </ScrollReveal3D>
            ))}
          </div>
        </div>
      </GlassSection>
    </div>
  );
}
