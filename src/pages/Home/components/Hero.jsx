  import React from 'react';
  import { motion } from 'framer-motion';

  export default function Hero() {
    return (
      <div className="relative w-full h-[50vh] md:h-[calc(100dvh-72px)] min-h-[300px] flex items-center justify-center overflow-hidden bg-[#061826]">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <video
            src="/hero_video.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-contain md:object-cover object-center pointer-events-none"
          />
          {/* Dark Overlay for Text Readability (If needed later) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#061826]/30 via-transparent to-[#061826]/30 pointer-events-none"></div>
        </div>
      </div>
    );
  }