const express = require('express');
const router = express.Router();
const { authenticateJWT, requireRole } = require('../middleware/auth');
const {
  getCategories,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// Public route - get active categories
router.get('/', getCategories);

// Admin routes
router.get('/all', authenticateJWT, requireRole('admin'), getAllCategories);
router.post('/', authenticateJWT, requireRole('admin'), createCategory);
router.put('/:id', authenticateJWT, requireRole('admin'), updateCategory);
router.delete('/:id', authenticateJWT, requireRole('admin'), deleteCategory);

module.exports = router;
