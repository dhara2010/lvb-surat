import { motion } from 'framer-motion';

const animations = {
  fadeUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: (delay) => ({ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] })
  },
  blurReveal: {
    initial: { opacity: 0, filter: 'blur(10px)', y: 20 },
    animate: { opacity: 1, filter: 'blur(0px)', y: 0 },
    transition: (delay) => ({ duration: 1, delay, ease: 'easeOut' })
  },
  scaleReveal: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: (delay) => ({ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] })
  },
  sectionFade: {
    initial: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    transition: (delay) => ({ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] })
  },
  curtainReveal: {
    initial: { opacity: 0, clipPath: 'inset(100% 0 0 0)' },
    animate: { opacity: 1, clipPath: 'inset(0% 0 0 0)' },
    transition: (delay) => ({ duration: 1.2, delay, ease: [0.76, 0, 0.24, 1] })
  }
};

export default function MotionWrapper({ 
  children, 
  variant = 'fadeUp', 
  delay = 0, 
  className = '',
  amount = 0.2
}) {
  const selected = animations[variant];

  return (
    <motion.div
      initial={selected.initial}
      whileInView={selected.animate}
      viewport={{ once: true, amount }}
      transition={selected.transition(delay)}
      className={className}
    >
      {children}
    </motion.div>
  );
}
