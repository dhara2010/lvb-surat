import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlideUp } from "../../../components/animations/SlideUp";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useFetch } from "../../../hooks/useFetch";
import { getGalleryImages } from "../../../api/galleryApi";

export default function GallerySection() {
  const [gallery, setGallery] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [touchStartX, setTouchStartX] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const { data, loading, error } = useFetch(getGalleryImages);

  useEffect(() => {
    if (data) {
      setGallery(data.map((item) => item.image_url));
    }
  }, [data]);

  // Responsive Items
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
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
    if (activeIndex >= totalPages) {
      setActiveIndex(totalPages ? totalPages - 1 : 0);
    }
  }, [totalPages]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) =>
      prev === totalPages - 1 ? 0 : prev + 1
    );
  }, [totalPages]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) =>
      prev === 0 ? totalPages - 1 : prev - 1
    );
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

  const onTouchStart = (e) =>
    setTouchStartX(e.touches[0].clientX);

  const onTouchEnd = (e) => {
    if (touchStartX === null) return;

    const diff = touchStartX - e.changedTouches[0].clientX;

    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();

    setTouchStartX(null);
  };

  const sliderVariants = {
    enter: (dir) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    }),
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 overflow-hidden w-full max-w-[100vw]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 relative">

        <SlideUp>
          <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 md:mb-12">
            Chapter <span className="text-[#0EA5A8]">Gallery</span>
          </h2>
        </SlideUp>

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
            className="absolute -left-2 sm:-left-4 md:-left-12 lg:-left-16 top-1/2 -translate-y-1/2 z-20 bg-white text-[#044765] hover:bg-[#0EA5A8] hover:text-white rounded-full shadow-lg p-1.5 sm:p-2 md:p-3 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Next */}
          <button
            onClick={handleNext}
            className="absolute -right-2 sm:-right-4 md:-right-12 lg:-right-16 top-1/2 -translate-y-1/2 z-20 bg-white text-[#044765] hover:bg-[#0EA5A8] hover:text-white rounded-full shadow-lg p-1.5 sm:p-2 md:p-3 transition-colors"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="overflow-hidden px-1">
            {loading && (
              <div className="h-[200px] sm:h-80 flex items-center justify-center text-white/50 text-sm md:text-base">
                Loading...
              </div>
            )}

            {error && (
              <div className="h-[200px] sm:h-80 flex items-center justify-center text-red-400 text-sm md:text-base">
                Failed to load gallery
              </div>
            )}

            {!loading && gallery.length > 0 && (
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={activeIndex}
                  variants={sliderVariants}
                  custom={direction}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className={`grid gap-4 sm:gap-5
                    ${
                      itemsPerPage === 1
                        ? "grid-cols-1"
                        : itemsPerPage === 2
                        ? "grid-cols-2"
                        : "grid-cols-3"
                    }`}
                >
                  {chunkedGallery[activeIndex].map((img, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-xl shadow-lg border border-white/10"
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full aspect-[4/3] object-cover hover:scale-105 transition duration-700"
                        onError={(e) => {
                          e.target.src = "/KVS_3369-scaled.jpg";
                        }}
                      />
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 md:gap-3 mt-6 md:mt-8">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`transition-all duration-300 rounded-full
              ${
                activeIndex === index
                  ? "w-6 h-2 md:w-8 md:h-2.5 bg-[#0EA5A8]"
                  : "w-2 h-2 md:w-2.5 md:h-2.5 bg-gray-400/50 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Button */}
        <SlideUp delay={0.1}>
          <div className="flex justify-center mt-8 md:mt-10">
            <Link
              to="/gallery"
              className="btn-primary text-sm md:text-base px-6 py-2.5 md:px-7 md:py-3"
            >
              View Full Gallery
            </Link>
          </div>
        </SlideUp>

      </div>
    </section>
  );
}