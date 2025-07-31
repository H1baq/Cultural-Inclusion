import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Use MongoDB Atlas URI from environment variables, fallback to local MongoDB
    const mongoURI = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/cultural-inclusion';
    
    console.log('🔗 Connecting to MongoDB...');
    console.log('📍 Database:', mongoURI.includes('mongodb.net') ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB');
    
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      retryWrites: true, // Retry write operations if they fail
      w: 'majority', // Write concern for data durability
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('🛑 MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('❌ Error during MongoDB shutdown:', err);
        process.exit(1);
      }
    });

    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('🔍 Error details:', error);
    
    // Provide helpful error messages
    if (error.name === 'MongoNetworkError') {
      console.error('🌐 Network Error: Check your internet connection and MongoDB Atlas network access');
    } else if (error.name === 'MongoServerSelectionError') {
      console.error('🔍 Server Selection Error: Check your MongoDB Atlas connection string and credentials');
    } else if (error.name === 'MongoParseError') {
      console.error('📝 Parse Error: Check your MongoDB connection string format');
    }
    
    process.exit(1);
  }
};

export default connectDB;
