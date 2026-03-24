import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Video from './models/Video.js';
import Channel from './models/Channel.js';

dotenv.config();

const videos = [
  {
    videoId: "video01",
    title: "Learn React in 30 Minutes",
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "A quick tutorial to get started with React.",
    channelId: "channel01",
    uploader: "user01",
    views: 15200,
    likes: 1023,
    dislikes: 45,
    uploadDate: "2024-09-20",
    category: "Education",
    comments: [
      {
        commentId: "comment01",
        userId: "user02",
        text: "Great video! Very helpful.",
        timestamp: "2024-09-21T08:30:00Z"
      }
    ]
  },
  {
    videoId: "video02",
    title: "Vite is the Future of Frontend",
    thumbnailUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    description: "Why you should switch from CRA to Vite.",
    channelId: "channel02",
    uploader: "techguru",
    views: 5400,
    likes: 800,
    dislikes: 10,
    uploadDate: "2024-10-15",
    category: "Technology",
    comments: []
  },
  {
    videoId: "video03",
    title: "Top 5 Programming Languages in 2025",
    thumbnailUrl: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "The languages you need to learn to stay relevant.",
    channelId: "channel02",
    uploader: "techguru",
    views: 12000,
    likes: 1500,
    dislikes: 20,
    uploadDate: "2024-11-01",
    category: "Education",
    comments: []
  },
  {
    videoId: "video04",
    title: "Relaxing Jazz Music for Studying",
    thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    description: "Smooth jazz for focused work.",
    channelId: "channel03",
    uploader: "musically",
    views: 89000,
    likes: 4500,
    dislikes: 100,
    uploadDate: "2024-12-10",
    category: "Music",
    comments: []
  },
  {
    videoId: "video05",
    title: "Elden Ring: Shadow of the Erdtree Gameplay",
    thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "Insane boss fight highlights.",
    channelId: "channel04",
    uploader: "gamerpro",
    views: 250000,
    likes: 20000,
    dislikes: 500,
    uploadDate: "2025-01-05",
    category: "Gaming",
    comments: []
  },
  {
    videoId: "video06",
    title: "Morning Routine of a Web Developer",
    thumbnailUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    description: "How I stay productive throughout the day.",
    channelId: "channel01",
    uploader: "user01",
    views: 32000,
    likes: 2100,
    dislikes: 15,
    uploadDate: "2025-02-12",
    category: "Technology",
    comments: []
  },
  {
    videoId: "video07",
    title: "UFC 300 Highlights",
    thumbnailUrl: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "The best knockouts from the main card.",
    channelId: "channel05",
    uploader: "sportscenter",
    views: 1500000,
    likes: 85000,
    dislikes: 2000,
    uploadDate: "2025-03-01",
    category: "Sports",
    comments: []
  },
  {
    videoId: "video08",
    title: "Breaking News: Major Tech Merger",
    thumbnailUrl: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    description: "A deep dive into the latest industry shift.",
    channelId: "channel06",
    uploader: "newsnetwork",
    views: 45000,
    likes: 1200,
    dislikes: 300,
    uploadDate: "2025-03-20",
    category: "News",
    comments: []
  },
  {
    videoId: "video09",
    title: "Quick and Easy Chicken Pasta",
    thumbnailUrl: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "Dinner in 15 minutes.",
    channelId: "channel01",
    uploader: "user01",
    views: 22000,
    likes: 1100,
    dislikes: 12,
    uploadDate: "2025-03-22",
    category: "Education",
    comments: []
  },
  {
    videoId: "video10",
    title: "The Science of Black Holes",
    thumbnailUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    description: "Understanding the most mysterious objects in the universe.",
    channelId: "channel02",
    uploader: "techguru",
    views: 67000,
    likes: 4200,
    dislikes: 35,
    uploadDate: "2025-03-24",
    category: "Education",
    comments: []
  }
];

const channels = [
  { channelId: "channel01", channelName: "Code with John", owner: "user01", description: "Coding tutorials and tech reviews by John Doe.", channelBanner: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80", subscribers: 5200 },
  { channelId: "channel02", channelName: "Tech Daily", owner: "user02", description: "All things technology.", channelBanner: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80", subscribers: 120000 },
  { channelId: "channel03", channelName: "Chill Beats", owner: "user03", description: "Music to relax to.", subscribers: 450000 },
  { channelId: "channel04", channelName: "Gamer Realm", owner: "user04", description: "Level up your gaming.", subscribers: 250000 },
  { channelId: "channel05", channelName: "Sports Central", owner: "user05", description: "All sports, all the time.", subscribers: 1000000 },
  { channelId: "channel06", channelName: "News Wire", owner: "user06", description: "Stay informed.", subscribers: 50000 }
];

const users = [
  { userId: "user01", username: "JohnDoe", email: "john@example.com", password: "hashedPassword123", avatar: "https://ui-avatars.com/api/?name=John+Doe", channels: ["channel01"] },
  { userId: "user02", username: "techguru", email: "tech@example.com", password: "hashedPassword456", avatar: "https://ui-avatars.com/api/?name=Tech+Guru" }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await User.deleteMany({});
    await Video.deleteMany({});
    await Channel.deleteMany({});

    await User.insertMany(users);
    await Video.insertMany(videos);
    await Channel.insertMany(channels);

    console.log("Database Seeded Successfully with Rubric-Specific Samples!");
    process.exit();
  } catch (error) {
    console.error("Error Seeding Database:", error);
    process.exit(1);
  }
};

seedDB();
