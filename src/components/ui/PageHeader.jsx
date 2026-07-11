import React from 'react';
import { SlideUp } from '../animations/SlideUp';
import Container from '../layout/Container';

export default function PageHeader({ label, title, description, alignment = 'left' }) {
  const alignClass = alignment === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';
  const textCenterClass = alignment === 'center' ? 'mx-auto' : '';

  return (
    <div className="pt-24 md:pt-28 lg:pt-32 bg-transparent flex flex-col w-full relative z-10 overflow-hidden">
      <Container>
        <div className={`flex flex-col ${alignClass} w-full`}>
          {label && (
            <SlideUp>
              <span className="inline-block text-secondary font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-4 md:mb-5">
                {label}
              </span>
            </SlideUp>
          )}
          {title && (
            <SlideUp delay={0.1}>
              <h1 className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-primary leading-tight max-w-3xl ${textCenterClass} mb-5 md:mb-6`}>
                {title}
              </h1>
            </SlideUp>
          )}
          {description && (
            <SlideUp delay={0.2}>
              <p className={`text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl ${textCenterClass}`}>
                {description}
              </p>
            </SlideUp>
          )}
        </div>
      </Container>
    </div>
  );
}
