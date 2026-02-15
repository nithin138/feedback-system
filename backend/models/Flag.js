const mongoose = require('mongoose');

const flagSchema = new mongoose.Schema({
  feedbackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feedback',
    required: [true, 'Feedback ID is required']
  },
  flaggedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Flagged by user is required']
  },
  reason: {
    type: String,
    required: [true, 'Flag reason is required'],
    trim: true,
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'dismissed', 'actioned'],
    default: 'pending'
  },
  adminAction: {
    type: String,
    enum: ['none', 'dismissed', 'suspended', 'banned'],
    default: 'none'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters'],
    default: null
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
flagSchema.index({ status: 1, createdAt: -1 });
flagSchema.index({ feedbackId: 1 });
flagSchema.index({ flaggedBy: 1 });

const Flag = mongoose.model('Flag', flagSchema);

module.exports = Flag;
