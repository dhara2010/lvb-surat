const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  image_url: String
});

module.exports = mongoose.model('Gallery', GallerySchema);
