import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home',       path: '/'           },
  { label: 'About Us',   path: '/about'      },
  { label: 'Events',     path: '/events'     },
  { label: 'Gallery',    path: '/gallery'    },
  { label: 'Membership', path: '/membership' },
  { label: 'Contact',    path: '/contact'    },
];

const NAV_HEIGHT = 72; 

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [logoError,   setLogoError]   = useState(false);
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
          backgroundColor: 'var(--color-bg)',
          boxShadow:  scrolled ? 'var(--shadow-navbar)' : 'none',
          borderBottom: scrolled ? '1px solid transparent' : '1px solid var(--color-border-subtle)',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        }}
        className="fixed top-0 left-0 right-0 z-50"
        role="banner"
      >
        <div
          className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10"
          style={{ height: `${NAV_HEIGHT}px` }}
        >

          {/* ── Logo ──────────────────────────── */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group"
            aria-label="LVB Surat Platinum — Homepage"
          >
            {logoError ? (
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-extrabold tracking-wider"
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
                    className="font-bold tracking-wider text-sm"
                    style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-sans)' }}
                  >
                    LVB SURAT
                  </span>
                  <span
                    className="text-[9px] tracking-[0.18em] uppercase mt-0.5"
                    style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-sans)' }}
                  >
                    Platinum Chapter
                  </span>
                </div>
              </div>
            ) : (
              <img
                src="/LVB_Platinum.png"
                alt="LVB Surat Platinum"
                className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                onError={() => setLogoError(true)}
              />
            )}
          </Link>

          {/* ── Desktop Navigation ───────────── */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Primary navigation"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                  relative px-3 py-2 rounded-sm text-sm font-medium tracking-wide transition-colors duration-200
                  ${isActive ? 'active' : ''}
                `}
                style={({ isActive }) => ({
                  color: isActive ? 'var(--color-secondary)' : 'var(--color-primary)',
                })}
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {/* Animated underline */}
                    <motion.span
                      className="absolute -bottom-0.5 left-0 h-[1.5px] rounded-full"
                      style={{ backgroundColor: 'var(--color-secondary)' }}
                      initial={false}
                      animate={{ width: isActive ? '100%' : '0%' }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ── Desktop CTA ──────────────────── */}
          <div className="hidden md:block shrink-0">
            <Link
              to="/contact"
              className="btn-primary group text-xs px-5 py-2.5"
              id="navbar-cta"
            >
              Let's Connect
              <ArrowRight
                className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>

          {/* ── Mobile Hamburger ─────────────── */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border transition-all duration-200"
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
              className="md:hidden"
            >
              <div className="px-6 pb-6 pt-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className="flex items-center justify-between py-3 text-sm font-medium border-b transition-colors"
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
                <Link
                  to="/contact"
                  className="btn-primary w-full justify-center mt-4"
                >
                  Let's Connect
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
