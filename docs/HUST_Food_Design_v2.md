**HUST-FOOD – MẠNG XÃ HỘI ẨM THỰC, KHÁM PHÁ & ĐÁNH GIÁ QUÁN ĂN**

**1\. ĐỊNH HÌNH NGHIỆP VỤ & TECH STACK (CHUẨN HÓA THEO STRUCTURE.MD)**

**1.1. Tầm nhìn & Kiến trúc Nghiệp vụ Cốt lõi**

HUST-Food là nền tảng mạng xã hội ẩm thực toàn diện dành cho tất cả mọi người, kết hợp giữa hệ thống danh bạ khám phá và chấm điểm địa điểm ăn uống (Places & Reviews) với bảng tin cộng đồng chia sẻ trải nghiệm và công thức nấu ăn (Posts & Feed).

* **Quản lý & Khám phá Quán ăn (Module places/):** Mỗi quán ăn, nhà hàng, quán cà phê là một thực thể độc lập lưu trữ thông tin chi tiết, địa chỉ, giờ mở cửa, thực đơn (menu), khoảng giá, tọa độ định vị GPS và điểm sao trung bình cộng đồng.  
* **Hệ thống Đánh giá Đa tiêu chí (Module reviews/):** Người dùng chấm điểm từ 1–5 sao theo 4 tiêu chí (Hương vị \- Taste, Giá cả \- Price, Vệ sinh \- Hygiene, Phục vụ \- Service) kèm nhận xét và hình ảnh thực tế cho từng quán ăn. Điểm trung bình của quán được tự động cập nhật sau mỗi lượt đánh giá.  
* **Bản đồ Ẩm thực Tương tác (Module maps/):** Truy vấn không gian địa lý (\$geoNear) hiển thị các quán ăn xung quanh vị trí người dùng theo bán kính tùy chỉnh, lọc theo danh mục, mức giá và điểm sao.  
* **Bảng tin Cộng đồng & Công thức (Module posts/):** Bảng tin cuộn vô tận nơi người dùng đăng bài chia sẻ trải nghiệm ăn uống (có gắn thẻ liên kết tới quán ăn trong bảng Place) hoặc chia sẻ công thức nấu ăn chi tiết từng bước, thả cảm xúc và bình luận phân tầng.  
* **Hồ sơ, Lưu địa điểm & Thông báo Realtime (Modules profiles/ & notifications/):** Quản lý trang cá nhân, theo dõi người dùng khác, lưu danh sách quán ăn và bài viết yêu thích (Bookmarks) và nhận thông báo tương tác tức thì qua WebSocket.

**1.2. Tech Stack đồng bộ (TypeScript Fullstack)**

| Tầng công nghệ | Công nghệ lựa chọn | Lý do chọn & Vai trò trong HUST-Food |
| :---- | :---- | :---- |
| **Ngôn ngữ** | TypeScript (.ts / .tsx) | Đồng bộ kiểu dữ liệu chặt chẽ giữa Client (src/types/) và Server (Models/DTOs), giảm thiểu lỗi runtime khi 4 thành viên làm việc song song. |
| **Client (Frontend)** | React (Vite), TailwindCSS, Zustand, React Hook Form \+ Zod, Axios | Tổ chức theo kiến trúc Feature-based (7 mô-đun nghiệp vụ), quản lý global state với Zustand và kiểm định form đa bước bằng Zod. |
| **Bản đồ số** | React-Leaflet \+ OpenStreetMap | Miễn phí 100%, không cần thẻ tín dụng, hỗ trợ custom marker quán ăn, vòng tròn bán kính và thẻ Popup thông tin trực quan. |
| **Server (Backend)** | Node.js, Express.js, Socket.io, Multer \+ Cloudinary, Nodemailer | Kiến trúc 3 lớp (Controllers \- Services \- Models), tích hợp WebSocket thông báo thời gian thực, upload ảnh đám mây và gửi email khôi phục mật khẩu. |
| **Cơ sở dữ liệu** | MongoDB (Mongoose ODM) | Hỗ trợ sẵn chỉ mục không gian 2dsphere cho bảng Place và lưu trữ linh hoạt cấu trúc thực đơn (menu) cũng như công thức nấu ăn. |
| **Hạ tầng & Deploy** | AWS, MongoDB Atlas (Cloud DB) | Triển khai frontend và backend trên AWS, thuận tiện quản lý tài nguyên và mở rộng khi cần. |

**2\. ĐẶC TẢ CHI TIẾT 25 CHỨC NĂNG THEO 7 MÔ-ĐUN (FUNCTIONAL SPEC)**

Toàn bộ 25 chức năng của hệ thống được phân bổ khớp 100% với 7 thư mục tính năng trong client/src/features/ của tài liệu STRUCTURE.md:

**Mô-đun 1: Xác thực & Phân quyền (features/auth/ – Chức năng F01, F02)**

* **F01 \- Đăng ký / Đăng nhập / Làm mới Token / Đăng xuất:** Đăng ký tài khoản mới (username, email, password, fullName); đăng nhập nhận cặp JWT Access Token & Refresh Token; tự động làm mới token qua Axios Interceptor; đăng xuất thu hồi phiên làm việc.  
* **F02 \- Quên mật khẩu & Đặt lại mật khẩu (Forgot / Reset Password):** Nhập email để nhận mã xác thực/link khôi phục mật khẩu qua dịch vụ Mailer và đặt lại mật khẩu mới an toàn.

**Mô-đun 2: Hồ sơ Cá nhân & Danh sách Đã lưu (features/profiles/ – Chức năng F03, F04, F05)**

* **F03 \- Xem và chỉnh sửa Hồ sơ cá nhân (Profile Management):** Cập nhật họ tên, ảnh đại diện (avatarUrl), tiểu sử (bio), đổi mật khẩu; xem trang cá nhân của người dùng khác kèm danh sách bài viết và đánh giá của họ.  
* **F04 \- Theo dõi / Bỏ theo dõi (Follow / Unfollow):** Bấm theo dõi người dùng khác để kết nối mạng lưới ẩm thực; xem danh sách người theo dõi (Followers) và đang theo dõi (Following).  
* **F05 \- Quản lý Danh sách Đã lưu (Bookmarks – Quán ăn & Bài viết):** Lưu hoặc bỏ lưu các Quán ăn yêu thích (Place) và Bài viết/Công thức hay (Post) vào danh sách Bookmarks cá nhân để xem lại bất cứ lúc nào.

**Mô-đun 3: Địa điểm Quán ăn (features/places/ – Chức năng F06, F07, F08)**

* **F06 \- Khám phá & Lọc danh sách Quán ăn:** Duyệt danh sách quán ăn có phân trang, lọc theo danh mục (Quán ăn, Nhà hàng, Cà phê, Ăn vặt), khoảng giá, khu vực và sắp xếp theo điểm đánh giá cao nhất hoặc nhiều đánh giá nhất.  
* **F07 \- Xem chi tiết Quán ăn (PlaceDetail.tsx):** Hiển thị đầy đủ thông tin quán: bộ sưu tập ảnh, địa chỉ, vị trí bản đồ, khung giờ mở cửa (openingHours), danh sách thực đơn (menu kèm giá từng món), bảng tổng hợp điểm sao trung bình 4 tiêu chí và danh sách đánh giá từ cộng đồng.  
* **F08 \- Thêm mới & Cập nhật Quán ăn:** Người dùng hoặc Admin đóng góp địa điểm quán ăn mới lên hệ thống (nhập tên quán, địa chỉ, ghim tọa độ GPS trên bản đồ, nhập giờ mở cửa, thêm các món trong menu và tải ảnh quán).

