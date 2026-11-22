/**
 * Seed data for Restaurants & Sample Posts
 * Prepared by BE1 for BE2 (DevOps) and Testing
 */
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/user.model');
const Post = require('../models/post.model');

const sampleRestaurants = [
  {
    name: 'Bún Cá Cay Gia Truyền Hải Phòng',
    address: 'Số 15 Phố Huế, Hai Bà Trưng, Hà Nội',
    priceRange: { min: 35000, max: 55000 },
    ratings: { taste: 5, price: 5, hygiene: 4, service: 5 },
    location: { type: 'Point', coordinates: [105.8515, 21.0182] },
  },
  {
    name: 'Phở Bò Gia Truyền Bát Đàn',
    address: '49 Bát Đàn, Hoàn Kiếm, Hà Nội',
    priceRange: { min: 50000, max: 70000 },
    ratings: { taste: 5, price: 4, hygiene: 4, service: 4 },
    location: { type: 'Point', coordinates: [105.8474, 21.0336] },
  },
  {
    name: 'Cơm Tấm Sà Bì Chưởng Hà Nội',
    address: '86 Nguyễn Văn Tuyết, Đống Đa, Hà Nội',
    priceRange: { min: 65000, max: 120000 },
    ratings: { taste: 4, price: 3, hygiene: 5, service: 4 },
    location: { type: 'Point', coordinates: [105.8188, 21.0115] },
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[Seed] Connected to database');

    // Find or create admin user
    let reviewer = await User.findOne({ username: 'foodie_master' });
    if (!reviewer) {
      reviewer = await User.create({
        username: 'foodie_master',
        email: 'foodie@hustfood.vn',
        passwordHash: 'dummy_hash',
        fullName: 'Foodie Master HUST',
        bio: 'Đam mê khám phá ẩm thực Hà Nội',
      });
    }

    for (const rest of sampleRestaurants) {
      await Post.create({
        authorId: reviewer._id,
        postType: 'REVIEW',
        title: `Review quán: ${rest.name}`,
        content: `Món ăn cực kỳ chất lượng tại ${rest.address}. Rất đáng để ghé qua thưởng thức!`,
        images: ['https://res.cloudinary.com/hustfood/image/upload/v1/default_post.jpg'],
        tags: ['am-thuc-ha-noi', 'review-quan-an'],
        restaurantInfo: rest,
      });
    }

    console.log('[Seed] Seeded sample restaurants successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = { sampleRestaurants };
