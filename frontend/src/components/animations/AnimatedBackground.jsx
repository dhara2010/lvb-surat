import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

function MovingSpheres() {
  const groupRef = useRef();
  
  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 2;
  });

  return (
    <group ref={groupRef}>
      {[...Array(12)].map((_, i) => (
        <Float key={i} speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
          <Sphere args={[Math.random() * 1.5 + 0.5, 32, 32]} position={[
            (Math.random() - 0.5) * 30, 
            (Math.random() - 0.5) * 30, 
            (Math.random() - 0.5) * 15 - 5
          ]}>
            <MeshDistortMaterial 
              color="#09475f" 
              attach="material" 
              distort={0.5} 
              speed={1.5} 
              roughness={0.1} 
              metalness={0.1}
              transparent
              opacity={0.15}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
}

export const AnimatedBackground = React.memo(() => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-transparent">
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-multiply z-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
      
      {/* Soft Moving Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-secondary/10 to-transparent blur-[120px] mix-blend-multiply animate-[pulse_8s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-secondary/15 to-transparent blur-[140px] mix-blend-multiply animate-[pulse_10s_ease-in-out_infinite_2s]"></div>

      <Canvas camera={{ position: [0, 0, 15], fov: 60 }} dpr={[1, 2]} className="z-0 opacity-80" events={false}>
        <ambientLight intensity={1.5} color="#ffffff" />
        <directionalLight position={[10, 15, 10]} intensity={1.5} color="#123B5D" />
        <directionalLight position={[-10, 0, -5]} intensity={1.5} color="#1A5485" />
        <directionalLight position={[0, -10, 5]} intensity={1} color="#ffffff" />
        <Stars radius={100} depth={50} count={1500} factor={3} saturation={0} fade speed={1.5} />
        <MovingSpheres />
      </Canvas>
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[40px]" />
    </div>
  );
});