**Mô-đun 4: Đánh giá Sao & Chấm điểm Quán ăn (features/reviews/ – Chức năng F09, F10)**

* **F09 \- Viết đánh giá & Chấm điểm 4 tiêu chí cho Quán ăn:** Tại trang chi tiết quán ăn, người dùng chấm điểm từ 1–5 sao cho 4 tiêu chí (Hương vị \- Taste, Giá cả \- Price, Vệ sinh \- Hygiene, Phục vụ \- Service), viết nhận xét chi tiết và đính kèm ảnh chụp thực tế. Server tự động tính lại điểm sao trung bình của quán.  
* **F10 \- Lọc, Chỉnh sửa & Xóa Đánh giá:** Xem danh sách đánh giá của quán (lọc theo 5 sao, 4 sao, có hình ảnh, mới nhất); người dùng có quyền sửa hoặc xóa đánh giá do chính mình viết.

**Mô-đun 5: Bản đồ Ẩm thực (features/maps/ – Chức năng F11, F12, F13)**

* **F11 \- Bản đồ Quán ăn Trực quan:** Hiển thị toàn bộ các quán ăn trên bản đồ tương tác Leaflet lấy tâm là vị trí GPS hiện tại của người dùng hoặc khu vực đang chọn.  
* **F12 \- Tìm kiếm Quán ăn theo Bán kính Địa lý (\$geoNear):** Kéo thanh trượt bán kính (500m – 1km – 2km – 5km) kết hợp bộ lọc danh mục, mức giá tối đa và số sao tối thiểu để quét các quán ăn nằm trong phạm vi vòng tròn.  
* **F13 \- Thẻ Popup Tóm tắt Quán ăn trên Bản đồ:** Click vào ghim (marker) trên bản đồ bật ra thẻ hiển thị: Tên quán, ảnh đại diện, điểm sao trung bình, tổng số review, khoảng giá, khoảng cách thực tế (mét) và nút mở trang chi tiết quán.

**Mô-đun 6: Bảng tin Cộng đồng, Công thức & Tương tác (features/posts/ – Chức năng F14 – F20)**

* **F14 \- Bảng tin (Newsfeed) Cuộn vô tận & Chuyển Tab lọc:** Lướt bảng tin mới nhất với Cursor Pagination; chuyển đổi nhanh giữa 3 tab: Tất cả bài viết (ALL) \| Bài chia sẻ trải nghiệm (EXPERIENCE) \| Công thức nấu ăn (RECIPE).  
* **F15 \- Đăng bài Chia sẻ Trải nghiệm hoặc Công thức nấu ăn:** Soạn bài viết mới tải tối đa 5 ảnh; nếu là bài Trải nghiệm có thể gắn thẻ liên kết tới một Quán ăn (placeId); nếu là bài Công thức nấu ăn có thể thêm động danh sách nguyên liệu, thời gian nấu, chi phí ước tính, độ khó và các bước thực hiện.  
* **F16 \- Tìm kiếm Bài viết & Khám phá Trending Tags:** Tìm kiếm toàn văn (Full-text Search) bài viết theo tên món, nguyên liệu hoặc nội dung; gắn \#tags và xem danh sách Top Tags thịnh hành.  
* **F17 \- Chỉnh sửa & Xóa Bài viết:** Tác giả chỉnh sửa nội dung, hình ảnh, công thức hoặc xóa bài viết của mình.  
* **F18 \- Thả cảm xúc 'Yummy' (Like Bài viết):** Bấm nút thả cảm xúc Yummy vào bài viết trên bảng tin, cập nhật số lượng tức thì.  
* **F19 \- Bình luận & Trả lời Bình luận Đa cấp (Nested Comments):** Viết bình luận gốc dưới bài viết, trả lời bình luận (Reply) tạo cây hội thoại phân tầng và xóa bình luận cá nhân.  
* **F20 \- Báo cáo Vi phạm (Report Post / Review):** Gửi báo cáo cho Admin khi phát hiện bài viết hoặc đánh giá chứa spam, thông tin sai lệch hoặc ngôn từ không phù hợp.

**Mô-đun 7: Thông báo Realtime & Quản trị Hệ thống (features/notifications/ & Admin – Chức năng F21 – F25)**

* **F21 \- Thông báo Đẩy Thời gian thực (Socket.io):** Nhận thông báo nảy số trên biểu tượng chuông và hiện Toast ngay lập tức khi có người thả Yummy, Bình luận, Trả lời bình luận hoặc Follow.  
* **F22 \- Quản lý Hộp thư Thông báo:** Xem danh sách thông báo, click để điều hướng tới bài viết/trang cá nhân tương ứng, đánh dấu đã đọc từng thông báo hoặc đọc tất cả.  
* **F23 \- Thống kê Tổng quan Hệ thống (Admin Stats):** Xem số liệu tổng hợp: tổng số người dùng, tổng số quán ăn, tổng số đánh giá, tổng số bài viết và số báo cáo vi phạm chờ duyệt.  
* **F24 \- Kiểm duyệt Báo cáo & Nội dung (Admin Moderation):** Xem danh sách báo cáo vi phạm, thực hiện ẩn bài viết/đánh giá vi phạm hoặc bác bỏ báo cáo; quản lý/xóa địa điểm quán ăn bị trùng lặp.  
* **F25 \- Quản lý & Khóa / Mở khóa Tài khoản (Admin User Ban):** Tìm kiếm người dùng và khóa (BANNED) hoặc mở khóa (ACTIVE) tài khoản vi phạm.

**Bảng Tóm tắt Phân chia 7 Mô-đun (25 Chức năng) cho 4 Thành viên**

| Thành viên | Mô-đun & Chức năng phụ trách | Sản phẩm bàn giao cụ thể (Theo STRUCTURE.md) |
| :---- | :---- | :---- |
| **FE 1 (Frontend Lead)** | components/layout, commonfeatures/auth, profiles, posts(F01 \-\> F05, F14 \-\> F20) | Khung Layout chung, màn hình Đăng nhập/Đăng ký/Quên MK, Hồ sơ cá nhân & Bookmarks, Bảng tin Newsfeed, Form tạo bài viết/công thức, Yummy & Bình luận cây. |
| **FE 2 (Frontend Dev)** | components/feedbackfeatures/places, reviews, maps, notifications & Admin(F06 \-\> F13, F21 \-\> F25) | Danh sách & Chi tiết Quán ăn (Menu, Giờ mở cửa), Form chấm điểm 4 tiêu chí (Reviews), Bản đồ Leaflet quét bán kính, Chuông thông báo Socket & Màn hình Admin. |
| **BE 1 (Backend Lead)** | models & APIs: User, Follow, Bookmark, Post, Comment, Reaction(F01 \-\> F05, F14 \-\> F20) | Khởi tạo 8 Mongoose Models, Auth JWT \+ Mailer quên MK, Upload Cloudinary, API Hồ sơ/Follow/Bookmarks, CRUD Bài viết & Công thức, Bình luận đa cấp, Top Tags. |
| **BE 2 (Backend Dev)** | models & APIs: Place, Review, Notification, Report, Admin(F06 \-\> F13, F21 \-\> F25) | API CRUD Quán ăn, Truy vấn bản đồ \$geoNear, API Đánh giá sao & tự động tính lại điểm trung bình Quán ăn, Socket.io Server, API Admin, Seed Data  |

