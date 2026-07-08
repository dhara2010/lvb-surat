  import React from 'react';
  import { motion } from 'framer-motion';
  import { Link } from 'react-router-dom';
  import { ArrowRight } from 'lucide-react';

  export default function Hero() {
    return (
      <div className="relative w-full h-[100vh] min-h-[900px] flex items-center overflow-hidden bg-[#0a0f16]">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
        >
          <img
            src="/KVS_3369-2048x1365.jpg"
            alt="LVB Surat Platinum Background"
            className="w-full h-full object-cover object-center"
            onError={(e) => { e.target.src = '/KVS_3369-scaled.jpg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#081321]/80 via-[#081321]/45 to-black/20"></div>
        </motion.div>
      </div>
    );
  }