# 🛡️ YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS)

> **Mã tài liệu:** `REQ-NFR-01`  
> **Dự án:** HUST-Food  
> **Phiên bản:** 2.0  
> **Trạng thái:** Bản phác thảo chuẩn hóa (Các mục ghi chú `[TODO]` sẽ được bổ sung chi tiết trong Sprint Kiểm thử)

---

## 1. Yêu cầu về Bảo mật (Security)

1. **Xác thực & Ủy quyền (Authentication & Authorization):**
   * Sử dụng cơ chế JSON Web Token (JWT) không trạng thái (stateless) với 2 loại khóa bí mật riêng biệt: `JWT_ACCESS_SECRET` (hạn 15 phút) và `JWT_REFRESH_SECRET` (hạn 7 ngày).
   * Mật khẩu người dùng bắt buộc mã hóa bằng thuật toán `bcrypt` với muối (salt round) tối thiểu 10 vòng trước khi lưu vào CSDL.
   * Trường `passwordHash` và `refreshToken` luôn được ẩn mặc định (`select: false`) trong các truy vấn Mongoose để tránh rò rỉ dữ liệu.
2. **Kiểm tra trạng thái tài khoản (Account Ban Check):**
   * Mọi request yêu cầu xác thực đều phải đi qua `auth.middleware.ts` để kiểm tra cờ `status === 'ACTIVE'`. Nếu người dùng bị `BANNED`, hệ thống lập tức từ chối với mã lỗi `403 FORBIDDEN_BANNED`.
3. **Phân quyền truy cập theo vai trò (RBAC):**
   * Các endpoint bắt đầu bằng `/api/v1/admin/*` bắt buộc có `role.middleware.ts` kiểm tra vai trò `ADMIN`.
4. **Kiểm định dữ liệu đầu vào (Input Sanitization & Validation):**
   * Toàn bộ dữ liệu gửi lên Client được kiểm định nghiêm ngặt bằng thư viện `Zod` trước khi chuyển vào tầng Service nhằm ngăn chặn các lỗ hổng NoSQL Injection và Cross-Site Scripting (XSS).
5. **CORS & Rate Limiting:**
   * Cấu hình CORS chỉ cho phép các domain được ủy quyền (`CLIENT_URL`) kết nối tới backend.
   * `[TODO]` Cấu hình Rate Limiter (tối đa 100 requests/phút cho các API public và 5 requests/phút cho các API đăng nhập/quên mật khẩu).

---

## 2. Yêu cầu về Hiệu năng (Performance)

1. **Tối ưu hóa Truy vấn Cơ sở dữ liệu:**
   * **Truy vấn không gian địa lý:** Bắt buộc áp dụng chỉ mục `2dsphere` trên trường `location` của bảng `Place` để thuật toán `$geoNear` quét tọa độ quán ăn trong bán kính dưới 100ms.
   * **Bảng tin Newsfeed:** Áp dụng phân trang theo con trỏ (**Cursor-based Pagination**) dựa trên `_id` và `createdAt` giảm dần để đảm bảo thời gian phản hồi không đổi kể cả khi số lượng bài viết lên tới hàng triệu bản ghi.
   * **Tìm kiếm toàn văn:** Đánh `Text Index` trên các trường `name`, `address`, `title`, `content` để tìm kiếm tức thì.
2. **Xử lý Tệp tin Đa phương tiện:**
   * Không lưu trữ tệp ảnh trực tiếp trên máy chủ backend; sử dụng luồng stream tải thẳng lên **Cloudinary CDN** với định dạng nén tối ưu (`.webp`, giới hạn dung lượng $\le 5\text{MB}$/ảnh).
3. **`[TODO]` Bộ nhớ đệm (Caching Strategy):**
   * Kế hoạch ứng dụng Redis để cache kết quả API Top Trending Tags và danh sách địa điểm nổi bật.

---

## 3. Khả năng tương thích & Trải nghiệm Người dùng (Compatibility & UX)

1. **Thiết kế Đáp ứng (Responsive Web Design):**
   * Giao diện tương thích hoàn hảo trên các kích thước màn hình: Mobile ($\le 640\text{px}$), Tablet ($768\text{px} - 1024\text{px}$) và Desktop ($\ge 1280\text{px}$).
   * Trên thiết bị di động, hiển thị thanh điều hướng đáy (`BottomNavigation.tsx`) thay cho Sidebar.
2. **Trải nghiệm Tải trang & Phản hồi:**
   * Hiển thị hiệu ứng xương tải (`Skeleton.tsx`) trong quá trình tải dữ liệu thay cho biểu tượng xoay (spinner) truyền thống để tăng cảm giác mượt mà.
   * Áp dụng cập nhật giao diện lạc quan (**Optimistic UI**) cho nút Yummy và Bookmark: Giao diện đổi màu ngay lập tức trước khi server phản hồi thành công.
3. **`[TODO]` Khả năng tiếp cận (Accessibility - a11y):**
   * Tuân thủ chuẩn tương phản màu sắc WCAG 2.1 AA cho các nút bấm và văn bản cảnh báo.

---

## 4. Độ sẵn sàng & Vận hành (Availability & DevOps)

1. **Khả năng phục hồi (Error Handling):**
   * Mọi lỗi ngoại lệ phía Server đều được gom lại tại `error.middleware.ts`, trả về JSON lỗi chuẩn hóa, không bao giờ làm sập tiến trình Node.js.
2. **`[TODO]` Giám sát hệ thống (Monitoring & Logging):**
   * Tích hợp Winston / Morgan để ghi log hoạt động HTTP và lỗi nghiêm trọng.
3. **`[TODO]` Sao lưu dữ liệu (Backup & Recovery):**
   * Thiết lập cơ chế tự động Snapshot dữ liệu định kỳ trên MongoDB Atlas.

