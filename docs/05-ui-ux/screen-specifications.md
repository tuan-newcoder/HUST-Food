# 🖥️ ĐẶC TẢ CHI TIẾT MÀN HÌNH GIAO DIỆN (SCREEN SPECIFICATIONS)

> **Mã tài liệu:** `UI-SCREEN-01`  
> **Dự án:** HUST-Food  
> **Căn cứ:** Đồng bộ theo 7 mô-đun nghiệp vụ tại [STRUCTURE.md](file:///d:/Hoc/2026.1/Web/HUST-Food/STRUCTURE.md) và thiết kế hệ thống tại [HUST_Food_Design_v2.md](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/HUST_Food_Design_v2.md)  
> **Mục tiêu:** Cung cấp tài liệu tham chiếu chuẩn cho 2 thành viên Frontend (Tuấn - FE1 và Vũ - FE2) để xây dựng chính xác các khối giao diện, dữ liệu hiển thị và tương tác người dùng.

---

## 📑 Bảng Tổng hợp Danh mục 9 Màn hình Chính

| Mã MH | Tên màn hình (Screen Name) | Tuyến đường (Route) | Phân hệ (Feature) | Thành viên phụ trách UI |
| :--- | :--- | :--- | :--- | :--- |
| **SCR-01** | Bảng tin Trang chủ (Newsfeed) | `/` | `features/posts/` | **Tuấn (FE 1)** |
| **SCR-02** | Bản đồ Ẩm thực Quét bán kính (Food Map) | `/map` | `features/maps/` | **Vũ (FE 2)** |
| **SCR-03** | Danh bạ Khám phá Quán ăn (Places Directory) | `/places` | `features/places/` | **Vũ (FE 2)** |
| **SCR-04** | Chi tiết Quán ăn & Đánh giá (Place Detail) | `/places/:id` | `features/places/` & `reviews/` | **Vũ (FE 2)** |
| **SCR-05** | Form / Modal Soạn bài viết đa bước (Create Post) | Modal / `/posts/new` | `features/posts/` | **Tuấn (FE 1)** |
| **SCR-06** | Chi tiết Bài viết & Cây Bình luận (Post Detail) | `/posts/:id` | `features/posts/` | **Tuấn (FE 1)** |
| **SCR-07** | Hồ sơ Cá nhân & Bookmarks (User Profile) | `/profile/:username` | `features/profiles/` | **Tuấn (FE 1)** |
| **SCR-08** | Cụm Màn hình Xác thực (Auth: Login, Register, Forgot) | `/login`, `/register`, `/forgot-password` | `features/auth/` | **Tuấn (FE 1)** |
| **SCR-09** | Bảng điều khiển Quản trị (Admin Dashboard) | `/admin` | `features/admin/` | **Vũ (FE 2)** |

---

## 1. SCR-01: Màn hình Bảng tin Trang chủ (Newsfeed – Route: `/`)

* **Mục đích:** Trung tâm trải nghiệm cộng đồng, nơi người dùng lướt xem bài viết mới nhất, tương tác và nắm bắt xu hướng ăn uống quanh trường.
* **Bố cục 3 cột kinh điển:**

### 🔹 1.1. Cột trái (Navigation Sidebar)
* **Logo HUST-Food:** Đặt ở góc trên cùng, click để quay về `/`.
* **Menu điều hướng dọc:**
  * 🏠 **Bảng tin** (`/` - Trạng thái Active)
  * 🗺️ **Bản đồ ẩm thực** (`/map`)
  * 🍜 **Khám phá quán ăn** (`/places`)
  * 🔖 **Đã lưu (Bookmarks)** (`/profile/:username?tab=bookmarks`)
  * 👤 **Trang cá nhân** (`/profile/:username`)
* **Nút CTA nổi bật:** **+ Viết bài mới** (nút màu đỏ `Primary #E11D48`, click mở Modal tạo bài viết SCR-05).

### 🔹 1.2. Cột giữa (Bảng tin chính - Feed Stream)
* **Khung tạo bài viết nhanh (Quick Post Bar):**
  * Avatar người dùng hiện tại + ô input giả lập placeholder: *"Hôm nay bạn ăn gì ở Bách Khoa?"*.
  * Hai icon lối tắt: 📷 *Đăng ảnh trải nghiệm* và 📖 *Chia sẻ công thức*.
  * Click vào bất kỳ vị trí nào trong khung đều mở Modal soạn bài viết đầy đủ.
* **Thanh Tab lọc bài viết nhanh (Feed Tabs):** 3 nút chuyển đổi tức thì:
  * `[Tất cả bài viết]` (Tải cả trải nghiệm và công thức)
  * `[Trải nghiệm quán]` (Chỉ lọc các bài có gắn thẻ quán ăn)
  * `[Công thức nấu ăn]` (Chỉ lọc các bài hướng dẫn nấu ăn)
* **Danh sách thẻ bài viết (Post Card List):**
  * **Phần đầu thẻ (Header):**
    * Avatar tác giả (tròn, click chuyển sang trang cá nhân của họ).
    * Tên hiển thị (Họ và tên in đậm), `@username`, huy hiệu tác giả.
    * Thời gian đăng bài (tính tương đối: *"15 phút trước"*, *"2 giờ trước"*).
    * Nút hành động phụ (icon 3 chấm): Báo cáo vi phạm (nếu là bài người khác) hoặc Sửa/Xóa (nếu là bài của chính mình).
  * **Nội dung thẻ (Body):**
    * Tiêu đề bài viết in đậm (Title).
    * Nội dung bài viết ngắn gọn (nếu dài hơn 4 dòng thì hiển thị nút *"Xem thêm"*).
    * Danh sách nhãn `#tags` màu xanh (click vào tag để lọc các bài cùng chủ đề).
    * **Lưới hiển thị hình ảnh (Image Grid):** Hỗ trợ từ 1 đến 5 ảnh với bố cục tự động co giãn. Click vào ảnh để mở popup xem ảnh kích thước lớn.
  * **Khối thông tin phụ trợ (Metadata Block):**
    * *Nếu là bài Trải nghiệm:* Hiển thị thẻ tóm tắt quán ăn được gắn kèm (Tên quán, địa chỉ ngắn, số sao trung bình của quán).
    * *Nếu là bài Công thức:* Thanh thông số nhanh gồm: Badge độ khó (`DỄ` / `TRUNG BÌNH` / `KHÓ`), Thời gian nấu (`30 phút`), Chi phí ước tính (`45.000 VNĐ`).
  * **Thanh công cụ tương tác ở đáy thẻ (Footer Actions):**
    * **Nút Yummy:** Icon đĩa ăn/trái tim. Khi bấm đổi sang màu đỏ ấm, số lượng đếm tăng ngay lập tức (Optimistic UI).
    * **Nút Bình luận:** Icon bong bóng thoại kèm tổng số lượt comment. Click để mở nhanh danh sách comment ngay dưới bài.
    * **Nút Lưu (Bookmark):** Icon đánh dấu. Click đổi sang màu vàng cam, lưu bài viết vào danh sách cá nhân.
    * **Nút Chia sẻ:** Sao chép liên kết trực tiếp bài viết vào bộ nhớ tạm.
* **Trạng thái tải trang:** Khi cuộn tới cuối màn hình, hiển thị hiệu ứng khung xương (`Skeleton`) trong 0.5s trước khi nạp thêm 10 bài tiếp theo.

### 🔹 1.3. Cột phải (Trending Tags & Gợi ý)
* **Thanh tìm kiếm toàn văn nhanh (Quick Search Input):** Nhập từ khóa tên món, quán ăn hoặc nguyên liệu.
* **Khối Top #Tags thịnh hành (Trending Tags Widget):** Danh sách 5-10 thẻ tag được gắn nhiều nhất trong tuần (ví dụ: `#bun-ca-cay`, `#pho-bo`, `#tra-chanh`, `#healthy-bach-khoa`) kèm số lượng bài viết.
* **Khối Reviewer nổi bật:** Danh sách 3-5 thành viên tích cực nhất có nhiều bài đánh giá chất lượng kèm nút bấm **"Theo dõi"** nhanh.

---

## 2. SCR-02: Màn hình Bản đồ Ẩm thực (Food Map – Route: `/map`)

* **Mục đích:** Giúp sinh viên và người dùng trực quan hóa địa điểm ăn uống xung quanh mình trên nền bản đồ số vệ tinh/vector.
* **Bố cục hiển thị:**
  * **Bản đồ Leaflet toàn màn hình (Full-Screen OpenStreetMap):**
    * Tự động xin quyền GPS của trình duyệt khi mở trang.
    * Vị trí người dùng được biểu diễn bằng một chấm xanh dương phát sáng (Pulsing Blue Dot).
    * Nếu người dùng từ chối quyền vị trí, tâm bản đồ mặc định đặt tại Đại học Bách Khoa Hà Nội (`21.0285, 105.8542`).
  * **Thanh điều khiển nổi phía trên (Floating Top Controls):**
    * **Thanh kéo bán kính quét (Radius Slider):** Người dùng kéo thanh trượt trực quan với 4 nấc: `500m` – `1km` – `2km` – `5km`.
    * **Vòng tròn bán kính mờ (Radius Circle Overlay):** Bản đồ vẽ một vòng tròn bán kính màu cam mờ quanh vị trí GPS tương ứng với cự ly đang chọn.
    * **Bộ lọc chip nhanh:**
      * Lọc mức giá tối đa: `< 30k`, `< 50k`, `< 100k`.
      * Lọc đánh giá: `≥ 4.0 ★`.
      * Danh mục quán: Tất cả | Quán ăn | Cà phê | Ăn vặt.
    * **Nút GPS:** Biểu tượng la bàn góc phải dưới, click để tâm bản đồ quay lại ngay vị trí người dùng.
  * **Các Ghim quán ăn (Custom Category Markers):**
    * Màu đỏ: Quán ăn / Nhà hàng (`RESTAURANT`).
    * Màu nâu/cam: Quán cà phê / Trà sữa (`CAFE`).
    * Màu vàng: Quán ăn vặt / Vỉa hè (`STREET_FOOD`).
  * **Thẻ Popup tóm tắt (Khi click vào 1 Marker bất kỳ):**
    * Ảnh bìa quán nhỏ (Thumbnail).
    * Tên quán ăn in đậm.
    * Điểm đánh giá trung bình tích lũy: ⭐ **4.8** (124 đánh giá).
    * Khoảng giá: `35.000đ - 60.000đ`.
    * Khoảng cách thực tế: 📍 *Cách bạn 320m*.
    * Nút bấm: **"Xem chi tiết quán"** (chuyển hướng sang `/places/:id`).

---

## 3. SCR-03: Màn hình Danh bạ Khám phá Quán ăn (Places Directory – Route: `/places`)

* **Mục đích:** Cung cấp giao diện tra cứu dạng danh mục và danh sách toàn bộ các quán ăn đã được kiểm duyệt trên hệ thống.
* **Bố cục hiển thị:**
  * **Khu vực Thanh công cụ & Bộ lọc (Filter & Search Header):**
    * Ô tìm kiếm chính: Tìm theo tên quán, địa chỉ phố hoặc món ăn trong thực đơn.
    * Dropdown phân loại: `Tất cả danh mục`, `Nhà hàng`, `Quán cà phê`, `Quán ăn vặt`, `Tiệm bánh`.
    * Dropdown sắp xếp: `[Điểm đánh giá cao nhất]`, `[Nhiều lượt review nhất]`, `[Mới đóng góp gần đây]`.
    * Khoảng giá mong muốn (Min Price - Max Price).
    * Nút CTA: **+ Đóng góp quán mới** (chuyển hướng sang trang tạo quán).
  * **Lưới thẻ quán ăn (Place Card Grid - Bố cục 3 đến 4 cột):**
    * Ảnh bìa quán (tỷ lệ 16:9 sắc nét).
    * Badge trạng thái hoạt động:
      * 🟢 **Đang mở cửa** (nếu thời gian hiện tại nằm trong khoảng `openingHours`).
      * 🔴 **Đã đóng cửa** (nếu ngoài giờ mở cửa).
    * Tên quán ăn, thể loại quán.
    * Địa chỉ rút gọn (ví dụ: *Số 15 Tạ Quang Bửu, Hai Bà Trưng*).
    * Điểm sao tổng hợp: ⭐ **4.7** (kèm số lượng đánh giá).
    * Mức giá trung bình: `30.000đ - 50.000đ`.
    * Icon Bookmark nhanh ở góc trên thẻ để lưu ngay không cần vào trang chi tiết.
  * **Thanh phân trang hoặc nút "Tải thêm quán ăn".**

---

## 4. SCR-04: Màn hình Chi tiết Quán ăn & Đánh giá (Place Detail – Route: `/places/:id`)

* **Mục đích:** Nơi xem toàn diện thông tin một quán ăn: hình ảnh, thực đơn chi tiết kèm giá, bản đồ vị trí và các đánh giá 4 tiêu chí từ thực khách.
* **Bố cục hiển thị:**
  1. **Khối Hero Thông tin & Bộ sưu tập ảnh (Gallery Section):**
     * Bộ ảnh quán: 1 ảnh lớn bên trái và 4 ảnh phụ bên phải (click mở trình chiếu ảnh toàn màn hình).
     * Tên quán ăn to đậm, danh mục (badge), địa chỉ chính xác.
     * Khung giờ phục vụ: ⏰ `07:30 - 22:30`.
     * Khoảng giá tham khảo: `25.000đ - 70.000đ`.
     * Hàng nút hành động: Nút **Lưu vào Bookmarks**, Nút **Chỉ đường** (mở Google Maps), Nút **Chia sẻ**.
  2. **Khối Bảng điểm 4 tiêu chí (Rating Summary & Breakdown):**
     * Cột trái: Điểm sao `Overall` to đậm (ví dụ: `4.8 / 5.0`) kèm 5 ngôi sao vàng lớn và tổng số bài review.
     * Cột phải: 4 thanh đo phần trăm chi tiết (Progress Bars):
       * 😋 **Hương vị (Taste):** 4.9 ★
       * 💰 **Giá cả (Price):** 4.6 ★
       * 🧼 **Vệ sinh (Hygiene):** 4.8 ★
       * 👨‍🍳 **Phục vụ (Service):** 4.7 ★
  3. **Khối Thực đơn của Quán (Menu Section):**
     * Danh sách các món ăn trình bày dạng thẻ ngang:
       * Ảnh chụp món ăn (nếu có).
       * Tên món ăn (ví dụ: *Bún cá thập cẩm đặc biệt*).
       * Giá tiền niêm yết (ví dụ: *45.000 VNĐ*).
  4. **Khối Vị trí Bản đồ thu nhỏ (Mini Map Location):**
     * Khung bản đồ nhỏ ghim vị trí chính xác của quán ăn kèm địa chỉ và nút phóng to sang `/map`.
  5. **Khối Đánh giá Cộng đồng (Community Reviews):**
     * Nút CTA: **"Viết đánh giá"** (mở Modal SCR-04-Modal nếu chưa đánh giá; nếu đã từng đánh giá quán này thì hiển thị nút "Chỉnh sửa đánh giá của bạn").
     * Bộ lọc đánh giá: Tab lọc theo mức sao (`Tất cả`, `5 sao`, `4 sao`, `3 sao`...) và checkbox `Chỉ xem bài có ảnh`.
     * **Danh sách các bài đánh giá cá nhân (Review Cards):**
       * Avatar người đánh giá, Họ tên, thời gian đăng.
       * Bộ điểm 4 tiêu chí mà người này chấm cho quán (Hương vị, Giá cả, Vệ sinh, Phục vụ).
       * Đoạn văn bản nhận xét chi tiết thực tế.
       * Album ảnh chụp thực tế món ăn mà reviewer tải lên.

---

## 5. SCR-05: Modal / Màn hình Soạn bài viết đa bước (Create Post Wizard)

* **Mục đích:** Hỗ trợ người dùng đóng góp nội dung mới lên bảng tin dưới dạng bài Trải nghiệm quán hoặc Công thức nấu ăn.
* **Bố cục hiển thị:**
  * **Bước 1: Chọn định dạng bài viết:**
    * Thẻ 1: 🍜 **Trải nghiệm ăn uống (`EXPERIENCE`):** Chia sẻ cảm nhận khi đi ăn tại một quán.
    * Thẻ 2: 🍳 **Công thức nấu ăn (`RECIPE`):** Hướng dẫn chế biến món ăn tại nhà.
  * **Bước 2: Soạn thảo nội dung:**
    * **Các trường chung:**
      * Ô nhập Tiêu đề bài viết (tối đa 150 ký tự).
      * Trình soạn thảo văn bản nội dung bài viết.
      * Khu vực tải ảnh: Cho phép kéo thả hoặc chọn tối đa 5 hình ảnh chất lượng cao (có preview và nút X để gỡ ảnh).
      * Ô nhập `#tags` (nhập từ khóa và nhấn Enter/Dấu phẩy để ghim tag).
    * **Nếu là bài Trải nghiệm ăn uống:**
      * Ô tìm kiếm và chọn Quán ăn từ hệ thống để gắn thẻ liên kết (`placeId`).
    * **Nếu là bài Công thức nấu ăn:**
      * Dòng thông số tổng quan: Thời gian nấu (phút), Chi phí ước tính (VNĐ), Khẩu phần ăn (số người), Độ khó (Dropdown: Dễ / Trung bình / Khó).
      * **Bảng Nguyên liệu động:** Nút "+ Thêm nguyên liệu" tự động sinh ra các dòng gồm ô nhập `Tên nguyên liệu` (ví dụ: *Ức gà phi lê*) và ô `Định lượng` (ví dụ: *300g*).
      * **Danh sách Các bước thực hiện động:** Nút "+ Thêm bước nấu" tự động sinh ra thẻ gồm số thứ tự bước, ô nhập lời hướng dẫn và khung tải ảnh minh họa cho riêng bước đó.
  * **Thanh hành động cuối:** Nút `[Hủy bỏ]` và nút `[Đăng bài viết]` (hiển thị trạng thái đang tải khi tải ảnh lên Cloudinary).

---

## 6. SCR-06: Màn hình Chi tiết Bài viết & Cây Bình luận (Post Detail – Route: `/posts/:id`)

* **Mục đích:** Nơi người dùng đọc trọn vẹn một bài viết, xem hướng dẫn công thức chi tiết và tham gia thảo luận phân tầng.
* **Bố cục hiển thị:**
  * **Phần đầu:** Thông tin tác giả (Avatar, Tên, Ngày đăng) kèm nút Follow.
  * **Nội dung:** Tiêu đề lớn, toàn bộ văn bản chia sẻ, slide ảnh lớn xem trực tiếp.
  * **Nếu là bài Công thức:** Bảng danh sách nguyên liệu định lượng và danh sách các bước nấu ăn trực quan kèm ảnh từng bước.
  * **Thanh nút tương tác:** Thả Yummy (+ số lượt), Lưu bài vào Bookmarks, Nút Báo cáo vi phạm.
  * **Khu vực Bình luận phân tầng (Nested Comments Section):**
    * Ô nhập bình luận mới ở trên cùng kèm nút "Gửi bình luận".
    * **Cây bình luận đa cấp:**
      * *Bình luận cấp 1 (Root Comment):* Avatar người viết, họ tên, thời gian, nội dung bình luận, nút **"Trả lời"** (Reply).
      * *Bình luận con cấp 2 (Reply Comments):* Thụt lề sang phải, hiển thị dưới bình luận cha, có thể trả lời lồng nhau.
      * Icon thùng rác xóa bình luận (chỉ hiển thị với bình luận do chính người dùng hiện tại viết).

---

## 7. SCR-07: Màn hình Hồ sơ Cá nhân (Profile – Route: `/profile/:username`)

* **Mục đích:** Quản lý thông tin tài khoản, xem các nội dung của bản thân và danh sách quán ăn/bài viết đã lưu.
* **Bố cục hiển thị:**
  * **Phần đầu trang (Profile Header Card):**
    * Avatar cá nhân lớn, Họ tên đầy đủ, `@username`.
    * Đoạn tiểu sử giới thiệu ngắn (Bio).
    * Bộ 3 chỉ số thống kê:
      * **Followers:** Số người đang theo dõi (click mở danh sách popup).
      * **Following:** Số người mình đang theo dõi.
      * **Bài viết:** Tổng số bài đã đăng.
    * Nút hành động:
      * *Nếu là trang của chính mình:* Nút **"Chỉnh sửa hồ sơ"** (mở modal cập nhật họ tên, bio, avatar và đổi mật khẩu).
      * *Nếu là trang của người khác:* Nút **"Theo dõi" / "Đang theo dõi"**.
  * **Thanh Tab nội dung bên dưới:**
    * **Tab 1 - Bài viết:** Lưới danh sách các bài viết trải nghiệm và công thức do người này đăng tải.
    * **Tab 2 - Quán ăn đã đóng góp:** Danh sách các quán ăn mà người này đã thêm lên hệ thống.
    * **Tab 3 - Đã lưu (Bookmarks - Chỉ hiển thị cho chính chủ):**
      * Sub-tab 1: *Quán ăn yêu thích đã lưu* (hiển thị danh sách thẻ Place để tiện ghé lại).
      * Sub-tab 2: *Bài viết & Công thức đã lưu* (hiển thị các bài Post để tiện nấu ăn/tham khảo).

---

## 8. SCR-08: Cụm Màn hình Xác thực (Auth Screens)

### 🔹 8.1. Màn hình Đăng nhập (`/login`)
* Logo HUST-Food ở trung tâm trên cùng.
* Tiêu đề: *"Chào mừng bạn quay trở lại với cộng đồng ẩm thực HUST!"*.
* Ô nhập liệu 1: Email hoặc Tên tài khoản (Username).
* Ô nhập liệu 2: Mật khẩu (có icon mắt ẩn/hiện mật khẩu).
* Dòng liên kết: **"Quên mật khẩu?"** (trỏ tới `/forgot-password`).
* Nút bấm lớn màu đỏ: **"Đăng nhập"**.
* Dòng chuyển hướng: *"Chưa có tài khoản? Đăng ký thành viên mới"*.

### 🔹 8.2. Màn hình Đăng ký (`/register`)
* Tiêu đề: *"Tạo tài khoản HUST-Food mới"*.
* Các ô nhập:
  * Họ và tên người dùng.
  * Tên tài khoản (Username - kiểm tra hợp lệ 3–30 ký tự, không dấu).
  * Địa chỉ Email.
  * Mật khẩu (tối thiểu 6 ký tự).
  * Xác nhận lại mật khẩu.
* Nút bấm: **"Tạo tài khoản"**.
* Dòng chuyển hướng: *"Đã có tài khoản? Đăng nhập ngay"*.

### 🔹 8.3. Màn hình Quên mật khẩu (`/forgot-password`)
* **Bước 1 (Gửi mã xác thực):** Người dùng nhập Email đã đăng ký $\rightarrow$ bấm nút "Gửi mã OTP qua Email".
* **Bước 2 (Đặt lại mật khẩu):** Người dùng nhập mã OTP nhận được từ hộp thư, nhập Mật khẩu mới và Xác nhận mật khẩu mới $\rightarrow$ bấm "Xác nhận đặt lại mật khẩu".

---

## 9. SCR-09: Màn hình Quản trị Hệ thống (Admin Dashboard – Route: `/admin`)

* **Mục đích:** Dành riêng cho tài khoản có vai trò `ADMIN` để theo dõi tình hình hệ thống và kiểm duyệt nội dung cộng đồng.
* **Gồm 3 Tabs quản lý chuyên biệt:**

### 🔹 9.1. Tab Thống kê Tổng quan (Overview Stats)
* 5 thẻ số liệu thống kê trực quan (KPI Cards):
  1. 👥 **Tổng người dùng:** Số lượng tài khoản đã đăng ký.
  2. 📈 **Người dùng mới tuần này:** Tốc độ tăng trưởng thành viên.
  3. 🍜 **Tổng số quán ăn:** Số địa điểm đã được duyệt trên bản đồ.
  4. 📝 **Tổng số bài viết:** Số bài trải nghiệm & công thức.
  5. ⚠️ **Báo cáo vi phạm chờ duyệt:** Số lượng khiếu nại chưa xử lý (hiển thị màu đỏ cảnh báo).

### 🔹 9.2. Tab Kiểm duyệt Báo cáo Vi phạm (Report Moderation)
* Bảng danh sách báo cáo vi phạm có phân trang:
  * Cột 1: Người gửi báo cáo (@username).
  * Cột 2: Đối tượng bị báo cáo (Bài viết hoặc Đánh giá quán).
  * Cột 3: Lý do vi phạm (Huy hiệu phân loại: `SPAM`, `NỘI DUNG PHẢN CẢM`, `SAI THÔNG TIN`).
  * Cột 4: Chi tiết nội dung bị tố cáo (click để xem nhanh bài viết/review).
  * Cột 5: Trạng thái (`CHỜ DUYỆT`, `ĐÃ XỬ LÝ`, `ĐÃ BÁC BỎ`).
  * Cột 6: Hành động:
    * Nút **[Ẩn nội dung vi phạm]** (chuyển trạng thái bài/review sang `HIDDEN`).
    * Nút **[Bác bỏ báo cáo]** (giữ nguyên bài viết).

### 🔹 9.3. Tab Quản lý Người dùng (User Management)
* Thanh tìm kiếm người dùng theo Họ tên, Username hoặc Email.
* Bảng danh sách thành viên:
  * Avatar, Họ tên, Username, Email, Ngày tham gia, Tổng số bài viết.
  * Cột trạng thái: Badge xanh `ACTIVE` hoặc Badge đỏ `BANNED`.
  * Cột hành động: Nút **[Khóa tài khoản]** (chuyển sang `BANNED`, tự động đá phiên đăng nhập) hoặc nút **[Mở khóa]** (khôi phục trạng thái `ACTIVE`).

