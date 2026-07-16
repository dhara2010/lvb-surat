import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
function ParticleField() {
  const ref = useRef();
  // Using an array of 2000 points
  const positions = new Float32Array(2000 * 3);
  for (let i = 0; i < 2000; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#0EA5A8" size={0.02} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
      </Points>
    </group>
  );
}

import HeroVideo from '../../../components/video/HeroVideo';

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <motion.div 
      style={{ y, opacity }}
      className="relative w-full h-[100svh] flex items-center justify-center overflow-hidden"
    >
      <HeroVideo />

      {/* 3D Particle overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none mix-blend-screen">
        <Canvas camera={{ position: [0, 0, 1] }} events={false}>
          <ParticleField />
        </Canvas>
      </div>
    </motion.div>
  );
}