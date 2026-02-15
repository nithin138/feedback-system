const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  authorAnonymousId: {
    type: String,
    required: function() {
      // Required for student posts
      return this.populated('authorId') && this.authorId.role === 'student';
    }
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [500, 'Content cannot exceed 500 characters']
  },
  category: {
    type: String,
    enum: ['general', 'faculty', 'course', 'facility'],
    default: 'general'
  },
  targetFacultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  targetCourse: {
    type: String,
    trim: true,
    default: null
  },
  targetFacility: {
    type: String,
    trim: true,
    default: null
  },
  ratings: [{
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RatingCategory'
    },
    categoryName: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    }
  }],
  likeCount: {
    type: Number,
    default: 0,
    min: 0
  },
  commentCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  flaggedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  flagReason: {
    type: String,
    default: null
  },
  isHidden: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for performance
feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ category: 1, isHidden: 1 });
feedbackSchema.index({ targetFacultyId: 1, isHidden: 1 });
feedbackSchema.index({ authorId: 1 });
feedbackSchema.index({ isFlagged: 1, isHidden: 1 });
feedbackSchema.index({ likeCount: -1 });

// Virtual for average rating
feedbackSchema.virtual('averageRating').get(function() {
  if (!this.ratings || this.ratings.length === 0) {
    return 0;
  }
  const sum = this.ratings.reduce((acc, rating) => acc + rating.value, 0);
  return (sum / this.ratings.length).toFixed(2);
});

// Method to get safe feedback object (with anonymity preserved)
feedbackSchema.methods.toSafeObject = async function(requestingUser) {
  await this.populate('authorId');
  
  const obj = this.toObject({ virtuals: true });
  
  // Always hide author's real identity for students
  if (obj.authorId && obj.authorId.role === 'student') {
    // Use displayName if set, otherwise use anonymousId
    obj.authorDisplay = obj.authorId.displayName || obj.authorAnonymousId;
    delete obj.authorId;
  } else if (obj.authorId) {
    // For faculty/admin, use displayName if set, otherwise use real name
    obj.authorDisplay = obj.authorId.displayName || obj.authorId.name;
    obj.authorRole = obj.authorId.role;
    delete obj.authorId;
  }
  
  // Remove sensitive fields
  delete obj.__v;
  
  return obj;
};

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
