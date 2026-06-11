import { z } from 'zod';

/**
 * Higher-order middleware to validate req.body against a Zod schema.
 */
export const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    next(error);
  }
};

// User Registration Validation Schema
export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

// User Login Validation Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

// Video Upload Validation Schema
export const uploadVideoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(1, 'Description is required'),
  thumbnailUrl: z.string().url('Invalid thumbnail URL format'),
  videoUrl: z.string().url('Invalid video URL format'),
  category: z.string().min(1, 'Category is required'),
  channelId: z.string().min(1, 'Channel ID is required')
});

// Channel Creation Validation Schema
export const createChannelSchema = z.object({
  channelName: z.string().min(3, 'Channel name must be at least 3 characters long').max(50, 'Channel name cannot exceed 50 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters long'),
  channelBanner: z.string().optional()
});
