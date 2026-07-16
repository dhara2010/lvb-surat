const express = require('express');
const router = express.Router();
const chaptersController = require('../controllers/chaptersController');
const authenticateToken = require('../middleware/auth');

router.get('/', chaptersController.getChapters);
router.post('/', authenticateToken, chaptersController.createChapter);
router.put('/:id', authenticateToken, chaptersController.updateChapter);
router.delete('/:id', authenticateToken, chaptersController.deleteChapter);

module.exports = router;
