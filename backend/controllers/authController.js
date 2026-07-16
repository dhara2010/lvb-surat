const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Admin.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });
    const hash = await bcrypt.hash(newPassword, 10);
    admin.password = hash;
    await admin.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json(admins.map(a => {
      const obj = a.toObject();
      obj.id = obj._id;
      delete obj._id;
      delete obj.__v;
      return obj;
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await Admin.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username already exists' });
    const hash = await bcrypt.hash(password, 10);
    await Admin.create({ username, password: hash });
    res.json({ message: 'Admin account created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const updateData = { username };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    await Admin.findByIdAndUpdate(req.params.id, updateData);
    res.json({ message: 'Admin account updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Self-deletion is prohibited' });
    }
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
