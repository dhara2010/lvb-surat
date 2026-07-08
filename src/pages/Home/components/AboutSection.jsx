import React from 'react';
import { SlideUp } from '../../../components/animations/SlideUp';
import { stats1 } from '../../../data';
import { CheckCircle } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-white py-32">

      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-teal-100 blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-slate-100 rounded-full blur-[120px] opacity-40"></div>
      <div className="relative max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          <div>
            <span className="inline-flex items-center gap-3 font-semibold tracking-[4px] uppercase text-teal-500">
              <div className="w-14 h-[2px] bg-teal-500"></div>
              About Chapter
            </span>
            <h2 className="mt-8 text-5xl lg:text-6xl font-black leading-tight text-slate-900">
              Building Powerful
              <br />
              Business
              <span className="text-teal-500"> Connections.</span>
            </h2>
            <p className="mt-8 text-lg leading-8 text-gray-600">Our Platinum Chapter brings together visionary entrepreneurs, manufacturers, traders and professionals under one exclusive ecosystem designed to generate quality referrals and long-term business relationships.</p>
            <div className="mt-12 space-y-8">{[
              "One Business Category Per Member",
              "Verified Referral Management",
              "Premium Business Networking"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-5">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center">
                    <CheckCircle size={22} />
                  </div>
                  {index !== 2 && (
                    <div className="absolute left-1/2 top-12 w-[2px] h-12 bg-teal-200"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xl text-slate-800">{item}</h4>
                  <p className="text-gray-500 mt-1">Professional networking focused on genuine business opportunities.</p>
                </div>
              </div>
            ))}
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-8">
              {stats1.map((item, index) => (
                <div key={index} className={`rounded-[35px] backdrop-blur-xl bg-white/80 border border-white shadow-xl p-10 transition duration-500 hover:-translate-y-3 hover:rotate-1 ${index === 0 && "col-span-2"}`}>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white mb-10">
                    <item.icon size={30} />
                  </div>
                  <h2 className="text-5xl font-black text-slate-900">
                    {item.value}
                  </h2>
                  <p className="uppercase tracking-[3px] mt-3 text-gray-500 font-semibold">
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
