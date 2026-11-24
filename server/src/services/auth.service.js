const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwtHelper');

const registerUser = async ({ username, email, password, fullName }) => {
  // Validate input presence
  if (!username || !email || !password || !fullName) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Vui lòng điền đầy đủ tất cả các trường thông tin');
  }

  // Validate format
  const trimmedUsername = username.trim().toLowerCase();
  const trimmedEmail = email.trim().toLowerCase();

  if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Tên đăng nhập phải có từ 3 đến 30 ký tự');
  }

  if (password.length < 6) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Mật khẩu phải có ít nhất 6 ký tự');
  }

  // Check uniqueness
  const existingUser = await User.findOne({
    $or: [{ username: trimmedUsername }, { email: trimmedEmail }],
  });

  if (existingUser) {
    if (existingUser.username === trimmedUsername) {
      throw new AppError(400, 'DUPLICATE_USERNAME', 'Tên đăng nhập đã được sử dụng');
    }
    if (existingUser.email === trimmedEmail) {
      throw new AppError(400, 'DUPLICATE_EMAIL', 'Email đã được đăng ký tài khoản');
    }
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = new User({
    username: trimmedUsername,
    email: trimmedEmail,
    passwordHash,
    fullName: fullName.trim(),
  });

  // Generate tokens
  const payload = { userId: newUser._id, role: newUser.role, username: newUser.username };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Hash refreshToken before storing in DB for security
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  newUser.refreshToken = hashedRefreshToken;

  await newUser.save();

  return {
    user: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
      avatarUrl: newUser.avatarUrl,
      role: newUser.role,
    },
    accessToken,
    refreshToken,
  };
};

const loginUser = async ({ emailOrUsername, password }) => {
  if (!emailOrUsername || !password) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Vui lòng nhập email/username và mật khẩu');
  }

  const query = emailOrUsername.trim().toLowerCase();
  const user = await User.findOne({
    $or: [{ email: query }, { username: query }],
  }).select('+passwordHash +refreshToken');

  if (!user) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Email/Tên đăng nhập hoặc mật khẩu không chính xác');
  }

  // Check if account is banned
  if (user.status === 'BANNED') {
    throw new AppError(
      403,
      'FORBIDDEN_BANNED',
      'Tài khoản của bạn đã bị khóa do vi phạm tiêu chuẩn cộng đồng'
    );
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Email/Tên đăng nhập hoặc mật khẩu không chính xác');
  }

  // Generate tokens
  const payload = { userId: user._id, role: user.role, username: user.username };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Save hashed refreshToken
  user.refreshToken = await bcrypt.hash(refreshToken, 10);
  await user.save();

  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      status: user.status,
    },
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (oldRefreshToken) => {
  if (!oldRefreshToken) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Refresh Token không được để trống');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(oldRefreshToken);
  } catch {
    throw new AppError(401, 'UNAUTHORIZED', 'Refresh Token đã hết hạn hoặc không hợp lệ');
  }

  const user = await User.findById(decoded.userId).select('+refreshToken');
  if (!user) {
    throw new AppError(401, 'UNAUTHORIZED', 'Người dùng không tồn tại');
  }

  if (user.status === 'BANNED') {
    throw new AppError(
      403,
      'FORBIDDEN_BANNED',
      'Tài khoản của bạn đã bị khóa do vi phạm tiêu chuẩn cộng đồng'
    );
  }

  if (!user.refreshToken) {
    throw new AppError(401, 'UNAUTHORIZED', 'Phiên đăng nhập không tồn tại hoặc đã đăng xuất');
  }

  // Verify matched refreshToken
  const isTokenMatch = await bcrypt.compare(oldRefreshToken, user.refreshToken);
  if (!isTokenMatch) {
    throw new AppError(401, 'UNAUTHORIZED', 'Refresh Token không hợp lệ');
  }

  // Generate new pair
  const payload = { userId: user._id, role: user.role, username: user.username };
  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
  return { loggedOut: true };
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
};
