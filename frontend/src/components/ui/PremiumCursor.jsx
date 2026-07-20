import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useCursor } from '../../hooks/useCursor';

export default function PremiumCursor() {
  const { position, isTouchDevice, hoverState, magneticPosition } = useCursor();
  
  // Outer Ring
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Inner Dot
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Smooth springs for outer ring
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const smoothCursorX = useSpring(cursorX, springConfig);
  const smoothCursorY = useSpring(cursorY, springConfig);

  // Smooth springs for inner dot (faster)
  const dotSpringConfig = { damping: 30, stiffness: 800, mass: 0.1 };
  const smoothDotX = useSpring(dotX, dotSpringConfig);
  const smoothDotY = useSpring(dotY, dotSpringConfig);

  const requestRef = useRef(null);
  
  useEffect(() => {
    if (isTouchDevice) return;

    // Use absolute window mouse position
    const updateMotionValues = () => {
      // The inner dot follows instantly (or with slight lerp if magnetic, but user requested standard dot follow)
      dotX.set(position.x);
      dotY.set(position.y);
      
      // Outer ring follows either magnetic center or exact mouse
      if (magneticPosition) {
        cursorX.set(magneticPosition.x);
        cursorY.set(magneticPosition.y);
      } else {
        cursorX.set(position.x);
        cursorY.set(position.y);
      }
      
      requestRef.current = requestAnimationFrame(updateMotionValues);
    };

    requestRef.current = requestAnimationFrame(updateMotionValues);
    
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [position, isTouchDevice, cursorX, cursorY, dotX, dotY, magneticPosition]);

  if (isTouchDevice) return null;

  const isHovering = hoverState.state !== 'default';
  
  let ringSize = 40; // Default flying bubble size
  const dotSize = 10; // Persistent simple blue dot
  
  if (hoverState.state === 'pointer') {
    ringSize = 65;
  } else if (hoverState.state === 'image') {
    ringSize = 80;
  } else if (hoverState.state === 'card') {
    ringSize = 60;
  }

  return (
    <div className="premium-cursor-container pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden lg:block">
      
      {/* Background Spotlight */}
      <motion.div
        className="absolute left-0 top-0 rounded-full"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(4,71,101,0.03) 0%, rgba(4,71,101,0) 70%)',
          x: smoothCursorX,
          y: smoothCursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Flying Bubble (Outer Ring) */}
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full backdrop-blur-[2px] border border-[var(--color-secondary)]/30 bg-[var(--color-secondary)]/10 shadow-sm"
        style={{
          width: ringSize,
          height: ringSize,
          x: smoothCursorX,
          y: smoothCursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: isHovering ? 1.2 : 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
      </motion.div>

      {/* Simple Blue Dot */}
      <motion.div
        className="absolute left-0 top-0 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_rgba(0,47,108,0.5)] border border-white/50"
        style={{
          width: dotSize,
          height: dotSize,
          x: smoothDotX,
          y: smoothDotY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: 1
        }}
      />
    </div>
  );
}
