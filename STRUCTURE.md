# 📁 CẤU TRÚC THƯ MỤC DỰ ÁN HUST-FOOD

> Tài liệu hướng dẫn cấu trúc mã nguồn, quy chuẩn thư mục và quy tắc phát triển dành cho các thành viên trong nhóm dự án **HUST-Food**.

---

## 1. Tổng quan kiến trúc

Dự án áp dụng mô hình **Client - Server tách biệt (Decoupled Monorepo)**:
- **`client/`**: Ứng dụng giao diện người dùng (Frontend - React / Vite / Next.js).
- **`server/`**: Cung cấp RESTful API hoặc GraphQL (Backend - Node.js / Express / NestJS).
- **`docs/`**: Tài liệu thiết kế hệ thống, sơ đồ CSDL (ERD), tài liệu API (Swagger/Postman).

---

## 2. Sơ đồ cây thư mục

```text
HUST-Food/
├── client/                             # Giao diện người dùng (Frontend)
│   ├── public/                         # Tài nguyên tĩnh (favicon, logo, icons public)
│   └── src/
│       ├── assets/                     # Ảnh tĩnh, icon nội bộ, font, illustrations
│       ├── components/                 # Component UI dùng chung toàn ứng dụng
│       │   ├── common/                 # Button, Input, Modal, Dropdown, Avatar...
│       │   ├── feedback/               # Toast, Alert, Skeleton, Spinner...
│       │   └── layout/                 # Header, Sidebar, BottomNavigation, Footer...
│       ├── features/                   # Mô đun tính năng theo nghiệp vụ (Feature-based)
│       │   ├── auth/                   # Đăng nhập, đăng ký, quên mật khẩu, phân quyền
│       │   ├── maps/                   # Bản đồ ẩm thực quanh HUST, vị trí quán ăn
│       │   ├── notifications/          # Thông báo tương tác (thả tim, bình luận, follow)
│       │   ├── places/                 # Quán ăn (thông tin, giờ mở cửa, menu, định vị)
│       │   ├── posts/                  # Bảng tin (Feed), đăng bài review, tải ảnh, tương tác
│       │   ├── profiles/               # Hồ sơ cá nhân, danh sách quán đã lưu (bookmarks)
│       │   └── reviews/                # Form chấm điểm (hương vị, giá cả, vệ sinh), đánh giá sao
│       ├── hooks/                      # Custom hooks dùng chung (useAuth, useDebounce...)
│       ├── services/                   # Cấu hình Axios/Fetch API client, API endpoints chung
│       ├── stores/                     # Quản lý State toàn cục (Zustand / Redux Toolkit)
│       ├── types/                      # Định nghĩa kiểu dữ liệu TypeScript (Interfaces/Types)
│       └── utils/                      # Hàm tiện ích (format tiền tệ, định dạng ngày tháng...)
│
├── server/                             # Dịch vụ Backend API
│   └── src/
│       ├── config/                     # Cấu hình Database, Cloudinary/S3, JWT, Mailer...
│       ├── constants/                  # Hằng số hệ thống, HTTP status, mã lỗi, Enums
│       ├── controllers/                # Tiếp nhận HTTP request, gọi service, trả response
│       ├── middlewares/                # Xác thực JWT, phân quyền (Role), validate dữ liệu, upload ảnh
│       ├── models/                     # Schema CSDL (Mongoose/MongoDB hoặc Prisma/PostgreSQL)
│       ├── routes/                     # Định nghĩa tuyến đường API (/api/v1/...)
│       ├── services/                   # Xử lý Logic nghiệp vụ (Business Logic) chính
│       └── utils/                      # Helper backend (tạo token, mã hóa mật khẩu, gửi email)
│
├── docs/                               # Tài liệu thiết kế, sơ đồ ERD, tài liệu API
├── .gitignore                          # Cấu hình bỏ qua file nhạy cảm và node_modules
├── README.md                           # Giới thiệu dự án, hướng dẫn cài đặt chạy thử
└── STRUCTURE.md                        # Hướng dẫn chi tiết cấu trúc thư mục (File này)
```

---

## 3. Chi tiết và vai trò từng thư mục

### 3.1. Phía Client (`/client`)

* **`public/`**: Chứa các file tĩnh không cần qua bước đóng gói (build tool) như `favicon.ico`, `robots.txt`, manifest PWA.
* **`src/components/`**: Chỉ chứa các UI component mang tính chất **dùng chung nhiều nơi** (Reusable UI):
  * `common/`: Các thành phần nguyên tử (Button, Input, Badge, Dialog, Dropdown).
  * `layout/`: Khung giao diện (Navbar, Sidebar, PageContainer).
  * `feedback/`: Thông báo trạng thái (Toast, Modal xác nhận, Skeleton khi đang tải).
