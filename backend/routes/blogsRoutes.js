const express = require('express');
const router = express.Router();
const blogsController = require('../controllers/blogsController');
const authenticateToken = require('../middleware/auth');

router.get('/', blogsController.getBlogs);
router.post('/', authenticateToken, blogsController.createBlog);
router.put('/:id', authenticateToken, blogsController.updateBlog);
router.delete('/:id', authenticateToken, blogsController.deleteBlog);

module.exports = router;
