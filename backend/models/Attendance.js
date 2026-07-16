const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  checkInTime: { type: String }, // Format: HH:MM AM/PM
  status: { type: String, enum: ['Present', 'Not Arrived'], default: 'Not Arrived' }
}, { timestamps: true });

// Create a compound index to ensure one record per member per date
AttendanceSchema.index({ memberId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
