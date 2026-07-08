const express = require('express');
const router = express.Router();
const leadersController = require('../controllers/leadersController');
const authenticateToken = require('../middleware/auth');

router.get('/', leadersController.getLeaders);
router.post('/', authenticateToken, leadersController.createLeader);
router.put('/:id', authenticateToken, leadersController.updateLeader);
router.delete('/:id', authenticateToken, leadersController.deleteLeader);

module.exports = router;
