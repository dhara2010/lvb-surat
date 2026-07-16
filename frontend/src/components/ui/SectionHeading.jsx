import React from 'react';
import ScrollReveal3D from '../animations/ScrollReveal3D';

export default function SectionHeading({ label, title, subtitle, highlight, align = 'center', className = '' }) {
  const alignmentClass = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left';

  return (
    <div className={`flex flex-col max-w-2xl px-4 mb-16 ${alignmentClass} ${className}`}>
      {label && (
        <ScrollReveal3D>
          <span className="inline-block text-primary font-bold tracking-[0.2em] uppercase text-xs mb-4">
            {label}
          </span>
        </ScrollReveal3D>
      )}
      {title && (
        <ScrollReveal3D delay={0.1}>
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-extrabold text-primary tracking-tight leading-[1.1] mb-5">
            {title} {highlight && <span className="text-secondary">{highlight}</span>}
          </h2>
        </ScrollReveal3D>
      )}
      {subtitle && (
        <ScrollReveal3D delay={0.2}>
          <p className="text-muted text-lg md:text-xl leading-relaxed">
            {subtitle}
          </p>
        </ScrollReveal3D>
      )}
    </div>
  );
}
