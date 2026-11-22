# HUST Food – Mạng Xã Hội Ẩm Thực & Review Quán Ăn

Dự án phát triển nền tảng mạng xã hội ẩm thực kết nối cộng đồng khám phá quán ăn, đánh giá thực tế và chia sẻ công thức nấu ăn.

---

## 👥 Phân công Vai trò Nhóm
- **BE 1 (Backend Lead & Git Master)**: Phụ trách kiến trúc Backend, 7 Mongoose Schemas & Indexes, Auth JWT, Quản lý User (F01–F04), Upload Cloudinary, CRUD Bài viết & Top Tags (F05–F10).
- **BE 2 (Backend DevOps)**: Phụ trách Bản đồ $geoNear, Tìm kiếm toàn văn, Comment cây, Yummy, Bộ sưu tập (F11–F19), Socket.io & Quản trị Admin (F20–F25).
- **FE 1 (Frontend Lead)**: Phụ trách Khung Layout, Auth, Profile, Newsfeed cuộn vô tận, Form tạo/sửa bài đa bước (F01–F10).
- **FE 2 (Frontend Dev)**: Phụ trách Bản đồ Leaflet, Bán kính, Cây bình luận, Modal Bộ sưu tập, Thông báo Socket, Admin (F11–F25).

---

## 🌿 Quy trình Git (Git Flow & Branch Protection)
Theo nhiệm vụ **Git Master** của BE 1:
- `main`: Nhánh production ổn định, chỉ merge thông qua Pull Request được duyệt (ít nhất 1 approve). Bật bảo vệ nhánh (Branch Protection).
- `develop`: Nhánh tích hợp chính cho cả nhóm trong quá trình phát triển.
- Các nhánh tính năng (Feature branches) phân chia theo thành viên:
  - `feature/be1-auth-users` (BE 1)
  - `feature/be1-posts-upload` (BE 1)
  - `feature/be2-map-search-socket` (BE 2)
  - `feature/fe1-auth-feed` (FE 1)
  - `feature/fe2-map-interactions` (FE 2)

---

## 🚀 Khởi chạy Nhanh Backend
Chi tiết xem tại [backend/README.md](file:///e:/IT4409_Project/backend/README.md).

```bash
cd backend
npm install
npm run dev
```

Chạy toàn bộ 22 automated test suites:
```bash
npm test
```
