const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  checkInTime: { type: String }, // Format: HH:MM AM/PM
  status: { type: String, enum: ['Present', 'Not Arrived'], default: 'Present' },
  latitude: { type: Number },
  longitude: { type: Number },
  accuracy: { type: Number },
  markedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for query optimization and duplicate prevention
AttendanceSchema.index({ memberId: 1, date: 1 });
AttendanceSchema.index({ eventId: 1, memberId: 1 }, { sparse: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
