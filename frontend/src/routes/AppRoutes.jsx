import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LoadingScreen from '../components/ui/LoadingScreen';

// Lazy load pages for performance (Code Splitting)
const Home = lazy(() => import('../pages/Home/index.jsx'));
const About = lazy(() => import('../pages/About/index.jsx'));
const Events = lazy(() => import('../pages/Events/index.jsx'));
const EventDetail = lazy(() => import('../pages/EventDetail/index.jsx'));
const Gallery = lazy(() => import('../pages/Gallery/index.jsx'));
const Membership = lazy(() => import('../pages/Members/index.jsx'));
const Contact = lazy(() => import('../pages/Contact/index.jsx'));
const NotFound = lazy(() => import('../pages/NotFound/index.jsx'));


export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:eventId" element={<EventDetail />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="members" element={<Membership />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

      </Routes>
    </Suspense>
  );
}