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
    <div className="w-full flex flex-col font-sans overflow-hidden bg-dark">
      {/* Minor Dark Video Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video autoPlay muted loop playsInline preload="auto" className="w-full h-full object-cover opacity-60">
          <source src="/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-dark/45 backdrop-blur-[2px]"></div>
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
