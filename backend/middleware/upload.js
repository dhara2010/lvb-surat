const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* =========================================================
   UPLOAD DIRECTORY

   Final location:

   backend/uploads/gallery/
========================================================= */

const uploadDirectory = path.join(__dirname, "../uploads/gallery");

/*
  Make sure directory exists
*/

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });

  console.log("Created upload directory:", uploadDirectory);
}

console.log("Multer upload directory:", uploadDirectory);

/* =========================================================
   MULTER STORAGE
========================================================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    /*
          Double-check folder exists
          before every upload.
        */

    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, {
        recursive: true,
      });
    }

    cb(null, uploadDirectory);
  },

  filename: function (req, file, cb) {
    /*
          Get extension:

          .png
          .jpg
          .webp
        */

    const extension = path.extname(file.originalname).toLowerCase();

    /*
          Remove extension from
          original filename.
        */

    const originalName = path.basename(
      file.originalname,
      path.extname(file.originalname),
    );

    /*
          Clean filename.

          "Amit Kaka Photo"
               ↓
          "Amit-Kaka-Photo"
        */

    const cleanName = originalName
      .trim()
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    /*
          Generate unique filename
        */

    const finalFilename = `${Date.now()}-${cleanName || "image"}${extension}`;

    console.log("Uploading file:");

    console.log("Original:", file.originalname);

    console.log("Saved as:", finalFilename);

    console.log("Directory:", uploadDirectory);

    cb(null, finalFilename);
  },
});

/* =========================================================
   IMAGE FILTER
========================================================= */

const fileFilter = function (req, file, cb) {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  cb(new Error("Only JPG, JPEG, PNG and WEBP image files are allowed."), false);
};

/* =========================================================
   CREATE MULTER
========================================================= */

const upload = multer({
  storage: storage,

  fileFilter: fileFilter,

  limits: {
    // Maximum 10 MB
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = upload;
