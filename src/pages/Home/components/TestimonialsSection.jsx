import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SlideUp } from '../../../components/animations/SlideUp';
import { ChevronRight, ChevronLeft, Quote, Star } from 'lucide-react';
import { useFetch } from '../../../hooks/useFetch';
import { getTestimonials } from '../../../api/testimonialsApi';

export default function TestimonialsSection() {
  const { data: testimonialsData, loading, error } = useFetch(getTestimonials);
  const [cards, setCards] = useState([]);
  const [moveDir, setMoveDir] = useState('next');
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    if (testimonialsData && testimonialsData.length > 0) {
      setCards(testimonialsData.map((t, i) => ({ ...t, id: i })));
    }
  }, [testimonialsData]);

  const moveNext = useCallback(() => {
    setMoveDir('next');
    setCards((prev) => {
      const newArray = [...prev];
      newArray.push(newArray.shift());
      return newArray;
    });
  }, []);

  const movePrev = useCallback(() => {
    setMoveDir('prev');
    setCards((prev) => {
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

  const getVariants = (dir) => ({
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
  });

  return (
    <div className="relative py-24 lg:py-32 overflow-hidden ">
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#14B8A6]/5 to-transparent rounded-full blur-[100px]" />
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-[#0B1F3A]/5 rounded-full blur-[80px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0B1F3A 1.5px, transparent 1.5px)', backgroundSize: '36px 36px' }} />
      </div>

      <div className="container-xl relative z-10 w-full flex flex-col items-center">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 px-4">
          <SlideUp delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-5 drop-shadow-md">
              What Our <span className="text-[#14B8A6]">Members</span> Say
            </h2>
          </SlideUp>
          <SlideUp delay={0.2}>
            <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed drop-shadow-sm">
              Real experiences from our trusted business community.
            </p>
          </SlideUp>
        </div>

        {/* Stacked Cards Area */}
        <SlideUp delay={0.3} className="w-full">
          <div 
            className="relative w-full max-w-[700px] mx-auto h-[500px] md:h-[460px]"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setTouchStartX(null); setIsHovered(false); }}
          >
            {loading && <div className="absolute inset-0 flex items-center justify-center text-white/50 h-full w-full">Loading testimonials...</div>}
            {error && <div className="absolute inset-0 flex items-center justify-center text-red-400 h-full w-full">Failed to load testimonials.</div>}
            {!loading && !error && cards.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-white/50 h-full w-full">No testimonials available</div>}
            
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
                  className="absolute top-0 left-0 w-full h-full p-4 md:p-0"
                >
                  <div className={`w-full h-full bg-[#0B1F3A]/40 backdrop-blur-xl rounded-[30px] p-8 md:p-10 border border-white/20 flex flex-col justify-between transition-all duration-300 ${isTop ? 'shadow-2xl hover:shadow-[0_20px_50px_rgba(20,184,166,0.25)] hover:bg-[#0B1F3A]/60 hover:border-[#14B8A6]/50 hover:-translate-y-2 group cursor-grab active:cursor-grabbing' : 'shadow-md pointer-events-none'}`}>
                    
                    {/* Top Row: Stars and Quote */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-4 h-4 md:w-5 md:h-5 ${isTop ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} />
                        ))}
                      </div>
                      <Quote className={`w-10 h-10 md:w-12 md:h-12 transition-colors duration-300 ${isTop ? 'text-white/20 group-hover:text-[#14B8A6]/40' : 'text-white/5'}`} />
                    </div>

                    {/* Testimonial Text */}
                    <p className={`text-base md:text-lg font-light leading-relaxed italic flex-grow ${isTop ? 'text-gray-200' : 'text-gray-500 line-clamp-4 md:line-clamp-none'}`}>
                      "{card.text}"
                    </p>

                    {/* Member Profile */}
                    <div className="flex items-center gap-4 mt-8">
                      <div className={`relative overflow-hidden w-12 h-12 md:w-14 md:h-14 rounded-full border-2 transition-transform duration-300 ${isTop ? 'border-white/40 group-hover:border-[#14B8A6] group-hover:scale-110' : 'border-transparent'}`}>
                        <img 
                          src={card.img} 
                          alt={card.name}
                          className={`w-full h-full object-cover ${isTop ? '' : 'grayscale opacity-70'}`}
                          onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${card.name}&backgroundColor=0B1F3A&textColor=fff`; }}
                        />
                      </div>
                      <div>
                        <h4 className={`font-extrabold text-base md:text-lg ${isTop ? 'text-white' : 'text-gray-500'}`}>
                          {card.name}
                        </h4>
                        <p className={`text-xs md:text-sm font-semibold ${isTop ? 'text-[#14B8A6]' : 'text-gray-400'}`}>
                          {card.role}
                        </p>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        </SlideUp>

        {/* Navigation */}
        <SlideUp delay={0.4} className="flex items-center justify-center gap-8 mt-12 md:mt-16 w-full max-w-[700px]">
          <button 
            onClick={movePrev} 
            className="flex items-center gap-2 font-semibold text-gray-300 hover:text-white transition-colors md:text-sm text-xs uppercase tracking-wider hover:-translate-x-1"
          >
            <ChevronLeft className="w-5 h-5"/> Previous
          </button>
          
          <div className="tabular-nums font-bold text-white tracking-[0.2em] text-sm flex items-center justify-center min-w-[80px]">
            <motion.span
              key={cards[0]?.id || 0}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-block"
            >
              {cards.length > 0 ? String(cards[0].id + 1).padStart(2, '0') : '00'}
            </motion.span>
            <span className="opacity-40 mx-2">/</span> 
            <span className="opacity-60">{String(cards.length).padStart(2, '0')}</span>
          </div>

          <button 
            onClick={moveNext} 
            className="flex items-center gap-2 font-semibold text-gray-300 hover:text-white transition-colors md:text-sm text-xs uppercase tracking-wider hover:translate-x-1"
          >
            Next <ChevronRight className="w-5 h-5"/>
          </button>
        </SlideUp>

      </div>
    </div>
  );
}
