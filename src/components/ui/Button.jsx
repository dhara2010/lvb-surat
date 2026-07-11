import React from 'react';

const variants = {
  primary: 'bg-[#044765] text-white hover:bg-opacity-90',
  secondary: 'bg-[#0EA5A8] text-white hover:bg-[#0EA5A8]',
  outline: 'border-2 border-[#044765] text-[#044765] hover:bg-[#044765] hover:text-white',
  ghost: 'text-[#1F2937] hover:bg-gray-100 hover:text-[#044765]',
  gradient: 'bg-gradient-to-r from-[#0EA5A8] to-[#044765] text-white hover:shadow-lg'
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3',
  lg: 'px-8 py-4 text-lg'
};

export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  return (
    <button
      className={`font-semibold rounded-full transition-all duration-300 flex items-center justify-center ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
