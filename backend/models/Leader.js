const mongoose = require('mongoose');

const LeaderSchema = new mongoose.Schema({
  name: String,
  role: String,
  img: String
});

module.exports = mongoose.model('Leader', LeaderSchema);
