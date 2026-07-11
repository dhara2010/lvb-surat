  import React from 'react';
  import { motion } from 'framer-motion';
  import { Link } from 'react-router-dom';
  import { ArrowRight } from 'lucide-react';

  export default function Hero() {
    return (
      <div className="relative w-full h-[100dvh] min-h-[600px] flex items-center justify-center overflow-hidden bg-[#061826]">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            src="/hero_video.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute top-0 left-0 w-full h-full object-cover object-center pointer-events-none"
          />
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#061826]/80 via-[#061826]/50 to-[#061826]/90"></div>
        </div>
      </div>
    );
  }