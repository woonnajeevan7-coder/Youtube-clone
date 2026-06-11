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

const router = express.Router();

router.post('/register', authLimiter, validateRequest(registerSchema), registerUser);
router.post('/login', authLimiter, validateRequest(loginSchema), loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshAccessToken);
router.post('/history', protect, addWatchHistory);
router.get('/history', protect, getWatchHistory);

export default router;
