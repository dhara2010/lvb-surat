import React from "react";
import { motion } from "framer-motion";

const ScrollReveal3D = ({ children, className = "", delay = 0, duration = 1 }) => {
  return (
    <motion.div
<<<<<<< HEAD
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
=======
      initial={{ opacity: 0, y: 100, rotateX: -25, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
>>>>>>> 4c81fa0 (home page done)
      viewport={{ once: true, margin: "-150px" }}
      transition={{ 
        duration: duration, 
        delay: delay, 
<<<<<<< HEAD
        ease: "easeOut" 
=======
        ease: [0.16, 1, 0.3, 1] 
>>>>>>> 4c81fa0 (home page done)
      }}
      className={className}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal3D;
