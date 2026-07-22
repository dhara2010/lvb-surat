const mongoose = require('mongoose');

const PaymentQRSchema = new mongoose.Schema({
  qrCodeUrl: { type: String, required: true },
  title: { type: String, default: 'Payment QR Code' },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('PaymentQR', PaymentQRSchema);
