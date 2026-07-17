import React from 'react';
import { motion } from 'framer-motion';

export default function LuxuryCard({ children, className = '', hoverEffect = true, hoverVariant = 'dark', ...props }) {
  const hoverBackground = hoverVariant === 'dark' 
    ? 'linear-gradient(135deg, #090E14, rgba(79,163,209,0.15))'
    : 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(79,163,209,0.1))';

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -10, scale: 1.03 } : {}}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-[28px] transition-colors duration-500 group ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
      }}
      {...props}
    >
      {/* Luxury Hover Gradient Background */}
      {hoverEffect && (
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"
          style={{
            background: hoverBackground
          }}
        />
      )}
      
      {/* Luxury Hover Border and Shadow (Simulated via overlay) */}
      {hoverEffect && (
        <div 
          className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 pointer-events-none"
          style={{
            border: '1px solid rgba(79,163,209,0.4)',
            boxShadow: 'inset 0 0 0 1px transparent, 0 30px 70px rgba(79,163,209,0.15)'
          }}
        />
      )}

      {/* Content wrapper to stay above the hover gradient */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}
