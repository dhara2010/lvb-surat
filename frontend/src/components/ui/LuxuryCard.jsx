import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import MotionWrapper from '../animations/MotionWrapper';

export default function LuxuryCard({ 
  children, 
  className = '', 
  hoverEffect = true, 
  hoverVariant,
  delay = 0, 
  ...props 
}) {
  const cardRef = useRef(null);
  
  // Spotlight coordinates
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  
  // 3D Tilt Springs (Smooth Physics)
  const rotateX = useSpring(0, { stiffness: 400, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 400, damping: 30 });

  function handleMouseMove(e) {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    // Spotlight update
    mouseX.set(x);
    mouseY.set(y);

    // 3D Tilt Engine update - calculates distance from center
    if (hoverEffect) {
       const mappedX = (x / width - 0.5) * 12; // Maximum tilt angle 6 degrees
       const mappedY = (y / height - 0.5) * -12; 
       rotateX.set(mappedY);
       rotateY.set(mappedX);
    }
  }

  function handleMouseLeave() {
    if (hoverEffect) {
      rotateX.set(0);
      rotateY.set(0);
    }
    // Eject spotlight outside bounds
    mouseX.set(-1000);
    mouseY.set(-1000);
  }

  return (
    <MotionWrapper variant="fadeUp" delay={delay}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
           perspective: 1200,
           rotateX,
           rotateY,
           transformStyle: "preserve-3d"
        }}
        whileHover={hoverEffect ? { y: -8, scale: 1.015 } : {}}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className={`group relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[rgba(4,71,101,0.08)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(4,71,101,0.12)] hover:border-transparent ${className}`}
        {...props}
      >
        {/* Animated Gradient Border Layer */}
        {hoverEffect && (
          <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[inherit]" 
               style={{
                 padding: '1px',
                 background: 'linear-gradient(135deg, rgba(14,165,233,0.5), rgba(4,71,101,0.4), transparent 60%)',
                 WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                 WebkitMaskComposite: 'xor',
                 maskComposite: 'exclude'
               }}></div>
        )}

        {/* Dynamic Mouse Spotlight Layer */}
        {hoverEffect && (
          <motion.div
            className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0 mix-blend-overlay rounded-[inherit]"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  450px circle at ${mouseX}px ${mouseY}px,
                  rgba(14, 165, 233, 0.15),
                  transparent 80%
                )
              `,
            }}
          />
        )}

        {/* Top Glow Bar Indicator */}
        {hoverEffect && (
          <div className="absolute top-0 left-0 right-0 h-[3px] opacity-0 transition-all duration-500 group-hover:opacity-100 bg-gradient-to-r from-transparent via-[#0EA5E9] to-transparent scale-x-0 group-hover:scale-x-100 z-10 origin-center" />
        )}

        {/* Content Projection Plane (Lifts towards user on hover) */}
        <div className="relative z-10 w-full h-full transform-gpu transition-transform duration-500" style={hoverEffect ? { transform: "translateZ(30px)" } : {}}>
          {children}
        </div>
      </motion.div>
    </MotionWrapper>
  );
}
