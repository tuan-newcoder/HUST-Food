import { Router } from "express";

import {
  getPlacesController,
  getNearbyPlacesController,
  getPlaceDetailController,
} from "../controllers/place.controller";

const router = Router();

// F06: Danh sách quán ăn
router.get("/", getPlacesController);

// F11-F13: Quán ăn gần vị trí GPS
router.get("/nearby", getNearbyPlacesController);

// F07: Chi tiết quán ăn
router.get("/:id", getPlaceDetailController);

export default router;
