const PaymentQR = require('../models/PaymentQR');
const fs = require('fs');
const path = require('path');

// Public: Get currently configured payment QR Code
exports.getPaymentQR = async (req, res) => {
  try {
    const qrDoc = await PaymentQR.findOne().sort({ updatedAt: -1 });
    if (!qrDoc || !qrDoc.qrCodeUrl) {
      return res.status(200).json({
        success: true,
        qrCodeUrl: null,
        message: 'No payment QR code configured.'
      });
    }
    return res.status(200).json({
      success: true,
      qrCodeUrl: qrDoc.qrCodeUrl,
      updatedAt: qrDoc.updatedAt
    });
  } catch (error) {
    console.error('getPaymentQR error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Upload/Add/Replace Payment QR Code
exports.uploadPaymentQR = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a QR code image.' });
    }

    const qrCodeUrl = `/uploads/qr/${req.file.filename}`;

    // Update existing document or create a new one
    let qrDoc = await PaymentQR.findOne();
    if (qrDoc) {
      // Clean up previous image file if exists
      if (qrDoc.qrCodeUrl) {
        const oldPath = path.join(__dirname, '..', qrDoc.qrCodeUrl);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) {}
        }
      }
      qrDoc.qrCodeUrl = qrCodeUrl;
      qrDoc.updatedAt = new Date();
      await qrDoc.save();
    } else {
      qrDoc = await PaymentQR.create({ qrCodeUrl, updatedAt: new Date() });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment QR Code updated successfully.',
      qrCodeUrl: qrDoc.qrCodeUrl
    });
  } catch (error) {
    console.error('uploadPaymentQR error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Delete Payment QR Code
exports.deletePaymentQR = async (req, res) => {
  try {
    const qrDoc = await PaymentQR.findOne();
    if (qrDoc) {
      if (qrDoc.qrCodeUrl) {
        const filePath = path.join(__dirname, '..', qrDoc.qrCodeUrl);
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (e) {}
        }
      }
      await PaymentQR.deleteOne({ _id: qrDoc._id });
    }
    return res.status(200).json({
      success: true,
      message: 'Payment QR Code deleted successfully.'
    });
  } catch (error) {
    console.error('deletePaymentQR error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
