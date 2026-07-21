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
    const events = await Event.find().sort({ createdAt: -1 });
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

exports.bookTicket = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.year && event.month && event.date) {
      const eventDateObj = new Date(`${event.month} ${event.date}, ${event.year}`);
      const today = new Date();
      
      eventDateObj.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      if (eventDateObj.getTime() < today.getTime()) {
        return res.status(400).json({ error: 'Ticket booking is no longer available because this event has ended.' });
      }
    }
    
    res.json({ message: 'Ticket booked successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

