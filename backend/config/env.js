import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.preprocess((val) => val || '5000', z.string()),
  MONGO_URI: z.string({
    required_error: 'MONGO_URI is required'
  }).url('MONGO_URI must be a valid connection URL'),
  JWT_SECRET: z.string({
    required_error: 'JWT_SECRET is required'
  }).min(8, 'JWT_SECRET must be at least 8 characters long'),
  CLIENT_URL: z.string().url('CLIENT_URL must be a valid URL').optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development')
});

const envResult = envSchema.safeParse(process.env);

if (!envResult.success) {
  console.error('❌ FATAL: Environment variable validation failed!');
  console.error(JSON.stringify(envResult.error.format(), null, 2));
  process.exit(1);
}

export const env = envResult.data;
export default env;
