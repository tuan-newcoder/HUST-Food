const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

process.env.JWT_ACCESS_SECRET = 'test_access_secret_123';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_123';
process.env.NODE_ENV = 'test';

const app = require('../src/app');
const User = require('../src/models/user.model');

describe('BE1 Test Suite - Full F01 to F10 Implementation', () => {
  let mongod;
  let user1Token;
  let user1RefreshToken;
  let user1Id;
  let user2Token;
  let user2Id;
  let createdReviewPostId;
  let createdRecipePostId;

  before(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
  });

  after(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  // ==========================================
  // PHÂN HỆ 1: AUTH & USER PROFILE (F01 - F04)
  // ==========================================
  describe('F01: Auth APIs (Register, Login, Refresh, Logout, Banned Check)', () => {
    test('1. POST /api/v1/auth/register - Đăng ký tài khoản thành công', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'vuong_lead',
          email: 'vuong@hustfood.vn',
          password: 'password123',
          fullName: 'Nguyễn Duy Vương',
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.user.username, 'vuong_lead');
      assert.equal(res.body.data.user.role, 'USER');
      assert.ok(res.body.data.accessToken);
      assert.ok(res.body.data.refreshToken);

      user1Token = res.body.data.accessToken;
      user1RefreshToken = res.body.data.refreshToken;
      user1Id = res.body.data.user._id;
    });

    test('2. POST /api/v1/auth/register - Báo lỗi trùng username hoặc email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'vuong_lead',
          email: 'different@hustfood.vn',
          password: 'password123',
          fullName: 'Nguyễn Duy Vương',
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'DUPLICATE_USERNAME');
    });

    test('3. POST /api/v1/auth/login - Đăng nhập thành công bằng email hoặc username', async () => {
      // Login with username
      const res1 = await request(app)
        .post('/api/v1/auth/login')
        .send({
          emailOrUsername: 'vuong_lead',
          password: 'password123',
        });
      assert.equal(res1.status, 200);
      assert.equal(res1.body.success, true);
      assert.ok(res1.body.data.accessToken);

      // Login with email
      const res2 = await request(app)
        .post('/api/v1/auth/login')
        .send({
          emailOrUsername: 'vuong@hustfood.vn',
          password: 'password123',
        });
      assert.equal(res2.status, 200);
      assert.equal(res2.body.success, true);
      assert.ok(res2.body.data.accessToken);
    });

    test('4. POST /api/v1/auth/login - Sai mật khẩu trả về 401', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          emailOrUsername: 'vuong_lead',
          password: 'wrong_password',
        });
      assert.equal(res.status, 401);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'INVALID_CREDENTIALS');
    });

    test('5. POST /api/v1/auth/refresh - Cấp token mới từ Refresh Token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken: user1RefreshToken,
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.accessToken);
      assert.ok(res.body.data.refreshToken);

      // Update tokens
      user1Token = res.body.data.accessToken;
      user1RefreshToken = res.body.data.refreshToken;
    });

    test('6. POST /api/v1/auth/login - Chặn tài khoản BANNED với mã 403', async () => {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('password123', salt);

      const bannedUser = new User({
        username: 'spammer_user',
        email: 'spam@hustfood.vn',
        passwordHash,
        fullName: 'Spammer Guy',
        status: 'BANNED',
      });
      await bannedUser.save();

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          emailOrUsername: 'spammer_user',
          password: 'password123',
        });

      assert.equal(res.status, 403);
      assert.equal(res.body.error.code, 'FORBIDDEN_BANNED');
    });

    test('7. POST /api/v1/auth/logout - Đăng xuất và thu hồi phiên', async () => {
      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${user1Token}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.data.loggedOut, true);

      // Log back in to get active token for subsequent tests
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ emailOrUsername: 'vuong_lead', password: 'password123' });
      user1Token = loginRes.body.data.accessToken;
      user1RefreshToken = loginRes.body.data.refreshToken;
    });
  });

  describe('F02, F03, F04: Profile & Follow APIs', () => {
    before(async () => {
      // Register a second user for follow tests
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'tuan_fe1',
          email: 'tuan@hustfood.vn',
          password: 'password123',
          fullName: 'Trần Minh Tuấn',
        });
      user2Token = res.body.data.accessToken;
      user2Id = res.body.data.user._id;
    });

    test('8. GET /api/v1/users/me - Lấy thông tin cá nhân', async () => {
      const res = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${user1Token}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.data.user.username, 'vuong_lead');
      assert.equal(res.body.data.user.followersCount, 0);
    });

    test('9. PUT /api/v1/users/me - Cập nhật thông tin cá nhân', async () => {
      const res = await request(app)
        .put('/api/v1/users/me')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          fullName: 'Nguyễn Duy Vương - Backend Lead',
          bio: 'Chuyên gia tối ưu Node.js & MongoDB',
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.data.user.fullName, 'Nguyễn Duy Vương - Backend Lead');
      assert.equal(res.body.data.user.bio, 'Chuyên gia tối ưu Node.js & MongoDB');
    });

    test('10. GET /api/v1/users/:username - Xem profile công khai người khác', async () => {
      const res = await request(app)
        .get('/api/v1/users/tuan_fe1')
        .set('Authorization', `Bearer ${user1Token}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.data.user.username, 'tuan_fe1');
      assert.equal(res.body.data.user.isFollowing, false);
    });

    test('11. POST /api/v1/users/:id/follow - Follow và Unfollow (Toggle)', async () => {
      // Follow user2
      const followRes = await request(app)
        .post(`/api/v1/users/${user2Id}/follow`)
        .set('Authorization', `Bearer ${user1Token}`);

      assert.equal(followRes.status, 200);
      assert.equal(followRes.body.data.isFollowing, true);
      assert.equal(followRes.body.data.followersCount, 1);

      // Verify profile now shows isFollowing = true
      const profileRes = await request(app)
        .get('/api/v1/users/tuan_fe1')
        .set('Authorization', `Bearer ${user1Token}`);
      assert.equal(profileRes.body.data.user.isFollowing, true);

      // Unfollow user2
      const unfollowRes = await request(app)
        .post(`/api/v1/users/${user2Id}/follow`)
        .set('Authorization', `Bearer ${user1Token}`);

      assert.equal(unfollowRes.status, 200);
      assert.equal(unfollowRes.body.data.isFollowing, false);
      assert.equal(unfollowRes.body.data.followersCount, 0);

      // Re-follow for list testing
      await request(app)
        .post(`/api/v1/users/${user2Id}/follow`)
        .set('Authorization', `Bearer ${user1Token}`);
    });

    test('12. GET /api/v1/users/:id/followers & following - Danh sách follow', async () => {
      const followersRes = await request(app).get(`/api/v1/users/${user2Id}/followers`);
      assert.equal(followersRes.status, 200);
      assert.equal(followersRes.body.data.length, 1);
      assert.equal(followersRes.body.data[0].username, 'vuong_lead');

      const followingRes = await request(app).get(`/api/v1/users/${user1Id}/following`);
      assert.equal(followingRes.status, 200);
      assert.equal(followingRes.body.data.length, 1);
      assert.equal(followingRes.body.data[0].username, 'tuan_fe1');
    });
  });

  // ==========================================
  // PHÂN HỆ 2: UPLOAD & BÀI VIẾT (F05 - F10)
  // ==========================================
  describe('F07, F08: Upload & Create Posts', () => {
    test('13. POST /api/v1/upload/images - Tải ảnh lên', async () => {
      const res = await request(app)
        .post('/api/v1/upload/images')
        .set('Authorization', `Bearer ${user1Token}`)
        .attach('images', Buffer.from('fake_image_content'), 'sample.jpg');

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data.urls));
      assert.equal(res.body.data.urls.length, 1);
    });

    test('14. POST /api/v1/posts - Tạo bài REVIEW tự tính điểm overall', async () => {
      const res = await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          postType: 'REVIEW',
          title: 'Bún cá cay Hải Phòng chuẩn vị',
          content: 'Nước dùng đậm đà, cá chiên giòn rụm.',
          images: ['https://res.cloudinary.com/hustfood/image/upload/v1/bunca.jpg'],
          tags: ['#bun-ca', '#hai-phong', '#an-sang'],
          restaurantInfo: {
            name: 'Bún Cá Cay Gia Truyền',
            address: 'Số 15 Phố Huế, Hai Bà Trưng, Hà Nội',
            priceRange: { min: 35000, max: 55000 },
            ratings: { taste: 5, price: 5, hygiene: 4, service: 5 },
            location: { type: 'Point', coordinates: [105.8515, 21.0182] },
          },
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      const post = res.body.data.post;
      assert.equal(post.postType, 'REVIEW');
      // Overall = (5 + 5 + 4 + 5) / 4 = 4.75 -> 4.8
      assert.equal(post.restaurantInfo.ratings.overall, 4.8);
      // Tags should have leading '#' removed
      assert.deepEqual(post.tags, ['bun-ca', 'hai-phong', 'an-sang']);

      createdReviewPostId = post._id;
    });

    test('15. POST /api/v1/posts - Tạo bài RECIPE', async () => {
      const res = await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          postType: 'RECIPE',
          title: 'Cách làm Phở Gà Trộn tại nhà cực ngon',
          content: 'Công thức đơn giản, nhanh gọn cho bữa sáng cuối tuần.',
          images: ['https://res.cloudinary.com/hustfood/image/upload/v1/phoga.jpg'],
          tags: ['#pho-ga', '#healthy', '#an-sang'],
          recipeInfo: {
            cookingTimeMinutes: 30,
            estimatedCost: 80000,
            servings: 2,
            difficulty: 'EASY',
            ingredients: [
              { name: 'Thịt gà ta luộc', amount: '300g' },
              { name: 'Bánh phở tươi', amount: '500g' },
              { name: 'Hành khô phi & rau thơm', amount: '50g' },
            ],
            steps: [
              { stepNumber: 1, instruction: 'Xé nhỏ thịt gà vừa ăn' },
              { stepNumber: 2, instruction: 'Trần bánh phở và trộn nước sốt chua ngọt' },
            ],
          },
        });

      assert.equal(res.status, 201);
      const post = res.body.data.post;
      assert.equal(post.postType, 'RECIPE');
      assert.equal(post.recipeInfo.ingredients.length, 3);

      createdRecipePostId = post._id;
    });

    test('16. POST /api/v1/posts - Báo lỗi nếu thiếu tọa độ trong Review', async () => {
      const res = await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          postType: 'REVIEW',
          title: 'Quán ăn thiếu địa chỉ tọa độ',
          content: 'Ăn cũng được',
          restaurantInfo: {
            name: 'Quán Ẩn Danh',
            address: 'Hà Nội',
            ratings: { taste: 4, price: 4, hygiene: 4, service: 4 },
          },
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });
  });

  describe('F05, F06, F09, F10: Feed, Detail, Edit, Trending Tags & Delete', () => {
    test('17. GET /api/v1/posts/feed - Bảng tin Newsfeed và lọc postType', async () => {
      // Get ALL posts
      const resAll = await request(app).get('/api/v1/posts/feed?postType=ALL&limit=10');
      assert.equal(resAll.status, 200);
      assert.equal(resAll.body.data.length, 2);

      // Filter REVIEW only
      const resReview = await request(app).get('/api/v1/posts/feed?postType=REVIEW');
      assert.equal(resReview.status, 200);
      assert.equal(resReview.body.data.length, 1);
      assert.equal(resReview.body.data[0].postType, 'REVIEW');

      // Filter RECIPE only
      const resRecipe = await request(app).get('/api/v1/posts/feed?postType=RECIPE');
      assert.equal(resRecipe.status, 200);
      assert.equal(resRecipe.body.data.length, 1);
      assert.equal(resRecipe.body.data[0].postType, 'RECIPE');
    });

    test('18. GET /api/v1/posts/tags/trending - Lấy danh sách Top Tags', async () => {
      const res = await request(app).get('/api/v1/posts/tags/trending?limit=5');
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body.data));
      // #an-sang was tagged in both posts, should be top tag with count 2
      const anSangTag = res.body.data.find((t) => t.tag === 'an-sang');
      assert.ok(anSangTag);
      assert.equal(anSangTag.postsCount, 2);
    });

    test('19. GET /api/v1/posts/:id - Chi tiết bài viết', async () => {
      const res = await request(app).get(`/api/v1/posts/${createdReviewPostId}`);
      assert.equal(res.status, 200);
      assert.equal(res.body.data.post.title, 'Bún cá cay Hải Phòng chuẩn vị');
      assert.equal(res.body.data.post.author.username, 'vuong_lead');
    });

    test('20. PUT /api/v1/posts/:id - Cập nhật bài viết bởi chính tác giả', async () => {
      const res = await request(app)
        .put(`/api/v1/posts/${createdReviewPostId}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'Bún cá cay Hải Phòng chuẩn vị (Đã cập nhật)',
          restaurantInfo: {
            ratings: { taste: 5, price: 4, hygiene: 4, service: 5 }, // overall = (5+4+4+5)/4 = 4.5
          },
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.data.post.title, 'Bún cá cay Hải Phòng chuẩn vị (Đã cập nhật)');
      assert.equal(res.body.data.post.restaurantInfo.ratings.overall, 4.5);
    });

    test('21. PUT /api/v1/posts/:id - Người khác không thể sửa bài (403)', async () => {
      const res = await request(app)
        .put(`/api/v1/posts/${createdReviewPostId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          title: 'Hacked Title',
        });

      assert.equal(res.status, 403);
      assert.equal(res.body.error.code, 'FORBIDDEN');
    });

    test('22. DELETE /api/v1/posts/:id - Xóa bài viết và kiểm tra dọn dẹp', async () => {
      const res = await request(app)
        .delete(`/api/v1/posts/${createdReviewPostId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.data.deletedPostId, createdReviewPostId);

      // Verify post no longer exists
      const checkRes = await request(app).get(`/api/v1/posts/${createdReviewPostId}`);
      assert.equal(checkRes.status, 404);
    });
  });
});
