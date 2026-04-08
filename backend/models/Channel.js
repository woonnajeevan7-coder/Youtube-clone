import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  channelId: { type: String, required: true, unique: true },
  channelName: { type: String, required: true, unique: true },
  owner: { type: String, required: true }, // userId
  description: { type: String, required: true },
  channelBanner: { type: String, default: 'https://via.placeholder.com/800x200' },
  subscribers: { type: Number, default: 0 },
  videos: [String] // videoIds
}, { timestamps: true });

export default mongoose.model('Channel', channelSchema);
