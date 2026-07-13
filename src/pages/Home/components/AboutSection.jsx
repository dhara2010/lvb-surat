import React from 'react';
import { ScrollReveal3D } from '../../../components/animations/ScrollReveal3D';
import { TiltCard } from '../../../components/animations/TiltCard';
import { stats1 } from '../../../data';
import { CheckCircle } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden py-32 bg-transparent z-10" id="about">
      <div className="relative max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          <div className="flex flex-col z-10 w-full">
            <ScrollReveal3D delay={0.1}>
              <span className="inline-flex items-center gap-3 font-bold tracking-[0.25em] uppercase text-secondary text-[10px] md:text-xs">
                <div className="w-10 md:w-16 h-[2px] bg-gradient-to-r from-secondary to-transparent"></div>
                About Chapter
              </span>
            </ScrollReveal3D>

            <ScrollReveal3D delay={0.2}>
              <h2 className="mt-5 md:mt-8 text-4xl md:text-5xl lg:text-[4rem] font-semibold leading-[1.1] text-heading tracking-tight">
                Building Powerful
                <br className="max-sm:hidden" />
                Business
                <span className="text-secondary bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"> Connections.</span>
              </h2>
            </ScrollReveal3D>

            <ScrollReveal3D delay={0.3}>
              <p className="mt-6 md:mt-8 text-[17px] md:text-[19px] leading-[1.8] text-body font-medium max-w-xl">
                Our Platinum Chapter brings together visionary entrepreneurs, manufacturers, traders, and professionals under one exclusive ecosystem designed to generate quality referrals and long-term relationships.
              </p>
            </ScrollReveal3D>

            {/* Modern Feature Cards instead of simple line list */}
            <div className="mt-10 md:mt-14 flex flex-col gap-5">
              {[
                { title: "One Business Category Per Member", desc: "Exclusive category rights outperforming ordinary networks." },
                { title: "Verified Referral Management", desc: "Seamless and secure tracking of high-quality business leads." },
                { title: "Premium Business Networking", desc: "Elite gatherings prioritizing substantial business growth." }
              ].map((item, index) => (
                <ScrollReveal3D key={index} delay={0.4 + index * 0.1}>
                  <div className="group relative flex items-center gap-5 md:gap-6 p-4 md:p-5 rounded-[20px] bg-white/40 border border-primary/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_15px_40px_rgb(9,71,95,0.08)] hover:border-primary/20">
                    <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/5 text-primary flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_10px_20px_rgb(9,71,95,0.2)]">
                      <CheckCircle className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-semibold text-md text-heading leading-tight">{item.title}</h4>
                      <p className="text-muted mt-1 text-sm md:text-[15px] font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </ScrollReveal3D>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Floating Glass Statistics */}
          <div className="relative lg:pl-10 h-full w-full">
            {/* Decorative floating blur behind cards */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-tr from-secondary/10 to-primary/10 blur-[80px] rounded-full pointer-events-none mix-blend-multiply"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 min-h-[300px] relative z-10 w-full mt-10 lg:mt-0">
              {stats1.map((item, index) => (
                <ScrollReveal3D key={index} delay={0.3 + index * 0.15} className={`h-full w-full ${index === 0 ? "sm:col-span-2" : ""}`}>
                  <div className="h-full w-full animate-[float_6s_ease-in-out_infinite]" style={{ animationDelay: `${index * 1.5}s` }}>
                    <TiltCard scaleMax={1.03} tiltMax={10} className="h-full w-full block">
                      <div className="h-full w-full rounded-[30px] md:rounded-[36px] bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_10px_40px_rgba(9,71,95,0.06)] p-8 md:p-10 lg:p-12 transition-all duration-700 hover:shadow-[0_20px_60px_rgba(9,71,95,0.12)] hover:bg-white/90 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-[100px] transition-transform duration-700 group-hover:scale-150 group-hover:bg-secondary/10 pointer-events-none"></div>
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-[18px] bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white mb-6 md:mb-10 shadow-lg relative z-10 transition-transform duration-500 group-hover:scale-110">
                          <item.icon className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2} />
                        </div>
                        <div className="relative z-10 flex flex-col justify-end h-full">
                          <h2 className="text-5xl md:text-6xl font-black text-heading tabular-nums tracking-tight">
                            {item.value}
                          </h2>
                          <p className="uppercase tracking-[0.2em] md:tracking-[0.25em] mt-3 md:mt-4 text-xs md:text-sm text-primary font-bold opacity-80 leading-snug break-words">
                            {item.label}
                          </p>
                        </div>

                      </div>
                    </TiltCard>
                  </div>
                </ScrollReveal3D>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
