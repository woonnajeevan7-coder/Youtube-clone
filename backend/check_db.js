import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Video from './models/Video.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const checkData = async () => {
  try {
    const count = await Video.countDocuments();
    console.log(`Video count: ${count}`);
    const videos = await Video.find({}).limit(1);
    console.log('Sample video Title:', videos[0]?.title);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkData();
