const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for a user
 * @param {object} user - User object with _id, email, role
 * @returns {string} - JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    approvalStatus: user.approvalStatus
  };
  
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '24h'
    }
  );
  
  return token;
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} - Decoded token payload
 * @throws {Error} - If token is invalid or expired
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const err = new Error('Token has expired');
      err.code = 'TOKEN_EXPIRED';
      err.status = 401;
      throw err;
    }
    
    if (error.name === 'JsonWebTokenError') {
      const err = new Error('Invalid token');
      err.code = 'INVALID_TOKEN';
      err.status = 401;
      throw err;
    }
    
    throw error;
  }
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} - Token or null if not found
 */
const extractToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

module.exports = {
  generateToken,
  verifyToken,
  extractToken
};
