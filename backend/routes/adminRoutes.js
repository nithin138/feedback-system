const express = require('express');
const {
  getPendingFaculty,
  approveFaculty,
  rejectFaculty,
  getFlaggedPosts,
  dismissFlag,
  suspendStudent,
  banStudent
} = require('../controllers/adminController');
const { authenticateJWT, requireRole } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin role
router.use(authenticateJWT, requireRole('admin'));

// Faculty approval routes
router.get('/faculty/pending', getPendingFaculty);
router.put('/faculty/:id/approve', approveFaculty);
router.put('/faculty/:id/reject', rejectFaculty);

// Moderation routes
router.get('/flags', getFlaggedPosts);
router.put('/flags/:id/dismiss', dismissFlag);
router.put('/flags/:id/suspend', suspendStudent);
router.put('/flags/:id/ban', banStudent);

module.exports = router;
