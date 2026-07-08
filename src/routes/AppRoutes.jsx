import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home/index.jsx';
import About from '../pages/About/index.jsx';
import Events from '../pages/Events/index.jsx';
import Gallery from '../pages/Gallery/index.jsx';
import Membership from '../pages/Members/index.jsx';
import Contact from '../pages/Contact/index.jsx';
import AdminDashboard from '../pages/Admin/index.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="events" element={<Events />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="members" element={<Membership />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}