# HUST Food - Backend Documentation (Phân hệ BE 1 - Hoàn thành Tuần 1 đến Tuần 3)

Tài liệu hướng dẫn kỹ thuật do **BE 1 (Backend Lead)** thiết lập và bàn giao cho **FE 1** (ghép API) và **BE 2** (tiếp tục phát triển nhánh F11 – F25).

---

## 📁 Cấu trúc Thư mục Backend
```
backend/
├── src/
│   ├── config/              # db.js, cloudinary.js, corsOptions.js
│   ├── controllers/         # auth.controller.js, user.controller.js, post.controller.js, upload.controller.js
│   ├── middlewares/         # auth.middleware.js, role.middleware.js, error.middleware.js, upload.js
│   ├── models/              # 8 Mongoose Models & Schemas (User, Follow, Post, Comment, Reaction, Collection, Notification, Report)
│   ├── routes/              # index.js, auth.route.js, user.route.js, post.route.js, upload.route.js
│   ├── seeds/               # seedRestaurants.js (dữ liệu mẫu 20 quán ăn cho BE2)
│   ├── services/            # auth.service.js, user.service.js, post.service.js, upload.service.js
│   ├── sockets/             # socketManager.js (xử lý Room và bắn Notification Realtime)
│   ├── utils/               # apiResponse.js, appError.js, jwtHelper.js
│   ├── app.js               # Express application setup
│   └── server.js            # Entry point chạy Server HTTP & WebSocket
├── tests/                   # Bộ test kiểm thử tích hợp tự động (22/22 tests passing)
├── .env.example
└── package.json
```

---

## 🔑 Biến Môi trường (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/hust-food
JWT_ACCESS_SECRET=hust_food_access_secret_key_2026
JWT_REFRESH_SECRET=hust_food_refresh_secret_key_2026
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 📡 Danh sách 18 APIs của BE 1 (F01 – F10) Đã Hoàn Thành

### 1. Phân hệ Xác thực (F01)
| Endpoint | Method | Quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/register` | `POST` | Public | Đăng ký tài khoản mới (username, email, password, fullName) |
| `/api/v1/auth/login` | `POST` | Public | Đăng nhập (hỗ trợ cả username hoặc email, check chặn BANNED) |
| `/api/v1/auth/refresh` | `POST` | Public | Làm mới Access Token từ Refresh Token |
| `/api/v1/auth/logout` | `POST` | Bearer Token | Đăng xuất, xóa refresh token trong DB |

### 2. Phân hệ Người dùng & Theo dõi (F02, F03, F04)
| Endpoint | Method | Quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `/api/v1/users/me` | `GET` | Bearer Token | Lấy thông tin cá nhân hiện tại |
| `/api/v1/users/me` | `PUT` | Bearer Token | Cập nhật fullName, avatarUrl, bio |
| `/api/v1/users/:username` | `GET` | Optional Auth | Xem profile người khác (kèm cờ `isFollowing`) |
| `/api/v1/users/:username/posts` | `GET` | Optional Auth | Lấy bài viết của user (lọc `postType`, phân trang con trỏ `cursor`) |
| `/api/v1/users/:id/follow` | `POST` | Bearer Token | Toggle Follow / Unfollow (tự bắn thông báo Socket.io) |
| `/api/v1/users/:id/followers` | `GET` | Public | Danh sách người theo dõi (`cursor` pagination) |
| `/api/v1/users/:id/following` | `GET` | Public | Danh sách đang theo dõi (`cursor` pagination) |

### 3. Phân hệ Upload & Bài viết (F05 – F10)
| Endpoint | Method | Quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `/api/v1/upload/images` | `POST` | Bearer Token | Upload tối đa 5 file ảnh (mỗi file $\le$ 5MB) lên Cloudinary |
| `/api/v1/posts/feed` | `GET` | Optional Auth | Bảng tin Newsfeed cuộn vô tận (`cursor`, lọc `postType=ALL\|REVIEW\|RECIPE`) |
| `/api/v1/posts/tags/trending` | `GET` | Public | Danh sách Top Tags thịnh hành |
| `/api/v1/posts` | `POST` | Bearer Token | Đăng bài Review (tự tính điểm overall, tọa độ GPS) hoặc Recipe (nguyên liệu, bước nấu) |
| `/api/v1/posts/:id` | `GET` | Optional Auth | Chi tiết bài viết |
| `/api/v1/posts/:id` | `PUT` | Bearer Token | Chỉnh sửa bài viết (kiểm tra quyền tác giả) |
| `/api/v1/posts/:id` | `DELETE` | Bearer Token | Xóa bài viết vĩnh viễn (dọn dẹp bình luận, reactions, reports liên quan) |

---

## 🛠 Hướng dẫn cho BE 2 (DevOps & F11–F25)
1. **Models:** Toàn bộ 8 Mongoose Models (`Post`, `User`, `Comment`, `Reaction`, `Collection`, `Notification`, `Report`) đã được BE 1 tạo sẵn với đầy đủ Index (Text Index, 2dsphere Index, Compound Indexes). BE 2 chỉ cần import từ `src/models/` để sử dụng.
2. **Socket.io:** Đã dựng sẵn `socketManager.js`. Khi BE 2 làm các tính năng Yummy (F16) hay Comment (F17), chỉ cần gọi hàm:
   ```javascript
   const { sendNotificationToUser } = require('../sockets/socketManager');
   sendNotificationToUser(targetUserId, notificationPayload);
   ```
3. **Seed Data:** BE 2 có thể chạy `node src/seeds/seedRestaurants.js` để tự động khởi tạo dữ liệu bài viết và quán ăn mẫu phục vụ cho việc kiểm thử tính năng Bản đồ `$geoNear`.
