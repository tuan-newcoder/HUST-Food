# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

- Frontend: React 18, TypeScript, Vite, TailwindCSS, Zustand (State Management), Lucide-React (Iconography), Axios
- Backend: Node.js, Express RESTful API, MongoDB (Mongoose), JWT Auth (Access Token 15m, Refresh Token 7d), Cloudinary (Image Storage)
- Architecture: Decoupled Monorepo (`client/` và `server/`)

## Users

- **Sinh viên & Giới trẻ Bách Khoa (K64 - K71+)**: Người dùng thường xuyên tìm kiếm các quán ăn ngon, bổ, rẻ, cơm bình dân, bún cá, trà đá, cafe học bài quanh các trục đường Tạ Quang Bửu, Trần Đại Nghĩa, Lê Thanh Nghị, Giải Phóng, Đại La.
- **Tác giả bài viết / Reviewer ẩm thực sinh viên**: Những cá nhân đam mê chia sẻ trải nghiệm ăn uống thực tế kèm ảnh chụp chân thực, hoặc chia sẻ công thức nấu ăn tiết kiệm bằng nồi cơm điện/bếp từ trong KTX/phòng trọ.
- **Chủ quán ăn & Người đóng góp địa điểm**: Cập nhật thông tin quán, địa chỉ chính xác, khoảng giá thực tế, giờ mở cửa và menu món ăn.
- **Quản trị viên (Admin)**: Duyệt bài viết, kiểm duyệt báo cáo vi phạm cộng đồng (F20), quản lý danh bạ địa điểm và tài khoản người dùng.

## Product Purpose

- Nền tảng mạng xã hội chuyên biệt về ẩm thực và review quán ăn khu vực Đại học Bách Khoa Hà Nội (mở rộng tự do cho mọi thực khách).
- Giúp sinh viên dễ dàng khám phá hàng quán hợp khẩu vị và vừa túi tiền qua Bản đồ ẩm thực tương tác (Food Map) và đánh giá khách quan.
- Tạo không gian gắn kết cộng đồng sinh viên thông qua chia sẻ trải nghiệm, tương tác Yummy (thích), bình luận đa cấp, lưu trữ (Bookmarks) quán ruột và công thức nấu ăn.
- Thước đo thành công: Dữ liệu quán ăn phong phú, đánh giá trung thực không quảng cáo bẩn, tốc độ tải trang nhanh, tương tác thảo luận sôi nổi và tỷ lệ quay lại cao.

## Positioning

- Kết hợp kiềng 3 chân: **Mạng xã hội Bảng tin (Newsfeed)** + **Bản đồ ẩm thực số (Interactive Campus Map)** + **Hệ thống chấm điểm 4 tiêu chí minh bạch (Hương vị, Giá cả, Vệ sinh, Phục vụ)**.
- Khác biệt với các ứng dụng thương mại đặt đồ ăn (ShopeeFood, GrabFood) hay thư mục tĩnh (Foody): HUST-Food tập trung vào trải nghiệm sinh viên thực tế, thông tin "ngóc ngách" quanh trường, công thức nấu ăn phòng trọ, và sự kết nối giữa các thế hệ sinh viên Bách Khoa.

## Operating Context

