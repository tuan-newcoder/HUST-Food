const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
const postRoutes = require("./post.route");
const uploadRoutes = require("./upload.route");

// BE2 - Place Routes (TypeScript)
const placeRoutes = require("./place.route.ts").default;

// BE1 Routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/upload", uploadRoutes);

// BE2 Routes
router.use("/places", placeRoutes);

module.exports = router;
