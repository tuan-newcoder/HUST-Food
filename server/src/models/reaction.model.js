const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['YUMMY'],
      default: 'YUMMY',
    },
  },
  {
    timestamps: true,
  }
);

ReactionSchema.index({ postId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Reaction', ReactionSchema);
