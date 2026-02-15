const { Feedback, Flag, Notification, User } = require('../models');

/**
 * Flag a feedback post (Faculty only)
 * POST /api/feedback/:id/flag
 */
const flagPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const faculty = req.user;

    // Validate reason
    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_REASON',
          message: 'Flag reason is required'
        }
      });
    }

    // Check if feedback exists
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'FEEDBACK_NOT_FOUND',
          message: 'Feedback post not found'
        }
      });
    }

    // Check if already flagged
    if (feedback.isFlagged) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ALREADY_FLAGGED',
          message: 'This post has already been flagged'
        }
      });
    }

    // Create flag
    await Flag.create({
      feedbackId: id,
      flaggedBy: faculty._id,
      reason: reason.trim()
    });

    // Update feedback
    feedback.isFlagged = true;
    feedback.isHidden = true;
    feedback.flaggedBy = faculty._id;
    feedback.flagReason = reason.trim();
    await feedback.save();

    // Notify all admins
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        userId: admin._id,
        type: 'flag',
        title: 'New Flagged Post',
        message: `A post has been flagged by ${faculty.name} for: ${reason.trim()}`,
        relatedId: id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Post flagged successfully and hidden from feed'
    });

  } catch (error) {
    console.error('Flag post error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FLAG_ERROR',
        message: 'Failed to flag post'
      }
    });
  }
};

module.exports = {
  flagPost
};
