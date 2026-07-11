  import React from 'react';
  import { motion } from 'framer-motion';

  export default function Hero() {
    return (
      <div className="relative w-full h-[50vh] md:h-[calc(100dvh-72px)] min-h-[300px] flex items-center justify-center overflow-hidden bg-dark">
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <video
            src="/hero_video.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center pointer-events-none"
          />
          {/* Dark Overlay for Text Readability (If needed later) */}
          <div className="absolute inset-0 bg-gradient-to-b from-dark/30 via-transparent to-dark/30 pointer-events-none"></div>
        </div>
      </div>
    );
  }