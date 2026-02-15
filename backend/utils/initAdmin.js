const { User } = require('../models');
const { hashPassword } = require('./password');

/**
 * Initialize default admin account if none exists
 */
const initializeAdmin = async () => {
  try {
    // Check if any admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('✅ Admin account already exists');
      return;
    }
    
    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@college.edu';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const adminName = process.env.ADMIN_NAME || 'System Administrator';
    
    // Hash password
    const hashedPassword = await hashPassword(adminPassword);
    
    // Create admin user
    const admin = await User.create({
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: 'admin',
      oauthProvider: 'local',
      approvalStatus: 'approved'
    });
    
    console.log('✅ Default admin account created successfully');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('   ⚠️  Please change the default password after first login!');
    
  } catch (error) {
    console.error('❌ Error initializing admin account:', error.message);
  }
};

module.exports = initializeAdmin;
