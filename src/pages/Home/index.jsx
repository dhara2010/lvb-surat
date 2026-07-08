import React from 'react';
import { motion } from 'framer-motion';

// Import split sections
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import PillarsSection from './components/PillarsSection';
import ChapterSection from './components/ChapterSection';
import LeadershipSection from './components/LeadershipSection';
import GallerySection from './components/GallerySection';
import TestimonialsSection from './components/TestimonialsSection';
import EventsSection from './components/EventsSection';
import FAQSection from './components/FAQSection';

export default function Home() {
  return (
    <div className="w-full flex flex-col font-sans overflow-hidden">
      {/* Background Video */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.video autoPlay muted loop playsInline className="w-full h-full object-cover" >
          <source src="/video.mp4" type="video/mp4" />
        </motion.video>
        {/* Cinematic dark overlay to make text highly readable */}
        <div className="absolute inset-0 bg-[#0B1F3A]/70 backdrop-blur-[2px]"></div>
      </div>
      
      <div className="relative z-10 w-full">
        <Hero />
        <AboutSection />
        <PillarsSection />
        <ChapterSection />
        <LeadershipSection />
        <GallerySection />
        <TestimonialsSection />
        <EventsSection />
        <FAQSection />
      </div>
    </div>
  );
}
