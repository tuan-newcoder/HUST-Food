const Post = require('../models/post.model');
const User = require('../models/user.model');
const Reaction = require('../models/reaction.model');
const Collection = require('../models/collection.model');
const Comment = require('../models/comment.model');
const Notification = require('../models/notification.model');
const Report = require('../models/report.model');
const AppError = require('../utils/appError');

const getFeedPosts = async ({ postType = 'ALL', cursor = null, limit = 10 }, currentUserId = null) => {
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

  const query = {
    status: 'PUBLISHED',
  };

  if (postType && postType !== 'ALL') {
    query.postType = postType;
  }

  if (cursor) {
    query._id = { $lt: cursor };
  }

  const posts = await Post.find(query)
    .sort({ _id: -1 })
    .limit(parsedLimit + 1)
    .populate('authorId', '_id username fullName avatarUrl');

  const hasMore = posts.length > parsedLimit;
  const slicedPosts = hasMore ? posts.slice(0, parsedLimit) : posts;
  const nextCursor = hasMore && slicedPosts.length > 0 ? slicedPosts[slicedPosts.length - 1]._id.toString() : null;

  // Check isYummied and isSaved for authenticated user
  let yummiedPostIds = new Set();
  let savedPostIds = new Set();

  if (currentUserId && slicedPosts.length > 0) {
    const postIds = slicedPosts.map((p) => p._id);
    const reactions = await Reaction.find({
      userId: currentUserId,
      postId: { $in: postIds },
      type: 'YUMMY',
    });
    reactions.forEach((r) => yummiedPostIds.add(r.postId.toString()));

    const collections = await Collection.find({
      userId: currentUserId,
      postIds: { $in: postIds },
    });
    collections.forEach((col) => {
      col.postIds.forEach((pid) => savedPostIds.add(pid.toString()));
    });
  }

  const formattedPosts = slicedPosts.map((p) => ({
    _id: p._id,
    postType: p.postType,
    title: p.title,
    content: p.content,
    images: p.images,
    tags: p.tags,
    author: p.authorId,
    restaurantInfo: p.restaurantInfo,
    recipeInfo: p.recipeInfo,
    metrics: p.metrics,
    isYummied: yummiedPostIds.has(p._id.toString()),
    isSaved: savedPostIds.has(p._id.toString()),
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));

  return {
    posts: formattedPosts,
    meta: {
      nextCursor,
      hasMore,
    },
  };
};

const createNewPost = async (authorId, postData) => {
  const { postType, title, content, images, tags, restaurantInfo, recipeInfo } = postData;

  if (!postType || !['REVIEW', 'RECIPE'].includes(postType)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Loại bài viết phải là REVIEW hoặc RECIPE');
  }

  if (!title || !title.trim()) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Tiêu đề bài viết không được để trống');
  }

  if (!content || !content.trim()) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Nội dung bài viết không được để trống');
  }

  // Validate specific post type requirements
  if (postType === 'REVIEW') {
    if (!restaurantInfo || !restaurantInfo.name || !restaurantInfo.address) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Bài Review cần có tên và địa chỉ quán ăn');
    }

    if (
      !restaurantInfo.location ||
      !Array.isArray(restaurantInfo.location.coordinates) ||
      restaurantInfo.location.coordinates.length !== 2
    ) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Thiếu tọa độ GPS hợp lệ [kinh độ, vĩ độ] khi đăng REVIEW');
    }

    const { ratings } = restaurantInfo;
    if (
      !ratings ||
      ratings.taste == null ||
      ratings.price == null ||
      ratings.hygiene == null ||
      ratings.service == null
    ) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Vui lòng đánh giá đủ 4 tiêu chí: Hương vị, Giá cả, Vệ sinh, Phục vụ');
    }
  }

  if (postType === 'RECIPE') {
    if (!recipeInfo) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Thiếu thông tin công thức nấu ăn');
    }

    if (!recipeInfo.ingredients || !Array.isArray(recipeInfo.ingredients) || recipeInfo.ingredients.length === 0) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Thiếu danh sách nguyên liệu khi đăng bài RECIPE');
    }
  }

  // Normalize tags
  const cleanTags = Array.isArray(tags)
    ? tags
        .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
        .filter((t) => t.length > 0)
    : [];

  const newPost = new Post({
    authorId,
    postType,
    title: title.trim(),
    content: content.trim(),
    images: Array.isArray(images) ? images : [],
    tags: cleanTags,
    restaurantInfo: postType === 'REVIEW' ? restaurantInfo : undefined,
    recipeInfo: postType === 'RECIPE' ? recipeInfo : undefined,
  });

  await newPost.save();

  // Increment author's post count
  await User.findByIdAndUpdate(authorId, { $inc: { postsCount: 1 } });

  return newPost;
};

