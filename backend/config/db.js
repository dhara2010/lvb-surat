const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('../models/Admin');
const Event = require('../models/Event');
const Gallery = require('../models/Gallery');
const Leader = require('../models/Leader');
const Member = require('../models/Member');

const initDb = async () => {
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const hash = await bcrypt.hash('admin123', 10);
    await Admin.create({ username: 'admin', password: hash });
    console.log("Created default admin user: admin / admin123");
  }
  
  const eventsCount = await Event.countDocuments();
  if (eventsCount === 0) {
    await Event.insertMany([
      { date: '28', month: 'Jun', title: 'Referral & Speed Networking Forum' },
      { date: '05', month: 'Jul', title: 'Surat Manufacturers Conclave' },
      { date: '12', month: 'Jul', title: 'Platinum Leadership Seminar' }
    ]);
  }
  
  const leadersCount = await Leader.countDocuments();
  if (leadersCount === 0) {
    await Leader.insertMany([
      { name: 'Pragnesh Kotadiya', role: 'Chapter Director', img: '/pragnesh.jpg' },
      { name: 'Jenish Vekariya', role: 'President', img: '/jenish.png' },
      { name: 'Mayur Rakholiya', role: 'Vice President', img: '/mayur-1.png' },
      { name: 'Rajvi Borad', role: 'Secretary Treasurer', img: '/rajvi.png' },
      { name: 'Het Radadiya', role: 'Lead Visitor Host', img: '/het.jpeg' }
    ]);
  }

  const galleryCount = await Gallery.countDocuments();
  if (galleryCount === 0) {
    const defaultImages = [
      "/gallery/1-1.jpeg", "/gallery/10-1.jpeg", "/gallery/11-1.jpeg",
      "/gallery/12-1.jpeg", "/gallery/13-1.jpeg", "/gallery/KVS_3369-2048x1365.jpg"
    ];
    for (let url of defaultImages) {
      await Gallery.create({ image_url: url });
    }
  }

  const membersCount = await Member.countDocuments();
  if (membersCount === 0) {
    await Member.insertMany([
      { name: 'Amit Rajodiya', memberId: 'MEM-001', chapter: 'Surat Platinum', businessName: 'Om Shiv Insurance', businessCategory: 'Insurance Services', photoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Amit%20Rajodiya&backgroundColor=09475f&textColor=fff', logoUrl: '' },
      { name: 'Jenish Vekariya', memberId: 'MEM-002', chapter: 'Surat Gold', businessName: 'JV Builders', businessCategory: 'Real Estate Developer', photoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Jenish%20Vekariya&backgroundColor=09475f&textColor=fff', logoUrl: '' },
      { name: 'Pragnesh Kotadiya', memberId: 'MEM-003', chapter: 'Surat Platinum', businessName: 'Kotadiya Diamonds', businessCategory: 'Diamond Merchant', photoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Pragnesh%20Kotadiya&backgroundColor=09475f&textColor=fff', logoUrl: '' },
      { name: 'Mayur Rakholiya', memberId: 'MEM-004', chapter: 'Surat Platinum', businessName: 'Rakholiya Textiles', businessCategory: 'Textile Manufacturer', photoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Mayur%20Rakholiya&backgroundColor=09475f&textColor=fff', logoUrl: '' },
      { name: 'Rajvi Borad', memberId: 'MEM-005', chapter: 'Surat Dynamic', businessName: 'Borad Financials', businessCategory: 'Financial Services', photoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Rajvi%20Borad&backgroundColor=09475f&textColor=fff', logoUrl: '' }
    ]);
    console.log("Seeded default members.");
  }
};

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.DATABASE_URL;
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');
    await initDb();
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
