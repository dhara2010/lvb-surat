const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: String,
  businessName: String,
  businessCategory: String,
  photoUrl: String,
  logoUrl: String
});

module.exports = mongoose.model('Member', MemberSchema);
