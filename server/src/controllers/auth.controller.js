const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    return successResponse(res, 201, 'Đăng ký tài khoản thành công', result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    return successResponse(res, 200, 'Đăng nhập thành công', result);
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await refreshAccessToken(refreshToken);
    return successResponse(res, 200, 'Làm mới token thành công', result);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const result = await logoutUser(req.user._id);
    return successResponse(res, 200, 'Đăng xuất thành công', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
