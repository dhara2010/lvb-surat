import { motion } from 'framer-motion';
import MotionWrapper from '../animations/MotionWrapper';

export default function LuxuryCard({ 
  children, 
  className = '', 
  hoverEffect = true, 
  hoverVariant,
  delay = 0, 
  ...props 
}) {
  return (
    <MotionWrapper variant="fadeUp" delay={delay}>
      <motion.div
        whileHover={hoverEffect ? { y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' } : {}}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`group relative overflow-hidden bg-white border border-[#E5E7EB] rounded-[24px] shadow-sm transition-all duration-300 ${className}`}
        {...props}
      >
        <div className="absolute top-0 left-0 right-0 h-[3px] opacity-0 transition-opacity duration-300 hover:opacity-100 group-hover:opacity-100 bg-[#22C55E]" />
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </motion.div>
    </MotionWrapper>
  );
}
