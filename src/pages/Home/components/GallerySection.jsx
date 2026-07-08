import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideUp } from '../../../components/animations/SlideUp';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { gallery } from '../../../data';

export default function GallerySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [touchStartX, setTouchStartX] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Responsive Items Per Page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(gallery.length / itemsPerPage);
  
  // Chunk the gallery into arrays of sizes matching itemsPerPage
  const chunkedGallery = [];
  for (let i = 0; i < gallery.length; i += itemsPerPage) {
    chunkedGallery.push(gallery.slice(i, i + itemsPerPage));
  }

  // Ensure activeIndex is bounded if resizing makes totalPages smaller
  useEffect(() => {
    if (activeIndex >= totalPages) setActiveIndex(totalPages > 0 ? totalPages - 1 : 0);
  }, [totalPages, activeIndex]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  }, [totalPages]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  }, [totalPages]);

  const handleDotClick = (i) => {
    if (i === activeIndex) return;
    setDirection(i > activeIndex ? 1 : -1);
    setActiveIndex(i);
  };

  // Auto-scrolling feature
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, handleNext]);

  // Touch Swipe Handlers for mobile functionality
  const onTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) handleNext();
    else if (diff < -50) handlePrev();
    setTouchStartX(null);
  };

  const sliderVariants = {
    enter: (dir) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 280, damping: 30 }
    },
    exit: (dir) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.95,
      transition: { type: "spring", stiffness: 280, damping: 30 }
    })
  };

  return (
    <div className="bg-white py-24 overflow-hidden relative border-b border-gray-100">
      <div className="flex flex-col items-center w-full relative">
        <SlideUp className="container-xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0B1F3A] mb-8 relative text-center">
            Chapter <span className='text-teal-500'>Gallery</span>
          </h2>
        </SlideUp>

        {/* Carousel Area */}
        <div 
          className="w-full relative mt-6 mb-8 group"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setTouchStartX(null); setIsHovered(false); }}
        >
          {/* Navigation Arrows */}
          <button 
            onClick={handlePrev} 
            aria-label="Previous Slide"
            className="absolute left-2 md:left-6 xl:left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur flex items-center justify-center rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 text-[#0B1F3A] transition hover:scale-105"
          >
             <ChevronLeft className="w-6 h-6 ml-[-2px]" />
          </button>
          <button 
            onClick={handleNext} 
            aria-label="Next Slide"
            className="absolute right-2 md:right-6 xl:right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur flex items-center justify-center rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 text-[#0B1F3A] transition hover:scale-105"
          >
             <ChevronRight className="w-6 h-6 mr-[-2px]" />
          </button>
          
          <div className="overflow-hidden mx-auto w-full max-w-[1400px] px-16 xl:px-32">
             <div className="grid w-full">
               <AnimatePresence initial={false} custom={direction} mode="popLayout">
                 <motion.div
                   key={activeIndex}
                   custom={direction}
                   variants={sliderVariants}
                   initial="enter"
                   animate="center"
                   exit="exit"
                   className="col-start-1 row-start-1 flex w-full"
                 >
                   {chunkedGallery[activeIndex]?.map((img, i) => (
                     <div 
                       key={i} 
                       className="flex-shrink-0 px-3" 
                       style={{ width: `${100 / itemsPerPage}%` }}
                     >
                        <div className="w-full aspect-video rounded-xl overflow-hidden shadow-sm border border-gray-100 relative group cursor-pointer">
                           <img 
                             src={img} 
                             alt={`Gallery visual ${i + 1}`}
                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                             onError={(e) => { e.target.src = '/KVS_3369-scaled.jpg'; }}
                           />
                           <div className="absolute inset-0 bg-[#0B1F3A]/0 group-hover:bg-[#0B1F3A]/20 transition-all duration-300 pointer-events-none"></div>
                        </div>
                     </div>
                   ))}
                 </motion.div>
               </AnimatePresence>
             </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2.5 mb-10 mt-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button 
              key={i}
              onClick={() => handleDotClick(i)}
              aria-label={`Go to slide page ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-8 bg-[#14B8A6]' : 'w-2.5 bg-gray-300 hover:bg-gray-400'}`}
            />
          ))}
        </div>

        {/* View Full Gallery Link */}
        <SlideUp delay={0.1}>
          <Link
            to="/gallery"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 py-4 font-semibold text-white shadow-lg transition-all duration-500 hover:shadow-2xl"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#14b8a6] via-[#0B1F3A] to-[#14b8a6] transition-transform duration-700 group-hover:translate-x-0"></span>
            <span className="relative z-10">View Full Gallery</span>
            <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-all duration-500 group-hover:translate-x-1 group-hover:bg-white group-hover:text-[#0B1F3A]">
              <ArrowRight className="h-4 w-4" strokeWidth={3} />
            </span>
          </Link>
        </SlideUp>
      </div>
    </div>
  );
}
