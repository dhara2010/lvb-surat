import React from 'react';

const variants = {
  primary: 'bg-primary text-white hover:bg-opacity-90',
  secondary: 'bg-secondary text-white hover:bg-secondary',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  ghost: 'text-body hover:bg-gray-100 hover:text-primary',
  gradient: 'bg-gradient-to-r from-secondary to-primary text-white hover:shadow-lg'
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
