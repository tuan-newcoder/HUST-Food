# 🗄️ THIẾT KẾ CƠ SỞ DỮ LIỆU (DATABASE DESIGN)

> **Mã tài liệu:** `DB-DES-01`  
> **Dự án:** HUST-Food  
> **Hệ quản trị CSDL:** MongoDB (Mongoose ODM)  
> **Ngôn ngữ triển khai:** TypeScript

---

## 1. Bảng Tổng quan 8 Collections & Chiến lược Đánh chỉ mục (Indexes)

| Collection / Model | Phục vụ CN | Các trường dữ liệu chính | Chỉ mục (Indexes) bắt buộc |
| :--- | :--- | :--- | :--- |
| **1. `users` (User.ts)** | F01 – F04, F23, F25 | `_id`, `username`, `email`, `passwordHash`, `fullName`, `avatarUrl`, `bio`, `role` (`'USER' \| 'ADMIN'`), `status` (`'ACTIVE' \| 'BANNED'`), `refreshToken`, `resetPasswordToken`, `resetPasswordExpires`, `followersCount`, `followingCount`, `postsCount`, `createdAt`, `updatedAt` | • `{ username: 1 }` (Unique)<br>• `{ email: 1 }` (Unique)<br>• `{ status: 1, role: 1 }` |
| **2. `follows` (Follow.ts)** | F04 | `_id`, `followerId` (ref User), `followingId` (ref User), `createdAt` | • `{ followerId: 1, followingId: 1 }` (Unique)<br>• `{ followingId: 1 }` |
| **3. `bookmarks` (Bookmark.ts)** | F05 | `_id`, `userId` (ref User), `targetType` (`'PLACE' \| 'POST'`), `placeId` (ref Place, nullable), `postId` (ref Post, nullable), `createdAt` | • `{ userId: 1, targetType: 1, placeId: 1, postId: 1 }` (Unique) |
| **4. `places` (Place.ts)** | F06 – F08, F11 – F13 | `_id`, `name`, `category` (`'RESTAURANT' \| 'CAFE' \| 'STREET_FOOD' \| 'BAKERY' \| 'OTHER'`), `address`, `coverImage`, `images[]`, `priceRange { min, max }`, `openingHours { open, close }`, `menu [{ name, price, imageUrl }]`, `location { type: 'Point', coordinates: [lng, lat] }`, `averageRatings { taste, price, hygiene, service, overall }`, `totalReviews`, `bookmarksCount`, `createdBy`, `status` (`'ACTIVE' \| 'HIDDEN'`), `createdAt`, `updatedAt` | • `{ location: '2dsphere' }` (Bắt buộc cho `$geoNear`)<br>• `{ category: 1, 'averageRatings.overall': -1 }`<br>• Text Index: `name`, `address`, `'menu.name'` |
| **5. `reviews` (Review.ts)** | F09, F10 | `_id`, `placeId` (ref Place), `authorId` (ref User), `ratings { taste, price, hygiene, service, overall }`, `content`, `images[]`, `status` (`'PUBLISHED' \| 'HIDDEN'`), `createdAt`, `updatedAt` | • `{ placeId: 1, createdAt: -1 }`<br>• `{ placeId: 1, authorId: 1 }` (Unique: 1 người chỉ đánh giá 1 lần/quán) |
| **6. `posts` (Post.ts)** | F14 – F18 | `_id`, `authorId` (ref User), `postType` (`'EXPERIENCE' \| 'RECIPE'`), `title`, `content`, `images[]`, `tags[]`, `placeId` (ref Place, nullable - gắn thẻ quán), `recipeInfo { cookingTimeMinutes, estimatedCost, servings, difficulty, ingredients [{ name, amount }], steps [{ stepNumber, instruction, imageUrl }] }`, `metrics { yummyCount, commentsCount, savesCount }`, `status` (`'PUBLISHED' \| 'HIDDEN'`), `createdAt`, `updatedAt` | • `{ status: 1, postType: 1, createdAt: -1, _id: -1 }` (Tối ưu Cursor Pagination)<br>• `{ placeId: 1, createdAt: -1 }`<br>• `{ tags: 1 }`<br>• Text Index: `title`, `content`, `'recipeInfo.ingredients.name'` |
| **7. `comments` & `reactions`** | F18, F19 | • `comments`: `_id`, `postId` (ref Post), `authorId` (ref User), `parentId` (ref Comment, null nếu comment gốc), `content`, `repliesCount`, `createdAt`<br>• `reactions`: `_id`, `postId` (ref Post), `userId` (ref User), `createdAt` | • `comments`: `{ postId: 1, parentId: 1, createdAt: -1 }`<br>• `reactions`: `{ postId: 1, userId: 1 }` (Unique) |
| **8. `notifications` & `reports`** | F20 – F24 | • `notifications`: `_id`, `recipientId`, `senderId`, `type` (`'YUMMY' \| 'COMMENT' \| 'REPLY' \| 'FOLLOW'`), `postId`, `isRead`, `createdAt`<br>• `reports`: `_id`, `reporterId`, `targetType` (`'POST' \| 'REVIEW'`), `targetPostId`, `targetReviewId`, `reason` (`'SPAM' \| 'INAPPROPRIATE' \| 'WRONG_INFO' \| 'OTHER'`), `description`, `status` (`'PENDING' \| 'RESOLVED' \| 'REJECTED'`), `resolvedBy`, `createdAt`, `updatedAt` | • `notifications`: `{ recipientId: 1, isRead: 1, createdAt: -1 }`<br>• `reports`: `{ status: 1, createdAt: -1 }`<br>• `{ reporterId: 1, targetType: 1, targetPostId: 1, targetReviewId: 1 }` |

