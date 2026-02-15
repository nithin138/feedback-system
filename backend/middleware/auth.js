const { verifyToken, extractToken } = require('../utils/jwt');
const { User } = require('../models');

/**
 * Middleware to verify JWT token and attach user to request
 */
const authenticateJWT = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = extractToken(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: 'No authentication token provided'
        }
      });
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Find user in database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    // Check if user can access the system
    if (!user.canAccess()) {
      let message = 'Access denied';
      let code = 'ACCESS_DENIED';
      
      if (user.isBanned) {
        message = 'Your account has been banned';
        code = 'ACCOUNT_BANNED';
      } else if (user.isSuspended) {
        message = `Your account is suspended until ${user.suspensionEndDate}`;
        code = 'ACCOUNT_SUSPENDED';
      } else if (user.role === 'faculty' && user.approvalStatus !== 'approved') {
        message = 'Your faculty account is pending approval';
        code = 'PENDING_APPROVAL';
      }
      
      return res.status(403).json({
        success: false,
        error: {
          code,
          message
        }
      });
    }
    
    // Attach user to request
    req.user = user;
    next();
    
  } catch (error) {
    if (error.status === 401) {
      return res.status(401).json({
        success: false,
        error: {
          code: error.code,
          message: error.message
        }
      });
    }
    
    return res.status(500).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Authentication failed'
      }
    });
  }
};

/**
 * Middleware to check if user has required role
 * @param {...string} roles - Allowed roles
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this resource'
        }
      });
    }
    
    next();
  };
};

/**
 * Optional authentication - attaches user if token is valid, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);
    
    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.canAccess()) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
};

module.exports = {
  authenticateJWT,
  requireRole,
  optionalAuth
};
