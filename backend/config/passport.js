const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

// Configure Google OAuth Strategy only if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists with this Google ID
          let user = await User.findOne({ oauthId: profile.id });
          
          if (user) {
            // User exists, return user
            return done(null, user);
          }
          
          // Check if user exists with this email
          user = await User.findOne({ email: profile.emails[0].value });
          
          if (user) {
            // User exists with email but not linked to Google
            // Link Google account to existing user
            user.oauthProvider = 'google';
            user.oauthId = profile.id;
            await user.save();
            return done(null, user);
          }
          
          // Create new user
          // Note: We don't know the role yet, so we'll need to handle this in the callback
          // For now, we'll create as student by default
          const newUser = await User.create({
            email: profile.emails[0].value,
            name: profile.displayName || profile.emails[0].value.split('@')[0],
            oauthProvider: 'google',
            oauthId: profile.id,
            role: 'student', // Default role, can be changed during registration
            password: null // No password for OAuth users
          });
          
          return done(null, newUser);
          
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
  console.log('✅ Google OAuth configured');
} else {
  console.log('⚠️  Google OAuth not configured - only email/password login available');
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
