import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import SmoothScroll from './components/animations/SmoothScroll';

// Global Effects
import ScrollProgress from './components/effects/ScrollProgress';
import PremiumCursor from './components/ui/PremiumCursor';

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <PremiumCursor />
        <ScrollProgress />
        <div className="relative z-10 w-full h-full min-h-screen">
          <AppRoutes />
        </div>
      </SmoothScroll>
    </BrowserRouter>
  );
}