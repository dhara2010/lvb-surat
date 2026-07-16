const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: String,
  businessName: String,
  businessCategory: String,
  photoUrl: String,
  logoUrl: String,
  memberId: String,
  chapter: String
});

module.exports = mongoose.model('Member', MemberSchema);