**3\. KIẾN TRÚC HỆ THỐNG & CẤU TRÚC THƯ MỤC (CHUẨN STRUCTURE.MD)**

**3.1. Luồng Kiến trúc 3 Lớp Phía Server & Giao tiếp Client \- Server**

| \[Client: React \+ TypeScript \+ TailwindCSS \+ Leaflet Map \+ Socket.io Client\]         \|                                      ^         \| 1\. RESTful API (HTTPS / JSON)        \| 2\. Realtime Event (WSS / Socket.io)         v                                      v\[Server: Node.js \+ Express \+ TypeScript\]   HTTP Request \-\> Routes \-\> Middlewares \-\> Controllers \-\> Services \-\> Models (DB) \-\> Response         \|                                      \|         \| 3\. Media Stream Upload / Mailer      \| 4\. Queries / 2dsphere & Text Indexes         v                                      v\[Cloudinary Storage & SMTP Mailer\]     \[MongoDB Atlas Cloud Cluster (8 Collections)\] |
| :---- |

**3.2. Sơ đồ Cây Thư mục Mã nguồn & Quy ước Đặt tên**

| HUST-Food/├── client/                             \# Giao diện người dùng (Frontend \- React \+ TypeScript)│   ├── public/                         \# Tài nguyên tĩnh (favicon, logo, icons public)│   └── src/│       ├── assets/                     \# Ảnh tĩnh, icon nội bộ, font, illustrations│       ├── components/                 \# Component UI dùng chung toàn ứng dụng│       │   ├── common/                 \# Button.tsx, Input.tsx, Modal.tsx, Dropdown.tsx, Avatar.tsx│       │   ├── feedback/               \# Toast.tsx, Alert.tsx, Skeleton.tsx, Spinner.tsx│       │   └── layout/                 \# Header.tsx, Sidebar.tsx, BottomNavigation.tsx, Footer.tsx│       ├── features/                   \# Mô-đun tính năng theo nghiệp vụ (Feature-based)│       │   ├── auth/                   \# Đăng nhập, đăng ký, quên mật khẩu, phân quyền (F01-F02)│       │   ├── maps/                   \# Bản đồ ẩm thực, quét bán kính, popup quán ăn (F11-F13)│       │   ├── notifications/          \# Thông báo tương tác realtime, danh sách thông báo (F21-F22)│       │   ├── places/                 \# Danh sách quán ăn, chi tiết quán, menu, giờ mở cửa (F06-F08)│       │   ├── posts/                  \# Bảng tin (Feed), đăng bài trải nghiệm/công thức, comment (F14-F20)│       │   ├── profiles/               \# Hồ sơ cá nhân, follow, danh sách đã lưu bookmarks (F03-F05)│       │   └── reviews/                \# Form chấm điểm 4 tiêu chí, danh sách đánh giá sao (F09-F10)│       ├── hooks/                      \# Custom hooks dùng chung (useAuth.ts, useDebounce.ts, useSocket.ts)│       ├── services/                   \# Cấu hình Axios client, interceptors, API endpoints chung│       ├── stores/                     \# Quản lý State toàn cục (useAuthStore.ts, useNotificationStore.ts)│       ├── types/                      \# Định nghĩa kiểu dữ liệu TypeScript (user.types.ts, place.types.ts...)│       └── utils/                      \# Hàm tiện ích (formatCurrency.ts, formatDate.ts)│├── server/                             \# Dịch vụ Backend API (Node.js \+ Express \+ TypeScript)│   └── src/│       ├── config/                     \# db.ts, cloudinary.ts, jwt.ts, mailer.ts, socket.ts│       ├── constants/                  \# httpStatus.ts, errorCodes.ts, enums.ts│       ├── controllers/                \# auth.controller.ts, place.controller.ts, review.controller.ts,│       │                               \# post.controller.ts, user.controller.ts, admin.controller.ts...│       ├── middlewares/                \# auth.middleware.ts, role.middleware.ts, validate.middleware.ts, upload.middleware.ts│       ├── models/                     \# User.ts, Follow.ts, Bookmark.ts, Place.ts, Review.ts,│       │                               \# Post.ts, Comment.ts, Reaction.ts, Notification.ts, Report.ts│       ├── routes/                     \# index.ts, auth.route.ts, place.route.ts, review.route.ts, post.route.ts...│       ├── services/                   \# auth.service.ts, place.service.ts, review.service.ts, post.service.ts...│       └── utils/                      \# apiResponse.ts, appError.ts, passwordHash.ts, seedData.ts│├── docs/                               \# Tài liệu thiết kế hệ thống, sơ đồ CSDL (ERD), Postman Collection├── .gitignore                          \# Cấu hình bỏ qua file nhạy cảm (.env) và node\_modules├── README.md                           \# Giới thiệu dự án, hướng dẫn cài đặt chạy thử└── STRUCTURE.md                        \# Hướng dẫn chi tiết cấu trúc thư mục |
| :---- |

**4\. THIẾT KẾ CƠ SỞ DỮ LIỆU HOÀN CHỈNH (TÁCH BẢNG PLACE, REVIEW & POST)**

Để đồng bộ tuyệt đối với cấu trúc tách biệt các mô-đun places/, reviews/ và posts/ trong STRUCTURE.md, cơ sở dữ liệu gồm 8 nhóm Collections chuẩn hóa. Quán ăn (Place) được tách thành thực thể độc lập; mỗi khi có người gửi Đánh giá (Review), hệ thống tự động tính toán lại điểm sao trung bình của Quán ăn đó.

**4.1. Bảng Tổng quan các Collections & Chiến lược Đánh chỉ mục (Indexes)**

