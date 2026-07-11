import React from 'react';
import { SlideUp } from '../../../components/animations/SlideUp';
import { stats1 } from '../../../data';
import { CheckCircle } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="relative max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center">
          <div>
            <span className="inline-flex items-center gap-3 font-semibold tracking-[2px] md:tracking-[4px] uppercase text-[#0EA5A8] text-xs md:text-sm">
              <div className="w-8 md:w-14 h-[2px] bg-[#0EA5A8]"></div>
              About Chapter
            </span>
            <h2 className="mt-4 md:mt-8 text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.2] lg:leading-tight text-white drop-shadow-md">
              Building Powerful
              <br className="max-sm:hidden" />
              Business
              <span className="text-[#0EA5A8]"> Connections.</span>
            </h2>
            <p className="mt-6 md:mt-8 text-base md:text-lg leading-7 md:leading-8 text-gray-200 font-light drop-shadow">Our Platinum Chapter brings together visionary entrepreneurs, manufacturers, traders and professionals under one exclusive ecosystem designed to generate quality referrals and long-term business relationships.</p>
            <div className="mt-8 md:mt-12 space-y-6 md:space-y-8">{[
              "One Business Category Per Member",
              "Verified Referral Management",
              "Premium Business Networking"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4 md:gap-5">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0EA5A8] text-white flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  {index !== 2 && (
                    <div className="absolute left-1/2 top-10 md:top-12 w-[2px] h-10 md:h-12 bg-[#0EA5A8] -translate-x-1/2"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-lg md:text-xl text-white drop-shadow-sm leading-tight md:leading-normal">{item}</h4>
                  <p className="text-gray-300 mt-1 text-sm md:text-base">Professional networking focused on genuine business opportunities.</p>
                </div>
              </div>
            ))}
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 min-h-[300px]">
              {stats1.map((item, index) => (
                <div key={index} className={`rounded-[24px] md:rounded-[35px] backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl md:shadow-2xl p-6 md:p-8 lg:p-10 transition duration-500 hover:-translate-y-2 lg:hover:-translate-y-3 hover:bg-white/20 hover:border-white/30 ${index === 0 ? "sm:col-span-2" : ""}`}>
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white mb-6 md:mb-10 block">
                    <item.icon className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-md">
                    {item.value}
                  </h2>
                  <p className="uppercase tracking-[2px] md:tracking-[3px] mt-2 md:mt-3 text-xs md:text-sm text-gray-300 font-semibold line-clamp-1">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
