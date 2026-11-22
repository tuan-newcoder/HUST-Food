const { uploadMultipleImages } = require('../services/upload.service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return errorResponse(res, 400, 'NO_FILES', 'Vui lòng chọn ít nhất 1 ảnh để tải lên');
    }

    const urls = await uploadMultipleImages(req.files);
    return successResponse(res, 200, 'Tải ảnh lên thành công', { urls });
  } catch (error) {
    return errorResponse(res, 500, 'UPLOAD_FAILED', error.message);
  }
};

module.exports = {
  uploadImages,
};
