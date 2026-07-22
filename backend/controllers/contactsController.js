const Contact = require('../models/Contact');

const mapId = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  const idStr = String(obj._id || obj.id || '');
  obj.id = idStr;
  obj._id = idStr;
  delete obj.__v;
  return obj;
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1, created_at: -1 });
    res.json(contacts.map(mapId).filter(Boolean));
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

exports.createContact = async (req, res) => {
  try {
    const newContact = await Contact.create(req.body);
    res.json({ message: 'Message sent successfully', data: mapId(newContact) });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
