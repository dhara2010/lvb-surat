const mongoose = require('mongoose');

const PaymentProofSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  eventTitle: { type: String, required: true },
  ticketCategory: { type: String, required: true },
  ticketPrice: { type: Number, default: 0 },
  quantity: { type: Number, default: 1 },
  totalAmount: { type: Number, default: 0 },
  
  memberId: { type: String, default: '' },
  userName: { type: String, required: true },
  userEmail: { type: String, default: '' },
  userPhone: { type: String, default: '' },
  
  proofImageUrl: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Verified/Approved', 'Rejected'], 
    default: 'Pending' 
  },
  adminNotes: { type: String, default: '' },
  submissionDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('PaymentProof', PaymentProofSchema);
