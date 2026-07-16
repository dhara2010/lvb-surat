import React from "react";
import { motion } from "framer-motion";

export function SlideIn({ children, direction = "left", delay = 0, duration = 0.8, className = "" }) {
  const x = direction === "left" ? -50 : direction === "right" ? 50 : 0;
  return (
    <motion.div
      initial={{ opacity: 0, x }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
