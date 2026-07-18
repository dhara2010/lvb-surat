import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export default function VerticalRiverStraps({ className = '' }) {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 25,
    restDelta: 0.001
  });

  // Stagger the drawing of the two waves
  const pathLength1 = useTransform(smoothProgress, [0, 0.9], [0, 1]);
  const pathLength2 = useTransform(smoothProgress, [0.1, 1], [0, 1]);

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40 ${className}`} 
    >
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
        
        {/* River Wave 1 */}
        <motion.path
          d="M 30,0 C 80,250 -10,500 60,750 C 130,1000 40,1000 40,1000"
          stroke="var(--color-primary)" 
          strokeWidth="3"
          strokeLinecap="round"
          style={{ pathLength: pathLength1 }}
        />

        {/* River Wave 2 (interweaving) */}
        <motion.path
          d="M 70,0 C -20,300 110,600 20,800 C -40,950 60,1000 60,1000"
          stroke="var(--color-primary)" 
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 6"
          style={{ pathLength: pathLength2 }}
        />

      </svg>
    </div>
  );
}
