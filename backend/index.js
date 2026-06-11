import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import mongoose from 'mongoose';
import env from './config/env.js';
import logger from './config/logger.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import channelRoutes from './routes/channelRoutes.js';
import playlistRoutes from './routes/playlistRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

connectDB();

const app = express();

app.use(compression());

// Stream Morgan access logs into Winston
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "http:", "https:"],
      mediaSrc: ["'self'", "https:"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));

const allowedOrigins = [
  env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

app.get('/', (req, res) => res.send('API is running...'));

// Global Central Error Handler Middleware
app.use((err, req, res, next) => {
  logger.error('Central Error Handler Captured:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: env.NODE_ENV === 'production' ? {} : { message: err.message, stack: err.stack }
  });
});

const PORT = env.PORT;
let server;
if (process.env.VERCEL !== '1') {
  server = app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
}

// Graceful shutdown listeners
const handleGracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');
      try {
        await mongoose.connection.close(false);
        logger.info('MongoDB connection closed.');
        process.exit(0);
      } catch (err) {
        logger.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

export default app;