| Model / Collection | Phục vụ CN | Các trường dữ liệu đầy đủ | Chỉ mục (Indexes) bắt buộc |
| :---- | :---- | :---- | :---- |
| **1\. User.ts(users)** | F01 \-\> F04, F23, F25 | \_id, username, email, passwordHash, fullName, avatarUrl, bio, role ('USER'\|'ADMIN'), status ('ACTIVE'\|'BANNED'), refreshToken, resetPasswordToken, resetPasswordExpires, followersCount, followingCount, postsCount, createdAt, updatedAt | • { username: 1 } (Unique)• { email: 1 } (Unique)• { status: 1, role: 1 } |
| **2\. Follow.ts & Bookmark.ts(follows, bookmarks)** | F04, F05 | • follows: \_id, followerId, followingId, createdAt• bookmarks: \_id, userId, targetType ('PLACE'\|'POST'), placeId (ref Place), postId (ref Post), createdAt | • follows: { followerId: 1, followingId: 1 } (Unique)• bookmarks: { userId: 1, targetType: 1, placeId: 1, postId: 1 } |
| **3\. Place.ts(places)** | F06, F07, F08, F11, F12, F13 | \_id, name, slug, category ('RESTAURANT'\|'CAFE'\|'STREET\_FOOD'\|'BAKERY'\|'OTHER'), address, coverImage, images\[\], priceRange {min, max}, openingHours {open: '07:00', close: '22:00'}, menu \[{name, price, imageUrl}\], location {type: 'Point', coordinates: \[lng, lat\]}, averageRatings {taste, price, hygiene, service, overall}, totalReviews, bookmarksCount, createdBy, status ('ACTIVE'\|'HIDDEN'), createdAt, updatedAt | • { location: '2dsphere' }• { category: 1, 'averageRatings.overall': \-1 }• Text Index: name, address, 'menu.name' |
| **4\. Review.ts(reviews)** | F09, F10 | \_id, placeId (ref Place), authorId (ref User), ratings {taste, price, hygiene, service, overall}, content, images\[\], status ('PUBLISHED'\|'HIDDEN'), createdAt, updatedAt | • { placeId: 1, createdAt: \-1 }• { placeId: 1, authorId: 1 } (Unique: mỗi user đánh giá 1 lần/quán) |
| **5\. Post.ts(posts)** | F14 \-\> F18 | \_id, authorId (ref User), postType ('EXPERIENCE'\|'RECIPE'), title, content, images\[\], tags\[\], placeId (ref Place, nullable \- dùng khi gắn thẻ quán ăn vào bài viết), recipeInfo {cookingTimeMinutes, estimatedCost, servings, difficulty, ingredients \[{name, amount}\], steps \[{stepNumber, instruction, imageUrl}\]}, metrics {yummyCount, commentsCount, savesCount}, status ('PUBLISHED'\|'HIDDEN'), createdAt, updatedAt | • { status: 1, postType: 1, createdAt: \-1, \_id: \-1 }• { placeId: 1, createdAt: \-1 }• { tags: 1 }• Text Index: title, content, 'recipeInfo.ingredients.name' |
| **6\. Comment.ts & Reaction.ts(comments, reactions)** | F18, F19 | • comments: \_id, postId (ref Post), authorId (ref User), parentId (ref Comment, nullable), content, repliesCount, createdAt• reactions: \_id, postId (ref Post), userId (ref User), createdAt | • comments: { postId: 1, parentId: 1, createdAt: \-1 }• reactions: { postId: 1, userId: 1 } (Unique) |
| **7\. Notification.ts(notifications)** | F21, F22 | \_id, recipientId (ref User), senderId (ref User), type ('YUMMY'\|'COMMENT'\|'REPLY'\|'FOLLOW'), postId (ref Post, nullable), isRead (Boolean), createdAt | • { recipientId: 1, isRead: 1, createdAt: \-1 } |
| **8\. Report.ts(reports)** | F20, F23, F24 | \_id, reporterId (ref User), targetType ('POST'\|'REVIEW'), targetPostId (ref Post, nullable), targetReviewId (ref Review, nullable), reason ('SPAM'\|'INAPPROPRIATE'\|'WRONG\_INFO'\|'OTHER'), description, status ('PENDING'\|'RESOLVED'\|'REJECTED'), resolvedBy, createdAt, updatedAt | • { status: 1, createdAt: \-1 }• { reporterId: 1, targetType: 1, targetPostId: 1, targetReviewId: 1 } |

**4.2. Mã nguồn TypeScript Mongoose Schemas Cốt lõi (Place.ts, Review.ts, Post.ts)**

| // 1\. server/src/models/Place.ts (Thực thể Quán ăn độc lập \- Phục vụ features/places & features/maps)const PlaceSchema \= new Schema({  name: { type: String, required: true, trim: true, maxLength: 150 },  category: { type: String, enum: \["RESTAURANT", "CAFE", "STREET\_FOOD", "BAKERY", "OTHER"\], default: "RESTAURANT", index: true },  address: { type: String, required: true, trim: true },  coverImage: { type: String, required: true },  images: \[{ type: String }\],  priceRange: {    min: { type: Number, required: true, min: 0 },    max: { type: Number, required: true, min: 0 }  },  openingHours: {    open: { type: String, default: "08:00" },    close: { type: String, default: "22:00" }  },  menu: \[{    name: { type: String, required: true },    price: { type: Number, required: true },    imageUrl: { type: String }  }\],  location: {    type: { type: String, enum: \["Point"\], default: "Point" },    coordinates: { type: \[Number\], required: true } // \[longitude, latitude\]  },  averageRatings: {    taste: { type: Number, default: 0 },    price: { type: Number, default: 0 },    hygiene: { type: Number, default: 0 },    service: { type: Number, default: 0 },    overall: { type: Number, default: 0, index: true }  },  totalReviews: { type: Number, default: 0 },  bookmarksCount: { type: Number, default: 0 },  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },  status: { type: String, enum: \["ACTIVE", "HIDDEN"\], default: "ACTIVE", index: true }}, { timestamps: true });PlaceSchema.index({ location: "2dsphere" });PlaceSchema.index({ name: "text", address: "text", "menu.name": "text" });// 2\. server/src/models/Review.ts (Đánh giá 4 tiêu chí cho Quán ăn \- Phục vụ features/reviews)const ReviewSchema \= new Schema({  placeId: { type: Schema.Types.ObjectId, ref: "Place", required: true, index: true },  authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },  ratings: {    taste: { type: Number, required: true, min: 1, max: 5 },    price: { type: Number, required: true, min: 1, max: 5 },    hygiene: { type: Number, required: true, min: 1, max: 5 },    service: { type: Number, required: true, min: 1, max: 5 },    overall: { type: Number, min: 1, max: 5 }  },  content: { type: String, required: true, maxLength: 2000 },  images: \[{ type: String }\],  status: { type: String, enum: \["PUBLISHED", "HIDDEN"\], default: "PUBLISHED" }}, { timestamps: true });ReviewSchema.index({ placeId: 1, authorId: 1 }, { unique: true });ReviewSchema.pre("save", function(next) {  const { taste, price, hygiene, service } \= this.ratings;  this.ratings.overall \= Number(((taste \+ price \+ hygiene \+ service) / 4).toFixed(1));  next();});// 3\. server/src/models/Post.ts (Bài viết Bảng tin & Công thức \- Phục vụ features/posts)const PostSchema \= new Schema({  authorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },  postType: { type: String, enum: \["EXPERIENCE", "RECIPE"\], required: true, index: true },  title: { type: String, required: true, trim: true, maxLength: 150 },  content: { type: String, required: true },  images: \[{ type: String }\],  tags: \[{ type: String, trim: true, lowercase: true, index: true }\],  placeId: { type: Schema.Types.ObjectId, ref: "Place", default: null, index: true }, // Gắn thẻ Quán ăn (nếu có)  recipeInfo: {    cookingTimeMinutes: { type: Number, min: 1 },    estimatedCost: { type: Number, min: 0 },    servings: { type: Number, default: 1 },    difficulty: { type: String, enum: \["EASY", "MEDIUM", "HARD"\] },    ingredients: \[{ name: String, amount: String }\],    steps: \[{ stepNumber: Number, instruction: String, imageUrl: String }\]  },  metrics: {    yummyCount: { type: Number, default: 0 },    commentsCount: { type: Number, default: 0 },    savesCount: { type: Number, default: 0 }  },  status: { type: String, enum: \["PUBLISHED", "HIDDEN"\], default: "PUBLISHED", index: true }}, { timestamps: true });PostSchema.index({ status: 1, postType: 1, createdAt: \-1, \_id: \-1 });PostSchema.index({ title: "text", content: "text", "recipeInfo.ingredients.name": "text" }); |
| :---- |

