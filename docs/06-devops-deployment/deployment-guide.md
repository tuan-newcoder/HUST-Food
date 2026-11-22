# 🚀 HƯỚNG DẪN TRIỂN KHAI HỆ THỐNG (DEPLOYMENT GUIDE)

> **Mã tài liệu:** `OPS-DEP-01`  
> **Dự án:** HUST-Food  
> **Hạ tầng dự kiến:** AWS EC2 / App Runner / S3 / MongoDB Atlas  
> **Trạng thái:** [ĐANG HOÀN THIỆN] - Khung hướng dẫn triển khai cho BE 2 (Dũng) trong Sprint 4

---

## 1. Triển khai Cơ sở dữ liệu MongoDB Atlas

1. **Khởi tạo Cluster:**
   * Tạo tài khoản tại [mongodb.com/atlas](https://www.mongodb.com/atlas).
   * Tạo Shared Cluster (Tier M0 Free) đặt tại khu vực Singapore (`ap-southeast-1`).
2. **Cấu hình Bảo mật:**
   * **Database Access:** Tạo người dùng quản trị DB với quyền `readWriteAnyDatabase`.
   * **Network Access:** Thêm địa chỉ IP của server backend hoặc tạm thời cho phép `0.0.0.0/0` trong giai đoạn dev/test.
3. **Thiết lập Chỉ mục (Indexes):**
   * Sau khi kết nối, kiểm tra đảm bảo chỉ mục `2dsphere` đã được tạo trên trường `location` của collection `places`.

---

## 2. [TODO] Triển khai Ứng dụng Backend lên AWS (EC2 / ECS)
* `[TODO]` Cấu hình Node.js runtime (v20+ LTS).
* `[TODO]` Thiết lập PM2 làm Process Manager duy trì server chạy ngầm:
  ```bash
  pm2 start dist/server.js --name hust-food-server
  ```
* `[TODO]` Cấu hình Nginx làm Reverse Proxy và cài đặt chứng chỉ SSL Let's Encrypt (HTTPS & WSS).

---

## 3. [TODO] Triển khai Ứng dụng Frontend lên Cloud (Vercel / AWS S3 + CloudFront)
* `[TODO]` Chạy lệnh build:
  ```bash
  cd client && npm run build
  ```
* `[TODO]` Cấu hình chuyển hướng Single Page Application (SPA Rewrite rule: `/* -> /index.html`).
* `[TODO]` Gắn biến môi trường `VITE_API_BASE_URL` trỏ về domain máy chủ backend production.

