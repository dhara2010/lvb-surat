import { useState, useEffect, useCallback } from 'react';

export function useCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [magneticPosition, setMagneticPosition] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [hoverState, setHoverState] = useState({ state: 'default', text: '' }); // default, pointer, image, card

  useEffect(() => {
    // Check if device supports hover
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);

    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    let rafId;
    let isTabActive = true;
    let currentMagneticTarget = null;

    const handleMouseMove = (e) => {
      if (!isTabActive) return;
      
      const nextPosition = { x: e.clientX, y: e.clientY };
      setPosition(nextPosition);

      if (currentMagneticTarget) {
        const rect = currentMagneticTarget.getBoundingClientRect();
        // Snap to center of the element, gently pulling towards the mouse
        // But the requirement is "magnetic attraction" so snapping to center with slight mouse influence
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Let's create a subtle pulling effect where it doesn't just lock to center, but pulls.
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        
        setMagneticPosition({
          x: centerX + distanceX * 0.1, // 10% follow
          y: centerY + distanceY * 0.1,
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
      
      // Determine what is being hovered over
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
      cancelAnimationFrame(rafId);
    };
  }, [isTouchDevice]);

  return { position, isTouchDevice, hoverState, magneticPosition };
}
