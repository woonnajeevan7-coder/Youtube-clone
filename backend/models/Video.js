import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  commentId: { type: String, required: true },
  userId: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const videoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  videoUrl: { type: String, required: true },
  description: { type: String, required: true },
  channelId: { type: String, required: true },
  uploader: { type: String, required: true },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  uploadDate: { type: Date, default: Date.now },
  category: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  comments: [commentSchema]
}, { timestamps: true });

videoSchema.index({ channelId: 1 });
videoSchema.index({ category: 1, uploadDate: -1 });
videoSchema.index({ uploadDate: -1 });
videoSchema.index({ title: 'text' });

export default mongoose.model('Video', videoSchema);
