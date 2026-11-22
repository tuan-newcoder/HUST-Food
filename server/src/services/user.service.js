const User = require('../models/user.model');
const Follow = require('../models/follow.model');
const Post = require('../models/post.model');
const Reaction = require('../models/reaction.model');
const Collection = require('../models/collection.model');
const Notification = require('../models/notification.model');
const AppError = require('../utils/appError');
const { sendNotificationToUser } = require('../sockets/socketManager');

const getMyProfile = async (userId) => {
  const user = await User.findById(userId).select(
    '_id username email fullName avatarUrl bio role followersCount followingCount postsCount createdAt'
  );
  if (!user) {
    throw new AppError(404, 'USER_NOT_FOUND', 'Người dùng không tồn tại');
  }
  return { user };
};

const updateMyProfile = async (userId, { fullName, avatarUrl, bio }) => {
  const updates = {};
  if (fullName !== undefined) {
    if (!fullName.trim()) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Họ tên không được để trống');
    }
    updates.fullName = fullName.trim();
  }
  if (avatarUrl !== undefined) {
    updates.avatarUrl = avatarUrl;
  }
  if (bio !== undefined) {
    if (bio.length > 250) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Tiểu sử không được vượt quá 250 ký tự');
    }
    updates.bio = bio.trim();
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select('_id username fullName avatarUrl bio updatedAt');

  if (!updatedUser) {
    throw new AppError(404, 'USER_NOT_FOUND', 'Người dùng không tồn tại');
  }

  return { user: updatedUser };
};

const getUserByUsername = async (username, currentUserId = null) => {
  const user = await User.findOne({ username: username.toLowerCase() }).select(
    '_id username fullName avatarUrl bio followersCount followingCount postsCount status'
  );

  if (!user || user.status === 'BANNED') {
    throw new AppError(404, 'USER_NOT_FOUND', 'Không tìm thấy người dùng');
  }

  let isFollowing = false;
  if (currentUserId && currentUserId.toString() !== user._id.toString()) {
    const existingFollow = await Follow.findOne({
      followerId: currentUserId,
      followingId: user._id,
    });
    isFollowing = !!existingFollow;
  }

  return {
    user: {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      postsCount: user.postsCount,
      isFollowing,
    },
  };
};

const getUserPosts = async (username, currentUserId = null, { postType = 'ALL', cursor = null, limit = 10 }) => {
  const targetUser = await User.findOne({ username: username.toLowerCase() });
  if (!targetUser || targetUser.status === 'BANNED') {
    throw new AppError(404, 'USER_NOT_FOUND', 'Không tìm thấy người dùng');
  }

  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

  const query = {
    authorId: targetUser._id,
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

  // Check isYummied and isSaved for current user if logged in
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

const toggleFollowUser = async (currentUserId, targetUserId) => {
  if (currentUserId.toString() === targetUserId.toString()) {
    throw new AppError(400, 'CANNOT_FOLLOW_SELF', 'Bạn không thể tự theo dõi chính mình');
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser || targetUser.status === 'BANNED') {
    throw new AppError(404, 'USER_NOT_FOUND', 'Người dùng cần theo dõi không tồn tại');
  }

  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    throw new AppError(404, 'USER_NOT_FOUND', 'Người dùng hiện tại không tồn tại');
  }

  const existingFollow = await Follow.findOne({
    followerId: currentUserId,
    followingId: targetUserId,
  });

  let isFollowing = false;

  if (existingFollow) {
    // Unfollow
    await Follow.findByIdAndDelete(existingFollow._id);
    await User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: -1 } });
    const updatedTarget = await User.findByIdAndUpdate(
      targetUserId,
      { $inc: { followersCount: -1 } },
      { new: true }
    );
    isFollowing = false;
    return {
      targetUserId,
      isFollowing,
      followersCount: Math.max(0, updatedTarget.followersCount),
    };
  } else {
    // Follow
    await Follow.create({
      followerId: currentUserId,
      followingId: targetUserId,
    });
    await User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: 1 } });
    const updatedTarget = await User.findByIdAndUpdate(
      targetUserId,
      { $inc: { followersCount: 1 } },
      { new: true }
    );
    isFollowing = true;

    // Create notification and emit socket
    const notification = await Notification.create({
      recipientId: targetUserId,
      senderId: currentUserId,
      type: 'FOLLOW',
    });

    sendNotificationToUser(targetUserId, {
      _id: notification._id,
      type: 'FOLLOW',
      sender: {
        _id: currentUser._id,
        username: currentUser.username,
        fullName: currentUser.fullName,
        avatarUrl: currentUser.avatarUrl,
      },
      post: null,
      createdAt: notification.createdAt,
    });

    return {
      targetUserId,
      isFollowing,
      followersCount: updatedTarget.followersCount,
    };
  }
};

const getUserFollowers = async (userId, { cursor = null, limit = 20 }) => {
  const targetUser = await User.findById(userId);
  if (!targetUser) {
    throw new AppError(404, 'USER_NOT_FOUND', 'Không tìm thấy người dùng');
  }

  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 50);
  const query = { followingId: userId };
  if (cursor) {
    query._id = { $lt: cursor };
  }

  const follows = await Follow.find(query)
    .sort({ _id: -1 })
    .limit(parsedLimit + 1)
    .populate('followerId', '_id username fullName avatarUrl bio');

  const hasMore = follows.length > parsedLimit;
  const sliced = hasMore ? follows.slice(0, parsedLimit) : follows;
  const nextCursor = hasMore && sliced.length > 0 ? sliced[sliced.length - 1]._id.toString() : null;

  const data = sliced.map((f) => f.followerId).filter(Boolean);

  return {
    followers: data,
    meta: {
      nextCursor,
      hasMore,
    },
  };
};

const getUserFollowing = async (userId, { cursor = null, limit = 20 }) => {
  const targetUser = await User.findById(userId);
  if (!targetUser) {
    throw new AppError(404, 'USER_NOT_FOUND', 'Không tìm thấy người dùng');
  }

  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 50);
  const query = { followerId: userId };
  if (cursor) {
    query._id = { $lt: cursor };
  }

  const follows = await Follow.find(query)
    .sort({ _id: -1 })
    .limit(parsedLimit + 1)
    .populate('followingId', '_id username fullName avatarUrl bio');

  const hasMore = follows.length > parsedLimit;
  const sliced = hasMore ? follows.slice(0, parsedLimit) : follows;
  const nextCursor = hasMore && sliced.length > 0 ? sliced[sliced.length - 1]._id.toString() : null;

  const data = sliced.map((f) => f.followingId).filter(Boolean);

  return {
    following: data,
    meta: {
      nextCursor,
      hasMore,
    },
  };
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getUserByUsername,
  getUserPosts,
  toggleFollowUser,
  getUserFollowers,
  getUserFollowing,
};
