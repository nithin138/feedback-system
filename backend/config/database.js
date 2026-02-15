const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Add family: 4 to force IPv4 (fixes ::1 connection issue on Windows)
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      family: 4
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    console.error(`💡 Make sure MongoDB is running. Start it with:`);
    console.error(`   Windows: net start MongoDB`);
    console.error(`   Mac: brew services start mongodb-community`);
    console.error(`   Linux: sudo systemctl start mongod`);
    process.exit(1);
  }
};

module.exports = connectDB;
