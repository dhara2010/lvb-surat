import React from "react";
import { motion } from "framer-motion";

const ScrollReveal3D = ({ children, className = "", delay = 0, duration = 1 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-150px" }}
      transition={{ 
        duration: duration, 
        delay: delay, 
        ease: "easeOut" 
      }}
      className={className}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal3D;
