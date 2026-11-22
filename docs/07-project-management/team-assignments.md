# 👥 PHÂN CÔNG NHIỆM VỤ THÀNH VIÊN (TEAM ASSIGNMENTS)

> **Mã tài liệu:** `PM-TEAM-01`  
> **Dự án:** HUST-Food  
> **Quy mô nhóm:** 4 thành viên  
> **Căn cứ:** Đồng bộ theo 7 mô-đun nghiệp vụ tại [STRUCTURE.md](file:///d:/Hoc/2026.1/Web/HUST-Food/STRUCTURE.md)

---

## 1. Bảng Tổng quan Phân chia Mô-đun & Chức năng

| Thành viên | Vai trò & Danh hiệu | Mô-đun & Chức năng phụ trách | Sản phẩm bàn giao cụ thể |
| :--- | :--- | :--- | :--- |
| **Vương (BE 1)** | **Backend Lead & Git Master** | • Models & APIs: User, Follow, Bookmark, Post, Comment, Reaction<br>• Chức năng: **F01 – F05, F14 – F20** | • Khởi tạo Monorepo (`client/`, `server/`, `docs/`).<br>• Viết đầy đủ 8 Mongoose Models (.ts) & Indexes.<br>• Cấu hình Cloudinary SDK & Nodemailer (SMTP).<br>• Code 14 APIs Auth (JWT, Quên MK), Hồ sơ, Follow & Bookmarks.<br>• Code 10 APIs Upload, Bảng tin, Bài viết/Công thức, Yummy & Comment cây. |
| **Dũng (BE 2)** | **Backend Dev & DevOps** | • Models & APIs: Place, Review, Notification, Report, Admin<br>• Chức năng: **F06 – F13, F21 – F25** | • Tạo Cluster MongoDB Atlas & cấu hình Cloud AWS.<br>• Viết script Seed Data mẫu 20 quán ăn quanh HUST (`seedData.ts`).<br>• Code 6 APIs CRUD Quán ăn & Truy vấn bản đồ `$geoNear`.<br>• Code 4 APIs Đánh giá sao & hàm tính điểm trung bình quán (`recalculatePlaceRatings`).<br>• Dựng Socket.io Server & 8 APIs Notify, Report, Admin. |
| **Tuấn (FE 1)** | **Frontend Lead & UI Architect** | • Components: Layout, Common<br>• Features: `auth/`, `profiles/`, `posts/`<br>• Chức năng: **F01 – F05, F14 – F20** | • Khởi tạo dự án React + TypeScript + TailwindCSS.<br>• Cấu hình Axios Interceptors tự động refresh token & Zustand Stores.<br>• Dựng khung Layout 3 cột, Navbar, Sidebar.<br>• Code màn hình Đăng nhập, Đăng ký, Quên mật khẩu (F01, F02).<br>• Code màn hình Hồ sơ cá nhân & Danh sách Bookmarks (F03 – F05).<br>• Code Bảng tin Newsfeed cuộn vô tận, Modal tạo bài/công thức, Comment cây (F14 – F20). |
| **Vũ (FE 2)** | **Frontend Dev & Map/UI Tester** | • Components: Feedback<br>• Features: `places/`, `reviews/`, `maps/`, `notifications/`, Admin<br>• Chức năng: **F06 – F13, F21 – F25** | • Tích hợp React-Leaflet hiển thị bản đồ số OpenStreetMap.<br>• Xây dựng bộ UI Kit phản hồi (`Toast.tsx`, `Skeleton.tsx`, `StarRating.tsx`).<br>• Code màn hình Khám phá & Chi tiết Quán ăn kèm Menu (F06 – F08).<br>• Code Form chấm điểm 4 tiêu chí đánh giá sao (F09, F10).<br>• Code Bản đồ ẩm thực quét bán kính 500m–5km & Popup quán (F11 – F13).<br>• Ghép Socket.io chuông thông báo & Trang quản trị Admin (F21 – F25). |

---

## 2. Ma trận Trách nhiệm (RACI Matrix)

* **R (Responsible):** Người trực tiếp code và thực thi tính năng.
* **A (Accountable):** Người chịu trách nhiệm phê duyệt cuối cùng (Lead).
* **C (Consulted):** Người được tham vấn ý kiến kỹ thuật khi tích hợp.
* **I (Informed):** Người nhận thông báo sau khi hoàn thành.

| Khối lượng công việc | Vương (BE 1) | Dũng (BE 2) | Tuấn (FE 1) | Vũ (FE 2) |
| :--- | :---: | :---: | :---: | :---: |
| Kiến trúc CSDL & Schemas | **A / R** | C | I | I |
| Auth JWT & Mailer OTP | **R** | I | **A / R** | I |
| Quán ăn (Place) & Map $geoNear | I | **R** | I | **A / R** |
| Đánh giá (Review) & Tính Overall | C | **R** | I | **A / R** |
| Bảng tin (Post) & Công thức (Recipe) | **R** | I | **A / R** | I |
| WebSocket Realtime (Socket.io) | I | **R** | C | **A / R** |
| Quản trị Admin & Báo cáo vi phạm | I | **R** | I | **A / R** |
| Triển khai Cloud & Postman Docs | C | **A / R** | I | I |

