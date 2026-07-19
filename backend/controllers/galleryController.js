const fs = require("fs");
const path = require("path");
const Gallery = require("../models/Gallery");

/* =========================================================
   HELPER - CONVERT MONGODB _id TO id
========================================================= */

const mapId = (doc) => {
  const obj = doc.toObject();

  obj.id = obj._id;

  delete obj._id;
  delete obj.__v;

  return obj;
};

/* =========================================================
   GET ALL GALLERY IMAGES
========================================================= */

exports.getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find();

    res.json(gallery.map(mapId));
  } catch (err) {
    console.error("Get gallery error:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/* =========================================================
   UPLOAD NEW GALLERY IMAGE
========================================================= */

exports.uploadGallery = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    /*
      IMPORTANT:

      Multer saves file here:

      backend/uploads/gallery/filename.webp

      server.js exposes:

      /uploads -> backend/uploads

      Therefore public URL MUST be:

      /uploads/gallery/filename.webp
    */

    const imageUrl = "/uploads/gallery/" + req.file.filename;

    const galleryItem = await Gallery.create({
      image_url: imageUrl,
    });

    console.log("==================================");

    console.log("Gallery image uploaded:");

    console.log("Physical file:", req.file.path);

    console.log("Public URL:", imageUrl);

    console.log("==================================");

    res.status(201).json({
      success: true,

      message: "Uploaded successfully",

      imageUrl: imageUrl,

      gallery: mapId(galleryItem),
    });
  } catch (err) {
    console.error("Gallery upload error:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/* =========================================================
   DELETE GALLERY IMAGE
========================================================= */

exports.deleteGallery = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,

        message: "Gallery image not found",
      });
    }

    /*
      If this is a dynamically uploaded image,
      delete physical file too.
    */

    if (
      galleryItem.image_url &&
      galleryItem.image_url.startsWith("/uploads/gallery/")
    ) {
      const filename = path.basename(galleryItem.image_url);

      const filePath = path.join(__dirname, "../uploads/gallery", filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);

        console.log("Deleted physical image:", filePath);
      }
    }

    /*
      Delete database record
    */

    await Gallery.findByIdAndDelete(req.params.id);

    res.json({
      success: true,

      message: "Deleted successfully",
    });
  } catch (err) {
    console.error("Delete gallery error:", err);

    res.status(500).json({
      success: false,

      error: err.message,
    });
  }
};
