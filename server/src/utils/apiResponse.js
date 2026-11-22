/**
 * Standard API Response Utilities matching HUST Food Spec 5.1
 */

const successResponse = (res, statusCode = 200, message = 'Thành công', data = null, meta = null) => {
  const responseBody = {
    success: true,
    message,
  };

  if (data !== null) {
    responseBody.data = data;
  }

  if (meta !== null) {
    responseBody.meta = meta;
  }

  return res.status(statusCode).json(responseBody);
};

const errorResponse = (res, statusCode = 500, code = 'INTERNAL_SERVER_ERROR', message = 'Đã có lỗi xảy ra', details = []) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details && details.length > 0 ? { details } : {})
    }
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
