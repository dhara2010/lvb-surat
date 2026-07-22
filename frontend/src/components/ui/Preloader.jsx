import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const duration = 1600;
    const interval = 25;
    let current = 0;

    const timer = setInterval(() => {
      current += Math.floor(Math.random() * 4) + 2;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(timer);
        setTimeout(() => {
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        }, 350);
      } else {
        setProgress(current);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return createPortal(
    <motion.div 
      className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#000000] pointer-events-auto select-none"
      initial={{ y: 0 }}
      exit={{ y: "-100%", transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="text-4xl md:text-7xl font-black text-white font-display overflow-hidden flex items-center">
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="tracking-widest"
        >
          LVB <span className="font-light">PLATINUM</span>
        </motion.div>
      </div>

      <motion.div 
        className="text-sm md:text-base font-bold text-gray-400 mt-4 tabular-nums tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {progress}%
      </motion.div>

      <div className="w-[80vw] max-w-sm h-[2px] bg-white/15 mt-6 overflow-hidden rounded-full">
        <motion.div 
          className="h-full bg-secondary"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.1 }}
        />
      </div>
    </motion.div>,
    document.body
  );
}
