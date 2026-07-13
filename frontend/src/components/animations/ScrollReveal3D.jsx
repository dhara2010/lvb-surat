import React from 'react';
import { motion } from 'framer-motion';

export const ScrollReveal3D = React.memo(({ children, delay = 0, className = '' }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 80, 
        rotateX: 25, 
        rotateY: -10, 
        scale: 0.9, 
        filter: 'blur(8px)' 
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        rotateX: 0, 
        rotateY: 0, 
        scale: 1, 
        filter: 'blur(0px)' 
      }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ 
        type: 'spring', 
        stiffness: 70, 
        damping: 20, 
        delay: delay, 
        mass: 1.2 
      }}
      className={className}
      style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
    >
      {children}
    </motion.div>
  );
});
