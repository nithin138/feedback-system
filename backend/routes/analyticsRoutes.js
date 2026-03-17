const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAdminAnalytics,
  getFacultyAnalytics
} = require('../controllers/analyticsController');

// Admin analytics
router.get('/admin', protect, authorize('admin'), getAdminAnalytics);

// Faculty analytics
router.get('/faculty', protect, authorize('faculty', 'admin'), getFacultyAnalytics);

module.exports = router;
