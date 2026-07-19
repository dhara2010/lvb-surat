// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// require('dotenv').config();

// const connectDB = require('./config/db');

// // Import modular routes
// const authRoutes = require('./routes/authRoutes');
// const eventsRoutes = require('./routes/eventsRoutes');
// const leadersRoutes = require('./routes/leadersRoutes');
// const membersRoutes = require('./routes/membersRoutes');
// const galleryRoutes = require('./routes/galleryRoutes');
// const contactsRoutes = require('./routes/contactsRoutes');
// const uploadRoutes = require('./routes/uploadRoutes');
// const chaptersRoutes = require('./routes/chaptersRoutes');
// const blogsRoutes = require('./routes/blogsRoutes');
// const notificationsRoutes = require('./routes/notificationsRoutes');
// const attendanceRoutes = require('./routes/attendanceRoutes');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Serve static gallery folder
// app.use('/gallery', express.static(path.join(__dirname, '../frontend/public/gallery')));

// // Boot Database Connect
// connectDB();

// // Bind API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/events', eventsRoutes);
// app.use('/api/leaders', leadersRoutes);
// app.use('/api/members', membersRoutes);
// app.use('/api/gallery', galleryRoutes);
// app.use('/api/contacts', contactsRoutes);
// app.use('/api/upload', uploadRoutes);
// app.use('/api/chapters', chaptersRoutes);
// app.use('/api/blogs', blogsRoutes);
// app.use('/api/notifications', notificationsRoutes);
// app.use('/api/attendance', attendanceRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

// Import modular routes
const authRoutes = require("./routes/authRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const leadersRoutes = require("./routes/leadersRoutes");
const membersRoutes = require("./routes/membersRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const contactsRoutes = require("./routes/contactsRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const chaptersRoutes = require("./routes/chaptersRoutes");
const blogsRoutes = require("./routes/blogsRoutes");
const notificationsRoutes = require("./routes/notificationsRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    }),
);

/* =========================================================
   ROOT / HEALTH CHECK
========================================================= */

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LVB Surat Backend API is running successfully.",
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "OK",
        message: "LVB Surat API is healthy.",
        timestamp: new Date().toISOString(),
    });
});

/* =========================================================
   STATIC FILES
========================================================= */

// Serve static gallery folder
app.use(
    "/gallery",
    express.static(path.join(__dirname, "../frontend/public/gallery")),
);

/* =========================================================
   DATABASE
========================================================= */

connectDB();

/* =========================================================
   API ROUTES
========================================================= */

app.use("/api/auth", authRoutes);

app.use("/api/events", eventsRoutes);

app.use("/api/leaders", leadersRoutes);

app.use("/api/members", membersRoutes);

app.use("/api/gallery", galleryRoutes);

app.use("/api/contacts", contactsRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/chapters", chaptersRoutes);

app.use("/api/blogs", blogsRoutes);

app.use("/api/notifications", notificationsRoutes);

app.use("/api/attendance", attendanceRoutes);

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

/* =========================================================
   SERVER
========================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`LVB Surat Backend Server running on port ${PORT}`);
});