---
name: HUST-Food Design System
description: Modern culinary social network and campus food map for Hanoi University of Science and Technology
colors:
  primary: "#E11D48"
  primary-hover: "#BE123C"
  primary-light: "#FFE4E6"
  secondary: "#F59E0B"
  secondary-hover: "#D97706"
  secondary-light: "#FEF3C7"
  background: "#F8FAFC"
  surface: "#FFFFFF"
  text-primary: "#0F172A"
  text-muted: "#64748B"
  border: "#E2E8F0"
  destructive: "#DC2626"
  success: "#16A34A"
  dark-background: "#0B0F19"
  dark-surface: "#151D2C"
  dark-surface-hover: "#1E293B"
  dark-text-primary: "#F8FAFC"
  dark-text-muted: "#94A3B8"
  dark-border: "#334155"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  h1:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  h2:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  h3:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  "2xl": "24px"
  "3xl": "32px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.2xl}"
    padding: "24px"
---

# HUST-Food Design System

## Overview
HUST-Food là nền tảng mạng xã hội ẩm thực và bản đồ đánh giá quán ăn dành cho sinh viên và giới trẻ khu vực Đại học Bách Khoa Hà Nội. Ngôn ngữ thiết kế kết hợp phong cách hiện đại, ấm áp của ẩm thực (Warm Gourmet) với sự trẻ trung, nhanh nhạy của công nghệ, tối ưu hoá cho cả trải nghiệm máy tính và lướt web trên thiết bị di động.

## Colors
- **Primary (`#E11D48` / `rose-600`)**: Màu đỏ ẩm thực ấm áp, tượng trưng cho năng lượng, sự thèm ăn và nhiệt huyết sinh viên. Dùng cho nút kêu gọi hành động chính (CTA), tim Yummy đã thả, badge nổi bật và tab đang hoạt động.
- **Secondary (`#F59E0B` / `amber-500`)**: Màu vàng cam mật ong, dùng cho hệ thống đánh giá sao (StarRating 4 tiêu chí), huy hiệu công thức KTX và cảnh báo quan trọng.
- **Background (`#F8FAFC` / `slate-50`)**: Nền sáng thanh thoát, trung tính cao, giúp hình ảnh món ăn thực tế nổi bật tối đa mà không gây mỏi mắt.
- **Surface (`#FFFFFF` / `white`)**: Bề mặt các thẻ bài viết (Feed Cards), Modal thoại, Dropdown menu và Popup bản đồ.
- **Text Primary (`#0F172A` / `slate-900`)**: Màu chữ đen than đậm đà, đảm bảo độ tương phản WCAG AA cao nhất (trên 12:1 trên nền trắng).
- **Text Muted (`#64748B` / `slate-500`)**: Chữ phụ, ngày tháng, địa chỉ và thông số phụ trợ (tương phản > 4.6:1 trên nền trắng).
- **Border (`#E2E8F0` / `slate-200`)**: Đường viền thanh mảnh, tinh tế ngăn cách các phân vùng mà không tạo cảm giác đóng hộp nặng nề.

### Light & Dark Themes (Theme Switching)
Hệ thống hỗ trợ chuyển đổi giao diện Sáng / Tối linh hoạt với lưu trữ bền vững qua `localStorage` (`hust_food_theme`), tự động đồng bộ theo hệ điều hành (`system preference`) và script chống nhấp nháy giao diện (anti-FOUT) đặt tại `<head>`:
- **Dark Background (`#0B0F19`)**: Tông xanh đen sâu thẳm, dịu mắt khi sử dụng ban đêm hoặc trong phòng học thiếu sáng.
- **Dark Surface (`#151D2C`)**: Bề mặt Card, Header, Sidebar, Modal và BottomNavigation trong chế độ tối.
- **Dark Sub-surface (`#1E293B`)**: Nền ô Input, Dropdown item, thanh cuộn scrollbar và hộp công thức.
- **Dark Border (`#334155` / `slate-800`)**: Đường ranh giới tương phản mềm mại.
- **Dark Text Primary (`#F8FAFC`)**: Chữ trắng sáng (độ tương phản 15:1 trên nền tối).
- **Dark Text Muted (`#94A3B8`)**: Chữ xám trung tính (tương phản 7.2:1 trên nền tối, đạt WCAG AAA).