**5\. ĐẶC TẢ CHI TIẾT ĐẦU VÀO (INPUT) & ĐẦU RA (OUTPUT) CỦA 42 RESTFUL APIS**

Lưu ý phân công: Backend (BE1, BE2) chịu trách nhiệm code 100% logic API trên Server (/server). Frontend (FE1, FE2) KHÔNG phải code API mà dựa vào cột Đầu vào (Input) để truyền tham số qua Axios và dựa vào cột Đầu ra (Output) để định nghĩa TypeScript Interfaces (/client/src/types/) và hiển thị giao diện.

**5.1. Khuôn mẫu JSON Phản hồi Chuẩn (Standard Response Wrapper)**

| // Phản hồi thành công (HTTP 200 / 201):{  "success": true,  "message": "Mô tả trạng thái thành công",  "data": { ... } \| \[ ... \],   // Nội dung chi tiết quy định ở cột 'Đầu ra (Output)' bên dưới  "meta": {                    // Xuất hiện ở các API danh sách có phân trang    "nextCursor": "67165f8e2b9a1c0012345678",    "hasMore": true  }}// Phản hồi lỗi (HTTP 400 / 401 / 403 / 404 / 429 / 500):{  "success": false,  "error": {    "code": "VALIDATION\_ERROR \| UNAUTHORIZED \| FORBIDDEN\_BANNED \| NOT\_FOUND \| DUPLICATE\_REVIEW",    "message": "Thông báo lỗi hiển thị cho người dùng",    "details": \["Chi tiết lỗi từng trường dữ liệu"\]  }} |
| :---- |

**5.2. Cụm 1: Xác thực, Hồ sơ & Bookmarks (14 APIs \- Phục vụ features/auth & features/profiles \| BE1 code \- FE1 ghép)**

| Mã CN & Endpoint | Auth & Vai trò | Đầu vào (Input: Params / Query / Body) | Đầu ra (Output: HTTP Status & Trường trong data) |
| :---- | :---- | :---- | :---- |
| **\[F01\] POST/api/v1/auth/register** | PublicBE1 codeFE1 ghép | Body JSON:{  username: string (3-30 ký tự),  email: string,  password: string (\>=6 ký tự),  fullName: string} | HTTP 201 Created:{  user: { \_id, username, email, fullName, avatarUrl, role: 'USER' },  accessToken: string (JWT 15m),  refreshToken: string (JWT 7d)}Lỗi: 400 (Trùng email/username) |
| **\[F01\] POST/api/v1/auth/login** | PublicBE1 codeFE1 ghép | Body JSON:{  emailOrUsername: string,  password: string} | HTTP 200 OK:{  user: { \_id, username, email, fullName, avatarUrl, role, status },  accessToken: string,  refreshToken: string}Lỗi: 401 (Sai MK), 403 (Tài khoản BANNED) |
| **\[F01\] POST/api/v1/auth/refresh** | PublicBE1 codeFE1 ghép | Body JSON:{  refreshToken: string} | HTTP 200 OK:{  accessToken: string (mới),  refreshToken: string (mới)} |
| **\[F01\] POST/api/v1/auth/logout** | Bearer TokenBE1 codeFE1 ghép | Header: Authorization: Bearer \<token\> | HTTP 200 OK:{  loggedOut: true} (Xóa refreshToken trong DB) |
| **\[F02\] POST/api/v1/auth/forgot-password** | PublicBE1 codeFE1 ghép | Body JSON:{  email: string} | HTTP 200 OK:{  message: 'Đã gửi mã khôi phục mật khẩu tới email'} (Gửi qua Nodemailer) |
| **\[F02\] POST/api/v1/auth/reset-password** | PublicBE1 codeFE1 ghép | Body JSON:{  token: string (Mã OTP/Token từ email),  newPassword: string (\>=6 ký tự)} | HTTP 200 OK:{  resetSuccess: true}Lỗi: 400 (Token sai hoặc hết hạn) |
| **\[F03\] GET/api/v1/users/me** | Bearer TokenBE1 codeFE1 ghép | Header: Authorization: Bearer \<token\> | HTTP 200 OK:{  user: { \_id, username, email, fullName, avatarUrl, bio, role, followersCount, followingCount, postsCount, createdAt }} |
| **\[F03\] PUT/api/v1/users/me** | Bearer TokenBE1 codeFE1 ghép | Body JSON:{  fullName?: string,  avatarUrl?: string,  bio?: string (\<=250 ký tự)} | HTTP 200 OK:{  user: { \_id, username, fullName, avatarUrl, bio, updatedAt }} |
| **\[F03\] GET/api/v1/users/:username** | Optional AuthBE1 codeFE1 ghép | Path Param: :username | HTTP 200 OK:{  user: { \_id, username, fullName, avatarUrl, bio, followersCount, followingCount, postsCount, isFollowing: boolean }} |
| **\[F03\] GET/api/v1/users/:username/posts** | Optional AuthBE1 codeFE1 ghép | Path Param: :usernameQuery: ?postType=ALL\|EXPERIENCE\|RECIPE\&cursor=\<id\>\&limit=10 | HTTP 200 OK:data: \[ PostItem \],meta: { nextCursor, hasMore } |
| **\[F04\] POST/api/v1/users/:id/follow** | Bearer TokenBE1 codeFE1 ghép | Path Param: :id (targetUserId) | HTTP 200 OK:{  targetUserId: string, isFollowing: boolean, followersCount: number} (Bắn Socket FOLLOW) |
| **\[F04\] GET/api/v1/users/:id/followers& /following** | PublicBE1 codeFE1 ghép | Path Param: :id (userId)Query: ?cursor=\<followId\>\&limit=20 | HTTP 200 OK:data: \[ { \_id, username, fullName, avatarUrl, bio } \],meta: { nextCursor, hasMore } (2 endpoints: followers và following) |
| **\[F05\] POST/api/v1/bookmarks/toggle** | Bearer TokenBE1 codeFE1 ghép | Body JSON:{  targetType: 'PLACE' \| 'POST',  targetId: string (placeId hoặc postId)} | HTTP 200 OK:{  targetType: 'PLACE' \| 'POST',  targetId: string,  isBookmarked: boolean} |
| **\[F05\] GET/api/v1/bookmarks** | Bearer TokenBE1 codeFE1 ghép | Query Params:?type=PLACE\|POST\&cursor=\<bookmarkId\>\&limit=12 | HTTP 200 OK:data: \[ PlaceItem \| PostItem \],meta: { nextCursor, hasMore } |

**5.3. Cụm 2: Bảng tin, Bài viết, Công thức & Bình luận (10 APIs \- Phục vụ features/posts \| BE1 code \- FE1 ghép)**

