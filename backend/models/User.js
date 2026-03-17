import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please add a username'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    channels: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
    }]
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
