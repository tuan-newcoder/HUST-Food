# 🎨 TẬP HỢP PROMPT THIẾT KẾ FIGMA CHO 9 MÀN HÌNH HUST-FOOD

> **Mã tài liệu:** `UI-FIGMA-01`  
> **Dự án:** HUST-Food  
> **Mục tiêu:** Cung cấp prompt Tiếng Anh chuyên sâu chuẩn Auto-layout dùng trực tiếp cho **Figma AI (First Draft / Make Designs)** hoặc các công cụ sinh giao diện tự động (v0, Lovable, Claude Artifacts).  
> **Design Tokens đồng bộ:**
> * Primary: `#E11D48` (Rose-600) | Accent: `#F59E0B` (Amber-500)
> * Background: `#F8FAFC` (Slate-50) | Surface Card: `#FFFFFF`
> * Text: `#0F172A` (Slate-900) | Muted: `#64748B` (Slate-500)
> * Border Radius: `rounded-2xl` (16px) | Font: Inter / Plus Jakarta Sans

---

## 📑 Danh mục Prompt 9 Màn hình

1. [SCR-01: Bảng tin Trang chủ (Newsfeed)](#scr-01-màn-hình-bảng-tin-trang-chủ-newsfeed)
2. [SCR-02: Bản đồ Ẩm thực Quét bán kính (Food Map)](#scr-02-màn-hình-bản-đồ-ẩm-thực-quét-bán-kính-food-map)
3. [SCR-03: Danh bạ Khám phá Quán ăn (Places Directory)](#scr-03-màn-hình-danh-bạ-khám-phá-quán-ăn-places-directory)
4. [SCR-04: Chi tiết Quán ăn & Đánh giá 4 Tiêu chí (Place Detail)](#scr-04-màn-hình-chi-tiết-quán-ăn--đánh-giá-place-detail)
5. [SCR-05: Modal Soạn bài viết Đa bước (Create Post Wizard)](#scr-05-modal-soạn-bài-viết-đa-bước-create-post-wizard)
6. [SCR-06: Chi tiết Bài viết & Cây Bình luận Đa cấp (Post Detail)](#scr-06-màn-hình-chi-tiết-bài-viết--bình-luận-post-detail)
7. [SCR-07: Hồ sơ Cá nhân & Quản lý Bookmarks (User Profile)](#scr-07-màn-hình-hồ-sơ-cá-nhân--bookmarks-user-profile)
8. [SCR-08: Cụm Màn hình Xác thực (Auth: Login, Register, Forgot Password)](#scr-08-cụm-màn-hình-xác-thực-auth-screens)
9. [SCR-09: Bảng điều khiển Quản trị Hệ thống (Admin Dashboard)](#scr-09-màn-hình-quản-trị-hệ-thống-admin-dashboard)

---

## SCR-01: Màn hình Bảng tin Trang chủ (Newsfeed)

```text
Design a modern, high-fidelity Web UI for a Food Social Network named "HUST-Food" (Screen: Newsfeed / Home Page).
Frame Size: Desktop 1440px width, responsive layout.

Style & Design System:
- Color Palette: Primary Warm Red (#E11D48), Accent Amber/Gold (#F59E0B), Neutral Dark (#0F172A), Muted Slate (#64748B), Soft Gray Background (#F8FAFC), Card Background Pure White (#FFFFFF).
- Typography: Inter or Plus Jakarta Sans, rounded cards (rounded-2xl), subtle drop shadows.

Layout Structure (Classic 3-Column Layout with sticky sidebars):
1. Left Sidebar (Width: 260px):
   - Logo "HUST-Food" with steaming noodle bowl icon in warm red (#E11D48).
   - Navigation Menu: Home (active red pill), Food Map, Places Directory, Bookmarks, My Profile.
   - Primary CTA Button: Full-width "+ Create New Post" (#E11D48, white bold text, rounded-xl).
   - User Mini Profile at bottom: Avatar, "Nguyen Van A", "@vana_foodie".
2. Center Feed Column (Width: 680px):
   - Top Header Bar: Universal Search Input, Notification Bell with red badge "3", Current User Avatar.
   - Quick Post Composer Box: User avatar + Input "What are you eating around campus today?" + Action pills: [Photo Review] [Recipe Guide].
   - Feed Filter Tabs: 3 segment pills: "All Posts" (Active), "Restaurant Reviews", "Cooking Recipes".
   - Post Card 1 (Restaurant Review): Author avatar, Name "Minh Tuấn", "@tuan_review" • "2 hours ago". Title: "Bún cá cay Hải Phòng chuẩn vị gần cổng Parabol Bách Khoa!". 3-photo grid of steaming fish noodle soup. Embedded Linked Place Card: "Bún Cá Cay Gia Truyền", 4.8★, "35.000đ - 50.000đ". Interaction bar: Yummy button (128 likes, red active), Comment button (24), Bookmark button, Share.
   - Post Card 2 (Cooking Recipe): Author avatar, Name "Thu Hà", "@ha_cooks". Title: "Công thức Ức gà áp chảo sốt chanh leo Eat Clean". Badges: [Easy], [25 mins], [40.000 VNĐ]. Hero photo of plated grilled chicken with sauce. Bottom interaction bar.
3. Right Sidebar (Width: 320px):
   - Widget 1: "Trending Tags" card (#bun-ca-cay, #tra-chanh, #an-sang-hust, #lau-sinh-vien) with post counts.
   - Widget 2: "Featured Reviewers" card with avatars, follower counts, and compact "Follow" buttons.
```

---

## SCR-02: Màn hình Bản đồ Ẩm thực Quét bán kính (Food Map)

```text
Design a modern, high-fidelity Web UI for a Food Social Network named "HUST-Food" (Screen: Interactive Food Map - Route: /map).
Frame Size: Desktop 1440px width, full viewport height (1024px).

Style & Design System:
- Color Palette: Primary Warm Red (#E11D48), Accent Amber/Gold (#F59E0B), Soft Gray Background (#F8FAFC), Card Background White (#FFFFFF).
- Typography: Inter or Plus Jakarta Sans.

Layout Structure:
1. Full-Screen Interactive Map Canvas (Leaflet / OpenStreetMap style):
   - Center location set to university campus area with streets and landmarks labeled.
   - User Current Location: Pulsing blue beacon pin with a semi-transparent amber radius circle overlay (1.5km radius).
   - Category Pins/Markers across map: Red pins for Restaurants, Brown pins for Cafes, Yellow pins for Street Food.
   - Selected Active Pin: Elevated with a glow and white border.

2. Top Floating Controls Bar (Centered or top-left, floating with backdrop-blur):
   - Back to Feed button with HUST-Food logo.
   - Search location/dish input with search icon.
   - Floating Radius Slider Widget (Pill container, white, rounded-full, shadow-md, px-4, py-2):
     • Label "Bán kính quét" (Scan Radius): 500m | 1km | 2km (Active highlighted) | 5km.
   - Filter Chips Row: Price "< 50k", Rating "≥ 4.0 ★", Category "Cà phê", "Ăn vặt".

3. Floating Selected Place Popup Card (Bottom-left corner, width: 380px, white card, rounded-2xl, shadow-xl, p-4):
   - Place Thumbnail image (100x100 rounded-xl) alongside details:
   - Place Name "Bún Cá Cay Gia Truyền - Tạ Quang Bửu" (Bold).
   - Category Badge: "Quán ăn" (Warm red pill).
   - Rating: ⭐ 4.8 / 5.0 (124 reviews).
   - Price range: 35.000đ - 55.000đ • Status: 🟢 Open Now.
   - Distance indicator: "📍 Cách bạn 320m".
   - CTA Button: Full-width "Xem chi tiết & Menu" (#E11D48, white text, rounded-xl).

4. Bottom-Right Map Tool Controls:
   - Floating circular buttons: GPS Recenter Button, Zoom In (+), Zoom Out (-), Map Layer Switcher.
```

---

## SCR-03: Màn hình Danh bạ Khám phá Quán ăn (Places Directory)

```text
Design a modern, high-fidelity Web UI for a Food Social Network named "HUST-Food" (Screen: Places Directory & Search - Route: /places).
Frame Size: Desktop 1440px width.

Style & Design System:
- Primary Warm Red (#E11D48), Accent Amber (#F59E0B), Slate-900 (#0F172A), Slate-50 Background (#F8FAFC).

Layout Structure:
1. Top Navbar: Logo, Navigation links, Global Search, Notification bell, User avatar.
2. Page Header Section:
   - Title: "Khám phá Quán ngon quanh Bách Khoa" (H1 Bold).
   - Subtitle: "Hơn 250 quán ăn, cafe và quán vỉa hè được sinh viên đánh giá thực tế".
   - Right CTA: "+ Đóng góp quán mới" (#E11D48 button, rounded-xl).
3. Search & Filter Bar (White card, rounded-2xl, shadow-sm, p-4, mb-6):
   - Large search input: "Tìm kiếm quán ăn, địa chỉ hoặc tên món...".
   - Category Tabs: All, Nhà hàng, Quán cà phê, Quán ăn vặt, Tiệm bánh.
   - Dropdown Filters: Price Range (Min - Max), Rating (3.5+ ★, 4.0+ ★), Sort By: "Điểm đánh giá cao nhất" / "Nhiều review nhất".
4. Places Grid (3 Columns, gap-6):
   - Place Card Component (White card, rounded-2xl, shadow-sm, hover elevate, overflow-hidden):
     • Image Header (16:9 ratio) with:
       - Category Badge top-left ("Quán ăn" or "Cà phê").
       - Status Badge top-right ("🟢 Đang mở cửa" or "🔴 Đã đóng cửa").
       - Floating Bookmark icon button top-right.
     • Card Body:
       - Place Name: "Cơm Tấm Sườn Bì Chả HUST" (Font bold, text-lg).
       - Address: "Số 28 Tạ Quang Bửu, P. Bách Khoa, Hai Bà Trưng".
       - Ratings & Price row: ⭐ 4.7 (86 đánh giá) • 30.000đ - 50.000đ.
       - Operating Hours: ⏰ 09:30 - 21:00.
       - Tag pills: #com-tam #an-trua #gia-sinh-vien.
5. Pagination & Load More: "Xem thêm 12 quán tiếp theo" button.
```

---

## SCR-04: Màn hình Chi tiết Quán ăn & Đánh giá (Place Detail)

```text
Design a modern, high-fidelity Web UI for a Food Social Network named "HUST-Food" (Screen: Place Detail Page - Route: /places/:id).
Frame Size: Desktop 1440px width.

Style & Design System:
- Color Palette: Primary Warm Red (#E11D48), Amber (#F59E0B), Slate-900, Slate-50 background.

Layout Structure:
1. Breadcrumbs: Trang chủ > Quán ăn > Bún Cá Cay Gia Truyền.
2. Hero Gallery Section (Mosaic Grid with 5 photos):
   - 1 large main hero photo on left (60% width), 4 smaller grid photos on right (40% width).
   - "Xem tất cả 18 ảnh" pill button at bottom-right of gallery.
3. Place Header Bar:
   - Place Name (H1 bold 28px): "Bún Cá Cay Gia Truyền - Tạ Quang Bửu".
   - Category Pill: "Quán ăn sinh viên".
   - Address row: 📍 "Số 15 Tạ Quang Bửu, P. Bách Khoa, Q. Hai Bà Trưng, Hà Nội".
   - Hours & Price: ⏰ "07:30 - 22:30 • Đang mở cửa" • 💰 "35.000đ - 55.000đ".
   - Action Buttons Row: [🔖 Lưu vào Bookmarks] [🗺️ Chỉ đường Google Maps] [📤 Chia sẻ] [⭐ Viết đánh giá (#E11D48 solid CTA)].
4. Main Content Body (2 Columns: Left 8 cols, Right 4 cols):
   - Left Column:
     • 4-Criteria Rating Summary Card (White, rounded-2xl, p-6):
       - Big overall rating score: "4.8" / 5.0 with 5 big golden stars and "124 đánh giá".
       - 4 Rating Progress Bars:
         * 😋 Hương vị (Taste): 4.9 ★ (98%)
         * 💰 Giá cả (Price): 4.6 ★ (92%)
         * 🧼 Vệ sinh (Hygiene): 4.8 ★ (96%)
         * 👨‍🍳 Phục vụ (Service): 4.7 ★ (94%)
     • Menu Section Card (White, rounded-2xl, p-6, mt-6):
       - Section Title: "Thực đơn & Giá cả" (Menu & Pricing).
       - Menu Items Grid (2 cols): Thumbnail photo, Dish name ("Bún cá cay đặc biệt"), description, price ("45.000 VNĐ").
     • Community Reviews Section:
       - Filter Pills: [Tất cả 124] [5 sao] [4 sao] [Có hình ảnh].
       - Review Cards List: Reviewer Avatar, Name "Hoàng Nam", Date "3 ngày trước", 4 criteria badges [Vị: 5, Giá: 5, Sạch: 4, Phục vụ: 5], detailed written review text, 3 photo thumbnails, "Hữu ích (15)" button.
   - Right Sticky Column:
     • Mini Map Card: Embedded Leaflet map pin, address text, "Mở bản đồ lớn" link.
     • Operating Hours Card: Full weekly schedule table (Thứ 2 - Chủ Nhật: 07:30 - 22:30).
     • Contributor Card: Avatar, "Đóng góp bởi @minhtuan • Đã xác minh".
```

---

## SCR-05: Modal Soạn bài viết Đa bước (Create Post Wizard)

```text
Design a modern, high-fidelity Web UI for a Food Social Network named "HUST-Food" (Component: Create Post Wizard Modal).
Modal Dimensions: Centered Dialog, Width: 760px, rounded-2xl, pure white background (#FFFFFF), backdrop overlay dim (rgba(0,0,0,0.5)).

Style & Design System:
- Primary Warm Red (#E11D48), Neutral Slate-900, Slate-500.

Layout & Form Elements:
1. Modal Header:
   - Title: "Tạo bài viết mới" (Font bold, text-xl).
   - Close Icon button (X) top-right.
2. Step 1: Post Type Segment Switcher (2 large radio cards side by side):
   - Card A (Active selected with red border): Icon Bowl/Utensils, "Trải nghiệm quán ăn" (Review & recommend a place).
   - Card B: Icon Chef Hat, "Công thức nấu ăn" (Step-by-step home cooking recipe).
3. Step 2: Form Content:
   - Title Input: "Nhập tiêu đề bài viết (tối đa 150 ký tự)...".
   - Content Rich Textarea: "Chia sẻ cảm nhận chi tiết của bạn về món ăn, không gian, trải nghiệm...".
   - Image Upload Dropzone: Drag-and-drop zone with camera icon, "Tải lên tối đa 5 hình ảnh (JPG, PNG, WebP ≤ 5MB)", showing 2 uploaded photo previews with circular delete (X) icons.
   - Tags Input field: "Nhập thẻ #tags (ví dụ: bun-ca, an-trua, bach-khoa)...".
   - (For Restaurant Review Type): Linked Place Selector:
     • Search input with dropdown results to select from registered Places ("Bún Cá Cay Gia Truyền - 15 Tạ Quang Bửu").
   - (For Recipe Type):
     • Metadata Row (4 inputs): Time (minutes), Cost (VNĐ), Servings (people), Difficulty (Dropdown: Easy/Medium/Hard).
     • Dynamic Ingredients Table: Rows with [Tên nguyên liệu] and [Định lượng], plus "+ Thêm nguyên liệu" link button.
     • Dynamic Steps Section: Numbered step cards (Bước 1, Bước 2...) with instruction textarea and step photo upload button.
4. Modal Footer:
   - Cancel button (Ghost/Outline).
   - Save Draft button.
   - Primary CTA: "Đăng bài viết" (#E11D48 solid background, white text, rounded-xl, px-6, py-2.5).
```

---

## SCR-06: Màn hình Chi tiết Bài viết & Cây Bình luận (Post Detail)

```text
Design a modern, high-fidelity Web UI for a Food Social Network named "HUST-Food" (Screen: Post Detail Page - Route: /posts/:id).
Frame Size: Desktop 1440px width (Content container: 800px centered).

Style & Design System:
- Color Palette: Primary Warm Red (#E11D48), Amber (#F59E0B), Slate-900, Slate-50 background.

Layout Structure:
1. Post Header:
   - Author Avatar (50x50), Full Name "Lê Phương Thảo", @username "@thao_foodie" • "Hôm qua lúc 18:30".
   - Follow Button (+ Theo dõi, red outline, rounded-full).
   - 3-dots Menu Icon (Report / Share).
2. Post Content:
   - Post Title (H1 bold 24px): "Trải nghiệm Bún cá cay Hải Phòng chuẩn vị gần cổng Parabol Bách Khoa".
   - Full narrative paragraphs detailing taste, soup sweetness, crispy fish fillets, and bamboo shoots.
   - Tags List: #bun-ca #hai-phong #bach-khoa #an-trua.
   - Embedded Place Summary Card: Box with place thumbnail, "Bún Cá Cay Gia Truyền", 4.8★, address, "Xem quán".
   - Photo Carousel / Big Image Grid: High-resolution photos with indicator dots.
3. Interaction Action Bar (Border top & bottom, py-3, flex items-center justify-between):
   - Left: Yummy button (Active red heart icon with "156 Yummy"), Bookmark button, Share button.
   - Right: Flag Report icon.
4. Nested Comments Section:
   - Header: "Bình luận (34)" with sort dropdown ("Mới nhất" / "Nổi bật nhất").
   - New Comment Box: Current user avatar, expandable textarea "Viết bình luận của bạn...", "Gửi bình luận" button (#E11D48).
   - Nested Comment Tree:
     • Root Comment 1: Avatar, Name "Trần Đức", "Quán này mở đến mấy giờ thế bạn?", 2 hours ago. Action: "Trả lời" (Reply).
       - Nested Reply (Indented 48px with a vertical connecting thread line): Avatar, Name "Lê Phương Thảo (Tác giả)", "Dạ quán mở từ 7h sáng đến 22h đêm nhé bạn!", 1 hour ago.
     • Root Comment 2: Avatar, Name "Mai Anh", "Nhìn đĩa cá rán giòn mê quá, trưa mai phải rủ hội bạn đi ăn luôn!".
```

---

## SCR-07: Màn hình Hồ sơ Cá nhân & Bookmarks (User Profile)

```text
Design a modern, high-fidelity Web UI for a Food Social Network named "HUST-Food" (Screen: User Profile & Bookmarks - Route: /profile/:username).
Frame Size: Desktop 1440px width.

Style & Design System:
- Color Palette: Primary Warm Red (#E11D48), Accent Amber (#F59E0B), Slate-900, Slate-50 background.

Layout Structure:
1. Profile Hero Header Card (White card, rounded-2xl, shadow-sm, overflow-hidden, mb-6):
   - Banner Cover Image: Landscape photo of Hanoi street food (Height 200px).
   - Profile Info Bar (Overlapping avatar):
     • Circular Avatar (120x120, white border 4px, shadow-md).
     • User Name (H1 bold 24px): "Nguyễn Minh Tuấn", @username "@minhtuan_foodie".
     • Bio: "Sinh viên K65 Bách Khoa 🍜 Đam mê săn lùng quán ăn ngon bổ rẻ quanh Bách - Kinh - Xây. Food reviewer nghiệp dư."
     • Stats Row: "1.240 Người theo dõi" • "340 Đang theo dõi" • "48 Bài viết" • "19 Đánh giá quán".
     • Action Buttons (Right side):
       - If Owner: "Chỉnh sửa hồ sơ" button (outline rounded-xl) + "Đổi mật khẩu".
       - If Other User: "Theo dõi" button (solid red #E11D48).
2. Navigation Tabs (Clean underline/pill tabs):
   - Tab 1: "Bài viết của tôi (48)"
   - Tab 2: "Quán ăn đã đóng góp (6)"
   - Tab 3: "Đã lưu (Bookmarks - 24)" [Active]
3. Bookmarks Tab Content (2 Sub-segmented pills):
   - Sub-tab A: "Quán ăn yêu thích (14)" [Active]
     • Grid of 3 Place Cards (Places previously saved by user with quick unsave bookmark button).
   - Sub-tab B: "Bài viết & Công thức đã lưu (10)"
     • Grid of saved Post cards with thumbnail, title, author, and Yummy count.
```

---

## SCR-08: Cụm Màn hình Xác thực (Auth Screens)

```text
Design a modern, high-fidelity Web UI for a Food Social Network named "HUST-Food" (Screen: Authentication - Login, Register, Forgot Password).
Frame Size: Desktop 1440px width, Split Screen (50% Visual Banner / 50% Clean Form Card).

Left Visual Banner (50% width):
- High-quality photography of vibrant Vietnamese food dishes (Pho, Bun Cha, Banh Mi).
- Overlay gradient with branding: Logo HUST-Food in white, Tagline: "Mạng xã hội Ẩm thực & Khám phá Quán ăn sinh viên Bách Khoa".
- Subtext: "Kết nối cộng đồng ăn uống, chia sẻ công thức và săn lùng quán ngon quanh trường."

Right Form Column (50% width, centered form container 420px):

State 1: Login Form (/login):
- Title: "Đăng nhập" (H1 bold 28px), Subtitle: "Chào mừng bạn quay trở lại với HUST-Food!".
- Input 1: "Email hoặc Tên đăng nhập", leading mail/user icon.
- Input 2: "Mật khẩu", leading lock icon, trailing eye toggle icon.
- Options row: "Ghi nhớ đăng nhập" checkbox, "Quên mật khẩu?" link (#E11D48).
- Primary Button: "Đăng nhập" (Full-width, #E11D48 solid, py-3, rounded-xl).
- Footer text: "Chưa có tài khoản? Đăng ký ngay (#E11D48 link)".

State 2: Register Form (/register):
- Title: "Tạo tài khoản mới".
- Inputs: Họ và tên, Tên đăng nhập (username), Email sinh viên, Mật khẩu, Xác nhận mật khẩu.
- Password strength indicator bar (Weak / Medium / Strong).
- Primary Button: "Đăng ký tài khoản".
- Footer: "Đã có tài khoản? Đăng nhập".

State 3: Forgot Password Form (/forgot-password):
- Step 1: Input registered email + Button "Gửi mã OTP qua email".
- Step 2: 6-digit OTP input boxes, New Password, Confirm New Password + Button "Đặt lại mật khẩu".
```

---

## SCR-09: Màn hình Quản trị Hệ thống (Admin Dashboard)

```text
Design a modern, high-fidelity Web UI for a Food Social Network named "HUST-Food" (Screen: Admin Dashboard - Route: /admin).
Frame Size: Desktop 1440px width.

Layout Structure:
1. Admin Topbar:
   - Admin Badge "HUST-Food Admin Portal", Search global, Admin Avatar & Name "Vương (Admin)", Logout button.
2. Main Admin Container with Tab Navigation:
   - Tab 1: "Tổng quan & Thống kê" (Overview) [Active]
   - Tab 2: "Kiểm duyệt báo cáo vi phạm" (Moderation) [Badge "8"]
   - Tab 3: "Quản lý người dùng" (User Management)

3. Tab 1 Content - Stats Overview:
   - 4 KPI Metric Cards (Grid 4 cols):
     • Card 1: 👥 "Tổng người dùng": 3,420 (+12% tuần này).
     • Card 2: 🍜 "Tổng số quán ăn": 286 quán.
     • Card 3: 📝 "Bài viết & Đánh giá": 1,845 bài.
     • Card 4: ⚠️ "Báo cáo chờ duyệt": 8 báo cáo (Red warning badge).

4. Tab 2 Content - Report Moderation Table:
   - Table Container (White card, rounded-2xl, shadow-sm, overflow-hidden):
     • Columns: Người báo cáo | Đối tượng bị tố cáo | Lý do vi phạm | Chi tiết nội dung | Trạng thái | Hành động.
     • Row 1: @tuan_k65 | Bài viết #6716 | SPAM (Red pill) | "Quảng cáo link ngoài không liên quan..." | CHỜ DUYỆT | [Ẩn bài viết (#E11D48 button)] [Bác bỏ].
     • Row 2: @lan_anh | Đánh giá #8821 | SAI THÔNG TIN (Amber pill) | "Quán này đã đóng cửa từ tháng trước..." | CHỜ DUYỆT | [Xác nhận ẩn] [Bác bỏ].

5. Tab 3 Content - User Management Table:
   - Search user input + Filter status (Tất cả | Hoạt động | Đã khóa).
   - Table columns: Avatar & Tên | Username | Email | Ngày tham gia | Số bài viết | Trạng thái (ACTIVE / BANNED) | Hành động.
   - Action buttons: [Khóa tài khoản (Ban)] / [Mở khóa (Active)].
```

