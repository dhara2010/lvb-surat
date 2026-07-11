import React from 'react';
import { SlideUp } from '../../../components/animations/SlideUp';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { stats2 } from '../../../data';

export default function ChapterSection() {
  return (
    <div className="py-16 md:py-20 lg:py-24">
      <div className="container-xl px-4 mx-auto w-full max-w-[100vw] overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 mb-16 md:mb-24">
          <SlideUp className="flex-1 w-full relative">
            <img
              src="/29-1.jpeg"
              alt="LVB Meeting"
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] aspect-video object-cover rounded-xl shadow-lg border-2 border-white"
            />
          </SlideUp>
          <SlideUp delay={0.2} className="flex-1 w-full">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 md:mb-5 leading-tight drop-shadow-lg">LVB Surat Platinum Chapter</h2>
            <div className="w-16 h-[5px] bg-[#0EA5A8] mb-6 md:mb-7 rounded-sm"></div>
            <p className="text-gray-200 mb-6 md:mb-8 leading-relaxed text-sm md:text-base lg:text-lg drop-shadow font-light">Established on 17 October 2020, LVB Surat Platinum Chapter is a premium business networking community under LVB that brings together entrepreneurs, professionals, and business leaders on a trusted platform. The chapter focuses on meaningful connections, quality referrals, and collaborative growth, helping members expand their business through strong relationships and structured networking.</p>
            <p className="text-gray-200 leading-relaxed text-sm md:text-base lg:text-lg drop-shadow font-light mb-8">Over the years, the chapter has built a vibrant ecosystem where members exchange ideas, share opportunities, and support each other's success. Through regular networking meetings, knowledge-sharing sessions, and business collaborations, LVB Surat Platinum empowers its members to strengthen their professional presence, unlock new opportunities, and achieve sustainable business growth while contributing to a stronger business community.</p>
            <Link to="/about" className="btn-primary mt-3 sm:mt-5 text-sm sm:text-base">
              Learn More
            </Link>
          </SlideUp>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {stats2.map((s, i) => (
            <SlideUp delay={i * 0.15} key={i}>
              <div className="border border-white/20 bg-white/10 backdrop-blur-lg text-white rounded-[24px] md:rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-xl hover:bg-[#0EA5A8]/30 hover:border-[#0EA5A8] hover:shadow-2xl transition-all duration-300 group">
                <s.icon className="w-8 h-8 md:w-10 md:h-10 mb-4 transition-colors duration-300 text-[#0EA5A8] group-hover:text-white" strokeWidth={1.5} />
                <div className="text-3xl md:text-4xl font-extrabold mb-1 tracking-tight">{s.value}</div>
                <div className="text-[10px] md:text-xs opacity-70 group-hover:opacity-100 transition-opacity uppercase tracking-widest font-bold">{s.label}</div>
              </div>
            </SlideUp>
          ))}
        </div>
      </div>
    </div>
  );
}
