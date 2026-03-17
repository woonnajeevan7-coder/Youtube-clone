import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import videos from './data/videos.js';
import User from './models/User.js';
import Video from './models/Video.js';
import Channel from './models/Channel.js';
import Comment from './models/Comment.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Video.deleteMany();
    await Channel.deleteMany();
    await Comment.deleteMany();

    // Insert users
    const createdUsers = await User.insertMany(users);
    
    // Assign channels to each user
    const channel1 = await Channel.create({
      channelName: 'Code with John',
      description: 'Coding tutorials and tech reviews by John Doe.',
      channelBanner: 'https://images.unsplash.com/photo-1627398246454-e918b958e8b6?w=1200&h=300&fit=crop',
      owner: createdUsers[0]._id,
      subscribers: 5200,
    });
    createdUsers[0].channels.push(channel1._id);
    await createdUsers[0].save();

    const channel2 = await Channel.create({
      channelName: 'Jane Rides',
      description: 'Mountain biking adventures around the world.',
      channelBanner: 'https://images.unsplash.com/photo-1507034589631-9433cc6bc453?w=1200&h=300&fit=crop',
      owner: createdUsers[1]._id,
      subscribers: 12000,
    });
    createdUsers[1].channels.push(channel2._id);
    await createdUsers[1].save();

    const channel3 = await Channel.create({
      channelName: 'Tech Life Daily',
      description: 'Daily tech setups, reviews, and lifestyle.',
      channelBanner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=300&fit=crop',
      owner: createdUsers[2]._id,
      subscribers: 89000,
    });
    createdUsers[2].channels.push(channel3._id);
    await createdUsers[2].save();

    // Insert videos, linking to respective channels and uploaders
    const sampleVideos = videos.map((video, index) => {
      let channelId, uploader;
      
      if (index < 2) {
        channelId = channel1._id;
        uploader = createdUsers[0]._id;
      } else if (index < 4) {
        channelId = channel2._id;
        uploader = createdUsers[1]._id;
      } else {
        channelId = channel3._id;
        uploader = createdUsers[2]._id;
      }

      return { ...video, channelId, uploader };
    });

    const createdVideos = await Video.insertMany(sampleVideos);

    // Create a few sample comments
    await Comment.create({
      text: 'Great video! Very helpful.',
      userId: createdUsers[1]._id,
      videoId: createdVideos[0]._id,
    });

    await Comment.create({
      text: 'Awesome setup!',
      userId: createdUsers[0]._id,
      videoId: createdVideos[4]._id,
    });

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Video.deleteMany();
    await Channel.deleteMany();
    await Comment.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
