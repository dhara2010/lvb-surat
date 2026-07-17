import React from "react";
import { motion } from "framer-motion";

export function FadeUp({ children, delay = 0, duration = 0.8, className = "" }) {
  return (
    <motion.div
<<<<<<< HEAD
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration, delay, ease: "easeOut" }}
=======
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
>>>>>>> 4c81fa0 (home page done)
      className={className}
    >
      {children}
    </motion.div>
  );
}
