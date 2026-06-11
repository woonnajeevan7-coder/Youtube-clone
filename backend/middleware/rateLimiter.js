import rateLimit from 'express-rate-limit';

// Limit auth routes (login / register) to 20 attempts per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login or registration attempts. Please try again after 15 minutes.' }
});

// Limit video uploads to 10 per hour
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many video uploads. Please try again after an hour.' }
});

// Limit comments to 15 per minute
export const commentLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many comments posted. Please wait a minute.' }
});
