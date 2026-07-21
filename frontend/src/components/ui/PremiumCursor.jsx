import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useCursor } from '../../hooks/useCursor';

export default function PremiumCursor() {
  const { position, velocity, isTouchDevice, hoverState, magneticPosition } = useCursor();

  // Motion values for coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // 3D rotation tilts based on cursor velocity
  const rotateXVal = useMotionValue(0);
  const rotateYVal = useMotionValue(0);

  // Springs for outer 3D orb
  const springConfig = { damping: 24, stiffness: 350, mass: 0.5 };
  const smoothCursorX = useSpring(cursorX, springConfig);
  const smoothCursorY = useSpring(cursorY, springConfig);

  // Springs for inner glowing core
  const dotSpringConfig = { damping: 30, stiffness: 700, mass: 0.1 };
  const smoothDotX = useSpring(dotX, dotSpringConfig);
  const smoothDotY = useSpring(dotY, dotSpringConfig);

  // Smooth springs for 3D tilt
  const tiltSpringConfig = { damping: 15, stiffness: 200 };
  const smoothRotateX = useSpring(rotateXVal, tiltSpringConfig);
  const smoothRotateY = useSpring(rotateYVal, tiltSpringConfig);

  const requestRef = useRef(null);

  useEffect(() => {
    if (isTouchDevice) return;

    const updateMotionValues = () => {
      dotX.set(position.x);
      dotY.set(position.y);

      if (magneticPosition) {
        cursorX.set(magneticPosition.x);
        cursorY.set(magneticPosition.y);
      } else {
        cursorX.set(position.x);
        cursorY.set(position.y);
      }

      // Calculate 3D tilt from velocity
      const clampVelocityX = Math.max(-15, Math.min(15, velocity.x * 4));
      const clampVelocityY = Math.max(-15, Math.min(15, velocity.y * 4));
      rotateXVal.set(-clampVelocityY);
      rotateYVal.set(clampVelocityX);

      requestRef.current = requestAnimationFrame(updateMotionValues);
    };

    requestRef.current = requestAnimationFrame(updateMotionValues);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [position, velocity, isTouchDevice, cursorX, cursorY, dotX, dotY, magneticPosition, rotateXVal, rotateYVal]);

  if (isTouchDevice) return null;

  const isHovering = hoverState.state !== 'default';
  let size = 36;
  if (hoverState.state === 'pointer') size = 56;
  if (hoverState.state === 'image') size = 74;
  if (hoverState.state === 'card') size = 62;

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden lg:block"
      style={{ perspective: '800px' }}
    >
      {/* Outer 3D Sphere Orb */}
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full shadow-[0_10px_30px_rgba(4,71,101,0.25)] backdrop-blur-[3px]"
        style={{
          width: size,
          height: size,
          x: smoothCursorX,
          y: smoothCursorY,
          translateX: '-50%',
          translateY: '-50%',
          rotateX: smoothRotateX,
          rotateY: smoothRotateY,
          transformStyle: 'preserve-3d',
          background: hoverState.state === 'image' 
            ? 'radial-gradient(circle at 35% 35%, rgba(14,165,233,0.3) 0%, rgba(4,71,101,0.6) 100%)'
            : 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, rgba(14,165,233,0.2) 50%, rgba(4,71,101,0.35) 100%)',
          border: '1.5px solid rgba(255,255,255,0.6)',
          boxShadow: isHovering 
            ? '0 12px 35px rgba(14,165,233,0.4), inset 0 2px 6px rgba(255,255,255,0.8)' 
            : '0 8px 24px rgba(4,71,101,0.2), inset 0 2px 4px rgba(255,255,255,0.6)'
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: isHovering ? 1.15 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Specular 3D Highlight sheen */}
        <div 
          className="absolute top-1 left-2 w-3 h-2 rounded-full bg-white/70 blur-[0.5px]" 
          style={{ transform: 'translateZ(10px)' }} 
        />

        {/* Hover Label */}
        {hoverState.text && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10px] font-black uppercase tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
            style={{ transform: 'translateZ(15px)' }}
          >
            {hoverState.text}
          </motion.span>
        )}
      </motion.div>

      {/* Inner Glowing 3D Core */}
      <motion.div
        className="absolute left-0 top-0 rounded-full bg-gradient-to-tr from-[#044765] to-[#0EA5E9] border border-white/80 shadow-[0_0_12px_rgba(14,165,233,0.8)]"
        style={{
          width: 10,
          height: 10,
          x: smoothDotX,
          y: smoothDotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{ scale: isHovering ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}
