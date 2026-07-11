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

// Admin pages
const AdminDashboard = lazy(() => import('../pages/Admin/index.jsx'));
const EventsList = lazy(() => import('../pages/Admin/Events/EventsList.jsx'));
const AddEvent = lazy(() => import('../pages/Admin/Events/AddEvent.jsx'));
const EditEvent = lazy(() => import('../pages/Admin/Events/EditEvent.jsx'));

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
        </Route>
        <Route path="/admin" element={<AdminDashboard />}>
           <Route path="events" element={<EventsList />} />
           <Route path="events/add" element={<AddEvent />} />
           <Route path="events/edit/:id" element={<EditEvent />} />
        </Route>
      </Routes>
    </Suspense>
  );
}