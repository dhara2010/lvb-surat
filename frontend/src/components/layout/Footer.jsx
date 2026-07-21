import React, { useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Members', href: '/members' },
  { label: 'Contact', href: '/contact' },
];

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/lvb_platinum_surat/',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <path d="M17.5 6.5h.01" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/lvb-surat-platinum-9b7367419/',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export default function Footer() {
  const footerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const footer = footerRef.current;
    const grid = gridRef.current;
    if (!footer || !grid) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (reduceMotion || coarsePointer) return undefined;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frameId = null;

    const animateGrid = () => {
      current.x += (target.x - current.x) * 0.09;
      current.y += (target.y - current.y) * 0.09;

      grid.style.setProperty('--grid-x', `${current.x.toFixed(2)}px`);
      grid.style.setProperty('--grid-y', `${current.y.toFixed(2)}px`);

      const isMoving = Math.abs(target.x - current.x) > 0.02 || Math.abs(target.y - current.y) > 0.02;
      frameId = isMoving ? requestAnimationFrame(animateGrid) : null;
    };

    const requestGridFrame = () => {
      if (frameId === null) frameId = requestAnimationFrame(animateGrid);
    };

    const handlePointerMove = (event) => {
      const rect = footer.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

      target.x = x * -10;
      target.y = y * -8;
      requestGridFrame();
    };

    const handlePointerLeave = () => {
      target.x = 0;
      target.y = 0;
      requestGridFrame();
    };

    footer.addEventListener('pointermove', handlePointerMove, { passive: true });
    footer.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      footer.removeEventListener('pointermove', handlePointerMove);
      footer.removeEventListener('pointerleave', handlePointerLeave);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <footer className="relative z-10 w-full bg-[#f6f7f9] px-3 py-5 text-[#334155] sm:px-6 lg:py-7">
      <div
        ref={footerRef}
        className="relative mx-auto w-full max-w-[1500px] overflow-hidden rounded-[34px] border border-[#e2e8f0] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] md:rounded-[48px]"
      >
        <div
          ref={gridRef}
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            '--grid-x': '0px',
            '--grid-y': '0px',
            backgroundImage: 'radial-gradient(circle, #38bdf8 0 2.1px, transparent 2.45px)',
            backgroundSize: '38px 38px',
            backgroundPosition: 'calc(19px + var(--grid-x)) calc(19px + var(--grid-y))',
          }}
        />

        <div className="relative mx-auto max-w-[1360px] px-6 py-10 sm:px-10 md:py-14 lg:px-14 lg:py-16">
          <div className="grid grid-cols-1 gap-9 md:grid-cols-[minmax(0,1fr)_300px] md:items-start lg:gap-20">
            <div className="flex flex-col items-start">
              <Link to="/" aria-label="LVB Surat Platinum Homepage" className="cursor-click inline-flex">
                <img
                  src="/LVB_Platinum.svg"
                  alt="LVB Surat Platinum"
                  className="h-11 w-auto object-contain sm:h-14"
                />
              </Link>

              <p className="mt-5 max-w-[440px] text-sm font-normal leading-relaxed text-[#475569] sm:text-base">
                Surat's invite-only elite networking chapter for top entrepreneurs, manufacturers, and trade leaders.
                Empowering business growth through powerful connections.
              </p>

              <div className="mt-7 flex items-center gap-4">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="cursor-click flex h-11 w-11 items-center justify-center rounded-[12px] border border-[#dfe7ef] bg-white text-[#0b3f73] shadow-sm transition-all duration-300 hover:border-[#38bdf8] hover:text-[#0ea5e9] hover:shadow-md"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            <nav aria-label="Footer quick links" className="md:justify-self-start">
              <h2 className="text-base font-extrabold uppercase tracking-wide text-[#0b3f73] sm:text-lg">
                Quick Links
              </h2>
              <div className="mt-2 h-[3px] w-10 rounded-full bg-[#0ea5e9]" />

              <ul className="mt-5 flex flex-col gap-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="cursor-click group inline-flex items-center gap-2 text-sm font-medium text-[#475569] transition-colors duration-300 hover:text-[#0b3f73] sm:text-base"
                    >
                      <ChevronRight className="h-4 w-4 text-[#0ea5e9] transition-transform duration-300 group-hover:translate-x-1" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-8 border-t border-[#e2e8f0] pt-6 md:mt-9">
            <div className="flex flex-col gap-3 text-xs font-medium text-[#64748b] sm:text-sm md:flex-row md:items-center md:justify-between">
              <p>&copy; 2026 LVB Surat Platinum. All Rights Reserved.</p>
              <p>
                Design & Developed by{' '}
                <a
                  href="https://kpglobalbusiness.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-click font-extrabold text-[#0ea5e9] transition-colors duration-300 hover:text-[#0b3f73] hover:underline"
                >
                  KP Global Business
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
