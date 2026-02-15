const { User, Feedback, Flag, Notification } = require('../models');

/**
 * Get pending faculty approvals
 * GET /api/admin/faculty/pending
 */
const getPendingFaculty = async (req, res) => {
  try {
    const pendingFaculty = await User.find({
      role: 'faculty',
      approvalStatus: 'pending'
    }).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        faculty: pendingFaculty
      }
    });

  } catch (error) {
    console.error('Get pending faculty error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_PENDING_ERROR',
        message: 'Failed to fetch pending faculty'
      }
    });
  }
};

/**
 * Approve faculty registration
 * PUT /api/admin/faculty/:id/approve
 */
const approveFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    const faculty = await User.findById(id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'FACULTY_NOT_FOUND',
          message: 'Faculty member not found'
        }
      });
    }

    if (faculty.role !== 'faculty') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NOT_FACULTY',
          message: 'User is not a faculty member'
        }
      });
    }

    faculty.approvalStatus = 'approved';
    await faculty.save();

    // Create notification
    await Notification.create({
      userId: faculty._id,
      type: 'approval',
      title: 'Account Approved',
      message: 'Your faculty account has been approved. You can now access the system.'
    });

    res.status(200).json({
      success: true,
      message: 'Faculty approved successfully'
    });

  } catch (error) {
    console.error('Approve faculty error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'APPROVE_ERROR',
        message: 'Failed to approve faculty'
      }
    });
  }
};

/**
 * Reject faculty registration
 * PUT /api/admin/faculty/:id/reject
 */
const rejectFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    const faculty = await User.findById(id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'FACULTY_NOT_FOUND',
          message: 'Faculty member not found'
        }
      });
    }

    faculty.approvalStatus = 'rejected';
    await faculty.save();

    // Create notification
    await Notification.create({
      userId: faculty._id,
      type: 'rejection',
      title: 'Account Rejected',
      message: 'Your faculty account registration has been rejected. Please contact administration for more information.'
    });

    res.status(200).json({
      success: true,
      message: 'Faculty rejected successfully'
    });

  } catch (error) {
    console.error('Reject faculty error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'REJECT_ERROR',
        message: 'Failed to reject faculty'
      }
    });
  }
};

/**
 * Get all flagged posts
 * GET /api/admin/flags
 */
const getFlaggedPosts = async (req, res) => {
  try {
    const flags = await Flag.find({ status: 'pending' })
      .populate({
        path: 'feedbackId',
        populate: { path: 'authorId' }
      })
      .populate('flaggedBy', 'name email')
      .sort({ createdAt: -1 });

    // Format response with student identity revealed
    const flaggedPosts = flags.map(flag => ({
      _id: flag._id,
      feedback: {
        _id: flag.feedbackId._id,
        content: flag.feedbackId.content,
        category: flag.feedbackId.category,
        createdAt: flag.feedbackId.createdAt,
        author: {
          _id: flag.feedbackId.authorId._id,
          name: flag.feedbackId.authorId.name,
          email: flag.feedbackId.authorId.email,
          anonymousId: flag.feedbackId.authorId.anonymousId
        }
      },
      flaggedBy: flag.flaggedBy,
      reason: flag.reason,
      createdAt: flag.createdAt
    }));

    res.status(200).json({
      success: true,
      data: {
        flags: flaggedPosts
      }
    });

  } catch (error) {
    console.error('Get flagged posts error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_FLAGS_ERROR',
        message: 'Failed to fetch flagged posts'
      }
    });
  }
};

/**
 * Dismiss flag (restore post)
 * PUT /api/admin/flags/:id/dismiss
 */
const dismissFlag = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = req.user;

    const flag = await Flag.findById(id).populate('feedbackId flaggedBy');

    if (!flag) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'FLAG_NOT_FOUND',
          message: 'Flag not found'
        }
      });
    }

    // Update flag status
    flag.status = 'dismissed';
    flag.adminAction = 'dismissed';
    flag.reviewedBy = admin._id;
    flag.reviewedAt = new Date();
    await flag.save();

    // Restore post visibility
    const feedback = await Feedback.findById(flag.feedbackId);
    if (feedback) {
      feedback.isHidden = false;
      feedback.isFlagged = false;
      await feedback.save();
    }

    // Notify faculty who flagged
    await Notification.create({
      userId: flag.flaggedBy._id,
      type: 'moderation',
      title: 'Flag Dismissed',
      message: 'The post you flagged has been reviewed and restored.',
      relatedId: flag.feedbackId._id
    });

    res.status(200).json({
      success: true,
      message: 'Flag dismissed and post restored'
    });

  } catch (error) {
    console.error('Dismiss flag error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DISMISS_ERROR',
        message: 'Failed to dismiss flag'
      }
    });
  }
};

/**
 * Suspend student account
 * PUT /api/admin/flags/:id/suspend
 */
const suspendStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { days = 7 } = req.body;
    const admin = req.user;

    const flag = await Flag.findById(id).populate('feedbackId flaggedBy');

    if (!flag) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'FLAG_NOT_FOUND',
          message: 'Flag not found'
        }
      });
    }

    // Get student from feedback
    const feedback = await Feedback.findById(flag.feedbackId).populate('authorId');
    const student = feedback.authorId;

    if (student.role !== 'student') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NOT_STUDENT',
          message: 'Can only suspend student accounts'
        }
      });
    }

    // Suspend student
    student.isSuspended = true;
    student.suspensionEndDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    await student.save();

    // Update flag
    flag.status = 'actioned';
    flag.adminAction = 'suspended';
    flag.reviewedBy = admin._id;
    flag.reviewedAt = new Date();
    await flag.save();

    // Notify faculty
    await Notification.create({
      userId: flag.flaggedBy._id,
      type: 'moderation',
      title: 'User Suspended',
      message: `The user who posted the flagged content has been suspended for ${days} days.`,
      relatedId: flag.feedbackId._id
    });

    res.status(200).json({
      success: true,
      message: `Student suspended for ${days} days`
    });

  } catch (error) {
    console.error('Suspend student error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SUSPEND_ERROR',
        message: 'Failed to suspend student'
      }
    });
  }
};

/**
 * Ban student account permanently
 * PUT /api/admin/flags/:id/ban
 */
const banStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = req.user;

    const flag = await Flag.findById(id).populate('feedbackId flaggedBy');

    if (!flag) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'FLAG_NOT_FOUND',
          message: 'Flag not found'
        }
      });
    }

    // Get student from feedback
    const feedback = await Feedback.findById(flag.feedbackId).populate('authorId');
    const student = feedback.authorId;

    if (student.role !== 'student') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NOT_STUDENT',
          message: 'Can only ban student accounts'
        }
      });
    }

    // Ban student
    student.isBanned = true;
    await student.save();

    // Update flag
    flag.status = 'actioned';
    flag.adminAction = 'banned';
    flag.reviewedBy = admin._id;
    flag.reviewedAt = new Date();
    await flag.save();

    // Notify faculty
    await Notification.create({
      userId: flag.flaggedBy._id,
      type: 'moderation',
      title: 'User Banned',
      message: 'The user who posted the flagged content has been permanently banned.',
      relatedId: flag.feedbackId._id
    });

    res.status(200).json({
      success: true,
      message: 'Student banned permanently'
    });

  } catch (error) {
    console.error('Ban student error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'BAN_ERROR',
        message: 'Failed to ban student'
      }
    });
  }
};

module.exports = {
  getPendingFaculty,
  approveFaculty,
  rejectFaculty,
  getFlaggedPosts,
  dismissFlag,
  suspendStudent,
  banStudent
};
