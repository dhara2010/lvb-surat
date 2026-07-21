const mongoose = require('mongoose');

const EventAttendanceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true }, // HH:MM AM/PM
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  status: { type: String, default: 'Present' }
}, { timestamps: true });

// Prevent duplicate attendance for the same user per event
EventAttendanceSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('EventAttendance', EventAttendanceSchema);
