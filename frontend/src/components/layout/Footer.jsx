import React from 'react';
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
  return (
    <footer className="relative z-10 bg-[#f6f7f9] px-0 pt-8 text-[#334155]">
      <div className="relative mx-auto w-full overflow-hidden rounded-t-[54px] bg-white">
        <div
          className="absolute inset-0 pointer-events-none opacity-80"
          style={{
            backgroundImage: `
              radial-gradient(circle, rgba(14,165,233,0.55) 0 2.5px, transparent 3px),
              linear-gradient(rgba(14,165,233,0.055) 1px, transparent 1px),
              linear-gradient(90deg, rgba(14,165,233,0.055) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 100px 100px',
            backgroundPosition: '62px 22px, 62px 22px, 62px 22px',
          }}
        />

        <div className="relative mx-auto max-w-[1500px] px-6 py-16 sm:px-10 md:py-20 lg:px-20">
          <div className="grid grid-cols-1 gap-14 md:grid-cols-[minmax(0,1fr)_360px] md:gap-20 lg:gap-32">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-start"
            >
              <Link to="/" aria-label="LVB Surat Platinum Homepage" className="cursor-click inline-flex">
                <img
                  src="/LVB_Platinum.svg"
                  alt="LVB Surat Platinum"
                  className="h-14 w-auto object-contain sm:h-16"
                />
              </Link>

              <p className="mt-10 max-w-[460px] text-[20px] leading-[1.58] text-[#475569] sm:text-[22px]">
                Surat's invite-only elite networking chapter for top entrepreneurs, manufacturers, and trade leaders.
                Empowering business growth through powerful connections.
              </p>

              <div className="mt-10 flex items-center gap-5">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="cursor-click flex h-14 w-14 items-center justify-center rounded-[14px] border border-[#dfe7ef] bg-white text-[#0b3f73] shadow-[0_3px_8px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#7dd3fc] hover:text-[#0ea5e9] hover:shadow-[0_12px_26px_rgba(14,165,233,0.22)]"
                  >
                    <Icon className="h-6 w-6" strokeWidth={2.2} />
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.nav
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              aria-label="Footer quick links"
              className="md:justify-self-start"
            >
              <h2 className="text-[26px] font-extrabold uppercase tracking-wide text-[#0b3f73]">
                Quick Links
              </h2>
              <div className="mt-4 h-[3px] w-12 bg-[#0ea5e9]" />

              <ul className="mt-8 flex flex-col gap-6">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="cursor-click group inline-flex items-center gap-3 text-[22px] font-medium text-[#475569] transition-colors duration-300 hover:text-[#0b3f73]"
                    >
                      <ChevronRight className="h-5 w-5 text-[#0ea5e9] transition-transform duration-300 group-hover:translate-x-1" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </div>

          <div className="mt-10 border-t border-[#d7dee8] pt-10 md:mt-12">
            <div className="flex flex-col gap-5 text-[15px] font-medium text-[#64748b] md:flex-row md:items-center md:justify-between">
              <p>© 2026 LVB Surat Platinum. All Rights Reserved.</p>
              <p>
                Design & Developed by{' '}
                <a
                  href="https://kpglobalbusiness.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-click font-extrabold text-[#0ea5e9] transition-colors duration-300 hover:text-[#0b3f73]"
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
