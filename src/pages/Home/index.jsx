import React from 'react';

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
    <div className="w-full flex flex-col font-sans overflow-hidden bg-white">
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
  );
}
