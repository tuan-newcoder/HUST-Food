const multer = require('multer');
const { errorResponse } = require('../utils/apiResponse');

// Use memory storage to stream upload directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('INVALID_FILE_TYPE: Chỉ chấp nhận định dạng ảnh .jpg, .png, .webp'), false);
  }
};

const uploadMulter = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5,
  },
  fileFilter,
}).array('images', 5);

const uploadMiddleware = (req, res, next) => {
  uploadMulter(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return errorResponse(res, 400, 'FILE_TOO_LARGE', 'Mỗi ảnh tải lên không được vượt quá 5MB');
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return errorResponse(res, 400, 'TOO_MANY_FILES', 'Chỉ được tải lên tối đa 5 ảnh');
      }
      return errorResponse(res, 400, 'UPLOAD_ERROR', err.message);
    } else if (err) {
      return errorResponse(res, 400, 'INVALID_FILE_TYPE', err.message);
    }
    next();
  });
};

module.exports = uploadMiddleware;
