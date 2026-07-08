import React from 'react';

export default function Container({ children, className = '' }) {
  return (
    <div className={`w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 ${className}`}>
      {children}
    </div>
  );
}
