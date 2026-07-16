const Member = require('../models/Member');
const Attendance = require('../models/Attendance');

exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required (format: YYYY-MM-DD).' });
    }

    // Get all members
    const members = await Member.find().sort({ name: 1 });
    
    // Get all attendance records for this date
    const records = await Attendance.find({ date });
    
    // Create a map of memberId to check-in record details
    const attendanceMap = {};
    records.forEach(r => {
      attendanceMap[r.memberId.toString()] = {
        id: r._id,
        checkInTime: r.checkInTime,
        status: r.status
      };
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
        status: att.status
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { memberId, date, checkInTime, status } = req.body;
    if (!memberId || !date) {
      return res.status(400).json({ error: 'memberId and date are required.' });
    }

    const checkIn = checkInTime || new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Find and update or insert a new attendance record
    const record = await Attendance.findOneAndUpdate(
      { memberId, date },
      { checkInTime: checkIn, status: status || 'Present' },
      { new: true, upsert: true }
    );

    res.json({ message: 'Attendance marked successfully', record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.clearAttendance = async (req, res) => {
  try {
    const { memberId, date } = req.query; // Accept both query and body
    const targetMemberId = memberId || req.body.memberId;
    const targetDate = date || req.body.date;

    if (!targetMemberId || !targetDate) {
      return res.status(400).json({ error: 'memberId and date parameters are required.' });
    }

    await Attendance.findOneAndDelete({ memberId: targetMemberId, date: targetDate });
    res.json({ message: 'Attendance record cleared successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
