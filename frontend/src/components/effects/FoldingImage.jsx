import React, { useRef, useMemo, useState, useEffect, Suspense, Component } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
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

    // 1. TISSUE PAPER WAVE UNFOLDING (Rippled reveal)
    // Curvature logic: fold the edges towards the middle
    float fold = pow(abs(pos.x * 2.0), 2.0) * (1.0 - uReveal) * 2.5;    
    
    // Intense crumpled tissue wave when hidden (uReveal = 0)
    float crinkleWave = sin(uv.x * 20.0) * cos(uv.y * 20.0) * 0.8 * (1.0 - uReveal);
    
    pos.z -= fold;
    pos.z += crinkleWave;
    
    // Scale on reveal
    pos *= mix(0.7, 1.0, uReveal);

    // 2. CONTINUOUS TISSUE PAPER FLUTTER 
    // Always active rippling surface structural waves representing thin tissue
    float tissueX = sin(uv.x * PI * 4.0 + uTime * 0.8) * 0.04;
    float tissueY = cos(uv.y * PI * 3.0 + uTime * 0.6) * 0.04;
    pos.z += tissueX + tissueY;

    // 3. MOUSE INTENSE HOVER DEFORMATION 
    // Track distance to mouse pointer locally
    float distToMouse = distance(uv, uMouse);
    
    // Intense localized magnetic ripple reacting to mouse movement across surface
    float hoverRipple = sin((distToMouse * 40.0) - (uTime * 20.0)) * 0.06 * exp(-distToMouse * 6.0) * uHover;
    
    // Deep suction pulling the paper up towards the mouse pointer
    float suction = exp(-distToMouse * 5.0) * 0.25 * uHover;
    
    // Bend logic: corners heavily drop backward to simulate the paper being grabbed
    vec2 centerDist = uv - 0.5;
    float cornerBend = dot(centerDist, centerDist) * -0.8 * uHover;
    
    pos.z += suction + hoverRipple + cornerBend;

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
  const { viewport } = useThree();
  
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

  // Dynamic object-cover sizing calculation
  const imageAspect = texture.image ? texture.image.width / texture.image.height : 1;
  const viewportAspect = viewport.width / viewport.height;
  
  let scaleX, scaleY;
  if (imageAspect > viewportAspect) {
    // Image is wider than viewport -> match height
    scaleY = viewport.height;
    scaleX = scaleY * imageAspect;
  } else {
    // Viewport is wider than image -> match width
    scaleX = viewport.width;
    scaleY = scaleX / imageAspect;
  }

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
      scale={[scaleX, scaleY, 1]}
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
// ERROR BOUNDARY FOR WEBGL CRASHES
// --------------------------------------------------------
class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.warn("FoldingImage WebGL Error:", error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// --------------------------------------------------------
// MAIN EXPORT
// --------------------------------------------------------
export default function FoldingImage({ src, alt, className = '' }) {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });
  
  // States: 'checking', 'supported', 'unsupported'
  const [webGLState, setWebGLState] = useState('checking');

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supported = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      setWebGLState(supported ? 'supported' : 'unsupported');
    } catch(e) {
      setWebGLState('unsupported');
    }
  }, []);

  const FallbackImage = (
    <motion.div 
      className={`relative overflow-hidden bg-transparent ${className}`}
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <img 
        loading="lazy" 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(e) => {
          console.warn(`[FoldingImage] Missing image: ${src}`);
          e.target.src = '/KVS_3369-scaled.webp';
        }}
      />
    </motion.div>
  );

  return (
    <div 
      ref={containerRef} 
      className={`interactive-img-container relative group bg-transparent overflow-hidden ${className}`}
      style={{ minHeight: '1px', transform: 'translateZ(0)', WebkitMaskImage: '-webkit-radial-gradient(white, black)' }} // forces hardware composite layer strict clipping
    >
      {webGLState === 'unsupported' && FallbackImage}
      
      {webGLState === 'supported' && (
        <WebGLErrorBoundary fallback={FallbackImage}>
          <Canvas 
            className="w-full h-full absolute inset-0 z-10"
            style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
            camera={{ position: [0, 0, 4.5], fov: 45 }}
            gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false, failIfMajorPerformanceCaveat: true }}
            dpr={[1, 2]}
          >
            <ambientLight intensity={0.5} />
            <Suspense fallback={null}>
              <PaperPlane src={src} inView={inView} />
            </Suspense>
          </Canvas>
        </WebGLErrorBoundary>
      )}
    </div>
  );
}
