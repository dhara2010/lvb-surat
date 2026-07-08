import React from 'react';
import { SlideUp } from '../../../components/animations/SlideUp';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { stats2 } from '../../../data';

export default function ChapterSection() {
  return (
    <div className="py-24 ">
      <div className="container-xl">
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <SlideUp className="flex-1 w-full relative">
            <img
              src="/29-1.jpeg"
              alt="LVB Meeting"
              className="w-full h-auto aspect-video object-cover rounded-xl shadow-lg border-2 border-white"
            />
          </SlideUp>
          <SlideUp delay={0.2} className="flex-1 w-full">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight drop-shadow-lg">LVB Surat Platinum Chapter</h2>
            <div className="w-16 h-[5px] bg-[#14B8A6] mb-7 rounded-sm"></div>
            <p className="text-gray-200 mb-8 leading-relaxed text-base md:text-lg drop-shadow font-light">Established on 17 October 2020, LVB Surat Platinum Chapter is a premium business networking community under LVB that brings together entrepreneurs, professionals, and business leaders on a trusted platform. The chapter focuses on meaningful connections, quality referrals, and collaborative growth, helping members expand their business through strong relationships and structured networking.</p>
            <p className="text-gray-200 leading-relaxed text-base md:text-lg drop-shadow font-light mb-8">Over the years, the chapter has built a vibrant ecosystem where members exchange ideas, share opportunities, and support each other's success. Through regular networking meetings, knowledge-sharing sessions, and business collaborations, LVB Surat Platinum empowers its members to strengthen their professional presence, unlock new opportunities, and achieve sustainable business growth while contributing to a stronger business community.</p>
            <Link to="/about" className="mt-3 group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 py-4 font-semibold text-white bg-white/50 backdrop-blur-md border border-white/20 shadow-lg transition-all duration-500 hover:shadow-2xl hover:border-transparent">
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#14b8a6] via-[#0B1F3A] to-[#14b8a6] transition-transform duration-700 group-hover:translate-x-0"></span>
              <span className="relative z-10">Learn More</span>
              <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-all duration-500 group-hover:translate-x-1 group-hover:bg-white group-hover:text-[#0B1F3A]">
                <ArrowRight className="h-4 w-4" strokeWidth={3} />
              </span>
            </Link>
          </SlideUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats2.map((s, i) => (
            <SlideUp delay={i * 0.15} key={i}>
              <div className="border border-white/20 bg-white/10 backdrop-blur-lg text-white rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xl hover:bg-[#14B8A6]/30 hover:border-[#14B8A6] hover:shadow-2xl transition-all duration-300 group">                <s.icon className="w-10 h-10 mb-4 transition-colors duration-300 text-[#14B8A6] group-hover:text-white" strokeWidth={1.5} />
                <div className="text-3xl lg:text-4xl font-extrabold mb-1 tracking-tight">{s.value}</div>
                <div className="text-xs opacity-70 group-hover:opacity-100 transition-opacity uppercase tracking-widest font-bold">{s.label}</div>
              </div>
            </SlideUp>
          ))}
        </div>
      </div>
    </div>
  );
}
