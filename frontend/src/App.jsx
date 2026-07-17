import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import SmoothScroll from './components/animations/SmoothScroll';
import CustomCursor from './components/animations/CustomCursor';
import { AnimatedBackground } from './components/animations/AnimatedBackground';

function ThemeController() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/') {
      document.body.classList.remove('theme-inner');
    } else {
      document.body.classList.add('theme-inner');
    }
  }, [location.pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeController />
      <SmoothScroll>
        <CustomCursor />
        <AppRoutes />
      </SmoothScroll>
    </BrowserRouter>
  );
}