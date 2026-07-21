const Event = require('../models/Event');

const monthMap = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
};

// Returns current server date (YYYY-MM-DD), 24-hr time (HH:mm), and 12-hr formatted string in Asia/Kolkata (IST)
const getISTTimeInfo = () => {
  const now = new Date();
  
  const formatterDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' });
  const currentDateIST = formatterDate.format(now); // e.g. "2026-07-20"

  const formatterTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const currentTimeIST = formatterTime.format(now); // e.g. "07:15"

  const formatter12h = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const checkInTimeIST = formatter12h.format(now);

  return { currentDateIST, currentTimeIST, checkInTimeIST };
};

const resolveEventDate = (event) => {
  if (event.eventDate) return event.eventDate;
  if (event.year && event.month && event.date) {
    const mStr = String(event.month).toLowerCase().trim().substring(0, 3);
    const mNum = monthMap[mStr] || '01';
    const dNum = String(event.date).trim().padStart(2, '0');
    const yNum = String(event.year).trim();
    return `${yNum}-${mNum}-${dNum}`;
  }
  return null;
};

const computeAttendanceStatus = (event) => {
  if (event.attendanceEnabled === false) {
    return {
      status: 'DISABLED',
      message: 'Attendance is disabled for this event.'
    };
  }

  const targetDate = resolveEventDate(event);
  if (!targetDate) {
    return {
      status: 'DISABLED',
      message: 'Event date not configured.'
    };
  }

  const { currentDateIST, currentTimeIST } = getISTTimeInfo();
  const openTime = event.attendanceOpenTime !== undefined && event.attendanceOpenTime !== null && event.attendanceOpenTime !== '' ? event.attendanceOpenTime : '07:00';
  const closeTime = event.attendanceCloseTime !== undefined && event.attendanceCloseTime !== null && event.attendanceCloseTime !== '' ? event.attendanceCloseTime : '08:00';

  if (currentDateIST < targetDate) {
    return {
      status: 'UPCOMING',
      message: `Attendance opens on ${targetDate} at ${openTime} IST`,
      targetDate,
      openTime,
      closeTime
    };
  }

  if (currentDateIST > targetDate) {
    return {
      status: 'CLOSED',
      message: 'Attendance Closed',
      targetDate,
      openTime,
      closeTime
    };
  }

  // Same date (currentDateIST === targetDate)
  if (currentTimeIST < openTime) {
    return {
      status: 'UPCOMING',
      message: `Attendance opens at ${openTime} IST`,
      targetDate,
      openTime,
      closeTime
    };
  }

  if (currentTimeIST > closeTime) {
    return {
      status: 'CLOSED',
      message: 'Attendance Closed',
      targetDate,
      openTime,
      closeTime
    };
  }

  return {
    status: 'OPEN',
    message: 'Attendance Open',
    targetDate,
    openTime,
    closeTime
  };
};

const mapId = (doc) => {
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id;
  
  const attendanceInfo = computeAttendanceStatus(obj);
  obj.attendanceInfo = attendanceInfo;
  obj.attendanceStatus = attendanceInfo.status;
  
  delete obj._id;
  delete obj.__v;
  return obj;
};

const sanitizeEventPayload = (raw) => {
  const data = { ...raw };
  delete data.id;
  delete data._id;
  delete data.attendanceInfo;
  delete data.attendanceStatus;
  delete data.createdAt;
  delete data.updatedAt;

  if (Array.isArray(data.sessions)) {
    data.sessions = data.sessions.map(s => {
      const item = { ...s };
      delete item._id;
      delete item.id;
      return item;
    });
  }

  if (Array.isArray(data.tickets)) {
    data.tickets = data.tickets.map(t => {
      const item = { ...t };
      delete item._id;
      delete item.id;
      item.price = String(item.price !== undefined && item.price !== null ? item.price : '');
      return item;
    });
  }

  if (!data.eventDate && data.year && data.month && data.date) {
    data.eventDate = resolveEventDate(data);
  }

  return data;
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events.map(mapId));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(mapId(event));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const sanitized = sanitizeEventPayload(req.body);
    const newEvent = await Event.create(sanitized);
    res.json({ message: 'Added successfully', data: mapId(newEvent) });
  } catch (err) {
    console.error('createEvent error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const sanitized = sanitizeEventPayload(req.body);
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, sanitized, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Updated successfully', data: mapId(updatedEvent) });
  } catch (err) {
    console.error('updateEvent error:', err);
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

// Export timing and status utilities for attendance controller
exports.getISTTimeInfo = getISTTimeInfo;
exports.resolveEventDate = resolveEventDate;
exports.computeAttendanceStatus = computeAttendanceStatus;
