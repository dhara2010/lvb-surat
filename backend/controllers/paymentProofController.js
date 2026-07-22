const PaymentProof = require('../models/PaymentProof');
const Event = require('../models/Event');
const fs = require('fs');
const path = require('path');

// Public: Submit Payment Proof
exports.submitPaymentProof = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Payment screenshot proof is required.' });
    }

    const {
      eventId,
      eventTitle,
      ticketCategory,
      ticketPrice,
      quantity,
      totalAmount,
      memberId,
      userName,
      userEmail,
      userPhone
    } = req.body;

    if (!eventId || !ticketCategory || !userName) {
      return res.status(400).json({
        success: false,
        message: 'Event ID, ticket category, and user name are required fields.'
      });
    }

    // Verify Event exists if valid ObjectId
    let resolvedTitle = eventTitle;
    try {
      const ev = await Event.findById(eventId);
      if (ev) resolvedTitle = ev.title;
    } catch (e) {}

    const proofImageUrl = `/uploads/proofs/${req.file.filename}`;

    const proofDoc = await PaymentProof.create({
      eventId,
      eventTitle: resolvedTitle || 'Event Ticket',
      ticketCategory,
      ticketPrice: parseFloat(ticketPrice) || 0,
      quantity: parseInt(quantity, 10) || 1,
      totalAmount: parseFloat(totalAmount) || 0,
      memberId: memberId || '',
      userName: userName.trim(),
      userEmail: (userEmail || '').trim(),
      userPhone: (userPhone || '').trim(),
      proofImageUrl,
      status: 'Pending',
      submissionDate: new Date()
    });

    return res.status(201).json({
      success: true,
      message: 'Payment proof uploaded successfully! Our HR/Admin team will contact you within 15–30 minutes.',
      data: proofDoc
    });
  } catch (error) {
    console.error('submitPaymentProof error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Public/Member: Check existing submission status for user/event
exports.checkUserSubmission = async (req, res) => {
  try {
    const { eventId, memberId, userName } = req.query;
    if (!eventId) {
      return res.status(400).json({ success: false, message: 'eventId query parameter is required.' });
    }

    const query = { eventId };
    if (memberId && memberId !== 'undefined') {
      query.memberId = memberId;
    } else if (userName && userName !== 'undefined') {
      query.userName = userName;
    } else {
      return res.status(200).json({ success: true, submission: null });
    }

    const submission = await PaymentProof.findOne(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      submission: submission || null
    });
  } catch (error) {
    console.error('checkUserSubmission error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all payment proof submissions with optional filters
exports.getAllPaymentProofs = async (req, res) => {
  try {
    const { eventId, status, search } = req.query;
    const filter = {};

    if (eventId && eventId !== 'all') {
      filter.eventId = eventId;
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { userName: regex },
        { userEmail: regex },
        { userPhone: regex },
        { memberId: regex },
        { eventTitle: regex },
        { ticketCategory: regex }
      ];
    }

    const proofs = await PaymentProof.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: proofs });
  } catch (error) {
    console.error('getAllPaymentProofs error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update Payment Proof status & admin notes
exports.updatePaymentProofStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ['Pending', 'Verified/Approved', 'Rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status.' });
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (adminNotes !== undefined) updateFields.adminNotes = adminNotes;

    const updated = await PaymentProof.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Payment proof record not found.' });
    }

    return res.status(200).json({
      success: true,
      message: `Payment proof status updated to ${updated.status}.`,
      data: updated
    });
  } catch (error) {
    console.error('updatePaymentProofStatus error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Delete Payment Proof submission
exports.deletePaymentProof = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await PaymentProof.findById(id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Payment proof record not found.' });
    }

    // Try to remove screenshot file from storage
    if (doc.proofImageUrl) {
      const filePath = path.join(__dirname, '..', doc.proofImageUrl);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) {}
      }
    }

    await PaymentProof.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Payment proof record deleted successfully.'
    });
  } catch (error) {
    console.error('deletePaymentProof error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
