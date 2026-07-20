import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function TiltCard({ children, tiltMax = 15, scaleMax = 1.02, className = '' }) {
  const cardRef = useRef(null);
  
  // 3D Tilt Spring
  const rotateX = useSpring(0, { stiffness: 400, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 400, damping: 30 });

  function handleMouseMove(e) {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    // Maps x and y coordinates relative to center
    const mappedX = (x / width - 0.5) * tiltMax; 
    const mappedY = (y / height - 0.5) * -tiltMax; 
    
    rotateX.set(mappedY);
    rotateY.set(mappedX);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
          perspective: 1200,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d" // IMPORTANT for nested 3D components like FoldingImage
      }}
      whileHover={{ scale: scaleMax }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
}
