import React, { useState, useEffect } from 'react';

export default function TypewriterText({ text, speed = 18, className = '' }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsDone(false);

    if (!text) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsDone(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayedText}
      {!isDone && (
        <span className="inline-block w-[3px] h-[1em] ml-1 bg-[#0EA5E9] animate-pulse align-middle rounded-full" />
      )}
    </span>
  );
}