| Mã CN & Endpoint | Auth & Vai trò | Đầu vào (Input: Params / Query / Body) | Đầu ra (Output: HTTP Status & Trường trong data) |
| :---- | :---- | :---- | :---- |
| **\[F08, F09, F15\] POST/api/v1/upload/images** | Bearer TokenBE1 codeFE1, FE2 dùng | Content-Type: multipart/form-dataField: images (Tối đa 5 file ảnh .jpg, .png, .webp; mỗi file \<= 5MB) | HTTP 200 OK:{  urls: \[ 'https\://res.cloudinary.com/.../img1.jpg', ... \]} |
| **\[F14\] GET/api/v1/posts/feed** | Optional AuthBE1 codeFE1 ghép | Query Params:?postType=ALL\|EXPERIENCE\|RECIPE\&cursor=\<postId\_cuối\>\&limit=10 | HTTP 200 OK:data: \[ {  \_id, postType, title, content, images, tags,  author: { \_id, username, fullName, avatarUrl },  place: { \_id, name, address, averageRatings } \| null,  recipeInfo, metrics: { yummyCount, commentsCount, savesCount },  isYummied: boolean, isBookmarked: boolean, createdAt} \],meta: { nextCursor, hasMore } |
| **\[F15, F16\] POST/api/v1/posts** | Bearer TokenBE1 codeFE1 ghép | Body JSON:{  postType: 'EXPERIENCE' \| 'RECIPE',  title: string, content: string,  images: string\[\], tags: string\[\],  placeId?: string \| null (ID quán ăn nếu gắn thẻ),  recipeInfo?: { cookingTimeMinutes, estimatedCost, servings, difficulty, ingredients:\[{name,amount}\], steps:\[{stepNumber,instruction,imageUrl}\] }} | HTTP 201 Created:{  post: { \_id, authorId, postType, title, content, images, tags, placeId, recipeInfo, metrics, status: 'PUBLISHED', createdAt }} |
| **\[F14, F15\] GET/api/v1/posts/:id** | Optional AuthBE1 codeFE1 ghép | Path Param: :id (postId) | HTTP 200 OK:{  post: { \_id, postType, title, content, images, tags, author, place, recipeInfo, metrics, isYummied, isBookmarked, createdAt }} |
| **\[F17\] PUT/api/v1/posts/:id** | Bearer TokenBE1 codeFE1 ghép | Path Param: :id (postId)Body JSON: { title?, content?, images?, tags?, placeId?, recipeInfo? } | HTTP 200 OK:{  post: { ...bài viết đã cập nhật }}Lỗi: 403 (Không phải tác giả) |
| **\[F17\] DELETE/api/v1/posts/:id** | Bearer TokenBE1 codeFE1 ghép | Path Param: :id (postId) | HTTP 200 OK:{  deletedPostId: string} |
| **\[F16\] GET/api/v1/posts/search** | Optional AuthBE1 codeFE1 ghép | Query Params:?q=\<từ\_khóa\>\&postType=ALL\|EXPERIENCE\|RECIPE\&difficulty=EASY\|MEDIUM\|HARD\&tag=\<tag\>\&cursor=\<id\>\&limit=10 | HTTP 200 OK:data: \[ PostItem \],meta: { nextCursor, hasMore } |
| **\[F16\] GET/api/v1/posts/tags/trending** | PublicBE1 codeFE1 ghép | Query: ?limit=10 | HTTP 200 OK:data: \[ { tag: 'an-sang', postsCount: 42 }, ... \] |
| **\[F18\] POST/api/v1/posts/:id/yummy** | Bearer TokenBE1 codeFE1 ghép | Path Param: :id (postId) | HTTP 200 OK:{  postId: string, isYummied: boolean, yummyCount: number} (Bắn Socket YUMMY) |
| **\[F19\] GET & POST/api/v1/posts/:id/comments& DELETE /comments/:id** | Public / BearerBE1 codeFE1 ghép | • GET: ?parentId=\<null\|commentId\>\&cursor=\<id\>\&limit=10• POST Body: { content: string, parentId?: string \| null }• DELETE: Path Param :id (commentId) | • GET 200: data: \[ CommentItem \], meta: { nextCursor, hasMore }• POST 201: { comment, postCommentsCount } (Bắn Socket COMMENT/REPLY)• DELETE 200: { deletedCommentId, postCommentsCount } |

**5.4. Cụm 3: Địa điểm Quán ăn, Bản đồ & Đánh giá Sao (10 APIs \- Phục vụ features/places, maps, reviews \| BE2 code \- FE2 ghép)**

| Mã CN & Endpoint | Auth & Vai trò | Đầu vào (Input: Params / Query / Body) | Đầu ra (Output: HTTP Status & Trường trong data) |
| :---- | :---- | :---- | :---- |
| **\[F06\] GET/api/v1/places** | Optional AuthBE2 codeFE2 ghép | Query Params:?q=\<tên\_quán\_địa\_chỉ\_món\>\&category=ALL\|RESTAURANT\|CAFE\|STREET\_FOOD\|BAKERY\&maxPrice=100000\&minRating=3.5\&sortBy=rating\|reviews\|newest\&cursor=\<id\>\&limit=12 | HTTP 200 OK:data: \[ {  \_id, name, category, address, coverImage,  priceRange: { min, max }, openingHours: { open, close },  averageRatings: { taste, price, hygiene, service, overall },  totalReviews: number, isBookmarked: boolean} \],meta: { nextCursor, hasMore } |
| **\[F11, F12, F13\] GET/api/v1/places/nearby** | PublicBE2 codeFE2 ghép | Query Params:?lat=21.0285\&lng=105.8542\&radius=1500 (Bán kính mét: 500-5000)\&category=ALL\|RESTAURANT\|CAFE...\&maxPrice=100000\&minRating=3.0\&limit=50 | HTTP 200 OK:data: \[ {  \_id, name, category, address, coverImage,  priceRange, openingHours, location: { type: 'Point', coordinates: \[lng, lat\] },  averageRatings: { overall, taste, price, hygiene, service },  totalReviews: number,  distanceMeters: number (VD: 340\)} \] |
| **\[F07\] GET/api/v1/places/:id** | Optional AuthBE2 codeFE2 ghép | Path Param: :id (placeId) | HTTP 200 OK:{  place: {    \_id, name, category, address, coverImage, images,    priceRange, openingHours, menu: \[ { name, price, imageUrl } \],    location, averageRatings, totalReviews, bookmarksCount,    isBookmarked: boolean, myReview: ReviewItem \| null, createdAt  }}Lỗi: 404 (Không tìm thấy quán) |
| **\[F08\] POST/api/v1/places** | Bearer TokenBE2 codeFE2 ghép | Body JSON:{  name: string, category: string, address: string,  coverImage: string, images?: string\[\],  priceRange: { min: number, max: number },  openingHours?: { open: string, close: string },  menu?: \[ { name: string, price: number, imageUrl?: string } \],  location: { type: 'Point', coordinates: \[lng, lat\] }} | HTTP 201 Created:{  place: { \_id, name, category, address, coverImage, priceRange, openingHours, menu, location, averageRatings, totalReviews: 0, createdAt }} |
| **\[F08\] PUT/api/v1/places/:id** | Bearer TokenBE2 codeFE2 ghép | Path Param: :id (placeId)Body JSON: { name?, category?, address?, coverImage?, images?, priceRange?, openingHours?, menu?, location? } | HTTP 200 OK:{  place: { ...thông tin quán đã cập nhật }}Lỗi: 403 (Chỉ người tạo quán hoặc Admin được sửa) |
| **\[F08, F24\] DELETE/api/v1/places/:id** | Admin RoleBE2 codeFE2 ghép | Path Param: :id (placeId) | HTTP 200 OK:{  deletedPlaceId: string} |
| **\[F10\] GET/api/v1/places/:id/reviews** | PublicBE2 codeFE2 ghép | Path Param: :id (placeId)Query Params:?star=ALL\|5\|4\|3\|2\|1\&hasImages=true\|false\&cursor=\<reviewId\>\&limit=10 | HTTP 200 OK:data: \[ {  \_id, placeId, ratings: { taste, price, hygiene, service, overall },  content, images,  author: { \_id, username, fullName, avatarUrl },  createdAt} \],meta: { nextCursor, hasMore } |
| **\[F09\] POST/api/v1/places/:id/reviews** | Bearer TokenBE2 codeFE2 ghép | Path Param: :id (placeId)Body JSON:{  ratings: { taste: 1..5, price: 1..5, hygiene: 1..5, service: 1..5 },  content: string (10-2000 ký tự),  images?: string\[\]} | HTTP 201 Created:{  review: { \_id, placeId, author, ratings (kèm overall), content, images, createdAt },  updatedPlaceStats: { averageRatings, totalReviews }}Lỗi: 400 (DUPLICATE\_REVIEW \- Đã đánh giá quán này rồi) |
| **\[F10\] PUT/api/v1/reviews/:id** | Bearer TokenBE2 codeFE2 ghép | Path Param: :id (reviewId)Body JSON: { ratings?: { taste, price, hygiene, service }, content?: string, images?: string\[\] } | HTTP 200 OK:{  review: { ...đánh giá đã sửa },  updatedPlaceStats: { averageRatings, totalReviews }} |
| **\[F10\] DELETE/api/v1/reviews/:id** | Bearer TokenBE2 codeFE2 ghép | Path Param: :id (reviewId) | HTTP 200 OK:{  deletedReviewId: string,  updatedPlaceStats: { averageRatings, totalReviews }} |

