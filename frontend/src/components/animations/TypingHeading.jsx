import React, { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';

const TypingHeading = React.memo(({
  text,
  children,
  speed = 40, // milliseconds per character
  delay = 0, // seconds
  cursor = "|",
  cursorBlink = true,
  once = true,
  el: Wrapper = 'h2',
  className = '',
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.2 });
  
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(false);

  // Count total characters structurally to ensure the loop stops accurately
  let totalCharsCount = 0;
  const countChars = (node) => {
    React.Children.forEach(node, child => {
      if (typeof child === 'string') totalCharsCount += child.length;
      else if (React.isValidElement(child)) countChars(child.props.children);
    });
  };
  countChars(text ? text : children);

  useEffect(() => {
    if (!isInView) return;
    
    let animationFrameId;
    let startTime = null;
    let isCancelled = false;
    const delayMs = delay * 1000;
    
    const startTyping = (timestamp) => {
      if (isCancelled) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      if (elapsed > delayMs) {
        setShowCursor(true);
        const typingElapsed = elapsed - delayMs;
        const currentTargetIndex = Math.floor(typingElapsed / speed);
        
        if (currentTargetIndex >= totalCharsCount) {
          setActiveIndex(totalCharsCount);
          setIsComplete(true);
        } else {
          setActiveIndex(currentTargetIndex);
          animationFrameId = requestAnimationFrame(startTyping);
        }
      } else {
        animationFrameId = requestAnimationFrame(startTyping);
      }
    };

    animationFrameId = requestAnimationFrame(startTyping);
    return () => {
      isCancelled = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, delay, speed, totalCharsCount]);

  // Handle cursor blinks after completion
  useEffect(() => {
    if (isComplete) {
      let blinks = 0;
      const interval = setInterval(() => {
        blinks++;
        setShowCursor(prev => !prev);
        if (blinks >= 6) { // 3 full cycles
          clearInterval(interval);
          setShowCursor(false);
        }
      }, 450);
      return () => clearInterval(interval);
    }
  }, [isComplete]);

  const counter = { count: 0 };
  
  const renderTextNodes = (str) => {
    // Split by words to preserve natural native wrapping
    return str.split(/(\s+)/).map((word, wordIdx) => {
      if (word.trim() === '') {
        // Render spaces
        return word.split('').map((char, charIdx) => {
          const currentIndex = counter.count++;
          const isRevealed = activeIndex >= currentIndex;
          const isCursorPos = currentIndex === activeIndex;
          return (
            <span key={`${wordIdx}-${charIdx}`} className="relative inline-block" style={{ whiteSpace: 'pre' }}>
              <span style={{ opacity: isRevealed ? 1 : 0, transition: 'opacity 0.05s ease-out' }}>{char}</span>
              {isCursorPos && showCursor && (
                <span className={`absolute top-0 -ml-[2px] font-thin ${cursorBlink ? 'animate-[pulse_0.9s_ease-in-out_infinite]' : ''}`} style={{ color: 'inherit' }}>{cursor}</span>
              )}
            </span>
          );
        });
      }
      
      // Render text word
      return (
        <span key={wordIdx} className="inline-block whitespace-nowrap">
          {word.split('').map((char, charIdx) => {
            const currentIndex = counter.count++;
            const isRevealed = activeIndex >= currentIndex;
            const isCursorPos = currentIndex === activeIndex;
            return (
              <span key={charIdx} className="relative inline-block">
                <span style={{ opacity: isRevealed ? 1 : 0, transition: 'opacity 0.05s ease-out' }}>
                  {char}
                </span>
                {isCursorPos && showCursor && (
                  <span className={`absolute top-0 -mr-[4px] font-thin ${cursorBlink ? 'animate-[pulse_0.9s_ease-in-out_infinite]' : ''}`} style={{ color: 'inherit' }}>
                    {cursor}
                  </span>
                )}
              </span>
            );
          })}
        </span>
      );
    });
  };

  const processChildren = (childNodes) => {
    return React.Children.map(childNodes, (child) => {
      if (typeof child === 'string') return renderTextNodes(child);
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          children: processChildren(child.props.children)
        });
      }
      return child;
    });
  };

  const isInitialCursor = activeIndex === -1 && showCursor;

  return (
    <Wrapper ref={ref} className={`${className} m-0`} {...props}>
      <span className="sr-only">{text || "Heading"}</span>
      <span aria-hidden="true" className="relative inline-block w-full">
        {isInitialCursor && (
           <span className={`absolute left-0 top-0 font-thin ${cursorBlink ? 'animate-[pulse_0.9s_ease-in-out_infinite]' : ''}`} style={{ color: 'inherit' }}>
             {cursor}
           </span>
        )}
        {text ? renderTextNodes(text) : processChildren(children)}
      </span>
    </Wrapper>
  );
});

export default TypingHeading;
