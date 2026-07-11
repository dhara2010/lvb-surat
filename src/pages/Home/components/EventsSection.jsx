import React, { useState, useEffect } from 'react';
import { SlideUp } from '../../../components/animations/SlideUp';
import { Calendar, Target } from 'lucide-react';
import { useFetch } from '../../../hooks/useFetch';
import { getEvents } from '../../../api/eventsApi';
import { Link } from 'react-router-dom';

export default function EventsSection() {
  const { data: eventsData, loading, error } = useFetch(getEvents);
  const events = eventsData ? [...eventsData].reverse().slice(0, 3) : [];

  return (
    <div className="py-16 md:py-20 lg:py-24">
      <div className="container-xl px-4 mx-auto w-full max-w-[100vw] overflow-hidden">
        <SlideUp>
          <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 md:mb-12">
            Upcoming <span className="text-secondary">Events</span>
          </h2>
        </SlideUp>
        <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[300px] md:min-h-[400px]">
          {loading && <div className="col-span-full flex justify-center items-center text-white/50 text-sm md:text-base">Loading Events...</div>}
          {error && <div className="col-span-full flex justify-center items-center text-red-400 text-sm md:text-base">Failed to load events.</div>}
          {!loading && !error && events.length === 0 && <div className="col-span-full flex justify-center items-center text-white/50 text-sm md:text-base">No events available</div>}
          {!loading && !error && events.map((e, i) => (
            <SlideUp delay={i * 0.15} key={i} className="h-full">
              <Link to={`/events/${e.id || i}`} className="block h-full">
                <div className="bg-white/40 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl md:shadow-2xl border border-white/20 flex flex-col relative group h-full hover:border-secondary/50 hover:shadow-[0_12px_40px_rgba(14,165,168,0.15)] transition-all duration-300 cursor-pointer">
                  {/* Top Image Banner */}
                  <div className="h-[200px] sm:h-[240px] md:h-[220px] relative overflow-hidden flex-shrink-0">
                    <img loading="lazy" decoding="async" src="/events.webp" className="w-full h-full object-cover opacity-30 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" alt="event" />
                    <div className="absolute top-4 left-4 md:top-5 md:left-5 font-bold text-white tracking-widest text-[10px] md:text-[11px] uppercase bg-black/40 px-3 py-1 rounded backdrop-blur-sm border border-white/20">
                      LVB Surat
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex flex-col sm:flex-row p-5 md:p-6 relative flex-grow bg-white items-start sm:items-stretch">
                    <div className="flex flex-col items-center justify-center -mt-12 sm:-mt-14 bg-primary-dark shadow-2xl rounded-xl w-14 h-14 sm:w-16 sm:h-16 border border-secondary/40 shrink-0 relative z-10 transition-transform sm:group-hover:-translate-y-1 group-hover:bg-secondary self-start sm:self-auto mb-4 sm:mb-0">
                      <span className="text-lg sm:text-xl font-extrabold leading-none mb-0.5 text-white">{e.date}</span>
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase text-secondary tracking-wider group-hover:text-white line-clamp-1">{e.month}</span>
                    </div>
                    <div className="sm:ml-5 flex flex-col justify-center w-full">
                      <h3 className="font-extrabold text-base md:text-lg mb-2.5 leading-snug line-clamp-2 md:line-clamp-none group-hover:text-secondary transition-colors">{e.title}</h3>
                      <div className="flex flex-col gap-1.5 mt-auto">
                        <p className="text-[11px] md:text-xs font-semibold flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 shrink-0 text-secondary" /> <span className="line-clamp-1 text-body">Every Wednesday</span>
                        </p>
                        <p className="text-[11px] md:text-xs font-semibold flex items-center gap-2">
                          <Target className="w-3.5 h-3.5 shrink-0 text-secondary" /> <span className="line-clamp-1 text-body">Surat, Gujarat</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Hover line indicator */}
                  <div className="w-full h-[3px] bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 mt-auto"></div>
                </div>
              </Link>
            </SlideUp>
          ))}
        </div>
      </div>
    </div>
  );
}