- Môi trường: Ứng dụng Web Responsive tối ưu 100% cho cả trình duyệt điện thoại (Mobile Web 375px - 430px) và máy tính (Desktop Web).
- Trải nghiệm khám phá: Tìm kiếm toàn văn thông minh (F16), lọc theo tag (#ngo-tu-do, #bun-ca, #cafe-hoc-bai), phân loại tab (Tất cả, Trải nghiệm quán, Công thức KTX).
- Trải nghiệm đóng góp: Soạn bài viết đa bước kèm ảnh chụp thực tế (tối đa 5 ảnh), gắn tọa độ quán hoặc nhập công thức (thời gian, chi phí, nguyên liệu, các bước nấu).
- Đảm bảo 4 trạng thái dữ liệu (Loading Skeleton, Empty State minh hoạ, Error Retry, Success Content).

## Capabilities and Constraints

- **Bảo mật & Phân quyền**: Đăng ký/Đăng nhập với Email hoặc Username, bảo vệ phiên bằng JWT; phân quyền USER và ADMIN.
- **Chống spam đánh giá**: Mỗi tài khoản chỉ được gửi tối đa 1 bài đánh giá cho mỗi quán ăn; có tính năng Báo cáo vi phạm (Report Modal) với 5 lý do chuẩn mực.
- **Bản đồ tương tác**: Tích hợp Leaflet Map, hỗ trợ định vị GPS người dùng và ghim tọa độ quán ăn.
- **Hiệu năng & Tối ưu**: Phân trang con trỏ (Cursor pagination) cho bài viết và bình luận, tải ảnh tối ưu tỷ lệ khung hình, tránh layout shift.

## Brand Commitments

- **Tên sản phẩm**: HUST-Food (Mạng xã hội Ẩm thực Bách Khoa).
- **Bảng màu nhận diện**:
  - Primary: `#E11D48` (`rose-600` - Đỏ ấm / Đỏ ẩm thực kích thích vị giác)
  - Secondary: `#F59E0B` (`amber-500` - Vàng cam đánh giá, ngôi sao rating, huy hiệu món ngon)
  - Background: `#F8FAFC` (`slate-50` - Nền sáng thoáng, tôn vinh hình ảnh món ăn)
  - Card Surface: `#FFFFFF` (`white` - Bề mặt thẻ bài viết, bo góc `rounded-3xl` mềm mại)
  - Text Primary: `#0F172A` (`slate-900` - Chữ tiêu đề đậm nét, tương phản cao)
  - Text Muted: `#64748B` (`slate-500` - Chữ phụ, ngày tháng, lượt tương tác)
- **Typography**: `Plus Jakarta Sans`, sans-serif (hiện đại, trẻ trung, thân thiện, dễ đọc trên màn hình di động).
- **Biểu tượng (Iconography)**: Thư viện SVG chuẩn `lucide-react`. Tuyệt đối không dùng emoji thay thế icon chức năng.
- **Văn phong (Tone of Voice)**: Trẻ trung, gần gũi, ấm cúng, chân thực, mang đậm chất sinh viên Bách Khoa.

## Evidence on Hand

- Mã nguồn hoàn chỉnh: `client/` (Frontend React 18 + Vite) và `server/` (Backend Express + MongoDB).
- Tài liệu quy chuẩn: `AGENTS.md`, `docs/01-requirements/feature-matrix.md`, `docs/05-ui-ux/design-system.md`, `STRUCTURE.md`.
- Trạng thái kiểm thử: `npm run build` thành công 100% không có lỗi TypeScript hay Vite bundling.

## Product Principles

1. **Chân thực & Khách quan**: Đánh giá phân tách rõ 4 tiêu chí (Hương vị, Giá cả, Vệ sinh, Phục vụ) để người dùng có cái nhìn toàn diện, loại bỏ đánh giá ảo.
2. **Nhanh chóng & Trực quan**: Hình ảnh món ăn chụp thật dẫn dắt trải nghiệm, kèm vị trí rõ ràng trên bản đồ.
3. **Chuẩn mực thủ công (Craft Floor)**: Giao diện hoàn thiện 100%, không để lại mã giả `// TODO`, hỗ trợ đầy đủ 4 trạng thái, touch target tối thiểu 44px trên mobile.
4. **Không AI-Slop**: Tránh tuyệt đối gradient tím-hồng generic, không lồng thẻ trong thẻ (nested cards), đảm bảo độ tương phản WCAG AA (≥ 4.5:1).

## Accessibility & Inclusion

- Tương phản màu văn bản đạt chuẩn WCAG AA (≥ 4.5:1) trên mọi nền sáng và tối.
- Kích thước vùng tương tác cảm ứng tối thiểu 44 × 44px cho mọi nút bấm, thẻ bài viết và icon điều hướng trên mobile.
- Bố cục responsive linh hoạt: Desktop 3 cột, Mobile tự động ẩn sidebar và kích hoạt Bottom Navigation tiện lợi ở đáy màn hình.
- Phím tắt điều hướng và hỗ trợ phím ESC đóng modal tự động.
