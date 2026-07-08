const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authenticateToken = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', authenticateToken, upload.single('image'), uploadController.uploadImage);

module.exports = router;
