const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Nội dung bình luận không được để trống'],
      trim: true,
      maxlength: [1000, 'Bình luận tối đa 1000 ký tự'],
    },
    repliesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

CommentSchema.index({ postId: 1, parentId: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', CommentSchema);
