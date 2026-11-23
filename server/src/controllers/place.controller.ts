import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

import {
  getPlaces,
  getNearbyPlaces,
  getPlaceById,
} from "../services/place.service";

// ==========================================
// HÀM HỖ TRỢ
// ==========================================

// Lấy query parameter kiểu string
const getQueryString = (req: Request, key: string): string | undefined => {
  const value = req.query[key];

  return typeof value === "string" ? value : undefined;
};

// Lấy query parameter kiểu number
const getQueryNumber = (
  req: Request,
  key: string,
  defaultValue?: number,
): number | undefined => {
  const value = req.query[key];

  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value !== "string" || value.trim() === "") {
    return NaN;
  }

  return Number(value);
};

// Trả lỗi validation
const sendValidationError = (res: Response, message: string): void => {
  res.status(400).json({
    success: false,
    error: {
      code: "VALIDATION_ERROR",
      message,
    },
  });
};

// ==========================================
// F06: GET /api/v1/places
// Lấy danh sách quán ăn
// ==========================================

export const getPlacesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Lấy các tham số lọc từ Frontend
    const query = {
      q: getQueryString(req, "q"),
      category: getQueryString(req, "category"),
      maxPrice: getQueryString(req, "maxPrice"),
      minRating: getQueryString(req, "minRating"),
      cursor: getQueryString(req, "cursor"),
      limit: getQueryString(req, "limit"),
    };

    // Gọi Service lấy danh sách quán
    const result = await getPlaces(query);

    // Trả kết quả thành công
    res.status(200).json({
      success: true,
      message: "Lấy danh sách quán ăn thành công",
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// F11 - F13: GET /api/v1/places/nearby
// Tìm quán ăn gần vị trí GPS
// ==========================================

export const getNearbyPlacesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Lấy tọa độ GPS
    const lat = getQueryNumber(req, "lat");
    const lng = getQueryNumber(req, "lng");

    // Bán kính mặc định 1500 mét
    const radius = getQueryNumber(req, "radius", 1500);

    // Số lượng quán tối đa
    const limit = getQueryNumber(req, "limit", 50);

    // Các bộ lọc
    const category = getQueryString(req, "category") ?? "ALL";

    const maxPrice = getQueryNumber(req, "maxPrice");
    const minRating = getQueryNumber(req, "minRating");

    // ======================================
    // VALIDATION
    // ======================================

    // Kiểm tra vĩ độ
    if (lat === undefined || !Number.isFinite(lat) || lat < -90 || lat > 90) {
      sendValidationError(res, "lat phải nằm trong khoảng -90 đến 90");
      return;
    }

    // Kiểm tra kinh độ
    if (lng === undefined || !Number.isFinite(lng) || lng < -180 || lng > 180) {
      sendValidationError(res, "lng phải nằm trong khoảng -180 đến 180");
      return;
    }

    // Kiểm tra bán kính tìm kiếm
    if (
      radius === undefined ||
      !Number.isFinite(radius) ||
      radius < 500 ||
      radius > 5000
    ) {
      sendValidationError(res, "radius phải từ 500 đến 5000 mét");
      return;
    }

    // Kiểm tra giới hạn số lượng
    if (
      limit === undefined ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 50
    ) {
      sendValidationError(res, "limit phải là số nguyên từ 1 đến 50");
      return;
    }

    // Kiểm tra giá tối đa
    if (
      maxPrice !== undefined &&
      (!Number.isFinite(maxPrice) || maxPrice < 0)
    ) {
      sendValidationError(res, "maxPrice không hợp lệ");
      return;
    }

    // Kiểm tra điểm đánh giá
    if (
      minRating !== undefined &&
      (!Number.isFinite(minRating) || minRating < 0 || minRating > 5)
    ) {
      sendValidationError(res, "minRating phải từ 0 đến 5");
      return;
    }

    // Kiểm tra danh mục quán
    const allowedCategories = [
      "ALL",
      "RESTAURANT",
      "CAFE",
      "STREET_FOOD",
      "BAKERY",
      "OTHER",
    ];

    if (!allowedCategories.includes(category)) {
      sendValidationError(res, "Danh mục quán không hợp lệ");
      return;
    }

    // ======================================
    // GỌI SERVICE
    // ======================================

    const places = await getNearbyPlaces({
      lat,
      lng,
      radius,
      limit,
      category,
      maxPrice,
      minRating,
    });

    // Trả kết quả
    res.status(200).json({
      success: true,
      message: "Tìm quán ăn gần vị trí thành công",
      data: places,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// F07: GET /api/v1/places/:id
// Xem chi tiết quán ăn
// ==========================================

export const getPlaceDetailController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Lấy ID quán từ URL
    const { id } = req.params;

    // Kiểm tra ObjectId
    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      sendValidationError(res, "ID quán ăn không hợp lệ");
      return;
    }

    // Gọi Service tìm quán ăn
    const place = await getPlaceById(id);

    // Không tìm thấy quán
    if (!place) {
      res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Không tìm thấy quán ăn",
        },
      });
      return;
    }

    // Trả thông tin chi tiết
    res.status(200).json({
      success: true,
      message: "Lấy chi tiết quán ăn thành công",
      data: {
        place,
      },
    });
  } catch (error) {
    next(error);
  }
};
