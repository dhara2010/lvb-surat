import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useInView } from 'framer-motion';

// --------------------------------------------------------
// LUSION STYLE PAPER SHADER
// --------------------------------------------------------
const vertexShader = `
  uniform float uTime;
  uniform float uHover;
  uniform vec2 uMouse;
  uniform float uReveal; // 0 = folded/hidden, 1 = open

  varying vec2 vUv;
  varying float vElevation;

  #define PI 3.1415926535897932384626433832795

  void main() {
    vUv = uv;
    vec3 pos = position;

    // 1. REVEAL UNFOLDING (Paper unfolding from center)
    // Curvature logic: fold the edges towards the middle
    float fold = pow(abs(pos.x * 2.0), 2.0) * (1.0 - uReveal) * 2.0;    
    pos.z -= fold;
    
    // Scale on reveal
    pos *= mix(0.5, 1.0, uReveal);

    // 2. MOUSE BEND DEFORMATION
    // Track distance to mouse pointer locally
    float distToMouse = distance(uv, uMouse);
    float mouseReact = exp(-distToMouse * 3.0) * 0.2 * uHover;
    
    // Slight overall wave lifting the paper towards the cursor
    float wave = sin(uv.x * PI + uTime) * cos(uv.y * PI + uTime) * 0.05 * uHover;
    
    // Bend logic: corners react opposite to center mass
    vec2 centerDist = uv - 0.5;
    float cornerBend = dot(centerDist, centerDist) * -0.5 * uHover;
    
    pos.z += mouseReact + wave + cornerBend;

    vElevation = pos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uReveal;
  uniform float uHover;
  
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    // Sample texture
    vec4 texColor = texture2D(uTexture, vUv);
    
    // Shadow shading driven geometrically by z elevation (removed aggressive darkening to maintain full brightness)
    vec3 color = texColor.rgb;
    
    // Alpha transitions smoothly on reveal
    float alpha = texColor.a * smoothstep(0.0, 0.4, uReveal);

    gl_FragColor = vec4(color, alpha);
  }
`;

// --------------------------------------------------------
// WEBGL PLANE MESH
// --------------------------------------------------------
const PaperPlane = ({ src, inView }) => {
  const meshRef = useRef();
  const texture = useTexture(src);
  
  // Track continuous target values for spring inertia
  const target = useRef({
    reveal: 0,
    hover: 0,
    mouse: new THREE.Vector2(0.5, 0.5), // Center local space
    rotX: 0,
    rotY: 0
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uHover: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uReveal: { value: 0 },
    uTexture: { value: texture }
  }), [texture]);

  // Adjust aspect ratio manually
  const aspect = texture.image ? texture.image.width / texture.image.height : 1;

  useEffect(() => {
    // When section enters viewport, trigger unfold parameter
    target.current.reveal = inView ? 1 : 0;
  }, [inView]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const mat = meshRef.current.material;
    
    // Spring physics interpolations
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uReveal.value = THREE.MathUtils.lerp(mat.uniforms.uReveal.value, target.current.reveal, 0.05);
    mat.uniforms.uHover.value = THREE.MathUtils.lerp(mat.uniforms.uHover.value, target.current.hover, 0.08);
    mat.uniforms.uMouse.value.lerp(target.current.mouse, 0.1);

    // Apply entire mesh subtle tilt rotation based on mouse
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, target.current.rotX, 0.05);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, target.current.rotY, 0.05);
  });

  const handlePointerMove = (e) => {
    // Calculate relative local UV position inside element
    target.current.mouse.set(e.uv.x, e.uv.y);
    
    // Rotation mapping for 3D card tilt
    target.current.rotY = (e.uv.x - 0.5) * 0.5; // Look at mouse
    target.current.rotX = -(e.uv.y - 0.5) * 0.5;
  };

  return (
    <mesh 
      ref={meshRef}
      onPointerOver={() => target.current.hover = 1}
      onPointerOut={() => {
        target.current.hover = 0;
        target.current.rotX = 0;
        target.current.rotY = 0;
      }}
      onPointerMove={handlePointerMove}
      scale={[aspect * 4, 4, 1]}
    >
      {/* High division plane to allow dense vertex bending */}
      <planeGeometry args={[1, 1, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
};

// --------------------------------------------------------
// MAIN EXPORT
// --------------------------------------------------------
export default function FoldingImage({ src, alt, className = '' }) {
  const [isMobile, setIsMobile] = useState(false);
  const [validSrc, setValidSrc] = useState(null);
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    // Pre-validate image so Three.js doesn't crash on 404s
    const img = new window.Image();
    img.src = src;
    img.onload = () => setValidSrc(src);
    img.onerror = () => setValidSrc('/KVS_3369-scaled.webp'); // Fallback image for missing textures
  }, [src]);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsMobile(true);
    }
  }, []);

  if (isMobile) {
    return (
      <motion.div 
        ref={containerRef}
        className={`relative overflow-hidden shadow-none bg-transparent ${className}`}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {validSrc && <img loading="lazy" src={validSrc} alt={alt} className="w-full h-full object-cover" />}
      </motion.div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`interactive-img-container relative group bg-transparent ${className}`}
    >
      {validSrc && (
        <Canvas 
          className="w-full h-full absolute inset-0 z-10"
          camera={{ position: [0, 0, 4.5], fov: 45 }}
          gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.5} />
          <Suspense fallback={null}>
            <PaperPlane src={validSrc} inView={inView} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