* **`src/features/`**: **Quy tắc quan trọng**: Mỗi tính năng lớn sẽ nằm gọn trong một thư mục con tại đây. Bên trong mỗi feature có thể chứa:
  * `components/`: Component chỉ phục vụ cho feature đó (ví dụ: `PostCard.tsx`, `CreatePostModal.tsx`).
  * `hooks/`: Hook riêng của feature (ví dụ: `usePostFeed.ts`).
  * `services/` hoặc `api/`: Các hàm gọi API riêng của feature.
  * `types.ts`: Kiểu dữ liệu cục bộ của feature.
* **`src/services/`**: Cấu hình Axios instance (kèm interceptors tự động gán token JWT vào Header, bắt lỗi 401 tự động refresh token).
* **`src/stores/`**: Chứa các store quản lý state toàn cục (thông tin người dùng hiện tại, giỏ hàng/danh sách đã lưu, theme Dark/Light).

---

### 3.2. Phía Server (`/server`)

Dự án áp dụng luồng kiến trúc 3 lớp tiêu chuẩn:

$$\text{HTTP Request} \longrightarrow \textbf{Routes} \longrightarrow \textbf{Middlewares} \longrightarrow \textbf{Controllers} \longrightarrow \textbf{Services} \longrightarrow \textbf{Models (DB)} \longrightarrow \text{Response}$$

* **`routes/`**: Chỉ khai báo URL endpoint, gắn middleware (nếu có) và trỏ tới hàm trong Controller.  
  *Ví dụ: `router.post('/posts', authMiddleware, postController.createPost)`*
* **`middlewares/`**: Kiểm tra điều kiện trước khi vào controller:
  * Xác thực token (`verifyToken`).
  * Phân quyền (`requireRole('ADMIN')`, `requireRole('OWNER')`).
  * Validate dữ liệu đầu vào (Zod/Joi).
  * Upload file/ảnh (Multer).
* **`controllers/`**: Tiếp nhận request, đọc `req.body`, `req.params`, gọi service tương ứng và trả về JSON chuẩn:
  ```json
  {
    "success": true,
    "message": "Tạo bài viết thành công",
    "data": { ... }
  }
  ```
* **`services/`**: Nơi chứa **100% logic nghiệp vụ**. Không thao tác trực tiếp với `req`, `res` ở đây để dễ dàng tái sử dụng hoặc viết Unit Test.
* **`models/`**: Khai báo cấu trúc bảng/collection trong cơ sở dữ liệu (User, Place, Post, Review, Comment...).
* **`config/`**: Khởi tạo kết nối DB, cấu hình storage lưu ảnh (Cloudinary/S3), cấu hình biến môi trường.

---

## 4. Quy ước đặt tên (Naming Conventions)

Để code đồng bộ giữa các thành viên, toàn đội tuân theo quy ước sau:

| Đối tượng | Quy ước | Ví dụ |
| :--- | :--- | :--- |
| **Thư mục (Folders)** | `kebab-case` hoặc `camelCase` (nhất quán) | `features/posts`, `components/common` |
| **Component React** | `PascalCase` | `PostCard.tsx`, `PlaceDetail.tsx` |
| **Custom Hooks** | `camelCase` bắt đầu bằng `use` | `useAuth.ts`, `usePlaceFilter.ts` |
| **File Controller / Service** | `camelCase` kèm hậu tố | `post.controller.ts`, `post.service.ts` |
| **Model / Entity** | `PascalCase` | `User.ts`, `Place.ts`, `Review.ts` |
| **Hàm & Biến** | `camelCase` | `getUserProfile()`, `totalReviews` |
| **Hằng số (Constants)** | `UPPER_SNAKE_CASE` | `MAX_IMAGE_COUNT`, `DEFAULT_PAGE_SIZE` |

---

## 5. Quy trình làm việc với Git

1. **Nhánh chính**:
   - `main`: Nhánh production ổn định. Không commit trực tiếp vào nhánh này.
   - `develop`: Nhánh tích hợp tính năng của cả nhóm.
2. **Nhánh tính năng**: Tạo từ `develop`:
   - Định dạng: `feat/<tên-tính-năng>` (ví dụ: `feat/place-map`, `feat/auth-jwt`)
   - Sửa lỗi: `fix/<tên-lỗi>` (ví dụ: `fix/image-upload-fail`)
3. **Quy tắc Commit Message**:
   - `feat: thêm chức năng tìm kiếm quán theo khoảng cách`
   - `fix: sửa lỗi không hiển thị avatar khi đăng nhập`
   - `docs: cập nhật sơ đồ CSDL trong thư mục docs`
   - `refactor: tối ưu hóa controller bài viết`
