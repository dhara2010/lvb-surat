import { motion } from "framer-motion";

const ScrollReveal3D = ({ children, className = "", delay = 0, duration = 1 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, filter: 'blur(15px)', scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: duration, 
        delay: delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal3D;