const getPostDetailById = async (postId, currentUserId = null) => {
  const post = await Post.findOne({ _id: postId, status: 'PUBLISHED' }).populate(
    'authorId',
    '_id username fullName avatarUrl'
  );

  if (!post) {
    throw new AppError(404, 'POST_NOT_FOUND', 'Bài viết không tồn tại hoặc đã bị ẩn');
  }

  let isYummied = false;
  let isSaved = false;

  if (currentUserId) {
    const reaction = await Reaction.findOne({
      userId: currentUserId,
      postId: post._id,
      type: 'YUMMY',
    });
    isYummied = !!reaction;

    const collection = await Collection.findOne({
      userId: currentUserId,
      postIds: post._id,
    });
    isSaved = !!collection;
  }

  return {
    post: {
      _id: post._id,
      postType: post.postType,
      title: post.title,
      content: post.content,
      images: post.images,
      tags: post.tags,
      author: post.authorId,
      restaurantInfo: post.restaurantInfo,
      recipeInfo: post.recipeInfo,
      metrics: post.metrics,
      isYummied,
      isSaved,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    },
  };
};

const updatePostById = async (postId, currentUserId, updateData) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(404, 'POST_NOT_FOUND', 'Bài viết không tồn tại');
  }

  if (post.authorId.toString() !== currentUserId.toString()) {
    throw new AppError(403, 'FORBIDDEN', 'Bạn không có quyền chỉnh sửa bài viết này');
  }

  const { title, content, images, tags, restaurantInfo, recipeInfo } = updateData;

  if (title !== undefined) post.title = title.trim();
  if (content !== undefined) post.content = content.trim();
  if (images !== undefined) post.images = images;
  if (tags !== undefined) {
    post.tags = tags
      .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
      .filter((t) => t.length > 0);
  }

  if (post.postType === 'REVIEW' && restaurantInfo) {
    post.restaurantInfo = {
      ...post.restaurantInfo.toObject(),
      ...restaurantInfo,
    };
    // Recalculate overall if ratings provided
    if (restaurantInfo.ratings) {
      const { taste, price, hygiene, service } = restaurantInfo.ratings;
      if (taste != null && price != null && hygiene != null && service != null) {
        post.restaurantInfo.ratings.overall = Number(
          ((taste + price + hygiene + service) / 4).toFixed(1)
        );
      }
    }
  }

  if (post.postType === 'RECIPE' && recipeInfo) {
    post.recipeInfo = {
      ...post.recipeInfo.toObject(),
      ...recipeInfo,
    };
  }

  await post.save();
  return post;
};

const deletePostById = async (postId, user) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(404, 'POST_NOT_FOUND', 'Bài viết không tồn tại');
  }

  const isAuthor = post.authorId.toString() === user._id.toString();
  const isAdmin = user.role === 'ADMIN';

  if (!isAuthor && !isAdmin) {
    throw new AppError(403, 'FORBIDDEN', 'Bạn không có quyền xóa bài viết này');
  }

  await Post.findByIdAndDelete(postId);

  // Decrement author post count
  await User.findByIdAndUpdate(post.authorId, { $inc: { postsCount: -1 } });

  // Clean up cascaded data
  await Promise.all([
    Comment.deleteMany({ postId }),
    Reaction.deleteMany({ postId }),
    Collection.updateMany({ postIds: postId }, { $pull: { postIds: postId } }),
    Notification.deleteMany({ postId }),
    Report.deleteMany({ targetPostId: postId }),
  ]);

  return {
    deletedPostId: postId,
    message: 'Đã xóa bài viết và dữ liệu liên quan',
  };
};

const getTrendingTagsList = async (limit = 10) => {
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 30);

  const tags = await Post.aggregate([
    { $match: { status: 'PUBLISHED' } },
    { $unwind: '$tags' },
    {
      $group: {
        _id: '$tags',
        postsCount: { $sum: 1 },
      },
    },
    { $sort: { postsCount: -1 } },
    { $limit: parsedLimit },
    {
      $project: {
        _id: 0,
        tag: '$_id',
        postsCount: 1,
      },
    },
  ]);

  return tags;
};

module.exports = {
  getFeedPosts,
  createNewPost,
  getPostDetailById,
  updatePostById,
  deletePostById,
  getTrendingTagsList,
};
