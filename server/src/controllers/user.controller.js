const {
  getMyProfile,
  updateMyProfile,
  getUserByUsername,
  getUserPosts,
  toggleFollowUser,
  getUserFollowers,
  getUserFollowing,
} = require('../services/user.service');
const { successResponse } = require('../utils/apiResponse');

const getMe = async (req, res, next) => {
  try {
    const result = await getMyProfile(req.user._id);
    return successResponse(res, 200, 'Lấy thông tin cá nhân thành công', result);
  } catch (error) {
    next(error);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const result = await updateMyProfile(req.user._id, req.body);
    return successResponse(res, 200, 'Cập nhật thông tin thành công', result);
  } catch (error) {
    next(error);
  }
};

const getProfileByUsername = async (req, res, next) => {
  try {
    const currentUserId = req.user ? req.user._id : null;
    const result = await getUserByUsername(req.params.username, currentUserId);
    return successResponse(res, 200, 'Lấy thông tin người dùng thành công', result);
  } catch (error) {
    next(error);
  }
};

const getPostsByUsername = async (req, res, next) => {
  try {
    const currentUserId = req.user ? req.user._id : null;
    const { postType, cursor, limit } = req.query;
    const { posts, meta } = await getUserPosts(req.params.username, currentUserId, {
      postType,
      cursor,
      limit,
    });
    return successResponse(res, 200, 'Lấy danh sách bài viết thành công', posts, meta);
  } catch (error) {
    next(error);
  }
};

const followUser = async (req, res, next) => {
  try {
    const result = await toggleFollowUser(req.user._id, req.params.id);
    const message = result.isFollowing
      ? 'Đã theo dõi người dùng thành công'
      : 'Đã hủy theo dõi người dùng thành công';
    return successResponse(res, 200, message, result);
  } catch (error) {
    next(error);
  }
};

const getFollowers = async (req, res, next) => {
  try {
    const { cursor, limit } = req.query;
    const { followers, meta } = await getUserFollowers(req.params.id, { cursor, limit });
    return successResponse(res, 200, 'Lấy danh sách người theo dõi thành công', followers, meta);
  } catch (error) {
    next(error);
  }
};

const getFollowing = async (req, res, next) => {
  try {
    const { cursor, limit } = req.query;
    const { following, meta } = await getUserFollowing(req.params.id, { cursor, limit });
    return successResponse(res, 200, 'Lấy danh sách đang theo dõi thành công', following, meta);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMe,
  updateMe,
  getProfileByUsername,
  getPostsByUsername,
  followUser,
  getFollowers,
  getFollowing,
};
