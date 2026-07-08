import React from 'react';

const variants = {
  primary: 'bg-[#0B1F3A] text-white hover:bg-opacity-90',
  secondary: 'bg-[#14B8A6] text-white hover:bg-teal-400',
  outline: 'border-2 border-[#0B1F3A] text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white',
  ghost: 'text-gray-600 hover:bg-gray-100 hover:text-[#0B1F3A]',
  gradient: 'bg-gradient-to-r from-[#14B8A6] to-[#0B1F3A] text-white hover:shadow-lg'
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
