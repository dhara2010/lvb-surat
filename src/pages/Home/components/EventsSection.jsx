import React, { useState, useEffect } from 'react';
import { SlideUp } from '../../../components/animations/SlideUp';
import { Calendar, Target } from 'lucide-react';

export default function EventsSection() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="py-24">
      <div className="container-xl">
        <SlideUp>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-16 text-center md:text-left relative inline-block drop-shadow-lg">
            Upcoming <span className='text-teal-500'>Events</span>
          </h2>
        </SlideUp>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((e, i) => (
            <SlideUp delay={i * 0.15} key={i}>
              <div className="bg-white/40 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/20 flex flex-col relative group h-full hover:border-[#14B8A6]/50 transition-colors duration-300">
                {/* Top Image Banner */}
                <div className="h-44 relative overflow-hidden flex-shrink-0">
                  <img src="/events.png" className="w-full h-full object-cover opacity-30 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" alt="event" />
                  <div className="absolute top-5 left-5 font-bold text-white tracking-widest text-[11px] uppercase bg-black/40 px-3 py-1 rounded backdrop-blur-sm border border-white/20">
                    LVB Surat
                  </div>
                </div>
                {/* Content */}
                <div className="flex p-6 relative flex-grow bg-white">
                  <div className="flex flex-col items-center justify-center -mt-14 bg-[#1a3a6b] shadow-2xl rounded-xl w-16 h-16 border border-[#14B8A6]/40 shrink-0 relative z-10 transition-transform group-hover:-translate-y-1 group-hover:bg-[#14B8A6]">
                    <span className="text-xl font-extrabold leading-none mb-0.5 text-white">{e.date}</span>
                    <span className="text-[10px] font-bold uppercase text-teal-200 tracking-wider group-hover:text-white">{e.month}</span>
                  </div>
                  <div className="ml-5 flex flex-col justify-center">
                    <h3 className="font-extrabold text-lg mb-2.5 leading-snug">{e.title}</h3>
                    <div className="flex flex-col gap-1.5 mt-auto">
                      <p className="text-xs font-semibold flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#14b8a6]" /> Every Wednesday
                      </p>
                      <p className="text-xs font-semibold flex items-center gap-2">
                        <Target className="w-3.5 h-3.5 text-[#14b8a6]" /> Surat, Gujarat
                      </p>
                    </div>
                  </div>
                </div>
                {/* Hover line indicator */}
                <div className="w-full h-[3px] bg-[#14b8a6] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </div>
            </SlideUp>
          ))}
        </div>
      </div>
    </div>
  );
}
