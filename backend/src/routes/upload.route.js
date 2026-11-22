const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const uploadMiddleware = require('../middlewares/upload');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/images', authenticate, uploadMiddleware, uploadController.uploadImages);

module.exports = router;
