# 🌿 QUY TRÌNH LÀM VIỆC VỚI GIT (GIT WORKFLOW)

> **Mã tài liệu:** `PM-GIT-01`  
> **Dự án:** HUST-Food  
> **Căn cứ:** Mục 5 trong [STRUCTURE.md](file:///d:/Hoc/2026.1/Web/HUST-Food/STRUCTURE.md)

---

## 1. Chiến lược Quản lý Nhánh (Branching Strategy)

Dự án áp dụng mô hình biến thể rút gọn của **Git Flow** nhằm tối ưu hóa cho nhóm 4 người:

```text
[main] ────────────────────────────────────────────────────────► (Release / Demo UAT)
   │
   └──► [develop] ─────────────────────────────────────────────► (Nhánh tích hợp chung)
           │
           ├──► [feat/auth-jwt] ─────────────► (Pull Request & Merge)
           ├──► [feat/places-crud] ──────────► (Pull Request & Merge)
           ├──► [feat/map-leaflet] ──────────► (Pull Request & Merge)
           └──► [fix/review-score-calc] ─────► (Pull Request & Merge)
```

1. **Nhánh `main`:**
   * Nhánh production ổn định tuyệt đối.
   * **Quy tắc:** Nghiêm cấm commit hoặc push trực tiếp vào `main`. Chỉ merge từ `develop` khi chuẩn bị nộp bài hoặc demo.
2. **Nhánh `develop`:**
   * Nhánh tích hợp tính năng của cả 4 thành viên.
   * **Quy tắc:** Tất cả tính năng sau khi code và test xong trên local sẽ tạo Pull Request (PR) trỏ vào `develop`. Vương (BE 1) hoặc Tuấn (FE 1) sẽ review code trước khi gộp.
3. **Nhánh tính năng (`feat/*`):**
   * Được tạo nhánh rẽ từ `develop`.
   * Định dạng tên: `feat/<tên-tính-năng-ngắn-gọn>`
   * *Ví dụ:* `feat/auth-jwt`, `feat/place-map`, `feat/recipe-form`, `feat/socket-notification`.
4. **Nhánh sửa lỗi (`fix/*`):**
   * Định dạng tên: `fix/<tên-lỗi>`
   * *Ví dụ:* `fix/rating-calculation`, `fix/avatar-upload-cors`.

---

## 2. Quy tắc Đặt thông điệp Commit (Conventional Commits)

Toàn bộ thành viên bắt buộc tuân theo định dạng:

```text
<loại>: <mô tả ngắn gọn bằng tiếng Việt>
```

| Loại (Type) | Mục đích sử dụng | Ví dụ mẫu |
| :--- | :--- | :--- |
| **`feat`** | Phát triển tính năng mới | `feat: thêm chức năng quét quán ăn theo bán kính geoNear` |
| **`fix`** | Sửa lỗi phát sinh trong mã nguồn | `fix: sửa lỗi tính sai điểm trung bình quán ăn khi xóa review` |
| **`docs`** | Cập nhật tài liệu thiết kế trong thư mục `docs/` | `docs: bổ sung sơ đồ ERD và đặc tả API Cụm 3` |
| **`refactor`** | Tái cấu trúc code (không đổi logic nghiệp vụ) | `refactor: tối ưu hóa truy vấn cursor pagination cho bài viết` |
| **`style`** | Chỉnh sửa định dạng, CSS, khoảng trắng, lint | `style: căn lề lại navbar và chỉnh màu thương hiệu Primary` |
| **`chore`** | Cài đặt package mới, cấu hình build/tooling | `chore: cài đặt react-leaflet và định nghĩa types` |

---

## 3. Các bước Đẩy Code Hàng ngày

```bash
# 1. Chuyển về develop và kéo code mới nhất của cả nhóm
git checkout develop
git pull origin develop

# 2. Tạo nhánh tính năng mới cho mình
git checkout -b feat/place-details

# 3. Thực hiện code và commit thường xuyên
git add .
git commit -m "feat: dựng giao diện trang chi tiết quán ăn PlaceDetail"

# 4. Trước khi đẩy lên, rebase hoặc merge develop để tránh xung đột
git pull origin develop

# 5. Đẩy nhánh lên GitHub và tạo Pull Request (PR)
git push origin feat/place-details
```

