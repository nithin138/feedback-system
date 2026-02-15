const { Feedback, Like, Comment } = require('../models');
const { getDisplayName } = require('../utils/anonymity');

/**
 * Like a feedback post
 * POST /api/feedback/:id/like
 */
const likeFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

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

    // Check if already liked
    const existingLike = await Like.findOne({
      feedbackId: id,
      userId: user._id
    });

    if (existingLike) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ALREADY_LIKED',
          message: 'You have already liked this post'
        }
      });
    }

    // Create like
    await Like.create({
      feedbackId: id,
      userId: user._id
    });

    // Increment like count
    feedback.likeCount += 1;
    await feedback.save();

    res.status(200).json({
      success: true,
      data: {
        likeCount: feedback.likeCount
      },
      message: 'Post liked successfully'
    });

  } catch (error) {
    console.error('Like feedback error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LIKE_ERROR',
        message: 'Failed to like post'
      }
    });
  }
};

/**
 * Unlike a feedback post
 * DELETE /api/feedback/:id/like
 */
const unlikeFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

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

    // Find and delete like
    const like = await Like.findOneAndDelete({
      feedbackId: id,
      userId: user._id
    });

    if (!like) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NOT_LIKED',
          message: 'You have not liked this post'
        }
      });
    }

    // Decrement like count
    feedback.likeCount = Math.max(0, feedback.likeCount - 1);
    await feedback.save();

    res.status(200).json({
      success: true,
      data: {
        likeCount: feedback.likeCount
      },
      message: 'Post unliked successfully'
    });

  } catch (error) {
    console.error('Unlike feedback error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UNLIKE_ERROR',
        message: 'Failed to unlike post'
      }
    });
  }
};

/**
 * Add comment to feedback post
 * POST /api/feedback/:id/comment
 */
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const user = req.user;

    // Validate content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'EMPTY_CONTENT',
          message: 'Comment content is required'
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

    // Create comment with appropriate display name
    const authorDisplay = getDisplayName(user);
    const comment = await Comment.create({
      feedbackId: id,
      authorId: user._id,
      authorAnonymousId: user.role === 'student' ? user.anonymousId : null,
      authorDisplay,
      content: content.trim()
    });

    // Increment comment count
    feedback.commentCount += 1;
    await feedback.save();

    res.status(201).json({
      success: true,
      data: {
        comment: {
          _id: comment._id,
          authorDisplay: comment.authorDisplay,
          content: comment.content,
          createdAt: comment.createdAt
        },
        commentCount: feedback.commentCount
      },
      message: 'Comment added successfully'
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'COMMENT_ERROR',
        message: 'Failed to add comment'
      }
    });
  }
};

/**
 * Get comments for feedback post
 * GET /api/feedback/:id/comments
 */
const getComments = async (req, res) => {
  try {
    const { id } = req.params;

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

    // Get comments in chronological order
    const comments = await Comment.find({ feedbackId: id })
      .sort({ createdAt: 1 })
      .select('authorDisplay content createdAt');

    res.status(200).json({
      success: true,
      data: {
        comments
      }
    });

  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_COMMENTS_ERROR',
        message: 'Failed to fetch comments'
      }
    });
  }
};

module.exports = {
  likeFeedback,
  unlikeFeedback,
  addComment,
  getComments
};
