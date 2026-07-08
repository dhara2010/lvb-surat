import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SlideUp } from '../../../components/animations/SlideUp';
import { ChevronRight, ChevronLeft, Quote, Star } from 'lucide-react';
import { testimonials } from '../../../data';

export default function TestimonialsSection() {
  const [cards, setCards] = useState(testimonials.map((t, i) => ({ ...t, id: i })));
  const [moveDir, setMoveDir] = useState('next');
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

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
    <div className="bg-[#FAFAFA] relative py-24 lg:py-32 overflow-hidden border-y border-gray-100">
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
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0B1F3A] tracking-tight leading-[1.1] mb-5">
              What Our <span className="text-[#14B8A6]">Members</span> Say
            </h2>
          </SlideUp>
          <SlideUp delay={0.2}>
            <p className="text-gray-500 text-lg md:text-xl leading-relaxed">
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
                  <div className={`w-full h-full bg-white rounded-[30px] p-8 md:p-10 border border-gray-100 flex flex-col justify-between transition-all duration-300 ${isTop ? 'shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.12)] hover:-translate-y-2 group cursor-grab active:cursor-grabbing' : 'shadow-sm pointer-events-none'}`}>
                    
                    {/* Top Row: Stars and Quote */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-4 h-4 md:w-5 md:h-5 ${isTop ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} />
                        ))}
                      </div>
                      <Quote className={`w-10 h-10 md:w-12 md:h-12 transition-colors duration-300 ${isTop ? 'text-gray-100 group-hover:text-[#14B8A6]/20' : 'text-gray-50'}`} />
                    </div>

                    {/* Testimonial Text */}
                    <p className={`text-base md:text-lg font-medium leading-relaxed italic flex-grow ${isTop ? 'text-gray-600' : 'text-gray-400 line-clamp-4 md:line-clamp-none'}`}>
                      "{card.text}"
                    </p>

                    {/* Member Profile */}
                    <div className="flex items-center gap-4 mt-8">
                      <div className={`relative overflow-hidden w-12 h-12 md:w-14 md:h-14 rounded-full border-2 transition-transform duration-300 ${isTop ? 'border-gray-100 group-hover:scale-110' : 'border-gray-50'}`}>
                        <img 
                          src={card.img} 
                          alt={card.name}
                          className={`w-full h-full object-cover ${isTop ? '' : 'grayscale opacity-70'}`}
                          onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${card.name}&backgroundColor=0B1F3A&textColor=fff`; }}
                        />
                      </div>
                      <div>
                        <h4 className={`font-extrabold text-base md:text-lg ${isTop ? 'text-[#0B1F3A]' : 'text-gray-400'}`}>
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
            className="flex items-center gap-2 font-semibold text-gray-400 hover:text-[#0B1F3A] transition-colors md:text-sm text-xs uppercase tracking-wider"
          >
            <ChevronLeft className="w-5 h-5"/> Previous
          </button>
          
          <div className="tabular-nums font-bold text-[#0B1F3A] tracking-[0.2em] text-sm flex items-center justify-center min-w-[80px]">
            <motion.span
              key={cards[0].id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-block"
            >
              {String(cards[0].id + 1).padStart(2, '0')}
            </motion.span>
            <span className="opacity-40 mx-2">/</span> 
            <span className="opacity-60">{String(testimonials.length).padStart(2, '0')}</span>
          </div>

          <button 
            onClick={moveNext} 
            className="flex items-center gap-2 font-semibold text-gray-400 hover:text-[#0B1F3A] transition-colors md:text-sm text-xs uppercase tracking-wider"
          >
            Next <ChevronRight className="w-5 h-5"/>
          </button>
        </SlideUp>

      </div>
    </div>
  );
}
