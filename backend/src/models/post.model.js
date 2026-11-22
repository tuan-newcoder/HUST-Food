const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Tác giả bài viết không được để trống'],
      index: true,
    },
    postType: {
      type: String,
      enum: ['REVIEW', 'RECIPE'],
      required: [true, 'Loại bài viết phải là REVIEW hoặc RECIPE'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Tiêu đề bài viết không được để trống'],
      trim: true,
      maxlength: [150, 'Tiêu đề tối đa 150 ký tự'],
    },
    content: {
      type: String,
      required: [true, 'Nội dung bài viết không được để trống'],
    },
    images: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    restaurantInfo: {
      name: { type: String, trim: true },
      address: { type: String, trim: true },
      priceRange: {
        min: { type: Number, min: 0 },
        max: { type: Number, min: 0 },
      },
      ratings: {
        taste: { type: Number, min: 1, max: 5 },
        price: { type: Number, min: 1, max: 5 },
        hygiene: { type: Number, min: 1, max: 5 },
        service: { type: Number, min: 1, max: 5 },
        overall: { type: Number, min: 1, max: 5 },
      },
      location: {
        type: {
          type: String,
          enum: ['Point'],
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
        },
      },
    },
    recipeInfo: {
      cookingTimeMinutes: { type: Number, min: 1 },
      estimatedCost: { type: Number, min: 0 },
      servings: { type: Number, default: 1, min: 1 },
      difficulty: {
        type: String,
        enum: ['EASY', 'MEDIUM', 'HARD'],
      },
      ingredients: [
        {
          name: { type: String, required: true },
          amount: { type: String, required: true },
        },
      ],
      steps: [
        {
          stepNumber: { type: Number },
          instruction: { type: String },
          imageUrl: { type: String },
        },
      ],
    },
    metrics: {
      yummyCount: { type: Number, default: 0, min: 0 },
      commentsCount: { type: Number, default: 0, min: 0 },
      savesCount: { type: Number, default: 0, min: 0 },
    },
    status: {
      type: String,
      enum: ['PUBLISHED', 'HIDDEN'],
      default: 'PUBLISHED',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate overall rating
PostSchema.pre('save', function (next) {
  if (this.postType === 'REVIEW' && this.restaurantInfo?.ratings) {
    const { taste, price, hygiene, service } = this.restaurantInfo.ratings;
    if (taste != null && price != null && hygiene != null && service != null) {
      this.restaurantInfo.ratings.overall = Number(
        ((taste + price + hygiene + service) / 4).toFixed(1)
      );
    }
  }
  next();
});

// Indexes
PostSchema.index({ 'restaurantInfo.location': '2dsphere' }, { sparse: true });
PostSchema.index({ status: 1, postType: 1, createdAt: -1, _id: -1 });
PostSchema.index({ tags: 1, status: 1 });
PostSchema.index({
  title: 'text',
  content: 'text',
  'restaurantInfo.name': 'text',
  'recipeInfo.ingredients.name': 'text',
});

module.exports = mongoose.model('Post', PostSchema);
