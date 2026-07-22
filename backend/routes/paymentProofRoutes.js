const express = require('express');
const router = express.Router();
const paymentProofController = require('../controllers/paymentProofController');
const authenticateToken = require('../middleware/auth');
const { proofUpload } = require('../middleware/paymentUpload');

// Public route to submit payment screenshot proof
router.post('/', proofUpload.single('proofImage'), paymentProofController.submitPaymentProof);

// Public/User check submission status
router.get('/check', paymentProofController.checkUserSubmission);

// Admin routes (require auth token)
router.get('/', authenticateToken, paymentProofController.getAllPaymentProofs);
router.put('/:id/status', authenticateToken, paymentProofController.updatePaymentProofStatus);
router.delete('/:id', authenticateToken, paymentProofController.deletePaymentProof);

module.exports = router;
