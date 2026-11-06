# ⚙️ DANH MỤC BIẾN MÔI TRƯỜNG (ENVIRONMENT VARIABLES)

> **Mã tài liệu:** `OPS-ENV-01`  
> **Dự án:** HUST-Food  
> **Áp dụng:** `server/.env` và `client/.env`

---

## 1. Cấu hình Máy chủ Backend (`server/.env`)

Tạo tệp `.env` tại thư mục `server/` dựa trên mẫu `server/.env.example`:

```env
# ================= SERVER CONFIGURATION =================
PORT=5000
NODE_ENV=development

# ================= DATABASE (MONGODB ATLAS) =============
# Chuỗi kết nối tới MongoDB Atlas Cluster
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hust-food?retryWrites=true&w=majority

# ================= JWT AUTHENTICATION ===================
# Khóa bí mật dùng ký Access Token (hết hạn 15 phút)
JWT_ACCESS_SECRET=hust_food_access_secret_key_2026_super_secure
JWT_ACCESS_EXPIRES_IN=15m

# Khóa bí mật dùng ký Refresh Token (hết hạn 7 ngày)
JWT_REFRESH_SECRET=hust_food_refresh_secret_key_2026_super_secure
JWT_REFRESH_EXPIRES_IN=7d

# ================= CLOUDINARY (MEDIA STORAGE) ===========
# Cấu hình lưu trữ ảnh từ Cloudinary Dashboard
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# ================= SMTP MAILER (NODEMAILER) =============
# Dùng để gửi email chứa mã OTP khôi phục mật khẩu (F02)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password

# ================= CORS & CLIENT URL =====================
# Địa chỉ Frontend được phép truy cập tài nguyên
CLIENT_URL=http://localhost:5173
```

---

## 2. Cấu hình Ứng dụng Giao diện (`client/.env`)

Tạo tệp `.env` tại thư mục `client/` dựa trên mẫu `client/.env.example`:

```env
# ================= CLIENT API & SOCKET ===================
# Địa chỉ gốc gọi RESTful API của Server
VITE_API_BASE_URL=http://localhost:5000/api/v1

# Địa chỉ WebSocket Server (Socket.io)
VITE_SOCKET_URL=http://localhost:5000

# ================= MAP DEFAULT COORDINATES ===============
# Tọa độ mặc định khi người dùng không cấp quyền truy cập vị trí GPS (Tâm Hà Nội)
VITE_DEFAULT_LAT=21.0285
VITE_DEFAULT_LNG=105.8542
VITE_DEFAULT_ZOOM=15
```

---

> [!WARNING]
> Tuyệt đối không commit tệp `.env` chứa mật khẩu thật lên GitHub. Tệp `.gitignore` đã được cấu hình để loại trừ `.env`. Chỉ commit `.env.example`.

