import mongoose from 'mongoose';

const channelSchema = mongoose.Schema(
  {
    channelName: {
      type: String,
      required: [true, 'Please add a channel name'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    channelBanner: {
      type: String,
      default: 'https://via.placeholder.com/800x200',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subscribers: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Channel = mongoose.model('Channel', channelSchema);
export default Channel;
