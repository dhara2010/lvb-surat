import React, { useState, useEffect, useCallback, useRef } from'react';
import { ChevronLeft, ChevronRight} from'lucide-react';
import ScrollReveal3D from'../../../components/animations/ScrollReveal3D';
import TextReveal from'../../../components/animations/TextReveal';
import TypingHeading from'../../../components/animations/TypingHeading';
import { motion } from'framer-motion';
import { useFetch } from'../../../hooks/useFetch';
import { getLeaders } from'../../../api/leadersApi';
import LuxuryCard from'../../../components/ui/LuxuryCard';
import GlassSection from'../../../components/ui/GlassSection';
import { resolveImageUrl } from'../../../utils/imageUrl';


export default function LeadershipSection() {
  const { data: leadersData, loading, error } = useFetch(getLeaders);
  const leaders = leadersData || [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [winWidth, setWinWidth] = useState(window.innerWidth);
  const [touchStartX, setTouchStartX] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const handleResize = () => setWinWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === leaders.length - 1 ? 0 : prev + 1));
  }, [leaders.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? leaders.length - 1 : prev - 1));
  }, [leaders.length]);

  // Auto-scrolling feature
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 3000); // Slower, more premium feel
    return () => clearInterval(interval);
  }, [isHovered, handleNext]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key ==='ArrowLeft') handlePrev();
      if (e.key ==='ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const onTouchStart = (e) => setTouchStartX(e.touches[0].clientX || e.clientX);
  const onTouchEnd = (e) => {
    if (touchStartX === null) return;
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = touchStartX - clientX;
    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
    setTouchStartX(null);
  };

  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) < 20) return;
    if (scrollTimeout.current) return;
    if (e.deltaX > 0) handleNext();
    else handlePrev();
    scrollTimeout.current = setTimeout(() => { scrollTimeout.current = null; }, 400);
  };

  const renderCards = () => {
    return leaders.map((leader, index) => {
      let diff = index - activeIndex;

      const half = Math.floor(leaders.length / 2);
      if (diff > half) diff -= leaders.length;
      else if (diff < -half) diff += leaders.length;

      let cardWidth, cardHeight, gap, overlap;
      if (winWidth <= 480) { cardWidth = 280; cardHeight = 420; gap = 70; overlap = 90; }
      else if (winWidth <= 767) { cardWidth = 320; cardHeight = 480; gap = 100; overlap = 120; }
      else if (winWidth <= 1024) { cardWidth = 360; cardHeight = 520; gap = 180; overlap = 160; }
      else if (winWidth <= 1366) { cardWidth = 400; cardHeight = 580; gap = 280; overlap = 220; }
      else { cardWidth = 460; cardHeight = 640; gap = 380; overlap = 280; }

      const absDiff = Math.abs(diff);
      const isActive = diff === 0;
      const scale = isActive ? 1 : 1 - absDiff * 0.15;

      let xOffset = 0;
      if (diff < 0) xOffset = -(gap + (absDiff - 1) * overlap);
      if (diff > 0) xOffset = gap + (absDiff - 1) * overlap;

      const zOffset = isActive ? 0 : -absDiff * 100;
      const rotateY = isActive ? 0 : diff < 0 ? -25 : 25;
      const opacity = absDiff > 2 ? 0 : isActive ? 1 : 0.6;
      const zIndex = 50 - absDiff;

      return (
        <motion.div
          key={index}
          onClick={() => setActiveIndex(index)}
          initial={false}
          animate={{ x:`calc(-50% + ${xOffset}px)`, y:"-50%", z: zOffset, rotateY: rotateY, scale: scale, opacity: opacity }}
          transition={{ type:"spring", stiffness: 200, damping: 25 }}
          style={{ position:'absolute', top:'50%', left:'50%', transformStyle:"preserve-3d", zIndex: zIndex }}
          className={`cursor-pointer ${isActive ?'group' :''}`}
        >
          <LuxuryCard 
            hoverEffect={false}
            className={`flex flex-col p-4 md:p-5 transition-all duration-700 ${isActive ?'' :'shadow-none grayscale filter pointer-events-none'}`}
            style={{ width:`${cardWidth}px`, height:`${cardHeight}px` }}
          >
            <div className="w-full h-[65%] md:h-[75%] rounded-[24px] overflow-hidden relative">
              <img src={resolveImageUrl(leader.img)}
                alt={leader.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => { e.target.src =`https://api.dicebear.com/7.x/initials/svg?seed=${leader.name}&backgroundColor=09475f&textColor=fff`; }}
              />
            </div>
            
            <div className="flex flex-col items-center justify-center text-center mt-auto flex-grow relative z-20">
              <h4 className="text-card font-bold transition-colors duration-500" style={{ color: isActive ?'#FFFFFF' :'#64748B' }}>
                {leader.name}
              </h4>
              <p className="text-sm font-semibold tracking-widest uppercase mt-2 transition-colors duration-500" style={{ color: isActive ?'#7DD3FC' :'#94A3B8' }}>{leader.role}</p>
            </div>
          </LuxuryCard>
        </motion.div>
      );
    });
  };

  return (
    <GlassSection>
      <div className="relative z-10 w-full flex flex-col items-center">
        
        <div className="flex flex-col items-center text-center max-w-2xl mb-12">
          <ScrollReveal3D>
            <span className="inline-flex items-center gap-3 font-bold tracking-[0.2em] uppercase text-xs mb-4" >
              <div className="w-12 h-[2px]" style={{ backgroundColor:'#4FA3D1' }}></div>
              Executive Board
              <div className="w-12 h-[2px]" style={{ backgroundColor:'#4FA3D1' }}></div>
            </span>
          </ScrollReveal3D>
          <ScrollReveal3D delay={0.1}>
            <TypingHeading el="h2" className="text-section font-extrabold tracking-tight">
              Meet Our Leadership Team
            </TypingHeading>
          </ScrollReveal3D>
          <ScrollReveal3D delay={0.2}>
            <TextReveal delay={0.4} splitBy="word" el="p" className="mt-6 font-light leading-relaxed max-w-[80%] mx-auto">
              Professional leaders committed to building a stronger, more connected and elite business ecosystem.
            </TextReveal>
          </ScrollReveal3D>
        </div>

        <ScrollReveal3D delay={0.3} className="w-full max-w-7xl mx-auto px-6 md:px-10">
          <div
            className="relative w-full max-w-[2200px] mx-auto flex justify-center items-center touch-pan-y select-none"
            style={{ perspective:"1500px", height: winWidth <= 480 ?'480px' : winWidth <= 767 ?'540px' : winWidth <= 1024 ?'620px' :'750px' }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onMouseDown={onTouchStart}
            onMouseUp={onTouchEnd}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setTouchStartX(null); setIsHovered(false); }}
            onWheel={handleWheel}
          >
            {loading && <div className="absolute inset-0 flex items-center justify-center  text-sm tracking-widest font-bold">LOADING LEADERS...</div>}
            {error && <div className="absolute inset-0 flex items-center justify-center  text-sm tracking-widest font-bold">FAILED TO LOAD</div>}
            {!loading && !error && leaders.length === 0 && <div className="absolute inset-0 flex items-center justify-center  text-sm tracking-widest font-bold">NO LEADERS AVAILABLE</div>}

            {leaders.length > 0 ? renderCards() : null}
          </div>
        </ScrollReveal3D>

        <ScrollReveal3D delay={0.4} className="flex items-center justify-center gap-10 md:gap-16">
          <button
            onClick={handlePrev}
            className="flex items-center gap-2 font-black text-xs md:text-sm uppercase tracking-[0.2em] transition-opacity opacity-50 hover:opacity-100 hover:-translate-x-1 transition-all"
            aria-label="Previous Leader"
          >
            <ChevronLeft className="w-5 h-5" /> Prev
          </button>

          <div className="font-extrabold text-sm md:text-base tracking-[0.2em] w-24 text-center tabular-nums flex items-center justify-center" >
            <motion.span
              key={activeIndex}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type:"spring", stiffness: 300, damping: 20 }}
              className="inline-block"
            >
              {String(activeIndex + 1).padStart(2,'0')}
            </motion.span>
            <span className="mx-2" >/</span>
            <span className="opacity-50" >{String((leaders.length || 0)).padStart(2,'0')}</span>
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 font-black text-xs md:text-sm uppercase tracking-[0.2em] transition-opacity opacity-50 hover:opacity-100 hover:translate-x-1 transition-all"
            aria-label="Next Leader"
          >
            Next <ChevronRight className="w-5 h-5" />
          </button>
        </ScrollReveal3D>

      </div>
    </GlassSection>
  );
}
