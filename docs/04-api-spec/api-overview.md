# 🌐 TỔNG QUAN ĐẶC TẢ HỆ THỐNG API (API SPECIFICATION OVERVIEW)

> **Mã tài liệu:** `API-SPEC-00`  
> **Dự án:** HUST-Food  
> **Phiên bản:** v2.0  
> **Giao thức:** RESTful over HTTPS | Định dạng trao đổi: JSON  
> **Quy ước:** 
> * Backend (BE1, BE2) code logic trên Server.
> * Frontend (FE1, FE2) dựa vào cột Input để gửi qua Axios và cột Output để định nghĩa TypeScript Interfaces (`client/src/types/`).

---

## 1. Cấu hình Đường dẫn Gốc (Base URL)

* **Môi trường phát triển cục bộ (Local):** `http://localhost:5000/api/v1`
* **Môi trường Cloud (Production):** `https://api.hustfood.live/api/v1` `[TODO]`

---

## 2. Tiêu chuẩn Khuôn mẫu Phản hồi JSON (Standard Response Wrapper)

Mọi API trả về khi **Thành công (HTTP 200, 201)** đều tuân theo khuôn mẫu:

```json
{
  "success": true,
  "message": "Mô tả trạng thái thành công (ví dụ: 'Đăng bài viết thành công')",
  "data": { ... } | [ ... ],
  "meta": {
    "nextCursor": "67165f8e2b9a1c0012345678",
    "hasMore": true
  }
}
```
*Trường `meta` chỉ xuất hiện ở các API trả về danh sách có phân trang dạng con trỏ (Cursor Pagination).*

Khi xảy ra **Lỗi (HTTP 400, 401, 403, 404, 429, 500)**:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN_BANNED | NOT_FOUND | DUPLICATE_REVIEW",
    "message": "Thông báo thân thiện để hiển thị Toast lên giao diện",
    "details": [
      "username: Tên tài khoản phải từ 3 đến 30 ký tự",
      "password: Mật khẩu phải có tối thiểu 6 ký tự"
    ]
  }
}
```

---

## 3. Quy chuẩn Header Xác thực (Authorization Header)

Các API yêu cầu đăng nhập (được đánh dấu **Bearer Token**) bắt buộc phải đính kèm Header:

```http
Authorization: Bearer <accessToken>
```

Axios Interceptor ở Client sẽ tự động chèn header này vào mọi request sau khi người dùng đăng nhập.

---

## 4. Bảng Phân bổ 42 APIs theo 4 Cụm Chuyên biệt

| Cụm | Tài liệu đặc tả | Số lượng | Người code API | Người ghép UI |
| :--- | :--- | :---: | :---: | :---: |
| **Cụm 1** | [auth-users-bookmarks.api.md](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/04-api-spec/auth-users-bookmarks.api.md) | 14 APIs | BE 1 (Vương) | FE 1 (Tuấn) |
| **Cụm 2** | [posts-comments.api.md](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/04-api-spec/posts-comments.api.md) | 10 APIs | BE 1 (Vương) | FE 1 (Tuấn) |
| **Cụm 3** | [places-reviews-maps.api.md](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/04-api-spec/places-reviews-maps.api.md) | 10 APIs | BE 2 (Dũng) | FE 2 (Vũ) |
| **Cụm 4** | [notifications-admin.api.md](file:///d:/Hoc/2026.1/Web/HUST-Food/docs/04-api-spec/notifications-admin.api.md) | 8 APIs | BE 2 (Dũng) | FE 2 (Vũ) |

