import React from 'react';

export default function Card({ 
  children, 
  className = '', 
  hover = true, 
  glass = false,
  padding = 'p-8',
  rounded = 'rounded-2xl',
  border = 'border-gray-100',
  shadow = 'shadow-sm'
}) {
  const baseStyle = `bg-white border ${border} ${rounded} ${padding} ${shadow} transition-all duration-300 relative`;
  const hoverStyle = hover ? 'hover:shadow-lg hover:-translate-y-1 group cursor-pointer' : '';
  const glassStyle = glass ? 'bg-white/80 backdrop-blur-lg border-white/20' : '';

  return (
    <div className={`${baseStyle} ${hoverStyle} ${glassStyle} ${className}`}>
      {children}
    </div>
  );
}
