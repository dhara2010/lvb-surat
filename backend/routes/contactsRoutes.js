const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contactsController');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, contactsController.getContacts);
router.post('/', contactsController.createContact);
router.delete('/:id', authenticateToken, contactsController.deleteContact);

module.exports = router;
