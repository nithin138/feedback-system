const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    // Password is optional for OAuth users
    required: function() {
      return this.oauthProvider === 'local';
    },
    minlength: [6, 'Password must be at least 6 characters']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    required: [true, 'Role is required'],
    default: 'student'
  },
  anonymousId: {
    type: String,
    sparse: true, // Only students have anonymousId
    // Format: AS_XXXXX (e.g., AS_12345)
  },
  displayName: {
    type: String,
    trim: true,
    default: null
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: function() {
      return this.role === 'faculty' ? 'pending' : 'approved';
    }
  },
  oauthProvider: {
    type: String,
    enum: ['google', 'local'],
    default: 'local'
  },
  oauthId: {
    type: String,
    sparse: true // Only for OAuth users
  },
  isSuspended: {
    type: Boolean,
    default: false
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  suspensionEndDate: {
    type: Date,
    default: null
  },
  themePreference: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ anonymousId: 1 }, { unique: true, sparse: true });
userSchema.index({ role: 1, approvalStatus: 1 });
userSchema.index({ oauthId: 1 }, { unique: true, sparse: true });

// Pre-save hook to generate anonymousId for students
userSchema.pre('save', function(next) {
  // Generate anonymousId only for students and only if not already set
  if (this.role === 'student' && !this.anonymousId) {
    // Generate random 5-digit number
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    this.anonymousId = `AS_${randomNum}`;
  }
  next();
});

// Method to get display name based on role
userSchema.methods.getDisplayName = function() {
  // If user has set a custom display name, use it
  if (this.displayName) {
    return this.displayName;
  }
  
  // Otherwise, use anonymous ID for students
  if (this.role === 'student') {
    return this.anonymousId;
  }
  
  // For faculty/admin, use their real name
  return this.name;
};

// Method to check if user can access the system
userSchema.methods.canAccess = function() {
  // Banned users cannot access
  if (this.isBanned) {
    return false;
  }
  
  // Suspended users cannot access until suspension ends
  if (this.isSuspended && this.suspensionEndDate && new Date() < this.suspensionEndDate) {
    return false;
  }
  
  // Faculty must be approved
  if (this.role === 'faculty' && this.approvalStatus !== 'approved') {
    return false;
  }
  
  return true;
};

// Method to get safe user object (without sensitive data)
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.oauthId;
  
  // For students, hide real identity in public contexts
  if (this.role === 'student') {
    return {
      _id: obj._id,
      role: obj.role,
      anonymousId: obj.anonymousId,
      displayName: obj.displayName,
      themePreference: obj.themePreference,
      createdAt: obj.createdAt
    };
  }
  
  return {
    _id: obj._id,
    email: obj.email,
    name: obj.name,
    role: obj.role,
    displayName: obj.displayName,
    approvalStatus: obj.approvalStatus,
    themePreference: obj.themePreference,
    createdAt: obj.createdAt
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
