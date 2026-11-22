const { verifyAccessToken } = require('../utils/jwtHelper');
const { errorResponse } = require('../utils/apiResponse');
const User = require('../models/user.model');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'UNAUTHORIZED', 'Vui lòng đăng nhập để tiếp tục');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return errorResponse(res, 401, 'UNAUTHORIZED', 'Token xác thực không hợp lệ');
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 401, 'TOKEN_EXPIRED', 'Phiên đăng nhập đã hết hạn');
      }
      return errorResponse(res, 401, 'INVALID_TOKEN', 'Token không hợp lệ hoặc đã bị thay đổi');
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return errorResponse(res, 401, 'USER_NOT_FOUND', 'Người dùng không tồn tại');
    }

    if (user.status === 'BANNED') {
      return errorResponse(
        res,
        403,
        'FORBIDDEN_BANNED',
        'Tài khoản của bạn đã bị khóa do vi phạm tiêu chuẩn cộng đồng'
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 500, 'AUTH_ERROR', error.message);
  }
};

const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      req.user = null;
      return next();
    }

    try {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.userId);
      if (user && user.status === 'ACTIVE') {
        req.user = user;
      } else {
        req.user = null;
      }
    } catch {
      req.user = null;
    }

    next();
  } catch {
    req.user = null;
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuthenticate,
};
