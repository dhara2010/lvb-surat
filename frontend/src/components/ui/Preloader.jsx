import React, { useEffect, useState } from'react';
import { motion, AnimatePresence } from'framer-motion';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500;
    const steps = 100;
    const interval = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      // smooth easing on the number update
      if (current < 100) {
        current += Math.random() > 0.5 ? 2 : 1;
        if (current > 100) current = 100;
        setProgress(current);
      } else {
        clearInterval(timer);
        setTimeout(onComplete, 600);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#000000]"
      initial={{ y: 0 }}
      exit={{ y:"-100%", transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
      
      <div className="text-4xl md:text-7xl font-black  font-display overflow-hidden flex items-center">
        <motion.div
          initial={{ y:"100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="tracking-widest"
        >
          LVB <span className="font-light">PLATINUM</span>
        </motion.div>
      </div>

      <motion.div 
        className="text-sm md:text-base font-semibold  mt-4 tabular-nums tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {progress}%
      </motion.div>

      <div className="w-[80vw] max-w-sm h-[2px] bg-white/10 mt-6 overflow-hidden rounded-full">
        <motion.div 
          className="h-full bg-secondary"
          initial={{ width:"0%" }}
          animate={{ width:`${progress}%` }}
          transition={{ ease:"linear", duration: 0.1 }}
        />
      </div>
    </motion.div>
  );
}