## Typography
- **Font chính**: `Plus Jakarta Sans`, sans-serif. Được nhúng trực tiếp qua Google Fonts với các trọng số `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold), `800` (ExtraBold).
- **Thang đo kích thước**:
  - `Display` (28px - 32px, Bold 800): Tiêu đề thương hiệu và trang chủ nổi bật.
  - `H1` (24px, Bold 700): Tiêu đề bài viết chi tiết, tiêu đề trang hồ sơ cá nhân.
  - `H2` (18px - 20px, Bold 700): Tiêu đề thẻ bài viết, tiêu đề phân vùng chính.
  - `H3` (15px - 16px, SemiBold 600): Tiêu đề widget bên phải, tên quán ăn rút gọn.
  - `Body` (13px - 14px, Regular 400): Nội dung bài review, bình luận, hướng dẫn nấu ăn.
  - `Caption` (11px - 12px, Medium 500): Tên người dùng, ngày đăng, số lượng tương tác.

## Layout
- **Kiến trúc 3 cột Responsive**:
  - Cột trái: Thanh điều hướng `Sidebar` cố định rộng `280px` - `308px` trên màn hình lớn (`lg:` và `xl:`), tự động ẩn trên màn hình di động.
  - Cột giữa: Dòng tin `Newsfeed` và nội dung chính có chiều rộng tối đa `680px` - `760px`, căn giữa cân đối.
  - Cột phải: Khối tiện ích `RightWidgets` rộng `320px` hiển thị Top #tags thịnh hành và Reviewer nổi bật (chỉ hiển thị trên `lg:`).
  - Đáy màn hình di động: Thanh điều hướng `BottomNavigation` cố định ở đáy với các nút chạm tối thiểu `44 × 44px`.

## Elevation & Depth
- Tránh sử dụng bóng đổ đen thô cứng (`box-shadow: 4px 4px 0` hoặc đổ bóng mờ đen xì).
- Sử dụng độ sâu mềm mại với tone màu chủ đạo:
  - `shadow-sm`: `0 1px 2px 0 rgb(0 0 0 / 0.05)` cho các thẻ bài viết ở trạng thái nghỉ.
  - `shadow-md`: `0 4px 6px -1px rgb(0 0 0 / 0.07)` kèm `hover:shadow-rose-500/10` khi di chuột.
  - `shadow-xl`: `0 20px 25px -5px rgb(15 23 42 / 0.1)` cho Modal hộp thoại và Dropdown menu.

## Shapes
- Bo góc nhất quán theo phân cấp:
  - `rounded-3xl` (24px - 32px): Dành cho Card bài viết lớn, khung hồ sơ người dùng.
  - `rounded-2xl` (16px - 20px): Dành cho Modal, khối ảnh món ăn, QuickPostBar.
  - `rounded-xl` (12px): Dành cho Button, Input nhập liệu, Dropdown item, Tag pill.
  - `rounded-full` (9999px): Dành cho Avatar người dùng, badge số thông báo, nút tròn icon.

## Components
- **Button**: 5 biến thể (`primary`, `secondary`, `outline`, `ghost`, `danger`), có trạng thái `isLoading` kèm spinner `Loader2`, hỗ trợ `leftIcon` và `rightIcon`, touch target ≥ 44px.
- **Input**: Nhãn rõ ràng, hỗ trợ icon trái/phải, nút ẩn/hiện mật khẩu tương tác cao, thông báo lỗi đỏ rõ ràng.
- **Avatar**: Tự động hiển thị ảnh chất lượng cao hoặc fallback về 2 chữ cái đầu với nền `rose-50` viền `rose-200` thanh lịch.
- **StarRating**: Hiển thị chấm sao màu `amber-500` cho 4 tiêu chí (Hương vị, Giá cả, Vệ sinh, Phục vụ) và tính điểm tổng hợp.
- **Skeleton**: Khung xương hiệu ứng pulse mô phỏng chân thực bài viết khi đang tải dữ liệu.
- **EmptyState**: Trạng thái rỗng kèm icon trực quan, mô tả thân thiện và nút hành động chuyển hướng rõ ràng.
- **Toast**: Thông báo dạng nổi góc màn hình hỗ trợ 4 mức: `success`, `error`, `info`, `warning`.

## Do's and Don'ts
### Do's:
- Luôn kiểm tra giao diện trên màn hình di động ($375\text{px} - 430\text{px}$) trước khi đóng gói.
- Đảm bảo xử lý đủ 4 trạng thái: Loading (Skeleton), Empty, Error (kèm nút Thử lại), Success.
- Sử dụng biểu tượng từ thư viện `lucide-react` để đảm bảo độ dày nét (stroke-width) đồng nhất.
- Đảm bảo độ tương phản văn bản đạt chuẩn WCAG AA (≥ 4.5:1).

### Don'ts:
- ❌ Không dùng emoji làm icon chức năng trên thanh điều hướng hoặc nút bấm.
- ❌ Không sử dụng gradient tím-xanh rập khuôn ("AI Slop gradient").
- ❌ Không lồng card trong card vô tội vạ; tận dụng khoảng trắng (whitespace) và phân cấp chữ.
- ❌ Không tạo các nút bấm hoặc vùng click nhỏ hơn $44 \times 44\text{px}$ trên giao diện mobile.
