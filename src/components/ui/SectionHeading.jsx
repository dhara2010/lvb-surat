import React from 'react';
import { SlideUp } from '../animations/SlideUp';

export default function SectionHeading({ label, title, subtitle, highlight, align = 'center', className = '' }) {
  const alignmentClass = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left';

  return (
    <div className={`flex flex-col max-w-2xl px-4 mb-16 ${alignmentClass} ${className}`}>
      {label && (
        <SlideUp>
          <span className="inline-block text-[#0B1F3A] font-bold tracking-[0.2em] uppercase text-xs mb-4">
            {label}
          </span>
        </SlideUp>
      )}
      {title && (
        <SlideUp delay={0.1}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0B1F3A] tracking-tight leading-[1.1] mb-5">
            {title} {highlight && <span className="text-[#14B8A6]">{highlight}</span>}
          </h2>
        </SlideUp>
      )}
      {subtitle && (
        <SlideUp delay={0.2}>
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed">
            {subtitle}
          </p>
        </SlideUp>
      )}
    </div>
  );
}
