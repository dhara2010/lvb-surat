import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { leaders } from '../../../data';
import { SlideUp } from '../../../components/animations/SlideUp';

export default function LeadershipSection() {
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
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? leaders.length - 1 : prev - 1));
  }, []);

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
      const gap = isMobile ? 150 : 300;
      const overlap = isMobile ? 100 : 150;

      let xOffset = 0;
      if (diff < 0) xOffset = -(gap + (absDiff - 1) * overlap);
      if (diff > 0) xOffset = gap + (absDiff - 1) * overlap;

      const zOffset = isActive ? 0 : -absDiff * 80;
      const rotateY = isActive ? 0 : diff < 0 ? -35 : 35;
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
          <div className={`
            w-[240px] h-[350px] md:w-[320px] md:h-[430px] rounded-[28px] bg-white border border-[#E5E7EB]
            flex flex-col p-6 transition-all duration-300
            ${isActive ? 'group-hover:-translate-y-3 shadow-[0_12px_40px_rgba(0,0,0,0.08)] group-hover:shadow-[0_24px_50px_rgba(0,0,0,0.12)]' : 'shadow-sm grayscale filter'}
          `}>
            <div className="w-full h-[55%] md:h-[60%] rounded-[20px] overflow-hidden mb-5">
              <img
                src={leader.img}
                alt={leader.name}
                className={`w-full h-full object-cover transition-transform duration-500 rounded-[20px] ${isActive ? 'group-hover:scale-105' : ''}`}
                onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${leader.name}&backgroundColor=0B1F3A&textColor=fff`; }}
              />
            </div>
            <div className="flex flex-col items-center text-center mt-auto">
              <h4 className={`text-lg md:text-xl font-bold transition-colors duration-300 ${isActive ? 'text-[#0B1F3A] group-hover:text-[#14B8A6]' : 'text-gray-400'}`}>
                {leader.name}
              </h4>
              <p className="text-gray-500 text-xs md:text-sm mt-1">{leader.role}</p>
              {/* Accent Line */}
              <div className={`h-[3px] bg-[#14B8A6] rounded-full transition-all duration-500 ease-out origin-center mt-5 ${isActive ? 'w-6 group-hover:w-16' : 'w-0'}`}></div>
            </div>
          </div>
        </motion.div>
      );
    });
  };

  return (
    <section className="bg-[#FFFFFF] bg-gradient-to-b from-[#FAFAFA] to-white relative py-24 lg:py-32 overflow-hidden border-t border-gray-100">

      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-blue-50/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-teal-50/40 rounded-full blur-[120px]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl px-6 mb-12 lg:mb-16">
          <SlideUp delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0B1F3A] tracking-tight leading-[1.1] mb-5">
              Meet Our Leadership <span className='text-teal-500'>Team</span>
            </h2>
          </SlideUp>
          <SlideUp delay={0.2}>
            <p className="text-gray-500 text-base md:text-lg font-light leading-relaxed max-w-[80%] mx-auto">
              Professional leaders committed to building a stronger, more connected business community.
            </p>
          </SlideUp>
        </div>

        {/* Cover Flow Carousel */}
        <SlideUp delay={0.3} className="w-full">
          <div
            className="relative w-full h-[450px] md:h-[550px] flex justify-center items-center touch-pan-y select-none"
            style={{ perspective: "1500px" }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onMouseDown={onTouchStart}
            onMouseUp={onTouchEnd}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setTouchStartX(null); setIsHovered(false); }}
            onWheel={handleWheel}
          >
            {renderCards()}
          </div>
        </SlideUp>

        {/* Bottom Navigation */}
        <SlideUp delay={0.4} className="mt-8 md:mt-12 flex items-center justify-center gap-10 md:gap-16 text-[#0B1F3A]">
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
