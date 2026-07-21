const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authenticateToken = require('../middleware/auth');

router.get('/', attendanceController.getAttendanceByDate);
router.get('/check', attendanceController.checkUserAttendance);
router.post('/mark', attendanceController.markAttendance);
router.post('/', attendanceController.markAttendance);
router.delete('/', authenticateToken, attendanceController.clearAttendance);

module.exports = router;
