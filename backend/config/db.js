const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/clueless';

async function connectDB() {
    try {
    await mongoose.connect(uri, {
      dbName: 'Cluster0'
    });
    console.log("Connected to MongoDB database: Clueless");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

module.exports = { connectDB };