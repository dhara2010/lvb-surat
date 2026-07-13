import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ParallaxSection = React.memo(({ children, speed = 0.5, className = '', bgImage = null }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Background moves at different speed depending on 'speed' prop
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden w-full ${className}`} style={{ transformStyle: 'preserve-3d' }}>
      {bgImage && (
        <motion.div 
          style={{ y, backgroundImage: `url(${bgImage})`, transformStyle: 'preserve-3d' }}
          className="absolute inset-0 z-0 bg-cover bg-center w-full h-[120%]"
        />
      )}
      <div className="relative z-10 w-full h-full transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </div>
  );
});
