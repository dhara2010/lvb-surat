import React from 'react';

export default function Container({ children, className = '' }) {
  return (
    <div className={`w-full max-w-7xl mx-auto px-6 md:px-10 ${className}`}>
      {children}
    </div>
  );
}
