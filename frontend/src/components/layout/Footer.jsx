import React, { useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

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
  const containerRef = useRef(null);

  // Measure scroll progress when approaching the footer
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  // Smooth Parallax Transformations for the Curtain Reveal
  const y = useTransform(scrollYProgress, [0, 1], [-90, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#f6f7f9] pt-4"
      style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
    >
      {/* Sticky Reveal Container */}
      <div className="relative w-full">
        <motion.footer 
          style={{ y, scale, opacity }}
          className="sticky bottom-0 z-0 bg-[#f6f7f9] px-3 sm:px-8 pt-4 pb-6 text-[#334155]"
        >
          <div className="relative mx-auto w-full max-w-[1500px] overflow-hidden rounded-[36px] md:rounded-[54px] bg-white border border-[#e2e8f0] shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
            {/* Exact Cyan Dot Grid Background Pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-60"
              style={{
                backgroundImage: `radial-gradient(circle, #38bdf8 0 2.2px, transparent 2.5px)`,
                backgroundSize: '38px 38px',
                backgroundPosition: '19px 19px',
              }}
            />

            <div className="relative mx-auto max-w-[1400px] px-6 py-12 sm:px-12 md:py-16 lg:px-16">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-24">
                
                {/* Brand Info Column */}
                <div className="flex flex-col items-start">
                  <Link to="/" aria-label="LVB Surat Platinum Homepage" className="cursor-click inline-flex">
                    <img
                      src="/LVB_Platinum.svg"
                      alt="LVB Surat Platinum"
                      className="h-12 w-auto object-contain sm:h-14"
                    />
                  </Link>

                  <p className="mt-6 max-w-[440px] text-sm sm:text-base leading-relaxed text-[#475569] font-normal">
                    Surat's invite-only elite networking chapter for top entrepreneurs, manufacturers, and trade leaders.
                    Empowering business growth through powerful connections.
                  </p>

                  {/* 3D Interactive Social Icons */}
                  <div className="mt-8 flex items-center gap-4">
                    {socialLinks.map(({ label, href, icon: Icon }) => (
                      <motion.a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={label}
                        whileHover={{ scale: 1.1, y: -3, rotateZ: 2 }}
                        whileTap={{ scale: 0.95 }}
                        className="cursor-click flex h-11 w-11 items-center justify-center rounded-[12px] border border-[#dfe7ef] bg-white text-[#0b3f73] shadow-sm transition-all duration-300 hover:border-[#38bdf8] hover:text-[#0ea5e9] hover:shadow-md"
                      >
                        <Icon className="h-5 w-5" strokeWidth={2.2} />
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Quick Links Column */}
                <nav aria-label="Footer quick links" className="md:justify-self-start">
                  <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-[#0b3f73]">
                    Quick Links
                  </h2>
                  <div className="mt-2 h-[3px] w-10 rounded-full bg-[#0ea5e9]" />

                  <ul className="mt-6 flex flex-col gap-3.5">
                    {quickLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          to={link.href}
                          className="cursor-click group inline-flex items-center gap-2 text-sm sm:text-base font-medium text-[#475569] transition-colors duration-300 hover:text-[#0b3f73]"
                        >
                          <ChevronRight className="h-4 w-4 text-[#0ea5e9] transition-transform duration-300 group-hover:translate-x-1" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Bottom Bar */}
              <div className="mt-10 border-t border-[#e2e8f0] pt-8 md:mt-12">
                <div className="flex flex-col gap-4 text-xs sm:text-sm font-medium text-[#64748b] md:flex-row md:items-center md:justify-between">
                  <p>© 2026 LVB Surat Platinum. All Rights Reserved.</p>
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
        </motion.footer>
      </div>
    </div>
  );
}
