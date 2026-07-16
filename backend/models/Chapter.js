const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  memberCount: { type: Number, default: 0 },
  foundedYear: { type: Number },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Chapter', ChapterSchema);
