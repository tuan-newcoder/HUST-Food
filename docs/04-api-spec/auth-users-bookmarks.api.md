# 🔐 ĐẶC TẢ API CỤM 1: XÁC THỰC, HỒ SƠ & BOOKMARKS (14 APIS)

> **Mã tài liệu:** `API-SPEC-01`  
> **Phụ trách:** BE 1 (Vương - Code API) | FE 1 (Tuấn - Ghép UI)  
> **Phục vụ:** `features/auth/` và `features/profiles/`

---

## Danh mục 14 Endpoints

| Mã CN | Phương thức & URL | Xác thực | Đầu vào (Input: Params / Query / Body) | Đầu ra (Output: HTTP Status & Data) |
| :--- | :--- | :--- | :--- | :--- |
| **F01** | `POST /api/v1/auth/register` | Public | **Body JSON:**<br>`{ username: string, email: string, password: string, fullName: string }` | **HTTP 201 Created:**<br>`{ user: { _id, username, email, fullName, avatarUrl, role: 'USER' }, accessToken: string (15m), refreshToken: string (7d) }`<br>*Lỗi: 400 (Trùng email/username)* |
| **F01** | `POST /api/v1/auth/login` | Public | **Body JSON:**<br>`{ emailOrUsername: string, password: string }` | **HTTP 200 OK:**<br>`{ user: { _id, username, email, fullName, avatarUrl, role, status }, accessToken: string, refreshToken: string }`<br>*Lỗi: 401 (Sai MK), 403 (Tài khoản BANNED)* |
| **F01** | `POST /api/v1/auth/refresh` | Public | **Body JSON:**<br>`{ refreshToken: string }` | **HTTP 200 OK:**<br>`{ accessToken: string, refreshToken: string }`<br>*Lỗi: 401 (Token hết hạn/không hợp lệ)* |
| **F01** | `POST /api/v1/auth/logout` | Bearer Token | **Header:** `Authorization: Bearer <token>` | **HTTP 200 OK:**<br>`{ loggedOut: true }` (Thu hồi refreshToken trong DB) |
| **F02** | `POST /api/v1/auth/forgot-password` | Public | **Body JSON:**<br>`{ email: string }` | **HTTP 200 OK:**<br>`{ message: 'Đã gửi mã khôi phục mật khẩu tới email' }` (Gửi qua Nodemailer) |
| **F02** | `POST /api/v1/auth/reset-password` | Public | **Body JSON:**<br>`{ token: string, newPassword: string }` | **HTTP 200 OK:**<br>`{ resetSuccess: true }`<br>*Lỗi: 400 (Mã sai hoặc hết hạn)* |
| **F03** | `GET /api/v1/users/me` | Bearer Token | **Header:** `Authorization: Bearer <token>` | **HTTP 200 OK:**<br>`{ user: { _id, username, email, fullName, avatarUrl, bio, role, followersCount, followingCount, postsCount, createdAt } }` |
| **F03** | `PUT /api/v1/users/me` | Bearer Token | **Body JSON:**<br>`{ fullName?: string, avatarUrl?: string, bio?: string (<=250 ký tự) }` | **HTTP 200 OK:**<br>`{ user: { _id, username, fullName, avatarUrl, bio, updatedAt } }` |
| **F03** | `GET /api/v1/users/:username` | Optional Auth | **Path Param:** `:username` | **HTTP 200 OK:**<br>`{ user: { _id, username, fullName, avatarUrl, bio, followersCount, followingCount, postsCount, isFollowing: boolean } }`<br>*Lỗi: 404 (Không tìm thấy user)* |
| **F03** | `GET /api/v1/users/:username/posts` | Optional Auth | **Path Param:** `:username`<br>**Query:** `?postType=ALL\|EXPERIENCE\|RECIPE&cursor=<id>&limit=10` | **HTTP 200 OK:**<br>`data: [ PostItem ], meta: { nextCursor: string \| null, hasMore: boolean }` |
| **F04** | `POST /api/v1/users/:id/follow` | Bearer Token | **Path Param:** `:id` (targetUserId) | **HTTP 200 OK:**<br>`{ targetUserId: string, isFollowing: boolean, followersCount: number }` *(Bắn Socket FOLLOW nếu isFollowing = true)* |
| **F04** | `GET /api/v1/users/:id/followers` | Public | **Path Param:** `:id`<br>**Query:** `?cursor=<followId>&limit=20` | **HTTP 200 OK:**<br>`data: [ { _id, username, fullName, avatarUrl, bio } ], meta: { nextCursor, hasMore }` |
| **F04** | `GET /api/v1/users/:id/following` | Public | **Path Param:** `:id`<br>**Query:** `?cursor=<followId>&limit=20` | **HTTP 200 OK:**<br>`data: [ { _id, username, fullName, avatarUrl, bio } ], meta: { nextCursor, hasMore }` |
| **F05** | `POST /api/v1/bookmarks/toggle` | Bearer Token | **Body JSON:**<br>`{ targetType: 'PLACE' \| 'POST', targetId: string }` | **HTTP 200 OK:**<br>`{ targetType: 'PLACE' \| 'POST', targetId: string, isBookmarked: boolean }` |
| **F05** | `GET /api/v1/bookmarks` | Bearer Token | **Query:** `?type=PLACE\|POST&cursor=<id>&limit=12` | **HTTP 200 OK:**<br>`data: [ PlaceItem | PostItem ], meta: { nextCursor, hasMore }` |

