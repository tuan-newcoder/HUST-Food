# 🍜 HUST-Food - Mạng xã hội Ẩm thực & Review Quán ăn

Nền tảng mạng xã hội kết nối cộng đồng yêu ẩm thực, sinh viên và các tín đồ ăn uống: khám phá các địa điểm ẩm thực, chia sẻ đánh giá, đăng tải bài viết và trải nghiệm bản đồ món ngon quanh trường và khu vực lân cận.

---

## 📌 Tài liệu cho thành viên dự án

- **Cấu trúc thư mục & Quy chuẩn code**: Xem chi tiết tại [STRUCTURE.md](file:///d:/Hoc/2026.1/Web/HUST-Food/STRUCTURE.md).
- **Tài liệu API & Thiết kế CSDL**: Xem trong thư mục [docs/](file:///d:/Hoc/2026.1/Web/HUST-Food/docs).

---

## 📂 Tổng quan cấu trúc thư mục

Dự án được phân chia theo mô hình **Client - Server**:

- `client/`: Mã nguồn giao diện người dùng (Frontend).
- `server/`: Mã nguồn hệ thống dịch vụ Backend & RESTful API.
- `docs/`: Tài liệu đặc tả, sơ đồ cơ sở dữ liệu và mô tả API.

---

## 🚀 Bắt đầu nhanh (Khởi chạy dự án)

### Phía Server
```bash
cd server
npm install
npm run dev
```

### Phía Client
```bash
cd client
npm install
npm run dev
```