---

## 2. Mã nguồn TypeScript Mongoose Schemas Chuẩn hóa

### 2.1. Place Model (`server/src/models/Place.ts`)
```typescript
import mongoose, { Schema, Document } from "mongoose";

export interface IPlace extends Document {
  name: string;
  category: "RESTAURANT" | "CAFE" | "STREET_FOOD" | "BAKERY" | "OTHER";
  address: string;
  coverImage: string;
  images: string[];
  priceRange: { min: number; max: number };
  openingHours: { open: string; close: string };
  menu: Array<{ name: string; price: number; imageUrl?: string }>;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  averageRatings: {
    taste: number;
    price: number;
    hygiene: number;
    service: number;
    overall: number;
  };
  totalReviews: number;
  bookmarksCount: number;
  createdBy: mongoose.Types.ObjectId;
  status: "ACTIVE" | "HIDDEN";
}

const PlaceSchema = new Schema<IPlace>(
  {
    name: { type: String, required: true, trim: true, maxLength: 150 },
    category: {
      type: String,
      enum: ["RESTAURANT", "CAFE", "STREET_FOOD", "BAKERY", "OTHER"],
      default: "RESTAURANT",
      index: true,
    },
    address: { type: String, required: true, trim: true },
    coverImage: { type: String, required: true },
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
        price: { type: Number, required: true },
        imageUrl: { type: String },
      },
    ],
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    averageRatings: {
      taste: { type: Number, default: 0 },
      price: { type: Number, default: 0 },
      hygiene: { type: Number, default: 0 },
      service: { type: Number, default: 0 },
      overall: { type: Number, default: 0, index: true },
    },
    totalReviews: { type: Number, default: 0 },
    bookmarksCount: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["ACTIVE", "HIDDEN"], default: "ACTIVE", index: true },
  },
  { timestamps: true }
);

PlaceSchema.index({ location: "2dsphere" });
PlaceSchema.index({ name: "text", address: "text", "menu.name": "text" });

export const Place = mongoose.model<IPlace>("Place", PlaceSchema);
```

---

### 2.2. Review Model (`server/src/models/Review.ts`)
```typescript
import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  placeId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  ratings: {
    taste: number;
    price: number;
    hygiene: number;
    service: number;
    overall: number;
  };
  content: string;
  images: string[];
  status: "PUBLISHED" | "HIDDEN";
}

const ReviewSchema = new Schema<IReview>(
  {
    placeId: { type: Schema.Types.ObjectId, ref: "Place", required: true, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ratings: {
      taste: { type: Number, required: true, min: 1, max: 5 },
      price: { type: Number, required: true, min: 1, max: 5 },
      hygiene: { type: Number, required: true, min: 1, max: 5 },
      service: { type: Number, required: true, min: 1, max: 5 },
      overall: { type: Number, min: 1, max: 5 },
    },
    content: { type: String, required: true, maxLength: 2000 },
    images: [{ type: String }],
    status: { type: String, enum: ["PUBLISHED", "HIDDEN"], default: "PUBLISHED" },
  },
  { timestamps: true }
);

// Mỗi người dùng chỉ viết tối đa 1 đánh giá cho mỗi quán ăn
ReviewSchema.index({ placeId: 1, authorId: 1 }, { unique: true });

// Tự động tính điểm overall trước khi lưu review
ReviewSchema.pre("save", function (next) {
  const { taste, price, hygiene, service } = this.ratings;
  this.ratings.overall = Number(((taste + price + hygiene + service) / 4).toFixed(1));
  next();
});

export const Review = mongoose.model<IReview>("Review", ReviewSchema);
```

