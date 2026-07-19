const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
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
   UPLOAD DIRECTORY SETUP
========================================================= */

/*
  Expected folder structure:

  backend/
  ├── server.js
  └── uploads/
      └── gallery/
          ├── image1.png
          └── image2.webp

  Public URL:

  /uploads/gallery/image1.png
*/

const uploadsPath = path.join(__dirname, "uploads");

const galleryUploadsPath = path.join(uploadsPath, "gallery");

/*
  Create upload folders automatically if they don't exist.

  This prevents Multer/static serving issues when the
  directory is missing on a fresh deployment.
*/

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, {
    recursive: true,
  });

  console.log("Created uploads directory:", uploadsPath);
}

if (!fs.existsSync(galleryUploadsPath)) {
  fs.mkdirSync(galleryUploadsPath, {
    recursive: true,
  });

  console.log("Created gallery uploads directory:", galleryUploadsPath);
}

console.log("Serving uploads from:", uploadsPath);

/* =========================================================
   STATIC FILES
========================================================= */

/*
  NEW ADMIN-UPLOADED FILES

  Physical file:

  backend/uploads/gallery/example.png

  Browser URL:

  https://lvb-surat.onrender.com/uploads/gallery/example.png
*/

app.use("/uploads", express.static(uploadsPath));

/*
  EXISTING FRONTEND GALLERY FILES

  Physical location:

  frontend/public/gallery/

  Browser URL:

  https://lvb-surat.onrender.com/gallery/example.webp
*/

const existingGalleryPath = path.join(__dirname, "../frontend/public/gallery");

console.log("Serving existing gallery from:", existingGalleryPath);

app.use("/gallery", express.static(existingGalleryPath));

/* =========================================================
   ROOT ROUTE

   GET:
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

   GET:
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

   GET:
   https://lvb-surat.onrender.com/api/health
========================================================= */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,

    status: "OK",

    message: "LVB Surat API is healthy.",

    timestamp: new Date().toISOString(),

    uploads: {
      path: uploadsPath,

      exists: fs.existsSync(uploadsPath),

      galleryExists: fs.existsSync(galleryUploadsPath),
    },
  });
});

/* =========================================================
   DATABASE CONNECTION
========================================================= */

connectDB();

/* =========================================================
   API ROUTES
========================================================= */

/*
  Authentication
*/

app.use("/api/auth", authRoutes);

/*
  Events
*/

app.use("/api/events", eventsRoutes);

/*
  Leaders
*/

app.use("/api/leaders", leadersRoutes);

/*
  Members
*/

app.use("/api/members", membersRoutes);

/*
  Gallery
*/

app.use("/api/gallery", galleryRoutes);

/*
  Contacts
*/

app.use("/api/contacts", contactsRoutes);

/*
  File Upload

  POST:
  /api/upload
*/

app.use("/api/upload", uploadRoutes);

/*
  Chapters
*/

app.use("/api/chapters", chaptersRoutes);

/*
  Blogs
*/

app.use("/api/blogs", blogsRoutes);

/*
  Notifications
*/

app.use("/api/notifications", notificationsRoutes);

/*
  Attendance
*/

app.use("/api/attendance", attendanceRoutes);

/* =========================================================
   404 - ROUTE NOT FOUND

   IMPORTANT:
   This MUST remain after:
   - static routes
   - root routes
   - API routes
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,

    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER

   IMPORTANT:
   Must have 4 parameters for Express error middleware.
========================================================= */

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  /*
      Handle Multer errors or uploaded-file errors
      with a useful response.
    */

  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,

      message: `Upload error: ${err.message}`,
    });
  }

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
  console.log("==========================================");

  console.log(`LVB Surat Backend Server running on port ${PORT}`);

  console.log(`Uploads directory: ${uploadsPath}`);

  console.log(`Gallery uploads: ${galleryUploadsPath}`);

  console.log("==========================================");
});
