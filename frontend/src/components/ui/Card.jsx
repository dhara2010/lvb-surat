import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

export default function Card({ 
  children, 
  className = '', 
  hover = true, 
  glass = false,
  padding = 'p-8',
  rounded = 'rounded-2xl',
  border = 'border-[rgba(4,71,101,0.06)]',
  shadow = 'shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
}) {
  const cardRef = useRef(null);
  
  // Spotlight
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  
  // 3D Tilt Spring
  const rotateX = useSpring(0, { stiffness: 400, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 400, damping: 30 });

  function handleMouseMove(e) {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    mouseX.set(x);
    mouseY.set(y);

    if (hover) {
       const mappedX = (x / width - 0.5) * 8; 
       const mappedY = (y / height - 0.5) * -8; 
       rotateX.set(mappedY);
       rotateY.set(mappedX);
    }
  }

  function handleMouseLeave() {
    if (hover) {
      rotateX.set(0);
      rotateY.set(0);
    }
    mouseX.set(-1000);
    mouseY.set(-1000);
  }

  const baseStyle = `relative overflow-hidden bg-white/95 ${border} ${rounded} ${padding} ${shadow} transition-all duration-500`;
  const hoverStyle = hover ? 'hover:shadow-[0_20px_40px_rgba(4,71,101,0.08)] hover:border-transparent group cursor-pointer' : '';
  const glassStyle = glass ? 'backdrop-blur-xl bg-white/70 border-white/40' : 'bg-white border';

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
          perspective: 1000,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
      }}
      whileHover={hover ? { y: -5, scale: 1.01 } : {}}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={`${baseStyle} ${hoverStyle} ${glassStyle} ${className}`}
    >
      {/* Animated Gradient Border Layer */}
      {hover && (
        <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[inherit]" 
             style={{
               padding: '1px',
               background: 'linear-gradient(135deg, rgba(14,165,233,0.3), rgba(4,71,101,0.2), transparent 60%)',
               WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
               WebkitMaskComposite: 'xor',
               maskComposite: 'exclude'
             }}></div>
      )}

      {/* Dynamic Mouse Spotlight Layer */}
      {hover && (
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0 mix-blend-overlay rounded-[inherit]"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                350px circle at ${mouseX}px ${mouseY}px,
                rgba(14, 165, 233, 0.08),
                transparent 80%
              )
            `,
          }}
        />
      )}

      {/* Lifted Content Plane */}
      <div className="relative z-10 w-full h-full transform-gpu transition-transform duration-500" style={hover ? { transform: "translateZ(20px)" } : {}}>
        {children}
      </div>
    </motion.div>
  );
}
