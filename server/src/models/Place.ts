import { Schema, model, models } from "mongoose";

const PlaceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["RESTAURANT", "CAFE", "STREET_FOOD", "BAKERY", "OTHER"],
      default: "RESTAURANT",
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    coverImage: {
      type: String,
      required: true,
    },

    images: [{ type: String }],

    priceRange: {
      min: { type: Number, required: true, min: 0 },
      max: { type: Number, required: true, min: 0 },
    },

    openingHours: {
      open: { type: String, default: "08:00" },
      close: { type: String, default: "22:00" },
    },

    menu: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        imageUrl: { type: String },
      },
    ],

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (v: number[]) =>
            Array.isArray(v) &&
            v.length === 2 &&
            v[0] >= -180 &&
            v[0] <= 180 &&
            v[1] >= -90 &&
            v[1] <= 90,
          message: "Tọa độ phải là [longitude, latitude] hợp lệ",
        },
      },
    },

    averageRatings: {
      taste: { type: Number, default: 0 },
      price: { type: Number, default: 0 },
      hygiene: { type: Number, default: 0 },
      service: { type: Number, default: 0 },
      overall: { type: Number, default: 0 },
    },

    totalReviews: { type: Number, default: 0 },
    bookmarksCount: { type: Number, default: 0 },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "HIDDEN"],
      default: "ACTIVE",
    },
  },
  { timestamps: true },
);

// Index hỗ trợ tìm kiếm địa lý
PlaceSchema.index({ location: "2dsphere" });

// Index hỗ trợ lọc và sắp xếp
PlaceSchema.index({
  category: 1,
  "averageRatings.overall": -1,
});

// Index tìm kiếm theo tên, địa chỉ, món ăn
PlaceSchema.index({
  name: "text",
  address: "text",
  "menu.name": "text",
});

const Place = models.Place || model("Place", PlaceSchema);

export default Place;
