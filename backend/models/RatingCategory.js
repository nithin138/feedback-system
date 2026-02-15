const mongoose = require('mongoose');

const ratingCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: null
  },
  applicableTo: {
    type: [String],
    enum: ['faculty', 'course', 'facility'],
    required: [true, 'Applicable to field is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one applicable type is required'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
ratingCategorySchema.index({ name: 1 }, { unique: true });
ratingCategorySchema.index({ isActive: 1 });

const RatingCategory = mongoose.model('RatingCategory', ratingCategorySchema);

module.exports = RatingCategory;
