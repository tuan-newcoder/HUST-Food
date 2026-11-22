const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Tên đăng nhập không được để trống'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Tên đăng nhập phải có ít nhất 3 ký tự'],
      maxlength: [30, 'Tên đăng nhập tối đa 30 ký tự'],
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email không được để trống'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Email không đúng định dạng'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Mật khẩu không được để trống'],
      select: false,
    },
    fullName: {
      type: String,
      required: [true, 'Họ và tên không được để trống'],
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: 'https://res.cloudinary.com/hustfood/image/upload/v1/default-avatar.png',
    },
    bio: {
      type: String,
      maxlength: [250, 'Tiểu sử tối đa 250 ký tự'],
      default: '',
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'BANNED'],
      default: 'ACTIVE',
      index: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    followersCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    postsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
UserSchema.index({ status: 1, role: 1 });

module.exports = mongoose.model('User', UserSchema);
