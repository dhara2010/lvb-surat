const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { connectDB, Admin, Event, Gallery, Leader, Member, Contact } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'lvb_platinum_secret_secure_key';

// Connect to MongoDB
connectDB();

// Middleware for Auth
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Multer setup for Gallery
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/gallery'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Helper to map _id to id for frontend compatibility
const mapId = (doc) => {
  const obj = doc.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

// --- AUTH ROUTE --- //
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Admin.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- EVENTS ROUTES --- //
app.get('/api/events', async (req, res) => {
  const events = await Event.find();
  res.json(events.map(mapId));
});
app.post('/api/events', authenticateToken, async (req, res) => {
  await Event.create(req.body);
  res.json({ message: 'Added successfully' });
});
app.put('/api/events/:id', authenticateToken, async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: 'Updated successfully' });
});
app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

// --- LEADERS ROUTES --- //
app.get('/api/leaders', async (req, res) => {
  const leaders = await Leader.find();
  res.json(leaders.map(mapId));
});
app.post('/api/leaders', authenticateToken, async (req, res) => {
  await Leader.create(req.body);
  res.json({ message: 'Added successfully' });
});
app.put('/api/leaders/:id', authenticateToken, async (req, res) => {
  await Leader.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: 'Updated successfully' });
});
app.delete('/api/leaders/:id', authenticateToken, async (req, res) => {
  await Leader.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

// --- MEMBERS ROUTES --- //
app.get('/api/members', async (req, res) => {
  const members = await Member.find().sort({name: 1});
  res.json(members.map(mapId));
});
app.post('/api/members', authenticateToken, async (req, res) => {
  await Member.create(req.body);
  res.json({ message: 'Added successfully' });
});
app.put('/api/members/:id', authenticateToken, async (req, res) => {
  await Member.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: 'Updated successfully' });
});
app.delete('/api/members/:id', authenticateToken, async (req, res) => {
  await Member.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

// --- GALLERY ROUTES --- //
app.get('/api/gallery', async (req, res) => {
  const gallery = await Gallery.find();
  res.json(gallery.map(mapId));
});
app.post('/api/gallery', authenticateToken, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const imageUrl = '/gallery/' + req.file.filename;
  await Gallery.create({ image_url: imageUrl });
  res.json({ message: 'Uploaded successfully', imageUrl });
});
app.delete('/api/gallery/:id', authenticateToken, async (req, res) => {
  await Gallery.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

// --- GENERIC UPLOAD ROUTE --- //
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const imageUrl = '/gallery/' + req.file.filename;
  res.json({ imageUrl });
});

// --- CONTACT ROUTES --- //
app.get('/api/contacts', authenticateToken, async (req, res) => {
  const contacts = await Contact.find().sort({ created_at: -1 });
  res.json(contacts.map(mapId));
});
app.post('/api/contacts', async (req, res) => {
  await Contact.create(req.body);
  res.json({ message: 'Message sent successfully' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
