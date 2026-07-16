import React from 'react';
import { motion } from 'framer-motion';

export default function HeroVideo() {
  return (
    <div className="absolute inset-0 w-full h-full pb-[0px] z-0 pointer-events-none overflow-hidden">
      {/* Hero Video with Fade-in and Slight Scale Reveal */}
      <motion.video
        src="/hero_video.mp4"
        autoPlay
        loop
        muted
        playsInline
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Required Dark Overlay Gradient for Hero */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ backgroundColor: "rgba(9,14,20,0.2)" }}
      ></div>
    </div>
  );
}
