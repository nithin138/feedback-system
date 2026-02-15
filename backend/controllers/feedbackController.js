const { Feedback, User, RatingCategory, Like } = require('../models');
const { getDisplayName } = require('../utils/anonymity');

/**
 * Create new feedback post
 * POST /api/feedback
 */
const createFeedback = async (req, res) => {
  try {
    const { content, category, targetFacultyId, targetCourse, targetFacility, ratings } = req.body;
    const author = req.user;

    // Validate content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'EMPTY_CONTENT',
          message: 'Feedback content is required'
        }
      });
    }

    // Validate ratings if provided
    if (ratings && ratings.length > 0) {
      for (const rating of ratings) {
        if (rating.value < 1 || rating.value > 5) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'INVALID_RATING',
              message: 'Rating values must be between 1 and 5'
            }
          });
        }
      }
    }

    // Create feedback
    const feedback = await Feedback.create({
      authorId: author._id,
      authorAnonymousId: author.role === 'student' ? author.anonymousId : null,
      content: content.trim(),
      category: category || 'general',
      targetFacultyId: targetFacultyId || null,
      targetCourse: targetCourse || null,
      targetFacility: targetFacility || null,
      ratings: ratings || []
    });

    // Populate author for response
    await feedback.populate('authorId');
    const safeFeedback = await feedback.toSafeObject();

    res.status(201).json({
      success: true,
      data: {
        feedback: safeFeedback
      },
      message: 'Feedback posted successfully'
    });

  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_FEEDBACK_ERROR',
        message: 'Failed to create feedback'
      }
    });
  }
};

/**
 * Get feedback feed with filtering and sorting
 * GET /api/feedback
 */
const getFeed = async (req, res) => {
  try {
    const { category, sort = 'recent', limit = 20, skip = 0 } = req.query;
    const user = req.user;

    // Build query
    const query = {};

    // Hide flagged posts for non-admin users
    if (!user || user.role !== 'admin') {
      query.isHidden = false;
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Debug logging
    console.log('=== GET FEED DEBUG ===');
    console.log('User:', user ? { id: user._id, role: user.role } : 'Not authenticated');
    console.log('Query:', JSON.stringify(query));
    console.log('Category filter:', category);
    console.log('Sort:', sort);

    // Build sort
    let sortOption = {};
    switch (sort) {
      case 'mostLiked':
        sortOption = { likeCount: -1, createdAt: -1 };
        break;
      case 'highestRated':
        sortOption = { 'ratings.value': -1, createdAt: -1 };
        break;
      case 'recent':
      default:
        sortOption = { createdAt: -1 };
    }

    // Check total posts in DB (without filters)
    const totalInDb = await Feedback.countDocuments({});
    const totalHidden = await Feedback.countDocuments({ isHidden: true });
    console.log('Total posts in DB:', totalInDb);
    console.log('Total hidden posts:', totalHidden);
    console.log('Total visible posts:', totalInDb - totalHidden);

    // Fetch feedback
    const feedbacks = await Feedback.find(query)
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('authorId');

    console.log('Feedbacks found with query:', feedbacks.length);
    console.log('======================');

    // Convert to safe objects
    const safeFeedbacks = await Promise.all(
      feedbacks.map(feedback => feedback.toSafeObject(user))
    );

    // Check which posts the user has liked (if authenticated)
    if (user) {
      const feedbackIds = feedbacks.map(f => f._id);
      const userLikes = await Like.find({
        feedbackId: { $in: feedbackIds },
        userId: user._id
      }).select('feedbackId');

      const likedPostIds = new Set(userLikes.map(like => like.feedbackId.toString()));

      // Add userLiked field to each feedback
      safeFeedbacks.forEach(feedback => {
        feedback.userLiked = likedPostIds.has(feedback._id.toString());
      });
    } else {
      // Not authenticated, set all to false
      safeFeedbacks.forEach(feedback => {
        feedback.userLiked = false;
      });
    }

    // Get total count
    const total = await Feedback.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        feedbacks: safeFeedbacks,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          hasMore: total > parseInt(skip) + parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_FEED_ERROR',
        message: 'Failed to fetch feedback'
      }
    });
  }
};

/**
 * Get specific feedback post
 * GET /api/feedback/:id
 */
const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const feedback = await Feedback.findById(id).populate('authorId');

    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'FEEDBACK_NOT_FOUND',
          message: 'Feedback post not found'
        }
      });
    }

    // Check if user can view this post
    if (feedback.isHidden && (!user || user.role !== 'admin')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'FEEDBACK_NOT_FOUND',
          message: 'Feedback post not found'
        }
      });
    }

    const safeFeedback = await feedback.toSafeObject(user);

    // Check if user has liked this post
    if (user) {
      const userLike = await Like.findOne({
        feedbackId: id,
        userId: user._id
      });
      safeFeedback.userLiked = !!userLike;
    } else {
      safeFeedback.userLiked = false;
    }

    res.status(200).json({
      success: true,
      data: {
        feedback: safeFeedback
      }
    });

  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_FEEDBACK_ERROR',
        message: 'Failed to fetch feedback'
      }
    });
  }
};

/**
 * Update feedback post
 * PUT /api/feedback/:id
 */
const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, ratings } = req.body;
    const user = req.user;

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

    // Check authorization (author or admin)
    if (feedback.authorId.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You can only edit your own posts'
        }
      });
    }

    // Update fields
    if (content) feedback.content = content.trim();
    if (ratings) feedback.ratings = ratings;

    await feedback.save();
    await feedback.populate('authorId');

    const safeFeedback = await feedback.toSafeObject(user);

    res.status(200).json({
      success: true,
      data: {
        feedback: safeFeedback
      },
      message: 'Feedback updated successfully'
    });

  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_FEEDBACK_ERROR',
        message: 'Failed to update feedback'
      }
    });
  }
};

/**
 * Delete feedback post
 * DELETE /api/feedback/:id
 */
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

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

    // Check authorization (author or admin)
    if (feedback.authorId.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You can only delete your own posts'
        }
      });
    }

    await feedback.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });

  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_FEEDBACK_ERROR',
        message: 'Failed to delete feedback'
      }
    });
  }
};

module.exports = {
  createFeedback,
  getFeed,
  getFeedbackById,
  updateFeedback,
  deleteFeedback
};
