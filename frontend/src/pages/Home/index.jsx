import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
import { ParallaxSection } from '../../components/animations/ParallaxSection';
import { AnimatedBackground } from '../../components/animations/AnimatedBackground';
import SmoothScroll from '../../components/animations/SmoothScroll';
import CustomCursor from '../../components/ui/CustomCursor';
import Preloader from '../../components/ui/Preloader';
import BackgroundVideo from '../../components/video/BackgroundVideo';

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <SmoothScroll>
      <CustomCursor />
      
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

    <div className={`theme-dark w-full flex flex-col font-sans overflow-hidden transition-opacity duration-1000 ease-[0.16,1,0.3,1] bg-transparent ${loading ? 'opacity-0 h-screen' : 'opacity-100'}`}>
      
      <BackgroundVideo />
      
      <main className="relative z-10 w-full" style={{ transformStyle: 'preserve-3d' }}>
        <Hero />
        
        <ParallaxSection speed={0.15}>
          <AboutSection />
          <PillarsSection />
        </ParallaxSection>

        <ParallaxSection speed={0.25}>
          <ChapterSection />
          <LeadershipSection />
        </ParallaxSection>

        <ParallaxSection speed={0.2}>
          <GallerySection />
          <TestimonialsSection />
        </ParallaxSection>

        <ParallaxSection speed={0.1}>
          <EventsSection />
          <FAQSection />
        </ParallaxSection>
      </main>
    </div>
    </SmoothScroll>
  );
}
