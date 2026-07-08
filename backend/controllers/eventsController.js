const Event = require('../models/Event');

const mapId = (doc) => {
  const obj = doc.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events.map(mapId));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createEvent = async (req, res) => {
  try {
    await Event.create(req.body);
    res.json({ message: 'Added successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateEvent = async (req, res) => {
  try {
    await Event.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
