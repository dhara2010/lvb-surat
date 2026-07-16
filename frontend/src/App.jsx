import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import SmoothScroll from './components/animations/SmoothScroll';
import CustomCursor from './components/animations/CustomCursor';
import { AnimatedBackground } from './components/animations/AnimatedBackground';

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <CustomCursor />
        <AppRoutes />
      </SmoothScroll>
    </BrowserRouter>
  );
}