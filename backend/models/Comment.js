const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  feedbackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feedback',
    required: [true, 'Feedback ID is required']
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  authorAnonymousId: {
    type: String,
    // Required for student comments
    default: null
  },
  authorDisplay: {
    type: String,
    required: [true, 'Author display name is required']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [300, 'Comment cannot exceed 300 characters']
  }
}, {
  timestamps: true
});

// Indexes
commentSchema.index({ feedbackId: 1, createdAt: 1 });
commentSchema.index({ authorId: 1 });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
