const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('../models/Admin');
const Event = require('../models/Event');
const Gallery = require('../models/Gallery');
const Leader = require('../models/Leader');

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
