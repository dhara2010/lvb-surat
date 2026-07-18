import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export default function GalleryStraps({ className = '' }) {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001
  });

  // Dual staggered path lengths for a premium layered effect
  const pathLength1 = useTransform(smoothProgress, [0, 0.9], [0, 1]);
  const pathLength2 = useTransform(smoothProgress, [0.1, 1], [0, 1]);

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30 ${className}`} 
    >
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
        
        {/* Main thick river curve entering from top-left, turning down at center, and exiting bottom-left */}
        <motion.path
          d="M -20,-20 C 800,0 800,1000 -20,1020"
          stroke="var(--color-primary)" 
          strokeWidth="4"
          strokeLinecap="round"
          style={{ pathLength: pathLength1 }}
        />

        {/* Thinner accompanying ribbon to add Lusion depth feeling */}
        <motion.path
          d="M -20,-50 C 780,-30 780,1030 -20,1050"
          stroke="var(--color-primary)" 
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="5 10"
          style={{ pathLength: pathLength2 }}
        />
        
      </svg>
    </div>
  );
}
