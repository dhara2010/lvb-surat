const EventAttendance = require('../models/EventAttendance');
const Event = require('../models/Event');
const mongoose = require('mongoose');

// Haversine formula to calculate distance in meters
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const rad = Math.PI / 180;
    const phi1 = lat1 * rad;
    const phi2 = lat2 * rad;
    const deltaPhi = (lat2 - lat1) * rad;
    const deltaLam = (lon2 - lon1) * rad;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLam / 2) * Math.sin(deltaLam / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

exports.markAttendance = async (req, res) => {
    try {
        const { eventId, userId, latitude, longitude } = req.body;

        if (!eventId || !userId || !latitude || !longitude) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Server Time Validation
        const now = new Date();
        
        // India timezone: UTC+5:30. Let's get locale date in IST to match the usual event dates if they are stored in IST. 
        // Using straightforward UTC or local? The prompt says "store server time". The server might be anywhere, let's use IST since it's an Indian client (Surat).
        const options = { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' };
        const formatter = new Intl.DateTimeFormat('en-GB', options);
        // en-GB outputs DD/MM/YYYY, HH:mm
        const parts = formatter.formatToParts(now);
        const dateParts = {};
        parts.forEach(p => dateParts[p.type] = p.value);
        
        const serverDate = `${dateParts.year}-${dateParts.month}-${dateParts.day}`; // YYYY-MM-DD
        const hour = parseInt(dateParts.hour, 10);
        const minute = parseInt(dateParts.minute, 10);
        
        // Format the time as AM/PM for storage
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        const serverTimeStr = `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;

        // Event Date Validation
        // The event has date and month and year e.g. date: "21", month: "July", year: "2026".
        // Let's parse event date to YYYY-MM-DD for comparison, or just compare using Date objects.
        const monthMap = {
            'January': '01', 'February': '02', 'March': '03', 'April': '04', 'May': '05', 'June': '06',
            'July': '07', 'August': '08', 'September': '09', 'October': '10', 'November': '11', 'December': '12'
        };
        const eventMonthFormatted = monthMap[event.month] || '01';
        const eventDateFormatted = `${event.year}-${eventMonthFormatted}-${event.date.padStart(2, '0')}`;

        if (serverDate !== eventDateFormatted) {
            return res.status(400).json({ error: "Attendance can only be marked on the day of the event." });
        }

        // Time Validation (7:00 AM to 8:00 AM)
        if (hour !== 7) {
            // It's strictly 7:XX AM
            // Wait, is 8:00 AM allowed? "between 07:00 AM and 08:00 AM". So 07:00 to 08:00 inclusive? Usually it means up to 8:00:59 or 08:00:00. Let's allow hour === 8 && minute === 0.
            if (!(hour === 8 && minute === 0)) {
                return res.status(400).json({ error: "Attendance is only allowed between 7:00 AM and 8:00 AM." });
            }
        }

        // Location Validation
        if (!event.latitude || !event.longitude) {
             return res.status(500).json({ error: "Event location is not configured by admin." });
        }

        const distance = getDistanceInMeters(latitude, longitude, event.latitude, event.longitude);
        if (distance > 100) {
             return res.status(400).json({ error: "You must be at the event venue to mark attendance." });
        }

        // Duplicate Check is done by MongoDB unique index, but we can catch it.
        try {
            const attendance = new EventAttendance({
                userId,
                eventId: event._id,
                date: serverDate,
                time: serverTimeStr,
                latitude,
                longitude,
                status: 'Present'
            });
            await attendance.save();
            return res.status(200).json({ message: "Attendance marked successfully." });
        } catch (err) {
            if (err.code === 11000) {
                return res.status(400).json({ error: "You have already marked attendance for this event." });
            }
            throw err;
        }

    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ error: 'Server error marking attendance' });
    }
};

exports.getAttendancesForEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const attendances = await EventAttendance.find({ eventId }).sort({ createdAt: -1 });
        res.status(200).json(attendances);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching attendances' });
    }
};
