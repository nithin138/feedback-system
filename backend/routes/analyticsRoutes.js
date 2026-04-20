const express = require('express');
const router = express.Router();
const { authenticateJWT, requireRole } = require('../middleware/auth');
const {
  getAdminAnalytics,
  getFacultyAnalytics
} = require('../controllers/analyticsController');

// Admin analytics
router.get('/admin', authenticateJWT, requireRole('admin'), getAdminAnalytics);

// Faculty analytics
router.get('/faculty', authenticateJWT, requireRole('faculty', 'admin'), getFacultyAnalytics);

module.exports = router;
