import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal3D from '../../../components/animations/ScrollReveal3D';
import TextReveal from '../../../components/animations/TextReveal';
import TypingHeading from '../../../components/animations/TypingHeading';
import { ChevronRight, ChevronLeft, Quote, Star } from 'lucide-react';
import { testimonials } from '../../../data';
import LuxuryCard from '../../../components/ui/LuxuryCard';
import GlassSection from '../../../components/ui/GlassSection';
import { resolveImageUrl } from '../../../utils/imageUrl';


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
        "0": { x: 0, y: 0, opacity: 1, scale: 1, zIndex: 10, transition: { duration: 0.3 } }, "1": { x: 0, y: 0, opacity: 0, scale: 1, zIndex: 9, transition: { duration: 0.3 } }, "2": { x: 0, y: 0, opacity: 0, scale: 1, zIndex: 8, transition: { duration: 0.3 } }, "3": { x: 0, y: 0, opacity: 0, scale: 1, zIndex: 7, transition: { duration: 0.3 } }
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
      }, "1": {
        y: 18, x: 0, scale: 0.97, opacity: 0.85, rotate: 0, zIndex: 9,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      }, "2": {
        y: 36, x: 0, scale: 0.94, opacity: 0.65, rotate: 0, zIndex: 8,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      }, "3": {
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
    <section className="relative w-full py-24 bg-[#FAFAFA] border-t border-[#E5E7EB]">      <div className="container-xl relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

      {/* Left Column */}
      <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left w-full">
        <ScrollReveal3D delay={0.1}>
          <span className="inline-block uppercase tracking-[0.2em] text-xs font-bold mb-3 text-[#044765]">
            Testimonials
          </span>
        </ScrollReveal3D>
        <TypingHeading el="h2" className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#090E14] tracking-tight leading-[1.2] lg:leading-[1.1] mb-5">
          What Member's Says?
        </TypingHeading>
        <TextReveal delay={0.2} splitBy="word" el="p" className="text-sm md:text-base lg:text-lg font-light leading-relaxed mb-10 max-w-lg lg:max-w-none mx-auto lg:mx-0">
          Discover what our customers love about us through their real experiences, honest feedback.
        </TextReveal>
        <ScrollReveal3D delay={0.4} className="flex flex-col sm:flex-row items-center gap-6 mt-2">
          {/* Satisfy Client Images */}
          <div className="flex -space-x-4">
            {testimonials.slice(0, 3).map((t, idx) => (
              <div key={idx} className="relative w-12 h-12 md:w-14 md:h-14 rounded-full border-2 overflow-hidden shadow-sm z-10 border-white">
                <img src={t.img} alt={t.name} className="w-full h-full object-cover" loading="lazy" decoding="async"
                  onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${t.name}&backgroundColor=090E14&textColor=fff`; }} />
              </div>
            ))}
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center shadow-sm z-0 bg-primary border-white">
              <span className="font-light text-xl">+</span>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <span className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4  fill-secondary" />)}
              <b className="text-[#090E14] font-bold ml-2 text-lg tabular-nums">4.9</b>
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold">
              4.9 / 5 Ratings
            </span>
          </div>
        </ScrollReveal3D>
      </div>

      {/* Right Column: Stacked Cards Area */}
      <div className="lg:col-span-7 flex flex-col items-center w-full relative mt-12 lg:mt-0">
        <ScrollReveal3D delay={0.3} className="w-full">
          <div
            className="relative w-full max-w-[600px] mx-auto md:pb-16"
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
                  <LuxuryCard
                    hoverVariant="light"
                    className={`w-full h-full p-6 sm:p-8 md:p-10 flex flex-col justify-between group ${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
                    }}
                  >

                    {/* Top Row: Stars and Quote */}
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-colors" style={{ color: isTop ? '#f59e0b' : '#d1d5db', fill: isTop ? '#f59e0b' : 'transparent' }} />
                        ))}
                      </div>
                      <Quote className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 transition-colors duration-300" style={{ color: isTop ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.05)' }} />
                    </div>

                    {/* Testimonial Text */}
                    <p className={`text-sm sm:text-base md:text-lg font-light leading-relaxed italic flex-grow ${isTop ? 'text-[#090E14]' : 'line-clamp-4 md:line-clamp-none text-[#64748B]'}`}>"{card.text}"
                    </p>

                    {/* Member Profile */}
                    <div className="flex items-center gap-3 sm:gap-4 mt-6 md:mt-8">
                      <div className={`relative overflow-hidden w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 transition-transform duration-300 ${isTop ? 'group-hover:scale-110' : ''}`} style={{ borderColor: isTop ? '#4FA3D1' : 'transparent' }}>
                        <img loading="lazy" decoding="async" src={card.img}
                          alt={card.name}
                          className={`w-full h-full object-cover ${isTop ? '' : 'grayscale opacity-70'}`}
                          onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${card.name}&backgroundColor=ffffff&textColor=000`; }}
                        />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base md:text-lg" style={{ color: isTop ? '#090E14' : '#64748B' }}>
                          {card.name}
                        </h4>
                        <p className="text-xs md:text-sm font-semibold" style={{ color: isTop ? '#4FA3D1' : '#94A3B8' }}>
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
        <ScrollReveal3D delay={0.4} className="flex items-center justify-center gap-8 mt-12 md:mt-16 w-full max-w-[600px]">
          <button
            onClick={movePrev}
            className="flex items-center gap-2 font-semibold transition-colors md:text-sm text-xs uppercase tracking-wider hover:-translate-x-1"

          >
            <ChevronLeft className="w-5 h-5" /> Previous
          </button>

          <div className="tabular-nums font-bold tracking-[0.2em] text-sm flex items-center justify-center min-w-[80px]" >
            <motion.span
              key={cards[0]?.id || 0}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-block"
            >
              {cards.length > 0 ? String(cards[0].id + 1).padStart(2, '0') : '00'}
            </motion.span>
            <span className="opacity-40 mx-2" >/</span>
            <span className="opacity-60" >{String(testimonials.length).padStart(2, '0')}</span>
          </div>

          <button
            onClick={moveNext}
            className="flex items-center gap-2 font-semibold transition-colors md:text-sm text-xs uppercase tracking-wider hover:translate-x-1 text-primary-text"
          >
            Next <ChevronRight className="w-5 h-5" />
          </button>
        </ScrollReveal3D>
      </div>
    </div>
    </section>
  );
}
