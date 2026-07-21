const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: String,
  date: String,
  month: String,
  year: String,
  time: String,
  cost: String,
  venue: String,
  mapLink: String,
  organizer: String,
  image: String,
  latitude: Number,
  longitude: Number,
  
  descriptionPart1: String,
  descriptionPart2: String,
  
  // Attendance settings
  eventDate: { type: String }, // YYYY-MM-DD
  attendanceEnabled: { type: Boolean, default: true },
  attendanceOpenTime: { type: String, default: '07:00' }, // HH:mm (IST)
  attendanceCloseTime: { type: String, default: '08:00' }, // HH:mm (IST)
  
  sessions: [{
    iconType: String,
    title: String,
    primaryLabel: String,
    primaryText: String,
    secondaryLabel: String,
    secondaryText: String,
    description: String
  }],
  
  tickets: [{
    category: String,
    description: String,
    price: String,
    status: { type: String, default: 'Available' },
    bookingUrl: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