**5.5. Cụm 4: Thông báo Realtime, Báo cáo & Quản trị Admin (8 APIs \- Phục vụ features/notifications & Admin \| BE2 code \- FE2 ghép)**

| Mã CN & Endpoint | Auth & Vai trò | Đầu vào (Input: Params / Query / Body) | Đầu ra (Output: HTTP Status & Trường trong data) |
| :---- | :---- | :---- | :---- |
| **\[F21, F22\] GET/api/v1/notifications** | Bearer TokenBE2 codeFE2 ghép | Query Params:?cursor=\<notifId\>\&limit=15 | HTTP 200 OK:data: \[ {  \_id, type: 'YUMMY'\|'COMMENT'\|'REPLY'\|'FOLLOW',  sender: { \_id, username, fullName, avatarUrl },  post: { \_id, title, postType } \| null,  isRead: boolean, createdAt} \],meta: { unreadCount: number, nextCursor, hasMore } |
| **\[F22\] PATCH/api/v1/notifications/:id/read** | Bearer TokenBE2 codeFE2 ghép | Path Param: :id (notificationId) | HTTP 200 OK:{  notificationId: string, isRead: true, unreadCount: number} |
| **\[F22\] PATCH/api/v1/notifications/read-all** | Bearer TokenBE2 codeFE2 ghép | Header: Authorization: Bearer \<token\> | HTTP 200 OK:{  unreadCount: 0, message: 'Đã đánh dấu đọc tất cả'} |
| **\[F20\] POST/api/v1/reports** | Bearer TokenBE2 codeFE2 ghép | Body JSON:{  targetType: 'POST' \| 'REVIEW',  targetPostId?: string,  targetReviewId?: string,  reason: 'SPAM' \| 'INAPPROPRIATE' \| 'WRONG\_INFO' \| 'OTHER',  description?: string} | HTTP 201 Created:{  report: { \_id, reporterId, targetType, reason, status: 'PENDING', createdAt }} |
| **\[F23\] GET/api/v1/admin/stats** | Admin RoleBE2 codeFE2 ghép | Header: Authorization: Bearer \<admin\_token\> | HTTP 200 OK:{  totalUsers: number, newUsersThisWeek: number,  totalPlaces: number, totalReviews: number,  totalPosts: number, pendingReportsCount: number} |
| **\[F24\] GET/api/v1/admin/reports** | Admin RoleBE2 codeFE2 ghép | Query Params:?status=PENDING\|RESOLVED\|REJECTED\&cursor=\<id\>\&limit=20 | HTTP 200 OK:data: \[ {  \_id, targetType, reason, description, status, createdAt,  reporter: { \_id, username, email },  targetPost: { \_id, title } \| null,  targetReview: { \_id, content, placeId } \| null} \],meta: { nextCursor, hasMore } |
| **\[F24\] PATCH/api/v1/admin/reports/:id** | Admin RoleBE2 codeFE2 ghép | Path Param: :id (reportId)Body JSON:{  action: 'HIDE\_TARGET' \| 'REJECT\_REPORT'} | HTTP 200 OK:{  report: { \_id, status: 'RESOLVED' \| 'REJECTED', resolvedBy },  targetStatus: 'HIDDEN' \| 'PUBLISHED'} |
| **\[F25\] GET & PATCH/api/v1/admin/users& /admin/users/:id/status** | Admin RoleBE2 codeFE2 ghép | • GET: ?q=\<từ\_khóa\>\&status=ALL\|ACTIVE\|BANNED\&cursor=\<id\>• PATCH (:id): Body { status: 'BANNED' \| 'ACTIVE' } | • GET 200: data: \[ { \_id, username, email, fullName, role, status, postsCount, createdAt } \]• PATCH 200: { user: { \_id, username, status } } |

**5.6. Thuật toán Tự động Cập nhật Điểm sao Trung bình của Quán ăn (review.service.ts)**

| // server/src/services/review.service.ts \- Tự động chạy sau khi POST / PUT / DELETE một Review (F09, F10)async function recalculatePlaceRatings(placeId: mongoose.Types.ObjectId) {  const stats \= await Review.aggregate(\[    { \$match: { placeId: new mongoose.Types.ObjectId(placeId), status: "PUBLISHED" } },    {      \$group: {        \_id: "\$placeId",        totalReviews: { \$sum: 1 },        avgTaste: { \$avg: "\$ratings.taste" },        avgPrice: { \$avg: "\$ratings.price" },        avgHygiene: { \$avg: "\$ratings.hygiene" },        avgService: { \$avg: "\$ratings.service" },        avgOverall: { \$avg: "\$ratings.overall" }      }    }  \]);  if (stats.length \> 0\) {    const s \= stats\[0\];    return await Place.findByIdAndUpdate(placeId, {      totalReviews: s.totalReviews,      averageRatings: {        taste: Number(s.avgTaste.toFixed(1)),        price: Number(s.avgPrice.toFixed(1)),        hygiene: Number(s.avgHygiene.toFixed(1)),        service: Number(s.avgService.toFixed(1)),        overall: Number(s.avgOverall.toFixed(1))      }    }, { new: true });  } else {    return await Place.findByIdAndUpdate(placeId, {      totalReviews: 0,      averageRatings: { taste: 0, price: 0, hygiene: 0, service: 0, overall: 0 }    }, { new: true });  }} |
| :---- |

**6\. LUỒNG REALTIME (SOCKET.IO) & QUY ƯỚC ĐẶT TÊN (NAMING CONVENTIONS)**

**6.1. Bảng sự kiện WebSocket (Socket.io Events \- Phục vụ features/notifications/)**

