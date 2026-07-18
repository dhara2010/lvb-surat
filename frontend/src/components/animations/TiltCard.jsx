import React, { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";

const TiltCard = ({ children, className = "", scaleMax = 1.05, tiltMax = 15, themeVariant = "dark" }) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [tiltMax, -tiltMax]), { stiffness: 300, damping: 40 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-tiltMax, tiltMax]), { stiffness: 300, damping: 40 });
  const scale = useSpring(isHovered ? scaleMax : 1, { stiffness: 300, damping: 30 });
  
  const background = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${themeVariant === 'dark' ? 'rgba(14,165,168,0.15)' : 'rgba(14,165,168,0.1)'}, transparent 80%)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // For tilt
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
    
    // For glow
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
      }}
      className={`relative w-full group ${className}`}
    >
      {/* Animated Glow Border */}
      <motion.div
        className="absolute -inset-[2px] rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background }}
      />
      
      {/* Main minimal floating card */}
      <div 
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} 
        className={`relative w-full h-full shadow-[0_15px_30px_rgb(0,0,0,0.03)] rounded-[inherit] overflow-hidden bg-white border border-[#E5E7EB] hover:border-gray-200 transition-colors duration-300`}
      >
        <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background }} />
        {children}
      </div>
    </motion.div>
  );
};

export default TiltCard;
