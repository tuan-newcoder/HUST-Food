const {
  getFeedPosts,
  createNewPost,
  getPostDetailById,
  updatePostById,
  deletePostById,
  getTrendingTagsList,
} = require('../services/post.service');
const { successResponse } = require('../utils/apiResponse');

const getFeed = async (req, res, next) => {
  try {
    const currentUserId = req.user ? req.user._id : null;
    const { postType, cursor, limit } = req.query;
    const { posts, meta } = await getFeedPosts(
      { postType, cursor, limit },
      currentUserId
    );
    return successResponse(res, 200, 'Lấy danh sách bảng tin thành công', posts, meta);
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const post = await createNewPost(req.user._id, req.body);
    return successResponse(res, 201, 'Đăng bài viết thành công', { post });
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const currentUserId = req.user ? req.user._id : null;
    const result = await getPostDetailById(req.params.id, currentUserId);
    return successResponse(res, 200, 'Lấy chi tiết bài viết thành công', result);
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const updatedPost = await updatePostById(req.params.id, req.user._id, req.body);
    return successResponse(res, 200, 'Cập nhật bài viết thành công', { post: updatedPost });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const result = await deletePostById(req.params.id, req.user);
    return successResponse(res, 200, result.message, result);
  } catch (error) {
    next(error);
  }
};

const getTrendingTags = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const tags = await getTrendingTagsList(limit);
    return successResponse(res, 200, 'Lấy danh sách tags thịnh hành thành công', tags);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFeed,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getTrendingTags,
};
