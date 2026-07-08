const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  date: String,
  month: String,
  title: String
});

module.exports = mongoose.model('Event', EventSchema);
