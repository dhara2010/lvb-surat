import React from'react';

export default function LuxuryButton({ children, className ='', as ='button', ...props }) {
  const Component = as;
  return (
    <Component
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-500 ease-out group ${className}`}
      style={{
        backgroundColor:'#090E14',
        }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Hover Background overlay */}
      <div 
        className="absolute inset-0 z-0 scale-y-0 origin-bottom transition-transform duration-500 ease-out group-hover:scale-y-100"
        style={{
          backgroundColor:'#4FA3D1',
        }}
      />

      {/* Shared subtle shadow, amplifies on hover via Tailwind group-hover if needed, but styling directly here */}
      <div 
        className="absolute inset-0 rounded-full z-[-1] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow:'0 20px 50px rgba(79,163,209,0.4)'
        }}
      />
    </Component>
  );
}
