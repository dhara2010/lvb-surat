const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const authenticateToken = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/change-password', authenticateToken, authController.changePassword);

router.get('/admins', authenticateToken, authController.getAdmins);
router.post('/admins', authenticateToken, authController.createAdmin);
router.put('/admins/:id', authenticateToken, authController.updateAdmin);
router.delete('/admins/:id', authenticateToken, authController.deleteAdmin);

module.exports = router;
