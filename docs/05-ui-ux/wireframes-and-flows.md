# 📱 SƠ ĐỒ MÀN HÌNH & LUỒNG NGƯỜI DÙNG (WIREFRAMES & USER FLOWS)

> **Mã tài liệu:** `UI-FLOW-01`  
> **Dự án:** HUST-Food  
> **Trạng thái:** [ĐANG HOÀN THIỆN] - Khung tài liệu định hướng thiết kế giao diện Figma / Mockup

---

## 1. Danh sách Luồng Người dùng Cốt lõi (User Flows)

### 🔹 Luồng 1: Đăng bài Review Quán ăn & Ghim Tọa độ
```text
[Bấm 'Đăng bài' trên Header] 
       │
       ▼
[Chọn loại bài: 'Trải nghiệm ăn uống'] 
       │
       ▼
[Nhập Tên, Nội dung, Chọn ảnh] 
       │
       ▼
[Tìm & Chọn Quán ăn từ danh bạ HOẶC Bấm 'Tạo địa điểm quán mới']
       │
       ▼
[Click ghim tọa độ GPS trên bản đồ Leaflet thu nhỏ] 
       │
       ▼
[Bấm 'Xuất bản'] ──► Server tính toán & cập nhật bài lên Newsfeed
```

---

### 🔹 Luồng 2: Khám phá Quán ăn Quanh vị trí Hiện tại
```text
[Mở tab 'Bản đồ' (/map)]
       │
       ▼
[Trình duyệt yêu cầu quyền truy cập GPS (Geolocation API)]
       │
       ├─► Cho phép: Bản đồ lấy tâm theo tọa độ người dùng
       └─► Từ chối: Bản đồ lấy tâm mặc định tại Hà Nội (21.0285, 105.8542)
       │
       ▼
[Kéo thanh trượt bán kính: 500m - 5km]
       │
       ▼
[Hiển thị các Marker quán ăn kèm khoảng cách mét]
       │
       ▼
[Click Marker ──► Mở thẻ Popup tóm tắt ──► Bấm xem Chi tiết quán]
```

---

## 2. [TODO] Bản vẽ Wireframe & Liên kết Figma
* `[TODO]` Nhúng liên kết Figma Design Prototype của dự án.
* `[TODO]` Hình ảnh mockup chi tiết các màn hình:
  * Wireframe Trang chủ (Desktop & Mobile)
  * Wireframe Trang Chi tiết Quán ăn (Menu & Review Form)
  * Wireframe Bảng điều khiển Quản trị Admin

