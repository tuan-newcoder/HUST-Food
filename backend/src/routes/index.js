const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const postRoutes = require('./post.route');
const uploadRoutes = require('./upload.route');

// API v1 Mounts
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
