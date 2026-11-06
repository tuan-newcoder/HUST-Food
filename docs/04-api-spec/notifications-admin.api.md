# 🔔 ĐẶC TẢ API CỤM 4: THÔNG BÁO, BÁO CÁO & QUẢN TRỊ ADMIN (8 APIS)

> **Mã tài liệu:** `API-SPEC-04`  
> **Phụ trách:** BE 2 (Dũng - Code API) | FE 2 (Vũ - Ghép UI)  
> **Phục vụ:** `features/notifications/` và Module Admin Dashboard

---

## Danh mục 8 Endpoints

| Mã CN | Phương thức & URL | Xác thực | Đầu vào (Input: Params / Query / Body) | Đầu ra (Output: HTTP Status & Data) |
| :--- | :--- | :--- | :--- | :--- |
| **F21, F22** | `GET /api/v1/notifications` | Bearer Token | **Query Params:**<br>`?cursor=<notifId>&limit=15` | **HTTP 200 OK:**<br>`data: [ { _id, type: 'YUMMY'\|'COMMENT'\|'REPLY'\|'FOLLOW', sender: { _id, username, fullName, avatarUrl }, post: { _id, title } \| null, isRead: boolean, createdAt } ], meta: { unreadCount: number, nextCursor, hasMore }` |
| **F22** | `PATCH /api/v1/notifications/:id/read` | Bearer Token | **Path Param:** `:id` (notificationId) | **HTTP 200 OK:**<br>`{ notificationId: string, isRead: true, unreadCount: number }` |
| **F22** | `PATCH /api/v1/notifications/read-all` | Bearer Token | **Header:** `Authorization: Bearer <token>` | **HTTP 200 OK:**<br>`{ unreadCount: 0, message: 'Đã đánh dấu đọc tất cả' }` |
| **F20** | `POST /api/v1/reports` | Bearer Token | **Body JSON:**<br>`{ targetType: 'POST' \| 'REVIEW', targetPostId?: string, targetReviewId?: string, reason: 'SPAM' \| 'INAPPROPRIATE' \| 'WRONG_INFO' \| 'OTHER', description?: string }` | **HTTP 201 Created:**<br>`{ report: { _id, reporterId, targetType, reason, status: 'PENDING', createdAt } }` |
| **F23** | `GET /api/v1/admin/stats` | Admin Role | **Header:** `Authorization: Bearer <admin_token>` | **HTTP 200 OK:**<br>`{ totalUsers: number, newUsersThisWeek: number, totalPlaces: number, totalReviews: number, totalPosts: number, pendingReportsCount: number }` |
| **F24** | `GET /api/v1/admin/reports` | Admin Role | **Query Params:**<br>`?status=PENDING\|RESOLVED\|REJECTED&cursor=<id>&limit=20` | **HTTP 200 OK:**<br>`data: [ { _id, targetType, reason, description, status, createdAt, reporter: { _id, username, email }, targetPost: { _id, title } \| null, targetReview: { _id, content, placeId } \| null } ], meta: { nextCursor, hasMore }` |
| **F24** | `PATCH /api/v1/admin/reports/:id` | Admin Role | **Path Param:** `:id`<br>**Body JSON:** `{ action: 'HIDE_TARGET' \| 'REJECT_REPORT' }` | **HTTP 200 OK:**<br>`{ report: { _id, status: 'RESOLVED' \| 'REJECTED', resolvedBy }, targetStatus: 'HIDDEN' \| 'PUBLISHED' }` |
| **F25** | `GET /api/v1/admin/users`<br>`PATCH /api/v1/admin/users/:id/status` | Admin Role | • **GET Query:** `?q=<từ_khóa>&status=ALL\|ACTIVE\|BANNED&cursor=<id>`<br>• **PATCH (:id) Body:** `{ status: 'BANNED' \| 'ACTIVE' }` | • **GET 200:** `data: [ { _id, username, email, fullName, role, status, postsCount, createdAt } ]`<br>• **PATCH 200:** `{ user: { _id, username, status } }` *(Nếu BANNED: tự động xóa refreshToken của user)* |

