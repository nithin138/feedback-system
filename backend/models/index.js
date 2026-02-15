// Export all models from a single file for convenience
const User = require('./User');
const Feedback = require('./Feedback');
const Comment = require('./Comment');
const Like = require('./Like');
const Flag = require('./Flag');
const RatingCategory = require('./RatingCategory');
const Notification = require('./Notification');

module.exports = {
  User,
  Feedback,
  Comment,
  Like,
  Flag,
  RatingCategory,
  Notification
};
