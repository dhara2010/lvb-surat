const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const authenticateToken = require('../middleware/auth');

router.get('/', notificationsController.getNotifications);
router.post('/', authenticateToken, notificationsController.createNotification);
router.put('/:id', authenticateToken, notificationsController.updateNotification);
router.delete('/:id', authenticateToken, notificationsController.deleteNotification);

module.exports = router;
