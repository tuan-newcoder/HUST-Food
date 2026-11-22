# 🍜 HUST-Food - Mạng xã hội Ẩm thực & Review Quán ăn

Nền tảng mạng xã hội kết nối cộng đồng yêu ẩm thực, sinh viên và các tín đồ ăn uống: khám phá các địa điểm ẩm thực, chia sẻ đánh giá, đăng tải bài viết và trải nghiệm bản đồ món ngon quanh trường Đại học Bách Khoa Hà Nội và khu vực lân cận.

---

## 📌 Hướng Dẫn & Tài Liệu Cho Thành Viên Mới

👉 **[Xem Hướng Dẫn Khởi Chạy Chi Tiết (GETTING_STARTED.md)](file:///d:/Hoc/2026.1/Web/HUST-Food/GETTING_STARTED.md)** — Đọc tài liệu này nếu bạn mới clone dự án về máy!

- **Cấu trúc thư mục & Quy chuẩn code**: Xem chi tiết tại [STRUCTURE.md](file:///d:/Hoc/2026.1/Web/HUST-Food/STRUCTURE.md).
- **Đặc tả 9 màn hình UI/UX**: Xem tại [docs/05-ui-ux/screen-specifications.md](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/05-ui-ux/screen-specifications.md).
- **Bộ Prompt tạo Figma UI**: Xem tại [docs/05-ui-ux/figma-prompts.md](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/05-ui-ux/figma-prompts.md).
- **Tài liệu API & Thiết kế CSDL**: Xem trong thư mục [docs/](file:///d:/Hoc/2026.1/Web/HUST-Food/docs).

---

## 📂 Tổng Quan Cấu Trúc Thư Mục

Dự án được phân chia theo mô hình **Client - Server**:

- `client/`: Mã nguồn giao diện người dùng (React 18, Vite, TypeScript, TailwindCSS, Leaflet & Mapbox).
- `server/`: Mã nguồn dịch vụ Backend (Node.js, Express, MongoDB, Socket.IO).
- `docs/`: Toàn bộ tài liệu phân tích thiết kế, CSDL, API spec và UX workflow.

---

## 🚀 Khởi Chạy Nhanh (3 Phút)

### 1. Phía Frontend (Client)
```bash
cd client
# Tạo file môi trường (đã có sẵn Mapbox API Token)
copy .env.example .env    # Trên Windows (Mac/Linux dùng: cp .env.example .env)

# Cài đặt và khởi chạy
npm install
npm run dev
```
Trình duyệt sẽ mở tại: **`http://localhost:5173`** (mặc định vào ngay Bản đồ ẩm thực Bách Khoa).

### 2. Phía Backend (Server)
```bash
cd server
# Tạo file môi trường
copy .env.example .env    # Trên Windows (Mac/Linux dùng: cp .env.example .env)

# Cài đặt và khởi chạy
npm install
npm run dev
```
Máy chủ API chạy tại: **`http://localhost:5000`**.
