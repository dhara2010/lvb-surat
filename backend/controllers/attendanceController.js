const Member = require('../models/Member');
const Attendance = require('../models/Attendance');
const Event = require('../models/Event');
const { getISTTimeInfo, computeAttendanceStatus, resolveEventDate } = require('./eventsController');

exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date, eventId } = req.query;
    
    let query = {};
    if (eventId) {
      query.eventId = eventId;
    } else if (date && date.trim() !== '' && date.trim() !== 'all') {
      query.date = date.trim();
    }

    // Get all members
    const members = await Member.find().sort({ name: 1 });
    
    // Get all matching attendance records, latest first
    const records = await Attendance.find(query).sort({ markedAt: -1, createdAt: -1 });
    
    // Create map of memberId to record (first seen is newest)
    const attendanceMap = {};
    records.forEach(r => {
      if (r.memberId) {
        const key = r.memberId.toString();
        if (!attendanceMap[key]) {
          attendanceMap[key] = {
            id: r._id,
            eventId: r.eventId,
            date: r.date,
            checkInTime: r.checkInTime,
            status: r.status,
            latitude: r.latitude,
            longitude: r.longitude,
            accuracy: r.accuracy,
            markedAt: r.markedAt
          };
        }
      }
    });

    // Merge members with check-in records
    const result = members.map(m => {
      const att = attendanceMap[m._id.toString()] || { checkInTime: '-', status: 'Not Arrived' };
      return {
        member: {
          id: m._id,
          name: m.name,
          businessName: m.businessName,
          businessCategory: m.businessCategory,
          photoUrl: m.photoUrl,
          logoUrl: m.logoUrl,
          memberId: m.memberId || `MEM-${m._id.toString().substring(18).toUpperCase()}`,
          chapter: m.chapter || 'Surat Platinum'
        },
        checkInTime: att.checkInTime,
        status: att.status,
        latitude: att.latitude,
        longitude: att.longitude,
        accuracy: att.accuracy,
        markedAt: att.markedAt,
        eventId: att.eventId,
        date: att.date
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { memberId, eventId, latitude, longitude, accuracy } = req.body;
    let targetDate = req.body.date;

    if (!memberId) {
      return res.status(400).json({ error: 'memberId is required.' });
    }

    // Verify member exists
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    const { currentDateIST, checkInTimeIST } = getISTTimeInfo();

    // If eventId is provided, perform strict server-side IST date/time validation
    if (eventId) {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found.' });
      }

      const attendanceInfo = computeAttendanceStatus(event);
      if (attendanceInfo.status !== 'OPEN') {
        return res.status(400).json({
          error: attendanceInfo.message || 'Attendance is currently closed for this event.'
        });
      }

      // Check for duplicate submission
      const existing = await Attendance.findOne({ eventId, memberId });
      if (existing) {
        return res.status(400).json({
          error: 'Attendance has already been marked for this event by this member.'
        });
      }

      targetDate = resolveEventDate(event) || currentDateIST;
    } else {
      if (!targetDate) {
        targetDate = currentDateIST;
      }
      // Check duplicate by memberId and date for date-only checkins
      const existingDate = await Attendance.findOne({ memberId, date: targetDate, eventId: null });
      if (existingDate) {
        return res.status(400).json({
          error: 'Attendance has already been marked for this date.'
        });
      }
    }

    const record = await Attendance.create({
      eventId: eventId || null,
      memberId,
      date: targetDate,
      checkInTime: checkInTimeIST,
      status: 'Present',
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      accuracy: accuracy ? Number(accuracy) : undefined,
      markedAt: new Date()
    });

    res.json({
      message: 'Attendance marked successfully',
      record: {
        id: record._id,
        eventId: record.eventId,
        memberId: record.memberId,
        date: record.date,
        checkInTime: record.checkInTime,
        status: record.status,
        latitude: record.latitude,
        longitude: record.longitude,
        accuracy: record.accuracy,
        markedAt: record.markedAt
      }
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Duplicate attendance record detected.' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.checkUserAttendance = async (req, res) => {
  try {
    const { eventId, memberId } = req.query;
    if (!eventId || !memberId) {
      return res.status(400).json({ error: 'Both eventId and memberId are required.' });
    }

    const record = await Attendance.findOne({ eventId, memberId });
    res.json({
      marked: !!record,
      record: record ? {
        id: record._id,
        checkInTime: record.checkInTime,
        status: record.status,
        markedAt: record.markedAt
      } : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.clearAttendance = async (req, res) => {
  try {
    const { memberId, date, eventId } = req.query;
    const targetMemberId = memberId || req.body.memberId;
    const targetDate = date || req.body.date;
    const targetEventId = eventId || req.body.eventId;

    if (!targetMemberId) {
      return res.status(400).json({ error: 'memberId is required.' });
    }

    let filter = { memberId: targetMemberId };
    if (targetEventId) {
      filter.eventId = targetEventId;
    } else if (targetDate) {
      filter.date = targetDate;
    }

    await Attendance.findOneAndDelete(filter);
    res.json({ message: 'Attendance record cleared successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
