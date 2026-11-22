const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Tên bộ sưu tập không được để trống'],
      trim: true,
      maxlength: [100, 'Tên bộ sưu tập tối đa 100 ký tự'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Mô tả tối đa 300 ký tự'],
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    postIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        index: true,
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

CollectionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Collection', CollectionSchema);
