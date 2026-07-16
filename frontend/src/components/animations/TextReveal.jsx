import React from "react";
import { motion, useInView } from "framer-motion";

export function TextReveal({ children, delay = 0, className = "" }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay * 0.1 },
    },
  };

  const childVariant = {
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 100 } },
    hidden: { opacity: 0, y: 30, transition: { type: "spring", damping: 20, stiffness: 100 } },
  };

  return (
    <motion.div ref={ref} variants={container} initial="hidden" animate={isInView ? "visible" : "hidden"} className={className}>
      {React.Children.map(children, (child) => (
        <motion.span variants={childVariant} style={{ display: "inline-block" }}>
          {child}
        </motion.span>
      ))}
    </motion.div>
  );
}
