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

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(mapId(event));
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
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Updated successfully', data: mapId(updatedEvent) });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};
