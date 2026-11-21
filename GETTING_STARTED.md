# 🚀 Hướng Dẫn Cài Đặt & Sử Dụng HUST-Food Cho Thành Viên Mới

Chào mừng bạn đến với dự án **HUST-Food** — Mạng xã hội Ẩm thực & Bản đồ Khám phá Món ngon dành cho sinh viên và cộng đồng quanh Đại học Bách Khoa Hà Nội!

Tài liệu này hướng dẫn chi tiết từng bước từ lúc clone mã nguồn từ GitHub về máy tính cho đến khi chạy thành công cả giao diện Frontend và dịch vụ Backend.

---

## 📋 1. Yêu Cầu Cài Đặt Ban Đầu (Prerequisites)

Trước khi bắt đầu, đảm bảo máy tính của bạn đã cài đặt các công cụ sau:
- **Node.js**: Phiên bản `>= 18.x` hoặc `20.x` LTS ([Tải Node.js tại đây](https://nodejs.org/))
- **Trình quản lý gói**: `npm` (đi kèm Node.js) hoặc `pnpm` / `yarn`
- **Git**: Để clone và quản lý mã nguồn ([Tải Git](https://git-scm.com/))
- **MongoDB** *(cho Backend)*: Có thể dùng MongoDB Community Server cục bộ hoặc kết nối miễn phí qua [MongoDB Atlas Cloud](https://www.mongodb.com/cloud/atlas).

Kiểm tra phiên bản trong terminal:
```bash
node -v   # Yêu cầu v18 trở lên
npm -v    # Yêu cầu v9 hoặc v10 trở lên
git --version
```

---

## 📥 2. Clone Dự Án Về Máy

Mở Terminal (hoặc PowerShell trên Windows) và chạy lệnh:
```bash
git clone https://github.com/<your-repo>/HUST-Food.git
cd HUST-Food
```

---

## 🎨 3. Khởi Chạy Frontend (Client)

Frontend được phát triển bằng **React 18 + Vite + TypeScript + TailwindCSS + Leaflet / Mapbox**.

### Bước 3.1: Tạo file cấu hình môi trường `.env`
Dự án đã nạp sẵn **Mapbox API Public Token chính thức** trong file [client/.env.example](file:///d:/Hoc/2026.1/Web/HUST-Food/client/.env.example). Bạn chỉ cần sao chép sang `.env`:

- **Trên Windows (PowerShell / CMD):**
  ```powershell
  cd client
  copy .env.example .env
  ```
- **Trên macOS / Linux:**
  ```bash
  cd client
  cp .env.example .env
  ```

> [!NOTE]
> File `.env` chứa token Mapbox miễn phí 50.000 lượt tải/tháng và toạ độ tâm Đại học Bách Khoa (Cổng Parabol: `21.0055, 105.8431`). Bạn không cần đăng ký thêm key nào để chạy thử nghiệm!

### Bước 3.2: Cài đặt thư viện dependencies
```bash
npm install
```

### Bước 3.3: Chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
Terminal sẽ hiển thị đường dẫn cục bộ:
```text
  VITE v5.4.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```
Truy cập **http://localhost:5173** trên trình duyệt để trải nghiệm ngay bản đồ ẩm thực!

---

## ⚙️ 4. Khởi Chạy Backend (Server)

Backend được xây dựng bằng **Node.js (Express / TypeScript) + MongoDB + Socket.IO**.

### Bước 4.1: Tạo file cấu hình môi trường `.env`

- **Trên Windows (PowerShell / CMD):**
  ```powershell
  cd ../server
  copy .env.example .env
  ```
- **Trên macOS / Linux:**
  ```bash
  cd ../server
  cp .env.example .env
  ```

> [!TIP]
> Kiểm tra chuỗi kết nối `DATABASE_URL` trong [server/.env](file:///d:/Hoc/2026.1/Web/HUST-Food/server/.env). Mặc định là `mongodb://localhost:27017/hust_food`. Nếu bạn dùng MongoDB Atlas, hãy dán connection string của bạn vào đây.

### Bước 4.2: Cài đặt thư viện dependencies
```bash
npm install
```

### Bước 4.3: Chạy máy chủ phát triển
```bash
npm run dev
```
Backend sẽ khởi động tại cổng **http://localhost:5000**.

---

## 🗺️ 5. Trải Nghiệm Các Tính Năng Hiện Có

Khi mở Frontend tại `http://localhost:5173`, bạn sẽ được đưa trực tiếp vào màn hình **Bản đồ Ẩm thực Bách Khoa (SCR-02)**:

1. **Bản đồ tương tác đa lớp (Mapbox Vector Tiles):**
   - Click nút **Layer Switcher** (ở góc phải dưới) để đổi giữa: **Chuẩn (Streets)** ➡️ **Bản đồ ấm/Địa hình (Outdoors)** ➡️ **Vệ tinh (Satellite)**.
   - Click nút **La bàn N** (góc phải trên) hoặc nút **GPS Target** (hình tâm ngắm tròn xanh `#3282F6`) để bay về tâm Bách Khoa.
   - Sử dụng chuột cuộn hoặc 2 nút **`+`** / **`-`** để phóng to/thu nhỏ.
2. **Bộ lọc thông minh (Floating Filter Bar):**
   - **Tìm kiếm:** Gõ tên quán (vd: *"Cơm sườn"*, *"Phở"*, *"Aha"*).
   - **Bán kính quét (Radar):** Chọn nhanh `500m`, `1km`, `2km`, `5km` — vòng tròn radar màu vàng cam sẽ tự động co giãn trực quan quanh vị trí người dùng.
   - **Danh mục:** Lọc theo *Tất cả*, *Quán ăn* 🔴, *Cà phê* 🟤, *Ăn vặt* 🟡.
   - **Bộ lọc nâng cao:** Lọc quán *< 50k* cho sinh viên, hoặc quán *⭐ 4.7+* điểm đánh giá.
3. **Thẻ thông tin quán ăn (Popup Card):**
   - Click vào bất kỳ marker pin nào trên bản đồ để xem chi tiết quán ở góc trái dưới: Ảnh đại diện, tên quán, địa chỉ, khoảng cách mét, giờ mở cửa và giá tiền.
4. **Thanh điều hướng cánh trái (Sidebar):**
   - Chuyển đổi giữa các phân hệ: **Trang chủ**, **Bản đồ**, **Địa điểm**, **Đã lưu**, **Cá nhân**.

---

## ❓ 6. Xử Lý Sự Cố Thường Gặp (Troubleshooting & FAQ)

### Q1: Bản đồ bị xám hoặc không tải được ảnh tiles?
- **Nguyên nhân:** File `.env` mới được tạo trong khi Vite dev server đang chạy, hoặc mạng bị chặn kết nối đến Mapbox.
- **Cách khắc phục:**
  1. Vào terminal `client`, ấn `Ctrl + C` để dừng server.
  2. Chạy lại `npm run dev`.
  3. Mở lại trình duyệt và bấm `Ctrl + F5` để xoá cache. Nếu mất kết nối Mapbox, hệ thống sẽ tự động chuyển sang OpenStreetMap.

### Q2: Lỗi cổng bị chiếm dụng (`EADDRINUSE: address already in use :::5173` hoặc `:::5000`)?
- **Cách khắc phục trên Windows:**
  ```powershell
  # Tìm process đang chiếm port 5000
  netstat -ano | findstr :5000
  # Tắt tiến trình theo PID
  taskkill /PID <PID> /F
  ```
- Hoặc đổi giá trị `PORT=5001` trong `server/.env`.

### Q3: Lỗi xung đột version khi chạy `npm install`?
- Dùng cờ `--legacy-peer-deps`:
  ```bash
  npm install --legacy-peer-deps
  ```

---

## 📚 7. Tài Liệu Kỹ Thuật Tham Khảo Thêm

- [STRUCTURE.md](file:///d:/Hoc/2026.1/Web/HUST-Food/STRUCTURE.md): Quy ước đặt tên, kiến trúc thư mục Feature-based và quy chuẩn Clean Code.
- [docs/05-ui-ux/screen-specifications.md](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/05-ui-ux/screen-specifications.md): Đặc tả chi tiết 9 màn hình UI/UX của dự án.
- [docs/05-ui-ux/figma-prompts.md](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/05-ui-ux/figma-prompts.md): Bộ Prompt chuẩn dựng giao diện trên Figma AI.
- [docs/04-api-spec/api-specifications.md](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/04-api-spec/api-specifications.md): Tài liệu đặc tả danh sách RESTful API.

---
*Chúc bạn có trải nghiệm lập trình vui vẻ cùng đội ngũ phát triển HUST-Food! 🍜*

