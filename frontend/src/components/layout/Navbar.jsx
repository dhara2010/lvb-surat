import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Magnetic from '../animations/Magnetic';
import LuxuryButton from '../ui/LuxuryButton';
import { ThemeNavLink } from '../ui/ThemeLink';

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

  const isHome = location.pathname === '/';

  return (
    <>
      <header
        style={{
          backgroundColor: isHome ? (scrolled ? 'rgba(9, 14, 20, 0.85)' : 'transparent') : '#FFFFFF',
          backdropFilter: isHome ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: isHome ? 'blur(20px)' : 'none',
          boxShadow: isHome ? (scrolled ? '0 10px 40px -10px rgba(0,0,0,0.2)' : 'none') : '0 4px 15px rgba(0,0,0,0.05)',
          borderBottom: isHome ? (scrolled ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid transparent') : '1px solid rgba(0,0,0,0.08)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isHome ? 'theme-dark' : 'theme-light'}`}
        role="banner"
      >
        <div
          className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 transition-all duration-500"
          style={{ height: scrolled ? '64px' : '80px' }}
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
                    style={{ color: 'var(--color-heading)', fontFamily: 'var(--font-sans)' }}
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
                {isHome ? (
                  <ThemeNavLink to={link.path} className="px-1 py-2 xl:text-base">
                     {link.label}
                  </ThemeNavLink>
                ) : (
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => `group relative inline-flex font-bold text-sm uppercase tracking-widest transition-colors duration-300 px-1 py-2 xl:text-base ${isActive ? 'text-[#0F9D9A]' : 'text-[#044765] hover:text-[#0F9D9A]'}`}
                  >
                    {({ isActive }) => (
                      <>
                        {link.label}
                        <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#0F9D9A] transition-all duration-300 ease-out ${isActive ? 'w-full' : 'w-full origin-left scale-x-0 group-hover:scale-x-100'}`}></span>
                      </>
                    )}
                  </NavLink>
                )}
              </Magnetic>
            ))}
          </nav>

          {/* ── Desktop CTA ──────────────────── */}
          <div className="hidden lg:block shrink-0">
            <Magnetic strength={0.4}>
              <Link to="/contact">
                {isHome ? (
                  <LuxuryButton as="div" className="xl:py-3.5 xl:px-10">
                    Let's Connect
                  </LuxuryButton>
                ) : (
                  <div className="inline-flex items-center justify-center rounded-full text-white font-bold text-[13px] md:text-sm uppercase tracking-widest transition-all duration-300 bg-[#044765] hover:bg-[#0F9D9A] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,157,154,0.3)] shadow-[0_4px_10px_rgba(4,71,101,0.2)] xl:py-3.5 xl:px-10 py-3 px-8">
                    Let's Connect
                  </div>
                )}
              </Link>
            </Magnetic>
          </div>

          {/* ── Mobile Hamburger ─────────────── */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg border transition-all duration-200"
            style={{
              borderColor: mobileOpen ? 'var(--color-secondary)' : (isHome ? 'var(--color-border)' : 'rgba(4,71,101,0.3)'),
              color: mobileOpen ? 'var(--color-secondary)' : (isHome ? 'var(--color-heading)' : '#044765'),
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
                backgroundColor: isHome ? 'var(--color-bg)' : '#FFFFFF',
                borderTop: isHome ? '1px solid var(--color-border-subtle)' : '1px solid rgba(0,0,0,0.08)',
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
                      color: isActive ? (isHome ? 'var(--color-secondary)' : '#0F9D9A') : (isHome ? 'var(--color-heading)' : '#044765'),
                      borderColor: isHome ? 'var(--color-border-subtle)' : 'rgba(0,0,0,0.08)',
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        <span>{link.label}</span>
                        {isActive && (
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: isHome ? 'var(--color-secondary)' : '#0F9D9A' }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
                <Link to="/contact" className={`mt-6 flex justify-center w-full max-w-[300px] mx-auto items-center overflow-hidden rounded-full px-4 py-3 font-semibold text-white shadow-[0_10px_30px_rgba(79,163,209,0.3)] transition-transform active:scale-95 ${isHome ? '' : 'bg-[#044765] hover:bg-[#0F9D9A]'}`} style={isHome ? { backgroundColor: '#4FA3D1' } : {}}>
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
