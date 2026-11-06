# 📖 TỪ ĐIỂN DỮ LIỆU CHI TIẾT (DATA DICTIONARY)

> **Mã tài liệu:** `DB-DICT-01`  
> **Dự án:** HUST-Food  
> **Trạng thái:** [ĐANG HOÀN THIỆN] - Khung tài liệu quy định kiểu dữ liệu và ràng buộc validation

---

## 1. Bảng `users`
| Tên cột (Field) | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả & Ràng buộc |
| :--- | :--- | :---: | :--- | :--- |
| `_id` | ObjectId | Có | Tự sinh | Khóa chính của người dùng |
| `username` | String | Có | Không | Tên tài khoản, 3–30 ký tự, chữ thường, không dấu, duy nhất |
| `email` | String | Có | Không | Email đăng ký, định dạng hợp lệ, duy nhất |
| `passwordHash` | String | Có | Không | Mật khẩu băm (bcrypt), ẩn khi query |
| `fullName` | String | Có | Không | Họ và tên hiển thị |
| `avatarUrl` | String | Không | Cloudinary default | Đường dẫn ảnh đại diện |
| `bio` | String | Không | `""` | Giới thiệu bản thân, tối đa 250 ký tự |
| `role` | String | Có | `'USER'` | Vai trò tài khoản: `'USER'` hoặc `'ADMIN'` |
| `status` | String | Có | `'ACTIVE'` | Trạng thái: `'ACTIVE'` hoặc `'BANNED'` |
| `refreshToken` | String | Không | null | Token duy trì phiên đăng nhập |
| `resetPasswordToken`| String | Không | null | Mã xác thực đặt lại mật khẩu |
| `resetPasswordExpires`| Date | Không | null | Thời gian hết hạn của mã xác thực |

---

## 2. Bảng `places`
| Tên cột (Field) | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả & Ràng buộc |
| :--- | :--- | :---: | :--- | :--- |
| `_id` | ObjectId | Có | Tự sinh | Khóa chính địa điểm quán ăn |
| `name` | String | Có | Không | Tên quán ăn, tối đa 150 ký tự |
| `category` | String | Có | `'RESTAURANT'`| `'RESTAURANT'`, `'CAFE'`, `'STREET_FOOD'`, `'BAKERY'`, `'OTHER'` |
| `address` | String | Có | Không | Địa chỉ thực tế của quán |
| `coverImage` | String | Có | Không | Ảnh bìa hiển thị trên thẻ và popup bản đồ |
| `priceRange.min` | Number | Có | 0 | Giá thấp nhất trong menu ($\ge 0$) |
| `priceRange.max` | Number | Có | 0 | Giá cao nhất trong menu ($\ge 0$) |
| `openingHours.open` | String | Không | `'08:00'` | Giờ mở cửa hàng ngày |
| `openingHours.close`| String | Không | `'22:00'` | Giờ đóng cửa hàng ngày |
| `location.type` | String | Có | `'Point'` | Chuẩn GeoJSON Point |
| `location.coordinates`| Array[2] | Có | Không | Mảng 2 phần tử `[longitude, latitude]` |
| `averageRatings.overall`| Number | Không | 0 | Điểm sao trung bình 4 tiêu chí (1.0 - 5.0) |

---

## 3. [TODO] Các bảng còn lại
> *Mục này sẽ được BE1 (Vương) và BE2 (Dũng) bổ sung chi tiết các trường phụ của `posts`, `reviews`, `comments`, `notifications` và `reports` trong Sprint 2.*

