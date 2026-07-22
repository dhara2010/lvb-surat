const express = require('express');
const router = express.Router();
const paymentQRController = require('../controllers/paymentQRController');
const authenticateToken = require('../middleware/auth');
const { qrUpload } = require('../middleware/paymentUpload');

// Public route to fetch current active QR code
router.get('/', paymentQRController.getPaymentQR);

// Admin routes (require auth token)
router.post('/', authenticateToken, qrUpload.single('qrCode'), paymentQRController.uploadPaymentQR);
router.delete('/', authenticateToken, paymentQRController.deletePaymentQR);

module.exports = router;
