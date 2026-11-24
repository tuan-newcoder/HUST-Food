const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    reason: {
      type: String,
      enum: ['SPAM', 'INAPPROPRIATE', 'WRONG_INFO', 'OTHER'],
      required: [true, 'Lý do báo cáo không được để trống'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Mô tả tối đa 500 ký tự'],
      default: '',
    },
    status: {
      type: String,
      enum: ['PENDING', 'RESOLVED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

ReportSchema.index({ status: 1, createdAt: -1 });
ReportSchema.index({ reporterId: 1, targetPostId: 1 });

module.exports = mongoose.model('Report', ReportSchema);
