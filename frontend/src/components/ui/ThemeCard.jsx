import React from 'react';
import { motion } from 'framer-motion';

/**
 * ThemeCard: Global luxury hover card system.
 * Expected children configurations:
 * text: group-hover:text-white
 * description: group-hover:text-white/90
 * icon box: group-hover:bg-white group-hover:text-primary group-hover:scale-115 group-hover:rotate-3 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]
 */
export const ThemeCard = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`group relative overflow-hidden rounded-[24px] sm:rounded-[32px] p-6 lg:p-8 transition-all duration-500 
        bg-white border border-border shadow-[0_10px_30px_rgba(9,14,20,0.04)]
        hover:bg-gradient-to-br hover:from-primary hover:to-secondary
        hover:border-transparent hover:shadow-[0_30px_60px_rgba(18,59,93,0.3)] ${className}`}
      {...props}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit]"></div>
      
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
};
