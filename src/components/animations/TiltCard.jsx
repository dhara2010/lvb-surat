import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const TiltCard = React.memo(({ children, className = '', tiltMax = 15, scaleMax = 1.05 }) => {
  const ref = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    setRotation({
      x: -yPct * tiltMax,
      y: xPct * tiltMax
    });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotation.x,
        rotateY: rotation.y,
        scale: isHovering ? scaleMax : 1,
        z: isHovering ? 50 : 0
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
      className={`relative will-change-transform ${className}`}
    >
      <div 
        style={{ transformStyle: 'preserve-3d', transform: isHovering ? 'translateZ(30px)' : 'translateZ(0px)', transition: 'transform 0.4s ease' }} 
        className="w-full h-full"
      >
        {children}
        
        {/* Soft shadow overlay for realistic depth lighting */}
        <motion.div 
          animate={{ opacity: isHovering ? 0.3 : 0 }}
          style={{
            background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 25%, transparent 35%)',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            transform: 'translateZ(1px)' // Keeps shadow strictly above card layers
          }}
        />
        
        {/* Drop shadow driven by elevation */}
        <motion.div 
          animate={{ opacity: isHovering ? 1 : 0 }}
          className="absolute -inset-4 z-[-1] blur-2xl bg-black/40 rounded-[inherit] pointer-events-none transition-opacity duration-300"
          style={{ transform: 'translateZ(-20px)' }}
        />
      </div>
    </motion.div>
  );
});
