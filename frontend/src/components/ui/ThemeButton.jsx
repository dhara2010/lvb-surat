import React from'react';
import { motion } from'framer-motion';

export const ThemeButton = ({ children, className ='', onClick, type ='button', ...props }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3, ease:'easeOut' }}
      className={`relative inline-flex items-center justify-center px-8 py-3.5 rounded-full font-bold text-sm tracking-[0.15em] uppercase transition-all duration-300
        bg-primary  shadow-[0_10px_20px_rgba(9,14,20,0.15)]
        hover:bg-secondary hover:text-white hover:shadow-[0_15px_30px_rgba(18,59,93,0.4)] ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
