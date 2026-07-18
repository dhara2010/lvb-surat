import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const TextReveal = React.memo(({
  children,
  text,
  el: Wrapper = 'h2',
  className = '',
  once = true,
  delay = 0,
  splitBy = 'char', // 'char' | 'word'
  stagger = null,
  duration = 0.9,
  direction = 'up',
  onComplete,
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.2 });

  const staggerValue = stagger !== null ? stagger : (splitBy === 'word' ? 0.04 : 0.015);

  const getDirectionOffset = () => {
    switch (direction) {
      case 'down': return { y: -30, x: 0 };
      case 'left': return { y: 0, x: 30 };
      case 'right': return { y: 0, x: -30 };
      case 'up':
      default: return { y: 30, x: 0 };
    }
  };

  const offset = getDirectionOffset();

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerValue,
        delayChildren: delay,
      }
    }
  };

  const childVariant = {
    hidden: {
      opacity: 0,
      y: offset.y,
      x: offset.x,
      filter: 'blur(12px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 24,
        stiffness: 120,
        mass: 1,
        bounce: 0,
        duration: duration,
      }
    }
  };

  const renderText = (str) => {
    if (splitBy === 'char') {
      return str.split(/(\s+)/).map((word, wordIdx) => {
        if (word.trim() === '') {
          return <span key={wordIdx} className="" style={{ whiteSpace: 'pre' }}>{word}</span>;
        }
        return (
          <span key={wordIdx} className="inline-block" style={{ whiteSpace: 'nowrap' }}>
            {word.split('').map((char, charIdx) => (
              <motion.span key={charIdx} variants={childVariant} className="inline-block">{char}</motion.span>
            ))}
          </span>
        );
      });
    } else {
      return str.split(/(\s+)/).map((word, wordIdx) => {
        if (word.trim() === '') {
          return <span key={wordIdx} className="" style={{ whiteSpace: 'pre' }}>{word}</span>;
        }
        return (
          <motion.span key={wordIdx} variants={childVariant} className="inline-block">
            {word}
          </motion.span>
        );
      });
    }
  };

  const processChildren = (childNodes) => {
    return React.Children.map(childNodes, (child) => {
      if (typeof child === 'string') {
        return renderText(child);
      }
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          children: processChildren(child.props.children)
        });
      }
      return child;
    });
  };

  return (
    <Wrapper ref={ref} className={className} {...props}>
      {text && <span className="sr-only">{text}</span>}
      <motion.span
        variants={container}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        onAnimationComplete={onComplete}
        aria-hidden={text ? "true" : undefined}
        className="inline-block w-full"
      >
        {text ? renderText(text) : processChildren(children)}
      </motion.span>
    </Wrapper>
  );
});

export default TextReveal;
