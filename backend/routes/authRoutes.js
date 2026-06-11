import express from 'express';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  refreshAccessToken, 
  addWatchHistory, 
  getWatchHistory 
} from '../controllers/authController.js';
import { validateRequest, registerSchema, loginSchema } from '../middleware/validationMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { protect } from '../middleware/authMiddleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

router.post('/register', authLimiter, validateRequest(registerSchema), asyncHandler(registerUser));
router.post('/login', authLimiter, validateRequest(loginSchema), asyncHandler(loginUser));
router.post('/logout', asyncHandler(logoutUser));
router.post('/refresh', asyncHandler(refreshAccessToken));
router.post('/history', protect, asyncHandler(addWatchHistory));
router.get('/history', protect, asyncHandler(getWatchHistory));

export default router;
