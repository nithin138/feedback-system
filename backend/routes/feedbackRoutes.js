const express = require('express');
const {
  createFeedback,
  getFeed,
  getFeedbackById,
  updateFeedback,
  deleteFeedback
} = require('../controllers/feedbackController');
const {
  likeFeedback,
  unlikeFeedback,
  addComment,
  getComments
} = require('../controllers/socialController');
const { flagPost } = require('../controllers/moderationController');
const { authenticateJWT, optionalAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Public/Optional auth routes
router.get('/', optionalAuth, getFeed);
router.get('/:id', optionalAuth, getFeedbackById);
router.get('/:id/comments', getComments);

// Protected routes
router.post('/', authenticateJWT, createFeedback);
router.put('/:id', authenticateJWT, updateFeedback);
router.delete('/:id', authenticateJWT, deleteFeedback);

// Social interactions
router.post('/:id/like', authenticateJWT, likeFeedback);
router.delete('/:id/like', authenticateJWT, unlikeFeedback);
router.post('/:id/comment', authenticateJWT, addComment);

// Moderation (Faculty and Admin only)
router.post('/:id/flag', authenticateJWT, requireRole('faculty', 'admin'), flagPost);

module.exports = router;
