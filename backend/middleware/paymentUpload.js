const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUploadMiddleware = (subfolder) => {
  const uploadDir = path.join(__dirname, `../uploads/${subfolder}`);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      const originalName = path.basename(file.originalname, ext);
      const cleanName = originalName
        .trim()
        .replace(/[^a-zA-Z0-9_-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      const finalFilename = `${subfolder}-${Date.now()}-${cleanName || 'file'}${ext}`;
      cb(null, finalFilename);
    }
  });

  const fileFilter = function (req, file, cb) {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];

    if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
      return cb(null, true);
    }

    cb(new Error('Only JPG, JPEG, PNG and WEBP image files are allowed.'), false);
  };

  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit
    }
  });
};

module.exports = {
  qrUpload: createUploadMiddleware('qr'),
  proofUpload: createUploadMiddleware('proofs')
};
