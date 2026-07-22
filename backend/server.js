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
const eventAttendanceRoutes = require("./routes/eventAttendanceRoutes");
const paymentQRRoutes = require("./routes/paymentQRRoutes");
const paymentProofRoutes = require("./routes/paymentProofRoutes");

/* =========================================================
   CREATE EXPRESS APP
========================================================= */

const app = express();

app.set("trust proxy", 1);

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
   UPLOAD DIRECTORIES
========================================================= */

const uploadsPath = path.join(__dirname, "uploads");

const galleryUploadsPath = path.join(uploadsPath, "gallery");

// Create /uploads if it does not exist
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, {
    recursive: true,
  });
}

// Create /uploads/gallery if it does not exist
if (!fs.existsSync(galleryUploadsPath)) {
  fs.mkdirSync(galleryUploadsPath, {
    recursive: true,
  });
}

// Create /uploads/qr & /uploads/proofs if not exist
const qrPath = path.join(uploadsPath, "qr");
const proofPath = path.join(uploadsPath, "proofs");
if (!fs.existsSync(qrPath)) fs.mkdirSync(qrPath, { recursive: true });
if (!fs.existsSync(proofPath)) fs.mkdirSync(proofPath, { recursive: true });

console.log("======================================");
console.log("Uploads Path:", uploadsPath);
console.log("Gallery Uploads Path:", galleryUploadsPath);
console.log("Uploads Exists:", fs.existsSync(uploadsPath));
console.log("Gallery Exists:", fs.existsSync(galleryUploadsPath));
console.log("======================================");

/* =========================================================
   STATIC FILE SERVING
========================================================= */

/*
  IMPORTANT

  Physical file:

  backend/uploads/gallery/photo.webp

  becomes:

  http://localhost:5000/uploads/gallery/photo.webp

  Production:

  https://lvb-surat.onrender.com/uploads/gallery/photo.webp
*/

app.use(
  "/uploads",
  express.static(uploadsPath, {
    fallthrough: true,

    setHeaders: (res) => {
      res.setHeader("Cache-Control", "public, max-age=86400");
    },
  }),
);

/*
  Existing static gallery files

  frontend/public/gallery/example.webp

  becomes:

  /gallery/example.webp
*/

const existingGalleryPath = path.join(__dirname, "../frontend/public/gallery");

if (fs.existsSync(existingGalleryPath)) {
  console.log("Serving existing gallery from:", existingGalleryPath);

  app.use("/gallery", express.static(existingGalleryPath));
} else {
  console.log(
    "Existing frontend gallery folder not found:",
    existingGalleryPath,
  );
}

/* =========================================================
   ROOT ROUTE
========================================================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LVB Surat Backend API is running successfully.",
  });
});

/* =========================================================
   API ROOT
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

      galleryPath: galleryUploadsPath,

      galleryExists: fs.existsSync(galleryUploadsPath),
    },
  });
});

/* =========================================================
   DEBUG UPLOAD CHECK

   Use:
   /api/debug/uploads

   This helps verify whether files actually exist on Render.
========================================================= */

app.get("/api/debug/uploads", (req, res) => {
  try {
    if (!fs.existsSync(galleryUploadsPath)) {
      return res.status(200).json({
        success: true,
        message: "Gallery upload directory exists but contains no files.",
        files: [],
      });
    }

    const files = fs.readdirSync(galleryUploadsPath);

    res.status(200).json({
      success: true,

      uploadDirectory: galleryUploadsPath,

      totalFiles: files.length,

      files: files,
    });
  } catch (error) {
    console.error("Upload debug error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

app.use("/api/event-attendance", eventAttendanceRoutes);

app.use("/api/payment-qr", paymentQRRoutes);

app.use("/api/payment-proofs", paymentProofRoutes);

/* =========================================================
   404 HANDLER

   MUST ALWAYS BE AFTER STATIC + API ROUTES
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
  console.error("SERVER ERROR:", err);

  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,

      message: `Upload error: ${err.message}`,
    });
  }

  return res.status(err.status || 500).json({
    success: false,

    message: err.message || "Internal Server Error",
  });
});

/* =========================================================
   START SERVER
========================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("======================================");

  console.log(`LVB Surat Backend running on port ${PORT}`);

  console.log(`Uploads served from: ${uploadsPath}`);

  console.log(`Gallery uploads: ${galleryUploadsPath}`);

  console.log("======================================");
});
