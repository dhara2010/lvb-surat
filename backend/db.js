const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://prajapatidhara2010:dhara2010@ac-txdrqcg-shard-00-00.xlkxrqf.mongodb.net:27017,ac-txdrqcg-shard-00-02.xlkxrqf.mongodb.net:27017,ac-txdrqcg-shard-00-01.xlkxrqf.mongodb.net:27017/lvb_surat?authSource=admin&replicaSet=atlas-fznrsa-shard-0&ssl=true';
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');
    await initDb();
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

const AdminSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});
const Admin = mongoose.model('Admin', AdminSchema);

const EventSchema = new mongoose.Schema({
  date: String,
  month: String,
  title: String
});
const Event = mongoose.model('Event', EventSchema);

const GallerySchema = new mongoose.Schema({
  image_url: String
});
const Gallery = mongoose.model('Gallery', GallerySchema);

const LeaderSchema = new mongoose.Schema({
  name: String,
  role: String,
  img: String
});
const Leader = mongoose.model('Leader', LeaderSchema);

const MemberSchema = new mongoose.Schema({
  name: String,
  businessName: String,
  businessCategory: String,
  photoUrl: String,
  logoUrl: String
});
const Member = mongoose.model('Member', MemberSchema);

const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  created_at: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', ContactSchema);

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

module.exports = {
  connectDB,
  Admin,
  Event,
  Gallery,
  Leader,
  Member,
  Contact
};
