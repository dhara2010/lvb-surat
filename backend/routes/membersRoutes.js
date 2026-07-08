const express = require('express');
const router = express.Router();
const membersController = require('../controllers/membersController');
const authenticateToken = require('../middleware/auth');

router.get('/', membersController.getMembers);
router.post('/', authenticateToken, membersController.createMember);
router.put('/:id', authenticateToken, membersController.updateMember);
router.delete('/:id', authenticateToken, membersController.deleteMember);

module.exports = router;
