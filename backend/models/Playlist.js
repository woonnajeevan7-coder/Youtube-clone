import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
  playlistId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  userId: { type: String, required: true }, // uploader's userId
  videos: [{ type: String }] // array of videoId strings
}, { timestamps: true });

playlistSchema.index({ userId: 1 });

export default mongoose.model('Playlist', playlistSchema);
