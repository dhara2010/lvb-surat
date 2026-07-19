const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

/* =========================================================
   IMPORT ROUTES
========================================================= */

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

/* =========================================================
   CREATE EXPRESS APP
========================================================= */

const app = express();

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

/* =========================================================
   ROOT ROUTE
   https://lvb-surat.onrender.com/
========================================================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LVB Surat Backend API is running successfully.",
  });
});

/* =========================================================
   API ROOT
   https://lvb-surat.onrender.com/api
========================================================= */

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LVB Surat API is running successfully.",

    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      events: "/api/events",
      leaders: "/api/leaders",
      members: "/api/members",
      gallery: "/api/gallery",
      contacts: "/api/contacts",
      upload: "/api/upload",
      chapters: "/api/chapters",
      blogs: "/api/blogs",
      notifications: "/api/notifications",
      attendance: "/api/attendance",
    },
  });
});

/* =========================================================
   HEALTH CHECK
   https://lvb-surat.onrender.com/api/health
========================================================= */

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

/*
  Existing gallery files.

  Example:
  https://lvb-surat.onrender.com/gallery/image.webp
*/

app.use(
  "/gallery",
  express.static(path.join(__dirname, "../frontend/public/gallery")),
);

/* =========================================================
   DATABASE CONNECTION
========================================================= */

connectDB();

/* =========================================================
   API ROUTES
========================================================= */

// Authentication
app.use("/api/auth", authRoutes);

// Events
app.use("/api/events", eventsRoutes);

// Leaders
app.use("/api/leaders", leadersRoutes);

// Members
app.use("/api/members", membersRoutes);

// Gallery
app.use("/api/gallery", galleryRoutes);

// Contacts
app.use("/api/contacts", contactsRoutes);

// File Upload
app.use("/api/upload", uploadRoutes);

// Chapters
app.use("/api/chapters", chaptersRoutes);

// Blogs
app.use("/api/blogs", blogsRoutes);

// Notifications
app.use("/api/notifications", notificationsRoutes);

// Attendance
app.use("/api/attendance", attendanceRoutes);

/* =========================================================
   404 - ROUTE NOT FOUND

   IMPORTANT:
   Keep this AFTER all API routes.
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message || "Internal Server Error",
  });
});

/* =========================================================
   START SERVER
========================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`LVB Surat Backend Server running on port ${PORT}`);
});
