import React from 'react';
import { motion } from 'framer-motion';

export default function BackgroundVideo() {
  return (
    <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none overflow-hidden bg-primary">
      {/* Background Video with Slow Zoom Effect */}
      <motion.video
        src="/video.mp4"
        autoPlay
        loop
        muted
        playsInline
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark/Blue Overlay Layer for Readability */}
      <div
        className="absolute inset-0 z-10"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
      ></div>
    </div>
  );
}
