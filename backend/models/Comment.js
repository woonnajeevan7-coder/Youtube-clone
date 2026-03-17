import mongoose from 'mongoose';

const commentSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Please add comment text'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
