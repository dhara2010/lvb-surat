import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Magnetic from '../animations/Magnetic';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Events', path: '/events' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Members', path: '/members' },
  { label: 'Contact', path: '/contact' },
];


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();

  /* ── Scroll shadow ──────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Close mobile menu on resize to desktop ─── */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── Close mobile menu on route change ─── */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        style={{
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.75)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          boxShadow: scrolled ? '0 10px 40px -10px rgba(0,0,0,0.08)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(9, 71, 95, 0.05)' : '1px solid transparent',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        role="banner"
      >
        <div
          className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 transition-all duration-500"
          style={{ height: scrolled ? '80px' : '100px' }}
        >

          {/* ── Logo ──────────────────────────── */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 group cursor-pointer"
            aria-label="LVB Surat Platinum — Homepage"
          >
            {logoError ? (
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center text-[10px] md:text-xs font-extrabold tracking-wider"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                    color: 'var(--color-secondary)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  LVB
                </div>
                <div className="flex flex-col leading-none">
                  <span
                    className="font-bold tracking-wider text-xs md:text-sm"
                    style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-sans)' }}
                  >
                    LVB SURAT
                  </span>
                  <span
                    className="text-[8px] md:text-[9px] tracking-[0.1em] md:tracking-[0.18em] uppercase mt-0.5"
                    style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-sans)' }}
                  >
                    Platinum Chapter
                  </span>
                </div>
              </div>
            ) : (
              <img
                src="/LVB_Platinum.svg"
                alt="LVB Surat Platinum"
                className="h-8 md:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                onError={() => setLogoError(true)}
              />
            )}
          </Link>

          {/* ── Desktop Navigation ───────────── */}
          <nav
            className="hidden lg:flex items-center gap-4 xl:gap-8"
            aria-label="Primary navigation"
          >
            {NAV_LINKS.map((link) => (
              <Magnetic strength={0.3} key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) => `
                    relative px-1 py-2 text-sm xl:text-base font-bold tracking-widest uppercase transition-colors duration-300 cursor-pointer
                    ${isActive ? 'active' : 'opacity-80 hover:opacity-100'}
                  `}
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--color-primary)' : 'var(--color-primary)',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <motion.span
                        className="absolute -bottom-1 left-0 h-[3px] rounded-full"
                        style={{ backgroundColor: 'var(--color-secondary)' }}
                        initial={false}
                        animate={{ width: isActive ? '100%' : '0%' }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </>
                  )}
                </NavLink>
              </Magnetic>
            ))}
          </nav>

          {/* ── Desktop CTA ──────────────────── */}
          <div className="hidden lg:block shrink-0">
            <Magnetic strength={0.4}>
              <Link
                to="/contact"
                className="group relative inline-flex items-center justify-center gap-2 xl:gap-3 overflow-hidden rounded-full px-8 py-3 text-sm xl:text-base font-bold tracking-widest uppercase text-white bg-primary shadow-lg transition-all duration-700 hover:shadow-[0_10px_30px_rgba(9,71,95,0.4)] cursor-pointer"
              >
                <span className="absolute inset-0 w-full h-full bg-secondary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-[0.16,1,0.3,1]"></span>
                <span className="relative z-10 w-full text-center">Let's Connect</span>
              </Link>
            </Magnetic>
          </div>

          {/* ── Mobile Hamburger ─────────────── */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg border transition-all duration-200"
            style={{
              borderColor: mobileOpen ? 'var(--color-secondary)' : 'var(--color-border)',
              color: mobileOpen ? 'var(--color-secondary)' : 'var(--color-primary)',
              backgroundColor: mobileOpen ? 'rgba(20,184,166,0.05)' : 'transparent',
            }}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mobileOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>

        {/* ── Mobile Drawer ────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{
                backgroundColor: 'var(--color-bg)',
                borderTop: '1px solid var(--color-border-subtle)',
                overflow: 'hidden',
              }}
              className="lg:hidden"
            >
              <div className="px-5 pb-6 pt-2 flex flex-col gap-1 max-h-[75vh] overflow-y-auto">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className="flex items-center justify-between py-3 text-base sm:text-lg font-medium border-b transition-colors"
                    style={({ isActive }) => ({
                      color: isActive ? 'var(--color-secondary)' : 'var(--color-primary)',
                      borderColor: 'var(--color-border-subtle)',
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        <span>{link.label}</span>
                        {isActive && (
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: 'var(--color-secondary)' }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
                <Link to="/contact" className="mt-6 flex justify-center w-full max-w-[300px] mx-auto items-center overflow-hidden rounded-full px-4 py-3 font-semibold text-white bg-primary shadow-lg transition-transform active:scale-95">
                  <span className="text-white">Let's Connect</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
