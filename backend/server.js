const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

// Import modular routes
const authRoutes = require('./routes/authRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const leadersRoutes = require('./routes/leadersRoutes');
const membersRoutes = require('./routes/membersRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const contactsRoutes = require('./routes/contactsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const chaptersRoutes = require('./routes/chaptersRoutes');
const blogsRoutes = require('./routes/blogsRoutes');
const notificationsRoutes = require('./routes/notificationsRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Backend purely serves uploads from its own disk
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Boot Database Connect
connectDB();

// Bind API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/leaders', leadersRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chapters', chaptersRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
