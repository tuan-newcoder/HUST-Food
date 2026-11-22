# 🎨 HỆ THỐNG THIẾT KẾ GIAO DIỆN (DESIGN SYSTEM & UI KIT)

> **Mã tài liệu:** `UI-DS-01`  
> **Dự án:** HUST-Food  
> **Framework:** TailwindCSS  
> **Căn cứ:** Quy chuẩn `client/src/components/` trong [STRUCTURE.md](file:///d:/Hoc/2026.1/Web/HUST-Food/STRUCTURE.md)

---

## 1. Bảng Màu Thương hiệu (Brand Colors)

| Màu sắc | Mã HEX | Ứng dụng trong giao diện |
| :--- | :--- | :--- |
| **Primary (Đỏ ấm)** | `#E11D48` (`rose-600`) | Nút bấm chính (CTA), icon Yummy khi đã thả, badge thông báo, thanh active tab. |
| **Secondary (Vàng Cam)** | `#F59E0B` (`amber-500`) | Chấm sao đánh giá (StarRating), icon cảnh báo, huy hiệu bài viết nổi bật. |
| **Neutral Dark (Chữ đậm)** | `#0F172A` (`slate-900`) | Tiêu đề bài viết, tên quán ăn, nội dung chữ chính. |
| **Neutral Muted (Chữ phụ)** | `#64748B` (`slate-500`) | Ngày đăng, số lượt thích, địa chỉ quán ăn, ghi chú phụ. |
| **Background (Nền sáng)** | `#F8FAFC` (`slate-50`) | Màu nền toàn bộ ứng dụng, tạo cảm giác sạch sẽ, thoáng mắt. |
| **Surface (Nền thẻ)** | `#FFFFFF` (`white`) | Nền các thẻ bài viết (Card), popup, modal, dropdown menu. |

---

## 2. Danh mục Component Dùng chung (`client/src/components/`)

### 2.1. Thành phần Nguyên tử (`components/common/`)
* **`Button.tsx`**: Các biến thể (`variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'`), hỗ trợ trạng thái `isLoading` kèm spinner.
* **`Input.tsx`**: Ô nhập liệu kèm icon, thông báo lỗi validate màu đỏ và nhãn (label).
* **`Modal.tsx`**: Hộp thoại nổi dùng cho Form tạo bài viết, sửa profile, xem ảnh phóng to.
* **`Dropdown.tsx`**: Menu thả xuống cho danh mục bộ lọc và tùy chọn bài viết.
* **`Avatar.tsx`**: Hiển thị ảnh đại diện người dùng, tự động fallback về chữ cái đầu nếu không có ảnh.
* **`StarRating.tsx`**: Thanh hiển thị số sao (0.5 – 5.0) và component cho phép người dùng click để chấm điểm.

### 2.2. Phản hồi Trạng thái (`components/feedback/`)
* **`Toast.tsx`**: Thông báo nổi góc màn hình (thành công, cảnh báo, lỗi) kích hoạt khi nhận Socket hoặc sau khi gọi API.
* **`Skeleton.tsx`**: Khung xương giả lập cấu trúc Card bài viết khi đang chờ tải dữ liệu.
* **`Alert.tsx`**: Khung cảnh báo thông tin tài khoản hoặc quy định cộng đồng.
* **`Spinner.tsx`**: Biểu tượng tải xoay vòng dùng khi tải thêm bình luận.

### 2.3. Khung Giao diện (`components/layout/`)
* **`Header.tsx` / `Navbar.tsx`**: Thanh điều hướng trên cùng chứa Logo HUST-Food, thanh tìm kiếm toàn văn, biểu tượng chuông thông báo có số badge và avatar cá nhân.
* **`Sidebar.tsx` / `LeftSidebar.tsx`**: Menu điều hướng bên trái (Bảng tin, Bản đồ khám phá, Quán ăn, Bookmarks, Hồ sơ).
* **`RightTrendingTags.tsx`**: Cột bên phải hiển thị danh sách Top #tags thịnh hành và gợi ý người dùng nổi bật.
* **`BottomNavigation.tsx`**: Thanh điều hướng tiện lợi ở đáy màn hình khi xem trên điện thoại.

---

## 3. Sáu Màn hình Giao diện Cốt lõi
1. **Trang chủ Bảng tin (Newsfeed):** Bố cục 3 cột kinh điển; tab chuyển đổi nhanh (Tất cả / Trải nghiệm / Công thức).
2. **Trang Bản đồ Ẩm thực (/map):** Tương tác bản đồ toàn màn hình, thanh trượt bán kính nổi và popup tóm tắt quán.
3. **Trang Chi tiết Quán ăn (/places/:id):** Thư viện ảnh, thực đơn có giá, điểm sao 4 tiêu chí và danh sách đánh giá.
4. **Modal Soạn bài viết đa bước:** Ghim tọa độ bản đồ cho bài Review, thêm nguyên liệu/bước nấu cho bài Recipe.
5. **Trang Hồ sơ Cá nhân (/profile):** Thông tin cá nhân, danh sách bài viết đã đăng và danh sách Bookmarks đã lưu.
6. **Trang Quản trị Admin (/admin):** Biểu đồ thống kê số liệu, bảng duyệt báo cáo vi phạm và quản lý khóa tài khoản.

