import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home/index.jsx';
import About from '../pages/About/index.jsx';
import Events from '../pages/Events/index.jsx';
import EventDetail from '../pages/EventDetail/index.jsx';
import Gallery from '../pages/Gallery/index.jsx';
import Membership from '../pages/Members/index.jsx';
import Contact from '../pages/Contact/index.jsx';
import AdminDashboard from '../pages/Admin/index.jsx';
import EventsList from '../pages/Admin/Events/EventsList.jsx';
import AddEvent from '../pages/Admin/Events/AddEvent.jsx';
import EditEvent from '../pages/Admin/Events/EditEvent.jsx';

export default function AppRoutes() {
  return (
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
  );
}