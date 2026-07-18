import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// Import split sections
import HeroSequence from './components/HeroSequence';
import AboutSection from './components/AboutSection';
import PillarsSection from './components/PillarsSection';
import ChapterSection from './components/ChapterSection';
import LeadershipSection from './components/LeadershipSection';
import GallerySection from './components/GallerySection';
import TestimonialsSection from './components/TestimonialsSection';
import EventsSection from './components/EventsSection';
import FAQSection from './components/FAQSection';
import Preloader from '../../components/ui/Preloader';

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <div className={`w-full flex flex-col font-sans overflow-hidden transition-opacity duration-1000 ease-[0.16,1,0.3,1] ${loading ? 'opacity-0 h-screen' : 'opacity-100'}`}>
        <main className="relative z-10 w-full mix-blend-multiply">
          <HeroSequence />
          <AboutSection />
          <PillarsSection />
          <ChapterSection />
          <LeadershipSection />
          <GallerySection />
          <TestimonialsSection />
          <EventsSection />
          <FAQSection />
        </main>
      </div>
    </>
  );
}
