import React from "react";
import { motion } from "framer-motion";

const FadeReveal = ({ children, className = "", delay = 0, direction = "up", distance = 40, duration = 0.8 }) => {
  let initial = {};
  switch (direction) {
    case "up":
      initial = { opacity: 0, y: distance };
      break;
    case "down":
      initial = { opacity: 0, y: -distance };
      break;
    case "left":
      initial = { opacity: 0, x: distance };
      break;
    case "right":
      initial = { opacity: 0, x: -distance };
      break;
    case "none":
    default:
      initial = { opacity: 0 };
      break;
  }

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeReveal;
