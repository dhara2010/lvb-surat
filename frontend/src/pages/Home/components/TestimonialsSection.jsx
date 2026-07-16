import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal3D from '../../../components/animations/ScrollReveal3D';
import { ChevronRight, ChevronLeft, Quote, Star } from 'lucide-react';
import { testimonials } from '../../../data';
import LuxuryCard from '../../../components/ui/LuxuryCard';
import GlassSection from '../../../components/ui/GlassSection';

export default function TestimonialsSection() {
  const [cards, setCards] = useState(testimonials.map((t, i) => ({ ...t, id: i })));
  const [moveDir, setMoveDir] = useState('next');
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const moveNext = useCallback(() => {
    setMoveDir('next');
    setCards((prev) => {
      if (!prev || prev.length <= 1) return prev;
      const newArray = [...prev];
      newArray.push(newArray.shift());
      return newArray;
    });
  }, []);

  const movePrev = useCallback(() => {
    setMoveDir('prev');
    setCards((prev) => {
      if (!prev || prev.length <= 1) return prev;
      const newArray = [...prev];
      newArray.unshift(newArray.pop());
      return newArray;
    });
  }, []);

  // Auto play
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(moveNext, 3000);
    return () => clearInterval(interval);
  }, [isHovered, moveNext]);

  // Touch handlers
  const onTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (!touchStartX) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) moveNext();
    else if (diff < -50) movePrev();
    setTouchStartX(null);
  };

  const getVariants = (dir) => {
    if (isMobile) {
      return {
        "0": { x: 0, y: 0, opacity: 1, scale: 1, zIndex: 10, transition: { duration: 0.3 } },
        "1": { x: 0, y: 0, opacity: 0, scale: 1, zIndex: 9, transition: { duration: 0.3 } },
        "2": { x: 0, y: 0, opacity: 0, scale: 1, zIndex: 8, transition: { duration: 0.3 } },
        "3": { x: 0, y: 0, opacity: 0, scale: 1, zIndex: 7, transition: { duration: 0.3 } }
      };
    }
    return {
      "0": {
        y: dir === 'prev' ? [54, -20, 0] : 0,
        x: dir === 'prev' ? [0, 120, 0] : 0,
        rotate: dir === 'prev' ? [0, 8, 0] : 0,
        scale: dir === 'prev' ? [0.91, 0.95, 1] : 1,
        opacity: 1,
        zIndex: dir === 'prev' ? [7, 10, 10] : 10,
        transition: dir === 'prev'
          ? { duration: 0.6, times: [0, 0.5, 1], ease: "easeInOut" }
          : { type: "spring", stiffness: 300, damping: 30 }
      },
      "1": {
        y: 18, x: 0, scale: 0.97, opacity: 0.85, rotate: 0, zIndex: 9,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      },
      "2": {
        y: 36, x: 0, scale: 0.94, opacity: 0.65, rotate: 0, zIndex: 8,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      },
      "3": {
        y: dir === 'next' ? [0, -30, 54] : 54,
        x: dir === 'next' ? [0, -160, 0] : 0,
        rotate: dir === 'next' ? [0, -10, 0] : 0,
        scale: dir === 'next' ? [1, 0.95, 0.91] : 0.91,
        opacity: dir === 'next' ? [1, 0, 0.45] : 0.45,
        zIndex: dir === 'next' ? [10, 10, 7] : 7,
        transition: dir === 'next'
          ? { duration: 0.6, times: [0, 0.5, 1], ease: "easeInOut" }
          : { type: "spring", stiffness: 300, damping: 30 }
      }
    };
  };

  return (
    <GlassSection>
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-gradient-to-b rounded-full blur-[100px]" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(18,59,93,0.1), transparent)' }} />
      </div>

      <div className="container-xl relative z-10 w-full flex flex-col items-center">

        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-[90%] md:max-w-2xl mx-auto mb-10 md:mb-16">
          <ScrollReveal3D delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-4xl font-extrabold text-white tracking-tight leading-[1.2] lg:leading-[1.1] mb-3 md:mb-5">
              What Our <span style={{ color: '#4FA3D1' }}>Members</span> Say
            </h2>
          </ScrollReveal3D>
          <ScrollReveal3D delay={0.2}>
            <p className="text-sm md:text-lg lg:text-xl font-light leading-relaxed" style={{ color: '#CBD5E1' }}>
              Real experiences from our trusted business community.
            </p>
          </ScrollReveal3D>
        </div>

        {/* Stacked Cards Area */}
        <ScrollReveal3D delay={0.3} className="w-full">
          <div
            className="relative w-full max-w-[700px] mx-auto md:pb-16"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setTouchStartX(null); setIsHovered(false); }}
          >
            {cards.map((card, idx) => {
              const isTop = idx === 0;
              // Safe fallback if more than 4 items are somehow fed, though exactly 4 are guaranteed here
              const variantKey = idx < 4 ? idx.toString() : "3";

              return (
                <motion.div
                  key={card.id}
                  animate={variantKey}
                  variants={getVariants(moveDir)}
                  initial={false}
                  className={`w-full ${isTop ? 'relative z-10' : 'hidden md:block absolute top-0 left-0 h-full'}`}
                >
                  <LuxuryCard className={`w-full h-full p-6 sm:p-8 md:p-10 flex flex-col justify-between group ${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}>
                    
                    {/* Top Row: Stars and Quote */}
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-colors" style={{ color: isTop ? '#4FA3D1' : '#64748B', fill: isTop ? '#4FA3D1' : 'transparent' }} />
                        ))}
                      </div>
                      <Quote className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 transition-colors duration-300" style={{ color: isTop ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)' }} />
                    </div>

                    {/* Testimonial Text */}
                    <p className={`text-sm sm:text-base md:text-lg font-light leading-relaxed italic flex-grow ${isTop ? 'text-white' : 'line-clamp-4 md:line-clamp-none'}`} style={!isTop ? { color: '#64748B' } : {}}>
                      "{card.text}"
                    </p>

                    {/* Member Profile */}
                    <div className="flex items-center gap-3 sm:gap-4 mt-6 md:mt-8">
                      <div className={`relative overflow-hidden w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 transition-transform duration-300 ${isTop ? 'group-hover:scale-110' : ''}`} style={{ borderColor: isTop ? '#FFFFFF' : 'transparent' }}>
                        <img loading="lazy" decoding="async" src={card.img}
                          alt={card.name}
                          className={`w-full h-full object-cover ${isTop ? '' : 'grayscale opacity-70'}`}
                          onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${card.name}&backgroundColor=090E14&textColor=fff`; }}
                        />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base md:text-lg" style={{ color: isTop ? '#FFFFFF' : '#64748B' }}>
                          {card.name}
                        </h4>
                        <p className="text-xs md:text-sm font-semibold" style={{ color: isTop ? '#7DD3FC' : '#94A3B8' }}>
                          {card.role}
                        </p>
                      </div>
                    </div>

                  </LuxuryCard>
                </motion.div>
              );
            })}
          </div>
        </ScrollReveal3D>

        {/* Navigation */}
        <ScrollReveal3D delay={0.4} className="flex items-center justify-center gap-8 mt-12 md:mt-16 w-full max-w-[700px]">
          <button
            onClick={movePrev}
            className="flex items-center gap-2 font-semibold transition-colors md:text-sm text-xs uppercase tracking-wider hover:-translate-x-1"
            style={{ color: '#E8EDF2' }}
          >
            <ChevronLeft className="w-5 h-5" /> Previous
          </button>

          <div className="tabular-nums font-bold tracking-[0.2em] text-sm flex items-center justify-center min-w-[80px]" style={{ color: '#4FA3D1' }}>
            <motion.span
              key={cards[0]?.id || 0}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-block"
            >
              {cards.length > 0 ? String(cards[0].id + 1).padStart(2, '0') : '00'}
            </motion.span>
            <span className="opacity-40 mx-2" style={{ color: '#CBD5E1' }}>/</span>
            <span className="opacity-60" style={{ color: '#CBD5E1' }}>{String(testimonials.length).padStart(2, '0')}</span>
          </div>

          <button
            onClick={moveNext}
            className="flex items-center gap-2 font-semibold transition-colors md:text-sm text-xs uppercase tracking-wider hover:translate-x-1"
            style={{ color: '#E8EDF2' }}
          >
            Next <ChevronRight className="w-5 h-5" />
          </button>
        </ScrollReveal3D>

      </div>
    </GlassSection>
  );
}