---

### 2.3. Post Model (`server/src/models/Post.ts`)
```typescript
import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  authorId: mongoose.Types.ObjectId;
  postType: "EXPERIENCE" | "RECIPE";
  title: string;
  content: string;
  images: string[];
  tags: string[];
  placeId?: mongoose.Types.ObjectId | null;
  recipeInfo?: {
    cookingTimeMinutes: number;
    estimatedCost: number;
    servings: number;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    ingredients: Array<{ name: string; amount: string }>;
    steps: Array<{ stepNumber: number; instruction: string; imageUrl?: string }>;
  };
  metrics: {
    yummyCount: number;
    commentsCount: number;
    savesCount: number;
  };
  status: "PUBLISHED" | "HIDDEN";
}

const PostSchema = new Schema<IPost>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    postType: { type: String, enum: ["EXPERIENCE", "RECIPE"], required: true, index: true },
    title: { type: String, required: true, trim: true, maxLength: 150 },
    content: { type: String, required: true },
    images: [{ type: String }],
    tags: [{ type: String, trim: true, lowercase: true, index: true }],
    placeId: { type: Schema.Types.ObjectId, ref: "Place", default: null, index: true },
    recipeInfo: {
      cookingTimeMinutes: { type: Number, min: 1 },
      estimatedCost: { type: Number, min: 0 },
      servings: { type: Number, default: 1 },
      difficulty: { type: String, enum: ["EASY", "MEDIUM", "HARD"] },
      ingredients: [{ name: { type: String }, amount: { type: String } }],
      steps: [{ stepNumber: Number, instruction: String, imageUrl: String }],
    },
    metrics: {
      yummyCount: { type: Number, default: 0 },
      commentsCount: { type: Number, default: 0 },
      savesCount: { type: Number, default: 0 },
    },
    status: { type: String, enum: ["PUBLISHED", "HIDDEN"], default: "PUBLISHED", index: true },
  },
  { timestamps: true }
);

PostSchema.index({ status: 1, postType: 1, createdAt: -1, _id: -1 });
PostSchema.index({ title: "text", content: "text", "recipeInfo.ingredients.name": "text" });

export const Post = mongoose.model<IPost>("Post", PostSchema);
```

---

## 3. Thuật toán Tự động Cập nhật Điểm sao Quán ăn (`recalculatePlaceRatings`)

Hàm này được kích hoạt tự động ở tầng Service sau khi thực hiện `POST`, `PUT` hoặc `DELETE` một bản ghi đánh giá (`Review`):

```typescript
// server/src/services/review.service.ts
import mongoose from "mongoose";
import { Review } from "../models/Review";
import { Place } from "../models/Place";

export async function recalculatePlaceRatings(placeId: mongoose.Types.ObjectId | string) {
  const stats = await Review.aggregate([
    { $match: { placeId: new mongoose.Types.ObjectId(placeId), status: "PUBLISHED" } },
    {
      $group: {
        _id: "$placeId",
        totalReviews: { $sum: 1 },
        avgTaste: { $avg: "$ratings.taste" },
        avgPrice: { $avg: "$ratings.price" },
        avgHygiene: { $avg: "$ratings.hygiene" },
        avgService: { $avg: "$ratings.service" },
        avgOverall: { $avg: "$ratings.overall" },
      },
    },
  ]);

  if (stats.length > 0) {
    const s = stats[0];
    return await Place.findByIdAndUpdate(
      placeId,
      {
        totalReviews: s.totalReviews,
        averageRatings: {
          taste: Number(s.avgTaste.toFixed(1)),
          price: Number(s.avgPrice.toFixed(1)),
          hygiene: Number(s.avgHygiene.toFixed(1)),
          service: Number(s.avgService.toFixed(1)),
          overall: Number(s.avgOverall.toFixed(1)),
        },
      },
      { new: true }
    );
  } else {
    // Trường hợp tất cả review bị xóa hết
    return await Place.findByIdAndUpdate(
      placeId,
      {
        totalReviews: 0,
        averageRatings: { taste: 0, price: 0, hygiene: 0, service: 0, overall: 0 },
      },
      { new: true }
    );
  }
}
```

