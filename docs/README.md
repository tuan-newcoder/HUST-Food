# 📚 HỆ THỐNG TÀI LIỆU THIẾT KẾ DỰ ÁN HUST-FOOD

> **Dự án:** HUST-Food – Mạng xã hội Ẩm thực, Khám phá & Đánh giá Quán ăn  
> **Phiên bản thiết kế:** v2.0 (Chuẩn hóa TypeScript Fullstack & Kiến trúc [STRUCTURE.md](file:///d:/Hoc/2026.1/Web/HUST-Food/STRUCTURE.md))  
> **Cập nhật lần cuối:** 06/11/2026

---

## 🗂️ Cấu trúc Tài liệu Dự án

Hệ thống tài liệu thiết kế được module hóa theo từng chuyên môn kỹ thuật để các thành viên dễ dàng tra cứu, phát triển song song và cập nhật trong suốt vòng đời dự án:

```text
docs/
├── README.md                            # Mục lục & hướng dẫn tổng quan tài liệu (File này)
├── HUST_Food_Design_v2.md               # Tài liệu thiết kế tổng hợp gốc (v2.0)
│
├── 01-requirements/                     # ĐẶC TẢ YÊU CẦU DỰ ÁN
│   ├── functional-requirements.md       # Đặc tả chi tiết 25 chức năng nghiệp vụ (F01 - F25)
│   └── non-functional-requirements.md   # Yêu cầu phi chức năng (Bảo mật, hiệu năng, UX)
│
├── 02-architecture/                     # THIẾT KẾ KIẾN TRÚC HỆ THỐNG
│   ├── system-architecture.md           # Kiến trúc Client-Server, Tech Stack TypeScript, Luồng 3 lớp
│   ├── realtime-events.md               # Thiết kế luồng Socket.io & WebSocket realtime
│   └── naming-conventions.md            # Quy chuẩn đặt tên mã nguồn (Folder, Component, Hook, Model)
│
├── 03-database/                         # THIẾT KẾ CƠ SỞ DỮ LIỆU
│   ├── database-design.md               # Thiết kế 8 Collections MongoDB, Schemas TypeScript, Indexes
│   ├── erd-diagram.md                   # Sơ đồ quan hệ thực thể ERD (Mermaid)
│   └── data-dictionary.md               # Từ điển dữ liệu chi tiết (Đang cập nhật)
│
├── 04-api-spec/                         # ĐẶC TẢ CHI TIẾT 42 RESTFUL APIS
│   ├── api-overview.md                  # Khuôn mẫu JSON Response chuẩn, Mã lỗi, Phân trang Cursor
│   ├── auth-users-bookmarks.api.md      # Cụm 1: Xác thực, Người dùng & Bookmarks (14 APIs)
│   ├── posts-comments.api.md            # Cụm 2: Bảng tin, Bài viết, Công thức & Bình luận (10 APIs)
│   ├── places-reviews-maps.api.md       # Cụm 3: Quán ăn, Đánh giá 4 tiêu chí & Bản đồ (10 APIs)
│   └── notifications-admin.api.md       # Cụm 4: Thông báo, Báo cáo vi phạm & Quản trị Admin (8 APIs)
│
├── 05-ui-ux/                            # THIẾT KẾ GIAO DIỆN & TRẢI NGHIỆM
│   ├── screen-specifications.md         # Đặc tả chi tiết bố cục, khối hiển thị của 9 màn hình chính
│   ├── design-system.md                 # Màu sắc thương hiệu, Typography, Bộ UI Kit dùng chung
│   └── wireframes-and-flows.md          # Sơ đồ màn hình chính & Luồng người dùng (Đang cập nhật)
│
├── 06-devops-deployment/                # MÔI TRƯỜNG & TRIỂN KHAI
│   ├── environment-variables.md         # Danh mục biến môi trường (.env) cho Client & Server
│   └── deployment-guide.md              # Hướng dẫn triển khai AWS & MongoDB Atlas (Đang cập nhật)
│
└── 07-project-management/               # QUẢN LÝ DỰ ÁN & PHÂN CÔNG
    ├── team-assignments.md              # Phân chia nhiệm vụ 4 thành viên (Vương, Dũng, Tuấn, Vũ)
    ├── git-workflow.md                  # Quy trình Git Flow (main, develop, feat/*) & Commit chuẩn
    └── sprint-plan.md                   # Kế hoạch tiến độ 4 tuần (Sprint Roadmap)
```

---

## 👥 Phân công Nhanh theo Thành viên Nhóm

| Thành viên | Vai trò chính | Thư mục tài liệu trọng tâm cần đọc |
| :--- | :--- | :--- |
| **Vương (BE 1)** | Backend Lead & Git Master | [03-database/](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/03-database/database-design.md), [04-api-spec/auth-users-bookmarks.api.md](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/04-api-spec/auth-users-bookmarks.api.md), [04-api-spec/posts-comments.api.md](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/04-api-spec/posts-comments.api.md) |
| **Dũng (BE 2)** | Backend Dev & DevOps | [03-database/](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/03-database/database-design.md), [04-api-spec/places-reviews-maps.api.md](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/04-api-spec/places-reviews-maps.api.md), [04-api-spec/notifications-admin.api.md](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/04-api-spec/notifications-admin.api.md), [06-devops-deployment/](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/06-devops-deployment/environment-variables.md) |
| **Tuấn (FE 1)** | Frontend Lead & UI Architect | [01-requirements/](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/01-requirements/functional-requirements.md), [05-ui-ux/screen-specifications.md](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/05-ui-ux/screen-specifications.md), [05-ui-ux/design-system.md](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/05-ui-ux/design-system.md), [04-api-spec/auth-users-bookmarks.api.md](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/04-api-spec/auth-users-bookmarks.api.md) |
| **Vũ (FE 2)** | Frontend Dev & Map/UI Tester | [01-requirements/](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/01-requirements/functional-requirements.md), [05-ui-ux/screen-specifications.md](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/05-ui-ux/screen-specifications.md), [05-ui-ux/design-system.md](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/05-ui-ux/design-system.md), [04-api-spec/places-reviews-maps.api.md](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/04-api-spec/places-reviews-maps.api.md) |

---

## 📌 Ghi chú Quy tắc Duy trì Tài liệu
1. Khi có bất kỳ thay đổi về Schema DB hoặc API Endpoint, thành viên phụ trách phải **cập nhật file tương ứng trong `03-database/` hoặc `04-api-spec/`** trước khi merge Pull Request vào `develop`.
2. Các tài liệu đánh dấu *(Đang cập nhật)* sẽ được bổ sung dần trong quá trình triển khai Sprint 2 & Sprint 3.

