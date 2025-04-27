import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI
    
    const conn = await mongoose.connect(uri);
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;