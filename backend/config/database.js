const mongoose = require('mongoose');

// Cache the connection to avoid multiple connections in serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  try {
    // If already connected, return the existing connection
    if (cached.conn) {
      return cached.conn;
    }

    if (cached.promise) {
      return cached.promise;
    }

    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://nexusit_db_user:nzORq3lNZbV7qOwZ@cluster0.fwjo5og.mongodb.net/saint-db?retryWrites=true&w=majority&appName=Cluster0';
    
    console.log('🔄 Connecting to MongoDB...');
    console.log('MongoDB URI:', mongoURI.replace(/\/\/.*@/, '//***:***@'));
    
    // Set connection options for serverless
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    cached.promise = mongoose.connect(mongoURI, opts).then((mongoose) => {
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
      console.log(`✅ Database Name: ${mongoose.connection.name}`);
      return mongoose;
    });

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    cached.promise = null;
    throw error;
  }
};

module.exports = connectDB;
