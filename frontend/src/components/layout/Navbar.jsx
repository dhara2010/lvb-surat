import React, { useState, useEffect } from'react';
import { motion, AnimatePresence } from'framer-motion';
import { Menu, X } from'lucide-react';
import { Link, NavLink, useLocation } from'react-router-dom';
import Magnetic from'../animations/Magnetic';
import LuxuryButton from'../ui/LuxuryButton';
const NAV_LINKS = [
  { label:'Home', path:'/' },
  { label:'About Us', path:'/about' },
  { label:'Events', path:'/events' },
  { label:'Gallery', path:'/gallery' },
  { label:'Members', path:'/members' },
  { label:'Contact', path:'/contact' },
];


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const isHome = location.pathname ==='/';

  return (
    <>
      <header
        style={scrolled ? {
          backgroundColor:'#FFFFFF',
          boxShadow:'0 4px 20px rgba(0,0,0,0.05)',
          borderBottom:'1px solid #E5E7EB',
          transition:'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        } : {
          backgroundColor:'transparent',
          boxShadow:'none',
          borderBottom:'1px solid transparent',
          transition:'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`fixed z-50 transition-all duration-500 w-full left-0 right-0 ${scrolled ?'top-0' :'top-0 pt-2'}`}
        role="banner"
      >
        <div
          className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 transition-all duration-500"
          style={{ height: scrolled ?'64px' :'80px' }}
        >

          {/* ── Logo ──────────────────────────── */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 group cursor-pointer"
            aria-label="LVB Surat Platinum — Homepage"
          >
              <img
                src="/LVB_Platinum.svg"
                alt="LVB Surat Platinum"
                className="h-10 md:h-15 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              />
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
                  className={({ isActive }) =>`group relative inline-flex font-bold text-sm uppercase tracking-widest transition-colors duration-300 px-1 py-2 xl:text-base text-[var(--color-primary)] hover:text-[var(--color-secondary)]`}
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <span className={`absolute -bottom-1 left-0 h-[2px] bg-[var(--color-secondary)] transition-all duration-300 ease-out ${isActive ?'w-full' :'w-full origin-left scale-x-0 group-hover:scale-x-100'}`}></span>
                    </>
                  )}
                </NavLink>
              </Magnetic>
            ))}
          </nav>

          {/* ── Desktop CTA ──────────────────── */}
          <div className="hidden lg:block shrink-0">
            <Magnetic strength={0.4}>
              <Link to="/contact">
                <div className="inline-flex items-center justify-center rounded-md font-bold text-[13px] md:text-sm uppercase tracking-widest transition-all duration-300 text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] shadow-sm hover:shadow-md hover:scale-105 xl:py-3.5 xl:px-10 py-3 px-8">
                  Let's Connect
                </div>
              </Link>
            </Magnetic>
          </div>

          {/* ── Mobile Hamburger ─────────────── */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg border transition-all duration-200"
            style={{
              borderColor: mobileOpen ?'var(--color-secondary)' :'#E5E7EB',
              color: mobileOpen ?'var(--color-secondary)' :'#090E14',
            }}
            aria-label={mobileOpen ?'Close menu' :'Open menu'}
            aria-expanded={mobileOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mobileOpen ?'close' :'open'}
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
              animate={{ opacity: 1, height:'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease:'easeInOut' }}
              style={{
                backgroundColor: isHome ?'var(--color-bg)' :'#FFFFFF',
                borderTop: isHome ?'1px solid var(--color-border-subtle)' :'1px solid rgba(0,0,0,0.08)',
                overflow:'hidden',
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
                      color: isActive ? (isHome ?'var(--color-secondary)' :'#0F9D9A') : (isHome ?'var(--color-heading)' :'#044765'),
                      borderColor: isHome ?'var(--color-border-subtle)' :'rgba(0,0,0,0.08)',
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        <span>{link.label}</span>
                        {isActive && (
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: isHome ?'var(--color-secondary)' :'#0F9D9A' }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
                <Link to="/contact" className={`mt-6 flex justify-center w-full max-w-[300px] mx-auto items-center overflow-hidden rounded-full px-4 py-3 font-semibold  shadow-[0_10px_30px_rgba(79,163,209,0.3)] transition-transform active:scale-95 ${isHome ?'' :'bg-[#044765] hover:bg-[#0F9D9A]'}`} style={isHome ? { backgroundColor:'#4FA3D1' } : {}}>
                  <span className="">Let's Connect</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
