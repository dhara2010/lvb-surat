const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const authenticateToken = require('../middleware/auth');

router.get('/', eventsController.getEvents);
router.get('/:id', eventsController.getEventById);
router.post('/', authenticateToken, eventsController.createEvent);
router.put('/:id', authenticateToken, eventsController.updateEvent);
router.delete('/:id', authenticateToken, eventsController.deleteEvent);

module.exports = router;
