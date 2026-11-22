# 📋 ĐẶC TẢ YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)

> **Mã tài liệu:** `REQ-FR-01`  
> **Dự án:** HUST-Food  
> **Căn cứ:** Chuẩn hóa theo 7 thư mục tính năng trong `client/src/features/` và cấu trúc [STRUCTURE.md](file:///d:/Hoc/2026.1/Web/HUST-Food/STRUCTURE.md).

---

## 📌 Tổng quan 25 Chức năng (F01 – F25)

Hệ thống HUST-Food cung cấp 25 chức năng nghiệp vụ, phân chia thành 7 mô-đun độc lập:

---

### Mô-đun 1: Xác thực & Phân quyền (`features/auth/`)

#### 🔹 F01 - Đăng ký / Đăng nhập / Làm mới Token / Đăng xuất
* **Đăng ký tài khoản mới:** Người dùng cung cấp `username` (3–30 ký tự, duy nhất), `email` (duy nhất), `password` ($\ge 6$ ký tự) và `fullName`. Mật khẩu được mã hóa băm bằng bcrypt trước khi lưu.
* **Đăng nhập:** Hỗ trợ đăng nhập bằng Email hoặc Username kèm Mật khẩu. Trả về cặp Token:
  * `accessToken`: Thời hạn ngắn (15 phút), dùng kèm header `Authorization: Bearer <token>` trong các request cần quyền.
  * `refreshToken`: Thời hạn dài (7 ngày), lưu an toàn trong database để cấp lại `accessToken`.
* **Làm mới Token (Refresh Token):** Axios Interceptor tại Client tự động bắt lỗi `401 Unauthorized` và gọi API refresh để lấy `accessToken` mới mà không làm gián đoạn trải nghiệm người dùng.
* **Đăng xuất:** Thu hồi phiên làm việc bằng cách xóa `refreshToken` tương ứng trong CSDL.

#### 🔹 F02 - Quên mật khẩu & Đặt lại mật khẩu (Forgot / Reset Password)
* **Yêu cầu khôi phục:** Người dùng nhập địa chỉ email đã đăng ký. Hệ thống tạo mã xác thực/token có hạn sử dụng (15 phút) và gửi qua dịch vụ SMTP Mailer (`Nodemailer`).
* **Đặt lại mật khẩu:** Người dùng nhập mã xác thực và mật khẩu mới ($\ge 6$ ký tự). Hệ thống kiểm tra tính hợp lệ của token, cập nhật mật khẩu băm mới và thu hồi token khôi phục.

---

### Mô-đun 2: Hồ sơ Cá nhân & Danh sách Đã lưu (`features/profiles/`)

#### 🔹 F03 - Xem & Chỉnh sửa Hồ sơ cá nhân (Profile Management)
* **Xem trang cá nhân:** Hiển thị thông tin cá nhân: Họ tên, avatar, tiểu sử (bio), ngày tham gia, thống kê số lượng (Followers, Following, tổng số bài viết).
* **Cập nhật thông tin:** Cho phép thay đổi họ tên, ảnh đại diện (upload qua Cloudinary), tiểu sử giới thiệu ($\le 250$ ký tự) và đổi mật khẩu.
* **Trang cá nhân công khai:** Cho phép xem profile của người dùng khác kèm danh sách bài viết và đánh giá quán của họ.

#### 🔹 F04 - Theo dõi / Bỏ theo dõi (Follow / Unfollow)
* Người dùng có thể nhấn nút **Theo dõi** các nhà đánh giá (Reviewer) hoặc thành viên yêu thích.
* Bấm lại để **Bỏ theo dõi** (Toggle Follow).
* Xem danh sách chi tiết người đang theo dõi mình (Followers) và người mình đang theo dõi (Following).

#### 🔹 F05 - Quản lý Danh sách Đã lưu (Bookmarks)
* Cho phép người dùng đánh dấu lưu (Bookmark) cả hai loại thực thể:
  * **Quán ăn yêu thích (`PLACE`):** Lưu lại để ghé thăm sau này.
  * **Bài viết / Công thức hay (`POST`):** Lưu lại để tham khảo khi nấu ăn hoặc tìm quán.
* Xem tab danh sách Bookmarks cá nhân, hỗ trợ phân loại theo Quán ăn hoặc Bài viết.

---

### Mô-đun 3: Địa điểm Quán ăn (`features/places/`)

#### 🔹 F06 - Khám phá & Lọc danh sách Quán ăn
* Hiển thị danh sách các quán ăn có phân trang (Cursor Pagination).
* Bộ lọc đa năng:
  * Lọc theo danh mục: Nhà hàng (`RESTAURANT`), Quán cà phê (`CAFE`), Ăn vặt (`STREET_FOOD`), Tiệm bánh (`BAKERY`), Khác (`OTHER`).
  * Lọc theo mức giá tối đa (`maxPrice`).
  * Lọc theo điểm đánh giá tối thiểu (`minRating`, ví dụ: $\ge 4.0$ sao).
  * Sắp xếp: Điểm cao nhất (`rating`), Nhiều review nhất (`reviews`), Mới nhất (`newest`).

#### 🔹 F07 - Xem chi tiết Quán ăn (Place Detail)
* Hiển thị thông tin tổng thể của quán:
  * Bộ sưu tập ảnh quán, tên quán, địa chỉ chính xác, vị trí trên bản đồ thu nhỏ.
  * Khung giờ mở cửa trong ngày (`openingHours.open` – `openingHours.close`).
  * Danh sách Thực đơn (`menu`): Tên món, đơn giá niêm yết (VNĐ), ảnh minh họa từng món.
  * Bảng tổng hợp điểm sao trung bình 4 tiêu chí: Hương vị, Giá cả, Vệ sinh, Phục vụ và điểm trung bình tích lũy (`overall`).
  * Danh sách các bài đánh giá (Reviews) thực tế từ cộng đồng, đánh dấu nếu người dùng hiện tại đã từng đánh giá quán này.

#### 🔹 F08 - Thêm mới & Cập nhật Quán ăn
* Người dùng và Quản trị viên có thể đóng góp địa điểm quán ăn mới lên hệ thống:
  * Tên quán, danh mục, địa chỉ.
  * Ghim tọa độ định vị GPS trực tiếp trên bản đồ Leaflet.
  * Nhập khung giờ hoạt động và khoảng giá trung bình.
  * Thêm động từng món ăn vào thực đơn kèm giá tiền và ảnh.
* Tác giả tạo quán hoặc Quản trị viên (Admin) có quyền cập nhật thông tin quán khi quán thay đổi menu hoặc địa chỉ.

---

### Mô-đun 4: Đánh giá Sao & Chấm điểm Quán ăn (`features/reviews/`)

#### 🔹 F09 - Viết đánh giá & Chấm điểm 4 tiêu chí cho Quán ăn
* Tại trang chi tiết quán ăn, người dùng đã đăng nhập có thể gửi bài đánh giá:
  * Chấm điểm 4 thanh trượt (1–5 sao): **Hương vị (Taste)**, **Giá cả (Price)**, **Vệ sinh (Hygiene)**, **Phục vụ (Service)**.
  * Hệ thống tự động tính điểm trung bình của lượt đánh giá: $\text{Overall} = \frac{\text{Taste} + \text{Price} + \text{Hygiene} + \text{Service}}{4}$.
  * Nhập nhận xét thực tế (10–2000 ký tự) và đính kèm tối đa 5 ảnh chụp thực tế.
  * **Quy tắc duy nhất:** Mỗi người dùng chỉ được viết tối đa 1 đánh giá cho mỗi quán ăn (Unique: `placeId` + `authorId`).
  * Sau khi gửi thành công, hệ thống tự động cập nhật lại điểm sao trung bình của toàn bộ quán ăn.

#### 🔹 F10 - Lọc, Chỉnh sửa & Xóa Đánh giá
* Xem danh sách đánh giá của quán có bộ lọc theo mức sao (5 sao, 4 sao, 3 sao...), lọc bài có ảnh.
* Người viết có quyền chỉnh sửa nội dung/điểm số hoặc xóa đánh giá của mình. Khi sửa hoặc xóa, điểm trung bình của quán ăn sẽ được tính toán lại ngay lập tức.

---

### Mô-đun 5: Bản đồ Ẩm thực Tương tác (`features/maps/`)

#### 🔹 F11 - Bản đồ Quán ăn Trực quan
* Bản đồ Leaflet tương tác toàn màn hình, lấy tâm mặc định theo vị trí GPS thực tế của người dùng (nếu được cấp quyền vị trí) hoặc tâm mặc định tại Hà Nội (21.0285, 105.8542).
* Hiển thị các ghim (Marker) quán ăn sinh động kèm icon nhận diện theo danh mục.

#### 🔹 F12 - Quét quán ăn theo Bán kính Tọa độ (`$geoNear`)
* Người dùng điều chỉnh thanh trượt bán kính (Radius Slider): 500m – 1km – 2km – 5km.
* Hệ thống thực hiện truy vấn không gian địa lý `$geoNear` với chỉ mục `2dsphere` trên bảng `Place`, trả về danh sách quán trong phạm vi kèm khoảng cách tính bằng mét thực tế.
* Kết hợp lọc theo mức giá tối đa và số sao tối thiểu ngay trên bản đồ.

#### 🔹 F13 - Thẻ Popup Tóm tắt Quán ăn trên Bản đồ
* Click vào từng ghim trên bản đồ hiển thị thẻ thông tin tóm tắt: Tên quán, ảnh bìa, danh mục, điểm sao `overall`, tổng số lượt review, khoảng giá, khoảng cách từ vị trí hiện tại (ví dụ: *Cách bạn 320m*).
* Nút bấm tiện lợi chuyển hướng ngay tới trang Chi tiết Quán ăn.

---

### Mô-đun 6: Bảng tin Cộng đồng, Công thức & Tương tác (`features/posts/`)

#### 🔹 F14 - Bảng tin (Newsfeed) Cuộn vô tận & Chuyển Tab lọc
* Xem danh sách bài viết mới nhất theo cơ chế **Cursor Pagination** (không trùng lặp dữ liệu khi có bài mới).
* Bộ lọc chuyển tab tức thì:
  * **Tất cả bài viết (`ALL`)**
  * **Chia sẻ trải nghiệm ăn uống (`EXPERIENCE`):** Có gắn thẻ liên kết tới một Quán ăn cụ thể.
  * **Công thức nấu ăn (`RECIPE`):** Hướng dẫn nấu ăn tại nhà.

#### 🔹 F15 - Đăng bài Chia sẻ Trải nghiệm hoặc Công thức nấu ăn
* Trình soạn thảo bài viết hỗ trợ upload tối đa 5 hình ảnh (Cloudinary) và gắn `#tags`.
* **Nếu chọn loại Trải nghiệm (`EXPERIENCE`):** Tùy chọn gắn thẻ liên kết tới Quán ăn (`placeId`) có sẵn trên hệ thống.
* **Nếu chọn loại Công thức (`RECIPE`):** Nhập thêm các thông số:
  * Thời gian nấu (phút), chi phí ước tính (VNĐ), khẩu phần ăn, độ khó (`EASY` / `MEDIUM` / `HARD`).
  * Thêm/xóa động từng dòng nguyên liệu (`name`, `amount`).
  * Thêm/xóa động từng bước nấu (`stepNumber`, `instruction`, `imageUrl`).

#### 🔹 F16 - Tìm kiếm Toàn văn (Full-text Search) & Khám phá Trending Tags
* Tìm kiếm theo từ khóa tên món, nguyên liệu hoặc nội dung bài viết (sử dụng MongoDB Text Index).
* Hiển thị danh sách Top #tags thịnh hành ở cột bên phải màn hình để người dùng click xem nhanh các bài cùng chủ đề.

#### 🔹 F17 - Chỉnh sửa & Xóa bài viết
* Tác giả có toàn quyền sửa nội dung, hình ảnh, công thức hoặc xóa bài viết của mình.
* Khi bài viết bị xóa, các phản hồi Yummy và bình luận liên quan sẽ được tự động dọn dẹp.

#### 🔹 F18 - Thả cảm xúc "Yummy" (Ngon)
* Bấm nút thả cảm xúc Yummy dưới bài viết. Trạng thái và số lượng cập nhật tức thì (Optimistic UI).

#### 🔹 F19 - Bình luận & Trả lời Bình luận Đa cấp (Nested Comments)
* Viết bình luận gốc dưới bài viết.
* Bấm "Trả lời" (Reply) vào một bình luận bất kỳ để tạo cây hội thoại phân tầng (`parentId`).
* Người viết có thể xóa bình luận của mình (tự động xóa kèm các bình luận con).

#### 🔹 F20 - Báo cáo Vi phạm (Report Post / Review)
* Người dùng có thể báo cáo bài viết hoặc đánh giá chứa nội dung vi phạm với các lý do: Quảng cáo rác (`SPAM`), Nội dung phản cảm (`INAPPROPRIATE`), Sai thông tin (`WRONG_INFO`), Khác (`OTHER`).

---

### Mô-đun 7: Thông báo Realtime & Quản trị Hệ thống (`features/notifications/` & Admin)

#### 🔹 F21 - Thông báo Đẩy Thời gian thực (Socket.io)
* Khi có người dùng khác tương tác (thả Yummy bài viết, Bình luận, Trả lời bình luận hoặc Follow), hệ thống sẽ gửi sự kiện WebSocket tức thì tới người nhận.
* Biểu tượng chuông thông báo tự động nảy số đỏ (badge) và bật thông báo Toast ở góc màn hình.

#### 🔹 F22 - Quản lý Hộp thư Thông báo
* Xem danh sách lịch sử thông báo có phân trang.
* Click vào thông báo để chuyển hướng tới bài viết hoặc trang cá nhân tương ứng.
* Tùy chọn đánh dấu đã đọc từng thông báo hoặc đánh dấu đọc tất cả.

#### 🔹 F23 - Thống kê Tổng quan Hệ thống (Admin Dashboard)
* Dành riêng cho Quản trị viên (`role: 'ADMIN'`):
  * Tổng số người dùng đăng ký, số người dùng mới trong tuần.
  * Tổng số địa điểm quán ăn trên hệ thống.
  * Tổng số đánh giá sao cộng đồng.
  * Tổng số bài viết trên bảng tin.
  * Số lượng báo cáo vi phạm đang chờ xử lý (`PENDING`).

#### 🔹 F24 - Kiểm duyệt Báo cáo & Nội dung (Admin Moderation)
* Danh sách báo cáo vi phạm kèm thông tin người báo cáo và nội dung bị tố cáo.
* Hành động xử lý:
  * **Ẩn nội dung vi phạm:** Chuyển trạng thái bài viết hoặc đánh giá sang `HIDDEN`.
  * **Bác bỏ báo cáo (`REJECTED`):** Giữ nguyên nội dung nếu báo cáo không chính xác.
  * Xóa bỏ các địa điểm quán ăn bị trùng lặp hoặc thông tin giả mạo.

#### 🔹 F25 - Quản lý & Khóa / Mở khóa Tài khoản (Admin User Ban)
* Tìm kiếm người dùng theo username hoặc email.
* Thực hiện **Khóa tài khoản (`BANNED`)** đối với người dùng spam hoặc vi phạm tiêu chuẩn cộng đồng.
  * Khi bị khóa, tài khoản sẽ bị thu hồi toàn bộ Refresh Token và bị chặn ngay tại `auth.middleware.ts` của Server.
* Hỗ trợ **Mở khóa tài khoản (`ACTIVE`)** khi có khiếu nại hợp lệ.

