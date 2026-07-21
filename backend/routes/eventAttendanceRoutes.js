const express = require('express');
const router = express.Router();
const eventAttendanceController = require('../controllers/eventAttendanceController');
const authenticateToken = require('../middleware/auth');

router.post('/', eventAttendanceController.markAttendance);
router.get('/:eventId', authenticateToken, eventAttendanceController.getAttendancesForEvent);

module.exports = router;
