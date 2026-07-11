import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SlideUp } from '../../../components/animations/SlideUp';
import { motion } from 'framer-motion';
import { useFetch } from '../../../hooks/useFetch';
import { getLeaders } from '../../../api/leadersApi';

export default function LeadershipSection() {
  const { data: leadersData, loading, error } = useFetch(getLeaders);
  const leaders = leadersData || [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
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
    }, 2000);
    return () => clearInterval(interval);
  }, [isHovered, handleNext]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
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

  // Mouse Wheel Debounced Handler
  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) < 20) return; // Prevent vertical scroll from triggering
    if (scrollTimeout.current) return;

    if (e.deltaX > 0) handleNext();
    else handlePrev();

    // Throttle scrolling
    scrollTimeout.current = setTimeout(() => { scrollTimeout.current = null; }, 400);
  };

  const renderCards = () => {
    return leaders.map((leader, index) => {
      let diff = index - activeIndex;

      const half = Math.floor(leaders.length / 2);
      if (diff > half) {
        diff -= leaders.length;
      } else if (diff < -half) {
        diff += leaders.length;
      }

      const absDiff = Math.abs(diff);
      const isActive = diff === 0;
      const scale = isActive ? 1 : 1 - absDiff * 0.15;
      const gap = isMobile ? 100 : 450;
      const overlap = isMobile ? 100 : 350;

      let xOffset = 0;
      if (diff < 0) xOffset = -(gap + (absDiff - 1) * overlap);
      if (diff > 0) xOffset = gap + (absDiff - 1) * overlap;

      const zOffset = isActive ? 0 : -absDiff * 80;
      const rotateY = isActive ? 0 : diff < 0 ? -20 : 20;
      const opacity = absDiff > 2 ? 0 : isActive ? 1 : 0.8;

      const zIndex = 50 - absDiff;

      return (
        <motion.div
          key={index}
          onClick={() => setActiveIndex(index)}
          initial={false}
          animate={{
            x: `calc(-50% + ${xOffset}px)`,
            y: "-50%",
            z: zOffset,
            rotateY: rotateY,
            scale: scale,
            opacity: opacity,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transformStyle: "preserve-3d",
            zIndex: zIndex
          }}
          className={`cursor-pointer ${isActive ? 'group' : ''}`}
        >
          <div className={`w-[300px] h-[420px] md:w-[420px] md:h-[560px] lg:w-[450px] lg:h-[600px] rounded-[28px] bg-[#044765]/40 backdrop-blur-md border border-white/20
              flex flex-col p-6 transition-all duration-300
              ${isActive ? 'group-hover:-translate-y-3 shadow-[0_12px_40px_rgba(0,0,0,0.2)] group-hover:shadow-[0_24px_50px_rgba(20,184,166,0.3)]' : 'shadow-sm grayscale filter'}
            `}>
            <div className="w-full h-[65%] md:h-[80%] rounded-[20px] overflow-hidden mb-5">
              <img
                src={leader.img}
                alt={leader.name}
                className={`w-full h-full object-cover transition-transform duration-500 rounded-[20px] ${isActive ? 'group-hover:scale-105' : ''}`}
                onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${leader.name}&backgroundColor=0B1F3A&textColor=fff`; }}
              />
            </div>
            <div className="flex flex-col items-center text-center mt-auto">
              <h4 className={`text-lg md:text-xl font-bold transition-colors duration-300 ${isActive ? 'text-white group-hover:text-[#0EA5A8]' : 'text-[#64748B]'}`}>
                {leader.name}
              </h4>
              <p className="text-gray-300 text-xs md:text-sm mt-1">{leader.role}</p>
              {/* Accent Line */}
              <div className={`h-[3px] bg-[#0EA5A8] rounded-full transition-all duration-500 ease-out origin-center mt-5 ${isActive ? 'w-6 group-hover:w-16' : 'w-0'}`}></div>
            </div>
          </div>
        </motion.div>
      );
    });
  };

  return (
    <section className="relative min-h-screen overflow-hidden ">
      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="flex flex-col items-center text-center max-w-2xl mt-16">
          <SlideUp delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-5">
              Meet Our Leadership <span className='text-[#0EA5A8]'>Team</span>
            </h2>
          </SlideUp>
          <SlideUp delay={0.2}>
            <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed max-w-[80%] mx-auto">
              Professional leaders committed to building a stronger, more connected business community.
            </p>
          </SlideUp>
        </div>
        <SlideUp delay={0.3} className="w-full px-6">
          <div
            className="relative w-full max-w-[2200px] mx-auto h-[550px] md:h-[650px] lg:h-[700px] flex justify-center items-center touch-pan-y select-none"
            style={{ perspective: "1500px" }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onMouseDown={onTouchStart}
            onMouseUp={onTouchEnd}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setTouchStartX(null); setIsHovered(false); }}
            onWheel={handleWheel}
          >
            {loading && <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm tracking-widest font-bold">LOADING LEADERS...</div>}
            {error && <div className="absolute inset-0 flex items-center justify-center text-red-400 text-sm tracking-widest font-bold">FAILED TO LOAD LEADERS</div>}
            {!loading && !error && leaders.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm tracking-widest font-bold">NO LEADERS AVAILABLE</div>}

            {leaders.length > 0 ? renderCards() : null}
          </div>
        </SlideUp>
        <SlideUp delay={0.4} className="mt-8 md:mt-12 flex items-center justify-center gap-10 md:gap-16 text-white">
          <button
            onClick={handlePrev}
            className={`flex items-center gap-2 font-semibold text-xs md:text-sm uppercase tracking-wider transition-opacity opacity-80 hover:opacity-100 hover:-translate-x-1 transition-all`}
            aria-label="Previous Leader"
          >
            <ChevronLeft className="w-5 h-5" /> Previous
          </button>

          <div className="font-bold text-sm tracking-[0.2em] w-24 text-center tabular-nums flex items-center justify-center">
            <motion.span
              key={activeIndex}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="inline-block"
            >
              {String(activeIndex + 1).padStart(2, '0')}
            </motion.span>
            <span className="mx-2">/</span>
            <span className="opacity-50">{String(leaders.length).padStart(2, '0')}</span>
          </div>

          <button
            onClick={handleNext}
            className={`flex items-center gap-2 font-semibold text-xs md:text-sm uppercase tracking-wider transition-opacity opacity-80 hover:opacity-100 hover:translate-x-1 transition-all`}
            aria-label="Next Leader"
          >
            Next <ChevronRight className="w-5 h-5" />
          </button>
        </SlideUp>

      </div>
    </section>
  );
}
