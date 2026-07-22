import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Preloader from '../ui/Preloader';
import { AnimatePresence } from 'framer-motion';

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      setProgress(total > 0 ? (scrollTop / total) * 100 : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[100] h-[2px]"
      style={{
        width: `${progress}%`,
        background: 'linear-gradient(to right, var(--color-secondary), var(--color-accent))',
        transition: 'width 0.1s linear',
        transformOrigin: 'left',
      }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    />
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Override browser history scroll lag with strict instant top navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
    }, 0);
  }, [pathname]);

  return (
    <div
      className="overflow-x-hidden flex flex-col min-h-screen bg-[#f6f7f9]"
      style={{
        fontFamily: 'var(--font-sans)',
      }}
    >
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          <ScrollProgress />
          <Navbar />
          {/* Foreground Main Container sitting on z-10 above the curtain reveal footer */}
          <main className="relative z-10 flex-grow pt-[72px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] border-b border-gray-100/60">
            <Outlet />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
