const { errorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'Đã có lỗi xảy ra trên hệ thống';
  let details = err.details || [];

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Dữ liệu đầu vào không hợp lệ';
    details = Object.values(err.errors).map((e) => e.message);
  }

  // Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    statusCode = 400;
    code = 'DUPLICATE_KEY';
    const fields = Object.keys(err.keyPattern || {});
    message = `Dữ liệu trường '${fields.join(', ')}' đã tồn tại trong hệ thống`;
    details = fields.map((f) => `Trường ${f} bị trùng lặp`);
  }

  // Mongoose CastError (Invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_ID';
    message = `Định dạng ID không hợp lệ cho trường: ${err.path}`;
  }

  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    console.error('[Error Details]:', err);
  }

  return errorResponse(res, statusCode, code, message, details);
};

module.exports = errorHandler;
