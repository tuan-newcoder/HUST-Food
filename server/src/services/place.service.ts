import { Types } from "mongoose";
import Place from "../models/Place";

// Các tham số FE gửi lên API
interface GetPlacesQuery {
  q?: string;
  category?: string;
  maxPrice?: string;
  minRating?: string;
  cursor?: string;
  limit?: string;
}

// Service lấy danh sách quán ăn
export const getPlaces = async (query: GetPlacesQuery) => {
  const pageSize = Math.min(50, Math.max(1, Number(query.limit) || 12));

  // Chỉ lấy quán đang hoạt động
  const filter: Record<string, unknown> = {
    status: "ACTIVE",
  };

  // Tìm kiếm theo tên, địa chỉ, món ăn
  if (query.q?.trim()) {
    filter.$text = { $search: query.q.trim() };
  }

  // Lọc danh mục quán
  if (query.category && query.category !== "ALL") {
    filter.category = query.category;
  }

  // Lọc theo mức giá tối đa của quán
  if (query.maxPrice !== undefined) {
    const maxPrice = Number(query.maxPrice);
    if (Number.isFinite(maxPrice) && maxPrice >= 0) {
      filter["priceRange.max"] = { $lte: maxPrice };
    }
  }

  // Lọc theo điểm đánh giá
  if (query.minRating !== undefined) {
    const minRating = Number(query.minRating);
    if (Number.isFinite(minRating) && minRating >= 0 && minRating <= 5) {
      filter["averageRatings.overall"] = {
        $gte: minRating,
      };
    }
  }

  // Cursor pagination theo _id giảm dần
  if (query.cursor) {
    if (!Types.ObjectId.isValid(query.cursor)) {
      throw new Error("Cursor không hợp lệ");
    }

    filter._id = {
      $lt: new Types.ObjectId(query.cursor),
    };
  }

  // Truy vấn MongoDB
  const places = await Place.find(filter)
    .sort({ _id: -1 })
    .limit(pageSize + 1)
    .lean();

  const hasMore = places.length > pageSize;
  const data = places.slice(0, pageSize);

  const nextCursor =
    hasMore && data.length > 0 ? String(data[data.length - 1]._id) : null;

  return {
    data,
    meta: {
      nextCursor,
      hasMore,
    },
  };
};

export interface NearbyPlacesQuery {
  lat: number;
  lng: number;
  radius: number;
  category?: string;
  maxPrice?: number;
  minRating?: number;
  limit: number;
}

export const getNearbyPlaces = async (params: NearbyPlacesQuery) => {
  // Chỉ lấy các quán đang hoạt động
  const filter: Record<string, unknown> = {
    status: "ACTIVE",
  };

  // Lọc theo danh mục
  if (params.category && params.category !== "ALL") {
    filter.category = params.category;
  }

  // Lọc theo giá
  if (params.maxPrice !== undefined) {
    filter["priceRange.max"] = {
      $lte: params.maxPrice,
    };
  }

  // Lọc theo điểm sao
  if (params.minRating !== undefined) {
    filter["averageRatings.overall"] = {
      $gte: params.minRating,
    };
  }

  // Truy vấn các quán gần vị trí GPS
  const places = await Place.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [params.lng, params.lat],
        },
        distanceField: "distanceMeters",
        maxDistance: params.radius,
        spherical: true,
        key: "location",
        query: filter,
      },
    },

    // Giới hạn số lượng quán
    {
      $limit: params.limit,
    },

    // Chỉ trả các trường cần cho bản đồ
    {
      $project: {
        name: 1,
        category: 1,
        address: 1,
        coverImage: 1,
        priceRange: 1,
        openingHours: 1,
        location: 1,
        averageRatings: 1,
        totalReviews: 1,
        distanceMeters: {
          $round: ["$distanceMeters", 0],
        },
      },
    },
  ]);

  return places;
};

export const getPlaceById = async (id: string) => {
  const place = await Place.findOne({
    _id: new Types.ObjectId(id),
    status: "ACTIVE",
  })
    .select("-__v")
    .lean();

  return place;
};
