import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'https://via.placeholder.com/150' },
  channels: [String],
  watchHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Date }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
