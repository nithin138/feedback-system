const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  feedbackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feedback',
    required: [true, 'Feedback ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  }
}, {
  timestamps: true
});

// Compound unique index to prevent duplicate likes
likeSchema.index({ feedbackId: 1, userId: 1 }, { unique: true });
likeSchema.index({ userId: 1 });

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
