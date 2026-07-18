import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function AnimatedLine({ className = '', thickness = 2, color = '#E5E7EB', delay = 0, orientation = 'horizontal' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div ref={ref} className={`overflow-hidden ${orientation === 'horizontal' ? 'w-full' : 'h-full'} ${className}`} style={{ minHeight: orientation === 'horizontal' ? thickness : 'auto', minWidth: orientation === 'vertical' ? thickness : 'auto' }}>
      <motion.div
        initial={{ [orientation === 'horizontal' ? 'width' : 'height']: '0%' }}
        animate={{ [orientation === 'horizontal' ? 'width' : 'height']: isInView ? '100%' : '0%' }}
        transition={{ duration: 1.2, delay, ease: [0.76, 0, 0.24, 1] }}
        style={{ 
          background: color,
          height: orientation === 'horizontal' ? thickness : '100%',
          width: orientation === 'vertical' ? thickness : '100%'
        }}
      />
    </div>
  );
}
