import React from'react';
import ScrollReveal3D from'../../../components/animations/ScrollReveal3D';
import TextReveal from'../../../components/animations/TextReveal';
import TypingHeading from'../../../components/animations/TypingHeading';
import { Target, Clock, ArrowRight } from'lucide-react';
import { useFetch } from'../../../hooks/useFetch';
import { getEvents } from'../../../api/eventsApi';
import { Link } from'react-router-dom';
import TiltCard from'../../../components/animations/TiltCard';
import LuxuryCard from'../../../components/ui/LuxuryCard';
import GlassSection from'../../../components/ui/GlassSection';
import VerticalRiverStraps from'../../../components/effects/VerticalRiverStraps';

export default function EventsSection() {
  const { data: eventsData, loading, error } = useFetch(getEvents);
  const events = eventsData ? [...eventsData].reverse().slice(0, 3) : [];

  return (
    <GlassSection>
      
      {/* Decorative premium river timeline line matching alternating cards */}
      <VerticalRiverStraps className="absolute left-[20px] md:left-1/2 top-40 bottom-20 w-[200px] hidden lg:block -translate-x-1/2 opacity-60 pointer-events-none" />
      
      <div className="container-xl mx-auto w-full max-w-[100vw] overflow-hidden relative z-10">
        <ScrollReveal3D>
          <div className="flex flex-col items-center justify-center text-center mb-16 md:mb-24">
            <span className="inline-flex items-center gap-3 font-bold tracking-[0.2em] uppercase text-xs mb-4" >
              <div className="w-12 h-[2px]" style={{ backgroundColor:'#4FA3D1' }}></div>
              Schedule
              <div className="w-12 h-[2px]" style={{ backgroundColor:'#4FA3D1' }}></div>
            </span>
            <TypingHeading el="h2" className="text-section font-bold">
              Upcoming <span className="bg-clip-text bg-gradient-to-r from-[#4FA3D1] to-[#7DD3FC] text-transparent">Events</span>
            </TypingHeading>
          </div>
        </ScrollReveal3D>

        <div className="flex flex-col gap-12 lg:gap-24 relative min-h-[300px] md:min-h-[400px]">
          {loading && <div className="flex justify-center items-center  text-sm font-bold tracking-widest">LOADING EVENTS...</div>}
          {error && <div className="flex justify-center items-center  text-sm font-bold tracking-widest">FAILED TO LOAD EVENTS</div>}
          {!loading && !error && events.length === 0 && <div className="flex justify-center items-center  text-sm font-bold tracking-widest">NO UPCOMING EVENTS</div>}
          
          {!loading && !error && events.map((e, i) => {
            const isEven = i % 2 === 0;
            return (
              <ScrollReveal3D delay={i * 0.15} key={i}>
                <div className={`relative flex flex-col lg:flex-row items-center gap-8 ${isEven ?'lg:flex-row' :'lg:flex-row-reverse'}`}>
                  
                  {/* Timeline Center Node */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-[4px] items-center justify-center z-20" style={{ background:'rgba(255,255,255,0.05)', borderColor:'rgba(255,255,255,0.15)' }}>
                    <div className="w-4 h-4 rounded-full animate-pulse" style={{ backgroundColor:'#7DD3FC' }} />
                  </div>

                  <div className="w-full lg:w-1/2 flex justify-center">
                    <Link to={`/events/${e.id || i}`} className="block w-full max-w-[600px] mx-auto">
                      <LuxuryCard className="h-full group p-6 sm:p-8">
                        
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex flex-col items-center justify-center rounded-[16px] w-16 h-16 shadow-lg shrink-0 transition-all duration-500 group-hover:bg-transparent" style={{ backgroundColor:'#090E14' }}>
                            <span className="text-xl font-black leading-none transition-colors group-hover:text-primary" >{e.date ||'17'}</span>
                            <span className="text-[10px] font-bold uppercase  mt-1 tracking-widest transition-colors" >{e.month ||'OCT'}</span>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase transition-colors group-hover:border-white/30 group-hover:text-gray-400" style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(125,211,252,0.3)' }}>
                            Networking
                          </span>
                        </div>

                        <h3 className="font-bold  mb-4 text-[22px] transition-colors duration-500">{e.title}</h3>
                        
                        <div className="flex flex-wrap gap-4 text-sm font-medium transition-colors duration-500 group-hover:text-gray-400 " >
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 transition-colors group-hover:text-gray-400"  /> Wednesday 7:30 AM
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 transition-colors group-hover:text-gray-400"  /> Surat, Gujarat
                          </div>
                        </div>

                        <div className="mt-8 flex items-center gap-2 font-bold uppercase tracking-widest transition-colors duration-500 text-sm group-hover:text-gray-400" >
                          View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </LuxuryCard>
                    </Link>
                  </div>
                  
                  {/* Empty Spacer for alternating layout */}
                  <div className="hidden lg:block w-1/2"></div>
                </div>
              </ScrollReveal3D>
            );
          })}
        </div>
      </div>
    </GlassSection>
  );
}
