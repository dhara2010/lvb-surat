import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import SmoothScroll from './components/animations/SmoothScroll';

// Global Effects
import ScrollProgress from './components/effects/ScrollProgress';

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <ScrollProgress />
        <div className="relative z-10 w-full h-full min-h-screen">
          <AppRoutes />
        </div>
      </SmoothScroll>
    </BrowserRouter>
  );
}