| Tên sự kiện (Event) | Chiều giao tiếp | Đầu vào / Payload truyền tải | Mô tả xử lý kỹ thuật |
| :---- | :---- | :---- | :---- |
| **register\_user** | Client \-\> Server | { userId: '67165f...' } | Khi người dùng đăng nhập thành công, Client phát sự kiện để Server đưa socket vào Room riêng: user\_\${userId}. |
| **new\_notification** | Server \-\> Client | { \_id, type: 'YUMMY' \| 'COMMENT' \| 'REPLY' \| 'FOLLOW', sender: { username, fullName, avatarUrl }, post: { \_id, title }, createdAt } | Khi User A tương tác với User B (F04, F18, F19), Server lưu DB xong sẽ emit tới Room user\_\${userB\_Id}. Client nhận được sẽ tăng badge số trên chuông và bật Toast góc màn hình. |

**6.2. Quy ước Đặt tên Mã nguồn (Naming Conventions từ STRUCTURE.md)**

| Đối tượng | Quy ước chuẩn | Ví dụ áp dụng thực tế trong HUST-Food |
| :---- | :---- | :---- |
| **Thư mục (Folders)** | kebab-case hoặc camelCase | client/src/features/places, client/src/components/common |
| **Component React** | PascalCase (.tsx) | PostCard.tsx, PlaceDetail.tsx, ReviewFormModal.tsx |
| **Custom Hooks** | camelCase bắt đầu bằng use (.ts) | useAuth.ts, usePlaceFilter.ts, useDebounce.ts |
| **File Controller / Service** | camelCase kèm hậu tố (.ts) | place.controller.ts, place.service.ts, review.service.ts |
| **Model / Entity** | PascalCase (.ts) | User.ts, Place.ts, Review.ts, Post.ts, Comment.ts |
| **Hàm & Biến** | camelCase | getUserProfile(), totalReviews, recalculatePlaceRatings() |
| **Hằng số (Constants)** | UPPER\_SNAKE\_CASE | MAX\_IMAGE\_COUNT, DEFAULT\_PAGE\_SIZE, HTTP\_STATUS |

**7\. QUY TRÌNH GIT, BIẾN MÔI TRƯỜNG & LỘ TRÌNH 4 THÀNH VIÊN**

**7.1. Quy trình làm việc với Git (Git Workflow)**

* **Nhánh chính:** main (nhánh production ổn định, không commit trực tiếp) và develop (nhánh tích hợp tính năng của cả nhóm).  
* **Nhánh tính năng (Tạo từ develop):** feat/\<tên-tính-năng\> (ví dụ: feat/place-map, feat/auth-jwt, feat/review-scoring) và fix/\<tên-lỗi\> (ví dụ: fix/image-upload-fail).  
* **Quy tắc Commit Message:** feat: thêm chức năng tìm kiếm quán theo khoảng cách \| fix: sửa lỗi không hiển thị avatar \| docs: cập nhật sơ đồ CSDL trong thư mục docs \| refactor: tối ưu hóa controller bài viết.

**7.2. Cấu hình Biến môi trường mẫu (.env.example)**

| \# \================= SERVER (/server/.env.example) \=================PORT=5000MONGODB\_URI=mongodb+srv://\<user\>:\<password\>@cluster0.mongodb.net/hust-foodJWT\_ACCESS\_SECRET=hust\_food\_access\_secret\_key\_2026JWT\_REFRESH\_SECRET=hust\_food\_refresh\_secret\_key\_2026CLOUDINARY\_CLOUD\_NAME=your\_cloud\_nameCLOUDINARY\_API\_KEY=your\_api\_keyCLOUDINARY\_API\_SECRET=your\_api\_secretSMTP\_HOST=smtp.gmail.comSMTP\_PORT=587SMTP\_USER=your\_email@gmail.comSMTP\_PASS=your\_app\_passwordCLIENT\_URL=http\://localhost:5173\# \================= CLIENT (/client/.env.example) \=================VITE\_API\_BASE\_URL=http\://localhost:5000/api/v1VITE\_SOCKET\_URL=http\://localhost:5000VITE\_DEFAULT\_LAT=21.0285VITE\_DEFAULT\_LNG=105.8542 |
| :---- |

**7.3. Ma trận Phân công Nhiệm vụ Chi tiết theo Tuần cho 4 Thành viên**

| Thành viên | Tuần 1: Thiết kế & Khung | Tuần 2 \- Tuần 3: Code 25 Chức năng | Tuần 4: Tối ưu & Kiểm thử |
| :---- | :---- | :---- | :---- |
| **BE 1 (Vương)(Backend Lead & Git Master)\[User, Follow, Bookmark, Post, Comment\]** | • Khởi tạo Monorepo (client/, server/, docs/).• Viết đầy đủ 8 Mongoose Models (.ts) & Indexes.• Cấu hình Cloudinary & Nodemailer. | • Code 14 APIs Auth (JWT, Quên MK), Hồ sơ, Follow & Bookmarks (F01 \-\> F05).• Code 10 APIs Upload, Bảng tin, Bài viết/Công thức, Yummy & Comment cây (F14 \-\> F20). | • Kiểm tra hiệu năng truy vấn DB.• Xuất tài liệu Postman Collection 42 APIs vào thư mục docs/.• Duyệt Pull Request nhánh develop. |
| **BE 2 (Dũng)(Backend Dev & DevOps)\[Place, Review, Map, Notification, Admin\]** | • Tạo Cluster MongoDB Atlas.• Deploy bản rỗng lên AWS• Viết script utils/seedData.ts (20 quán ăn mẫu). | • Code 6 APIs CRUD Quán ăn & Bản đồ \$geoNear (F06 \-\> F08, F11 \-\> F13).• Code 4 APIs Đánh giá sao & hàm tính điểm trung bình Quán (F09, F10).• Dựng Socket.io & 8 APIs Notify, Report, Admin (F20 \-\> F25). | • Cấu hình Rate Limiting chống spam.• Kiểm tra kết nối WSS trên môi trường Cloud.• Giám sát Server logs khi chạy UAT. |
| **FE 1 (Tuấn)(Frontend Lead & UI Architect)\[features/auth, profiles, posts\]** | • Khởi tạo React \+ TypeScript \+ TailwindCSS.• Cấu hình Axios Interceptor & Zustand Stores.• Dựng components/layout/ và components/common/. | • Code features/auth/ (Login, Register, Forgot/Reset Password \- F01, F02).• Code features/profiles/ (Hồ sơ, Follow, danh sách Bookmarks \- F03 \-\> F05).• Code features/posts/ (Newsfeed, Form bài viết/công thức, Comment cây \- F14 \-\> F20). | • Chuẩn hóa trạng thái Loading Skeleton.• Review & gộp các Pull Request phía Client.• Điều phối buổi test tổng duyệt UAT. |
| **FE 2 (Vũ)(Frontend Dev & Map/UI Tester)\[features/places, reviews, maps, notifications\]** | • Tích hợp React-Leaflet hiển thị bản đồ số.• Xây dựng components/feedback/ (Toast, Alert, Skeleton).• Định nghĩa TypeScript Interfaces cho Place & Review. | • Code features/places/ (Danh sách quán, Trang chi tiết quán, Menu, Form thêm quán \- F06 \-\> F08).• Code features/reviews/ (Form chấm điểm 4 tiêu chí & lọc sao \- F09, F10).• Code features/maps/, features/notifications/ & trang Admin (F11 \-\> F13, F21 \-\> F25). | • Kiểm thử tương thích Mobile Responsive.• Kiểm tra xử lý lỗi Form & thông báo Toast.• Chuẩn bị kịch bản Demo sản phẩm. |

