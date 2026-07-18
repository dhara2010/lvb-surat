import React, { useState, useEffect, useCallback } from"react";
import { motion, AnimatePresence } from"framer-motion";
import ScrollReveal3D from'../../../components/animations/ScrollReveal3D';
import TextReveal from'../../../components/animations/TextReveal';
import TypingHeading from'../../../components/animations/TypingHeading';
import { Link } from"react-router-dom";
import { ChevronLeft, ChevronRight} from"lucide-react";
import { useFetch } from"../../../hooks/useFetch";
import { getGalleryImages } from"../../../api/galleryApi";
import TiltCard from'../../../components/animations/TiltCard';
import LuxuryButton from'../../../components/ui/LuxuryButton';
import LuxuryCard from'../../../components/ui/LuxuryCard';
import GlassSection from'../../../components/ui/GlassSection';
import GalleryStraps from'../../../components/effects/GalleryStraps';
import FoldingImage from'../../../components/effects/FoldingImage';

export default function GallerySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [touchStartX, setTouchStartX] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const { data, loading, error } = useFetch(getGalleryImages);

  const gallery = React.useMemo(() => data ? data.map((item) => item.image_url) : [], [data]);

  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const chunkedGallery = [];
  for (let i = 0; i < gallery.length; i += itemsPerPage) {
    chunkedGallery.push(gallery.slice(i, i + itemsPerPage));
  }
  const totalPages = chunkedGallery.length;

  useEffect(() => {
    if (totalPages > 0 && activeIndex >= totalPages) {
      setActiveIndex(totalPages - 1);
    }
  }, [totalPages, activeIndex]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => prev === totalPages - 1 ? 0 : prev + 1);
  }, [totalPages]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => prev === 0 ? totalPages - 1 : prev - 1);
  }, [totalPages]);

  useEffect(() => {
    if (isHovered || totalPages <= 1) return;
    const interval = setInterval(handleNext, 4000);
    return () => clearInterval(interval);
  }, [handleNext, isHovered, totalPages]);

  const handleDotClick = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const onTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
    setTouchStartX(null);
  };

  const sliderVariants = {
    enter: (dir) => ({ x: dir > 0 ?"100%" :"-100%", opacity: 0, rotateY: dir > 0 ? 15 : -15, z: -50 }),
    center: { x: 0, opacity: 1, rotateY: 0, z: 0, transition: { duration: 0.6, type:'spring', stiffness: 150, damping: 20 } },
    exit: (dir) => ({ x: dir > 0 ?"-100%" :"100%", opacity: 0, rotateY: dir > 0 ? -15 : 15, z: -50, transition: { duration: 0.5 } })
  };

  return (
    <div className="relative">
      <GalleryStraps className="absolute inset-x-0 -top-1/4 h-[125%] opacity-30 z-0 pointer-events-none" />
      <GlassSection>
      <div className="container-xl mx-auto relative z-10">

        <ScrollReveal3D>
          <div className="flex flex-col items-center justify-center text-center mb-16 md:mb-20">
            <span className="inline-flex items-center gap-3 font-bold tracking-[0.2em] uppercase text-xs mb-4" >
              <div className="w-12 h-[2px]" style={{ backgroundColor:'#4FA3D1' }}></div>
              Experiences
              <div className="w-12 h-[2px]" style={{ backgroundColor:'#4FA3D1' }}></div>
            </span>
            <TypingHeading el="h2" className="text-section font-bold">
              Our <span className="bg-clip-text bg-gradient-to-r from-[#4FA3D1] to-[#7DD3FC] text-transparent">Gallery</span>
            </TypingHeading>
          </div>
        </ScrollReveal3D>

        <div
          className="relative mt-8 md:mt-10"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Previous */}
          <button
            onClick={handlePrev}
            className="absolute -left-3 sm:-left-6 md:-left-8 top-1/2 -translate-y-1/2 z-20 glass-panel shadow-[0_10px_30px_rgba(11,25,44,0.1)]  hover:text-secondary rounded-full p-3 transition-colors hidden md:block"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next */}
          <button
            onClick={handleNext}
            className="absolute -right-3 sm:-right-6 md:-right-8 top-1/2 -translate-y-1/2 z-20 glass-panel shadow-[0_10px_30px_rgba(11,25,44,0.1)]  hover:text-secondary rounded-full p-3 transition-colors hidden md:block"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="overflow-visible px-1 py-8">
            {loading && <div className="h-[200px] sm:h-80 flex items-center justify-center  font-bold tracking-widest text-sm">LOADING GALLERY...</div>}
            {error && <div className="h-[200px] sm:h-80 flex items-center justify-center  font-bold tracking-widest text-sm">FAILED TO LOAD</div>}

            {!loading && gallery.length > 0 && (
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={activeIndex}
                  variants={sliderVariants}
                  custom={direction}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{ transformStyle:'preserve-3d', perspective:'1200px' }}
                  className={`grid gap-6 sm:gap-8 ${itemsPerPage === 1 ?"grid-cols-1" : itemsPerPage === 2 ?"grid-cols-2" :"grid-cols-3"}`}
                >
                  {chunkedGallery[activeIndex].map((img, index) => (
                    <TiltCard key={index} tiltMax={12} scaleMax={1.03} className="h-full">
                      <LuxuryCard className="relative group overflow-hidden p-2 h-full transition-all duration-500">
                        <div className="relative overflow-hidden rounded-[18px] w-full h-full aspect-[4/3]">
                          <FoldingImage
                            src={img}
                            alt="Gallery Event"
                            className="w-full h-full rounded-[18px] overflow-hidden" 
                          />
                        </div>
                      </LuxuryCard>
                    </TiltCard>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-6">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`transition-all duration-300 rounded-full h-2 ${activeIndex === index ?"w-8 shadow-[0_0_10px_rgba(125,211,252,0.3)] bg-[#7DD3FC]" :"w-2 bg-gray-600 hover:bg-gray-400"}`}
            />
          ))}
        </div>

        {/* Button */}
        <ScrollReveal3D delay={0.1}>
          <div className="flex justify-center mt-12 w-full">
            <Link to="/gallery">
                <div className="inline-flex items-center justify-center rounded-[12px] font-bold text-[13px] md:text-sm uppercase tracking-widest transition-all duration-300 text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] shadow-sm hover:shadow-md hover:scale-105 xl:py-3.5 xl:px-10 py-3 px-8">
                  View Full Experiences
                </div>
              </Link>
          </div>
        </ScrollReveal3D>

      </div>
    </GlassSection>
</div>
  );
}
