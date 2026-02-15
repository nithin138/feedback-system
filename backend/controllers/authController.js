const { User } = require('../models');
const { hashPassword, comparePassword, validatePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

/**
 * Register new user with email and password
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    
    // Validate required fields
    if (!email || !password || !name || !role) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Email, password, name, and role are required'
        }
      });
    }
    
    // Validate role
    if (!['student', 'faculty'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ROLE',
          message: 'Role must be either student or faculty'
        }
      });
    }
    
    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'WEAK_PASSWORD',
          message: 'Password does not meet requirements',
          details: passwordValidation.errors
        }
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists'
        }
      });
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role,
      oauthProvider: 'local'
    });
    
    // Generate token
    const token = generateToken(user);
    
    // Return response
    res.status(201).json({
      success: true,
      data: {
        token,
        user: user.toSafeObject()
      },
      message: role === 'faculty' 
        ? 'Registration successful. Your account is pending admin approval.' 
        : 'Registration successful'
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'REGISTRATION_ERROR',
        message: 'Failed to register user'
      }
    });
  }
};

/**
 * Login with email and password
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_CREDENTIALS',
          message: 'Email and password are required'
        }
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }
    
    // Check if user registered with OAuth
    if (user.oauthProvider !== 'local' || !user.password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'OAUTH_USER',
          message: 'This account uses Google sign-in. Please use "Continue with Google"'
        }
      });
    }
    
    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }
    
    // Check if user can access
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
    
    // Generate token
    const token = generateToken(user);
    
    // Return response
    res.status(200).json({
      success: true,
      data: {
        token,
        user: user.toSafeObject()
      },
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGIN_ERROR',
        message: 'Failed to login'
      }
    });
  }
};

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user.toSafeObject()
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_USER_ERROR',
        message: 'Failed to get user information'
      }
    });
  }
};

/**
 * Logout (client-side token removal)
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  try {
    // In JWT-based auth, logout is handled client-side by removing the token
    // This endpoint is mainly for consistency and future enhancements
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGOUT_ERROR',
        message: 'Failed to logout'
      }
    });
  }
};

/**
 * Google OAuth callback handler
 * This will be called by Passport after Google authentication
 */
const googleCallback = async (req, res) => {
  try {
    // User is attached to req by Passport
    const user = req.user;
    
    // Generate token
    const token = generateToken(user);
    
    // Redirect to frontend with token
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendURL}/auth/callback?token=${token}`);
    
  } catch (error) {
    console.error('Google callback error:', error);
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendURL}/auth/callback?error=authentication_failed`);
  }
};

/**
 * Update user display name
 * PUT /api/auth/display-name
 */
const updateDisplayName = async (req, res) => {
  try {
    const { displayName } = req.body;
    
    // Validate display name
    if (!displayName || displayName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DISPLAY_NAME',
          message: 'Display name cannot be empty'
        }
      });
    }
    
    if (displayName.trim().length > 50) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DISPLAY_NAME_TOO_LONG',
          message: 'Display name must be 50 characters or less'
        }
      });
    }
    
    // Update user
    req.user.displayName = displayName.trim();
    await req.user.save();
    
    res.status(200).json({
      success: true,
      data: {
        user: req.user.toSafeObject()
      },
      message: 'Display name updated successfully'
    });
    
  } catch (error) {
    console.error('Update display name error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Failed to update display name'
      }
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  googleCallback,
  updateDisplayName
};
