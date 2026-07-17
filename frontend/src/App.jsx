import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import SmoothScroll from './components/animations/SmoothScroll';
import CustomCursor from './components/animations/CustomCursor';
import { AnimatedBackground } from './components/animations/AnimatedBackground';
<<<<<<< HEAD
=======

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
>>>>>>> 4c81fa0 (home page done)

export default function App() {
  return (
    <BrowserRouter>
<<<<<<< HEAD
=======
      <ThemeController />
>>>>>>> 4c81fa0 (home page done)
      <SmoothScroll>
        <CustomCursor />
        <AppRoutes />
      </SmoothScroll>
    </BrowserRouter>
  );
}