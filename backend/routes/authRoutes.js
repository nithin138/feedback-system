const express = require('express');
const passport = require('passport');
const { 
  register, 
  login, 
  getMe, 
  logout, 
  googleCallback,
  updateDisplayName
} = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

// Email/Password Authentication
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Get current user (protected route)
router.get('/me', authenticateJWT, getMe);

// Update display name (protected route)
router.put('/display-name', authenticateJWT, updateDisplayName);

// Google OAuth routes (only if configured)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google', 
    passport.authenticate('google', { 
      scope: ['profile', 'email'],
      session: false 
    })
  );

  router.get('/google/callback',
    passport.authenticate('google', { 
      session: false,
      failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=auth_failed`
    }),
    googleCallback
  );
} else {
  // Return error if OAuth not configured
  router.get('/google', (req, res) => {
    res.status(503).json({
      success: false,
      error: {
        code: 'OAUTH_NOT_CONFIGURED',
        message: 'Google OAuth is not configured. Please use email/password login.'
      }
    });
  });
}

module.exports = router;
