import React from 'react';
import ScrollReveal3D from '../animations/ScrollReveal3D';
import Container from '../layout/Container';

export default function PageHeader({ label, title, description, alignment = 'left' }) {
  const alignClass = alignment === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';
  const textCenterClass = alignment === 'center' ? 'mx-auto' : '';

  return (
    <div className="pt-24 md:pt-28 lg:pt-32 bg-transparent flex flex-col w-full relative z-10 overflow-hidden">
      <Container>
        <div className={`flex flex-col ${alignClass} w-full`}>
          {label && (
            <ScrollReveal3D>
              <span className="inline-block text-secondary font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-4 md:mb-5">
                {label}
              </span>
            </ScrollReveal3D>
          )}
          {title && (
            <ScrollReveal3D delay={0.1}>
<<<<<<< HEAD
              <h1 className={`text-3xl md:text-4xl lg:text-4xl xl:text-4xl font-extrabold text-primary leading-tight max-w-3xl ${textCenterClass} mb-5 md:mb-6`}>
=======
              <h1 className={`text-3xl md:text-4xl lg:text-4xl xl:text-4xl font-extrabold text-black leading-tight max-w-3xl ${textCenterClass} mb-5 md:mb-6`}>
>>>>>>> 4c81fa0 (home page done)
                {title}
              </h1>
            </ScrollReveal3D>
          )}
          {description && (
            <ScrollReveal3D delay={0.2}>
              <p className={`text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl ${textCenterClass}`}>
                {description}
              </p>
            </ScrollReveal3D>
          )}
        </div>
      </Container>
    </div>
  );
}
