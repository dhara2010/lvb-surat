const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authenticateToken = require('../middleware/auth');

router.get('/', attendanceController.getAttendanceByDate);
router.post('/', authenticateToken, attendanceController.markAttendance);
router.delete('/', authenticateToken, attendanceController.clearAttendance);

module.exports = router;
