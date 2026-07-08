const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const authenticateToken = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', galleryController.getGallery);
router.post('/', authenticateToken, upload.single('image'), galleryController.uploadGallery);
router.delete('/:id', authenticateToken, galleryController.deleteGallery);

module.exports = router;
