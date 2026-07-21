const mongoose = require('mongoose');
const Member = require('../models/Member');
const Attendance = require('../models/Attendance');
const Event = require('../models/Event');
const { getISTTimeInfo, computeAttendanceStatus, resolveEventDate } = require('./eventsController');

exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date, eventId } = req.query;
    
    let query = {};
    if (eventId && mongoose.Types.ObjectId.isValid(eventId)) {
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
        id: att.id || null,
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
    console.error('getAttendanceByDate error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { memberId, eventId, latitude, longitude, accuracy } = req.body;
    let targetDate = req.body.date;

    if (!memberId || !mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ error: 'Valid memberId is required.' });
    }

    // Verify member exists
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    const { currentDateIST, checkInTimeIST } = getISTTimeInfo();

    // If eventId is provided and valid, perform strict server-side IST date/time validation
    if (eventId && mongoose.Types.ObjectId.isValid(eventId)) {
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
      eventId: (eventId && mongoose.Types.ObjectId.isValid(eventId)) ? eventId : null,
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
    console.error('markAttendance error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.checkUserAttendance = async (req, res) => {
  try {
    const { eventId, memberId } = req.query;
    if (!eventId || !memberId || !mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(memberId)) {
      return res.json({ marked: false, record: null });
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
    const { id, memberId, date, eventId } = req.query;
    const targetId = id || req.query.attendanceId || req.body?.id || req.body?.attendanceId;
    const targetMemberId = memberId || req.body?.memberId;
    const targetDate = date || req.body?.date;
    const targetEventId = eventId || req.body?.eventId;

    // 1. Try deleting by attendance record ID first if provided and valid
    if (targetId && mongoose.Types.ObjectId.isValid(targetId)) {
      const deleted = await Attendance.findByIdAndDelete(targetId);
      if (deleted) {
        return res.json({ message: 'Attendance record cleared successfully.' });
      }
    }

    // 2. Build flexible filter for deletion
    let filter = {};
    if (targetMemberId && mongoose.Types.ObjectId.isValid(targetMemberId)) {
      filter.memberId = targetMemberId;
    }

    if (targetEventId && mongoose.Types.ObjectId.isValid(targetEventId)) {
      filter.eventId = targetEventId;
    } else if (targetDate && String(targetDate).trim() !== '') {
      filter.date = String(targetDate).trim();
    }

    // If no valid filter conditions were met, handle gracefully instead of crashing
    if (Object.keys(filter).length === 0) {
      if (targetId) {
        // ID was provided but record wasn't found (already deleted)
        return res.json({ message: 'Attendance record already cleared or not found.' });
      }
      return res.status(400).json({ error: 'Valid id, memberId, eventId, or date is required.' });
    }

    const result = await Attendance.deleteMany(filter);
    res.json({ message: 'Attendance record cleared successfully.', count: result.deletedCount });
  } catch (err) {
    console.error('clearAttendance error:', err);
    res.status(500).json({ error: err.message });
  }
};
