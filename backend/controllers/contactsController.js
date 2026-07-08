const Contact = require('../models/Contact');

const mapId = (doc) => {
  const obj = doc.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ created_at: -1 });
    res.json(contacts.map(mapId));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createContact = async (req, res) => {
  try {
    await Contact.create(req.body);
    res.json({ message: 'Message sent successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
