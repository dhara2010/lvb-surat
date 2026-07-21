import { useState, useEffect } from 'react';

export function useCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [magneticPosition, setMagneticPosition] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [hoverState, setHoverState] = useState({ state: 'default', text: '' }); // default, pointer, image, card

  useEffect(() => {
    const checkTouch = () => {
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const hasHover = window.matchMedia('(hover: hover)').matches;
      setIsTouchDevice(hasCoarsePointer && !hasHover);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    let lastX = -100;
    let lastY = -100;
    let lastTime = performance.now();
    let currentMagneticTarget = null;
    let isTabActive = true;

    const handleMouseMove = (e) => {
      if (!isTabActive) return;
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);

      const vx = (e.clientX - lastX) / dt;
      const vy = (e.clientY - lastY) / dt;

      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;

      setPosition({ x: e.clientX, y: e.clientY });
      setVelocity({ x: vx, y: vy });

      if (currentMagneticTarget) {
        const rect = currentMagneticTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        setMagneticPosition({
          x: centerX + distanceX * 0.15,
          y: centerY + distanceY * 0.15,
          width: rect.width,
          height: rect.height
        });
      }
    };

    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const closestLinkOrBtn = target.closest('a, button, .cursor-click, .btn-primary, .btn-secondary, nav');
      const closestImage = target.closest('img, .gallery-item, .cursor-view');
      const closestCard = target.closest('.cursor-explore, .member-card, .testimonial-card, article');

      let newState = 'default';
      let text = '';
      currentMagneticTarget = closestLinkOrBtn || closestImage || closestCard;

      if (closestImage || target.tagName.toLowerCase() === 'img') {
        newState = 'image'; text = 'View';
        currentMagneticTarget = closestImage || target;
      } else if (closestCard) {
        newState = 'card'; text = 'Explore';
      } else if (closestLinkOrBtn || window.getComputedStyle(target).cursor === 'pointer') {
        newState = 'pointer'; text = 'Click';
        currentMagneticTarget = closestLinkOrBtn || target;
      } else {
        currentMagneticTarget = null;
        setMagneticPosition(null);
      }

      setHoverState({ state: newState, text });

      if (currentMagneticTarget) {
        const rect = currentMagneticTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        setMagneticPosition({ x: centerX, y: centerY, width: rect.width, height: rect.height });
      }
    };

    const handleMouseOut = () => {
      setHoverState({ state: 'default', text: '' });
      currentMagneticTarget = null;
      setMagneticPosition(null);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isTouchDevice]);

  return { position, velocity, isTouchDevice, hoverState, magneticPosition };
}
