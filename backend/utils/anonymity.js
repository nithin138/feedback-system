/**
 * Generate anonymous identifier for students
 * Format: AS_XXXXX (e.g., AS_12345)
 * @returns {string} - Anonymous identifier
 */
const generateAnonymousId = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `AS_${randomNum}`;
};

/**
 * Get display name based on user role
 * Students get anonymous display, faculty/admin get real names
 * @param {object} user - User object
 * @returns {string} - Display name
 */
const getDisplayName = (user) => {
  if (!user) {
    return 'Unknown User';
  }
  
  if (user.role === 'student') {
    if (user.anonymousId) {
      const idNumber = user.anonymousId.split('_')[1];
      return `Anonymous Student #${idNumber}`;
    }
    return 'Anonymous Student';
  }
  
  return user.name;
};

/**
 * Strip student PII from user object
 * @param {object} user - User object
 * @param {boolean} isAdmin - Whether the requesting user is admin
 * @returns {object} - Safe user object
 */
const stripStudentPII = (user, isAdmin = false) => {
  if (!user) {
    return null;
  }
  
  // Convert to plain object if it's a Mongoose document
  const userObj = user.toObject ? user.toObject() : { ...user };
  
  // Remove password and OAuth ID for all users
  delete userObj.password;
  delete userObj.oauthId;
  delete userObj.__v;
  
  // For students, hide identity unless admin is requesting
  if (userObj.role === 'student' && !isAdmin) {
    return {
      _id: userObj._id,
      role: userObj.role,
      anonymousId: userObj.anonymousId,
      displayName: getDisplayName(userObj),
      createdAt: userObj.createdAt
    };
  }
  
  // For faculty/admin or when admin is requesting
  return {
    _id: userObj._id,
    email: isAdmin ? userObj.email : undefined,
    name: userObj.name,
    role: userObj.role,
    displayName: getDisplayName(userObj),
    approvalStatus: userObj.approvalStatus,
    anonymousId: userObj.anonymousId,
    createdAt: userObj.createdAt
  };
};

/**
 * Middleware to strip student PII from response
 * This ensures student identities are never exposed in API responses
 */
const anonymityMiddleware = (req, res, next) => {
  const originalJson = res.json.bind(res);
  
  res.json = function(data) {
    // Check if requesting user is admin
    const isAdmin = req.user && req.user.role === 'admin';
    
    // Recursively strip PII from response data
    const stripPII = (obj) => {
      if (!obj || typeof obj !== 'object') {
        return obj;
      }
      
      if (Array.isArray(obj)) {
        return obj.map(item => stripPII(item));
      }
      
      // Check if this is a user object
      if (obj.role && obj.email) {
        return stripStudentPII(obj, isAdmin);
      }
      
      // Check if this has an author or user field
      if (obj.author && typeof obj.author === 'object') {
        obj.author = stripStudentPII(obj.author, isAdmin);
      }
      
      if (obj.user && typeof obj.user === 'object') {
        obj.user = stripStudentPII(obj.user, isAdmin);
      }
      
      // Recursively process nested objects
      const result = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          result[key] = stripPII(obj[key]);
        }
      }
      
      return result;
    };
    
    const sanitizedData = stripPII(data);
    return originalJson(sanitizedData);
  };
  
  next();
};

/**
 * Check if user should see real identity
 * @param {object} requestingUser - User making the request
 * @param {object} targetUser - User whose identity is being accessed
 * @returns {boolean} - True if real identity should be shown
 */
const canSeeRealIdentity = (requestingUser, targetUser) => {
  if (!requestingUser || !targetUser) {
    return false;
  }
  
  // Admin can see all identities
  if (requestingUser.role === 'admin') {
    return true;
  }
  
  // Users can see their own identity
  if (requestingUser._id.toString() === targetUser._id.toString()) {
    return true;
  }
  
  // Faculty and admin identities are public
  if (targetUser.role === 'faculty' || targetUser.role === 'admin') {
    return true;
  }
  
  // Student identities are hidden
  return false;
};

module.exports = {
  generateAnonymousId,
  getDisplayName,
  stripStudentPII,
  anonymityMiddleware,
  canSeeRealIdentity
};
