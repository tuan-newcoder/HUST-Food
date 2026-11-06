# 📍 ĐẶC TẢ API CỤM 3: QUÁN ĂN, ĐÁNH GIÁ 4 TIÊU CHÍ & BẢN ĐỒ (10 APIS)

> **Mã tài liệu:** `API-SPEC-03`  
> **Phụ trách:** BE 2 (Dũng - Code API) | FE 2 (Vũ - Ghép UI)  
> **Phục vụ:** `features/places/`, `features/reviews/` và `features/maps/`

---

## Danh mục 10 Endpoints

| Mã CN | Phương thức & URL | Xác thực | Đầu vào (Input: Params / Query / Body) | Đầu ra (Output: HTTP Status & Data) |
| :--- | :--- | :--- | :--- | :--- |
| **F06** | `GET /api/v1/places` | Optional Auth | **Query Params:**<br>`?q=<từ_khóa>&category=ALL\|RESTAURANT\|CAFE\|STREET_FOOD\|BAKERY&maxPrice=100000&minRating=3.5&sortBy=rating\|reviews\|newest&cursor=<id>&limit=12` | **HTTP 200 OK:**<br>`data: [ { _id, name, category, address, coverImage, priceRange, openingHours, averageRatings, totalReviews, isBookmarked } ], meta: { nextCursor, hasMore }` |
| **F11, F12, F13** | `GET /api/v1/places/nearby` | Public | **Query Params:**<br>`?lat=21.0285&lng=105.8542&radius=1500 (500–5000m)&category=ALL...&maxPrice=100000&minRating=3.0&limit=50` | **HTTP 200 OK:**<br>`data: [ { _id, name, category, address, coverImage, priceRange, openingHours, location, averageRatings, totalReviews, distanceMeters: number } ]` |
| **F07** | `GET /api/v1/places/:id` | Optional Auth | **Path Param:** `:id` (placeId) | **HTTP 200 OK:**<br>`{ place: { _id, name, category, address, coverImage, images, priceRange, openingHours, menu: [{ name, price, imageUrl }], location, averageRatings, totalReviews, bookmarksCount, isBookmarked, myReview: ReviewItem \| null, createdAt } }`<br>*Lỗi: 404 (Không tìm thấy)* |
| **F08** | `POST /api/v1/places` | Bearer Token | **Body JSON:**<br>`{ name: string, category: string, address: string, coverImage: string, images?: string[], priceRange: { min, max }, openingHours?: { open, close }, menu?: [{ name, price, imageUrl }], location: { type: 'Point', coordinates: [lng, lat] } }` | **HTTP 201 Created:**<br>`{ place: { _id, name, category, address, coverImage, priceRange, openingHours, menu, location, averageRatings, totalReviews: 0, createdAt } }` |
| **F08** | `PUT /api/v1/places/:id` | Bearer Token | **Path Param:** `:id`<br>**Body JSON:** `{ name?, category?, address?, coverImage?, images?, priceRange?, openingHours?, menu?, location? }` | **HTTP 200 OK:**<br>`{ place: { ...thông tin quán cập nhật } }`<br>*Lỗi: 403 (Không có quyền sửa)* |
| **F08, F24** | `DELETE /api/v1/places/:id` | Admin Role | **Path Param:** `:id` | **HTTP 200 OK:**<br>`{ deletedPlaceId: string }` |
| **F10** | `GET /api/v1/places/:id/reviews` | Public | **Path Param:** `:id`<br>**Query:** `?star=ALL\|5\|4\|3\|2\|1&hasImages=true\|false&cursor=<id>&limit=10` | **HTTP 200 OK:**<br>`data: [ { _id, placeId, ratings: { taste, price, hygiene, service, overall }, content, images, author: { _id, username, fullName, avatarUrl }, createdAt } ], meta: { nextCursor, hasMore }` |
| **F09** | `POST /api/v1/places/:id/reviews` | Bearer Token | **Path Param:** `:id` (placeId)<br>**Body JSON:**<br>`{ ratings: { taste: 1..5, price: 1..5, hygiene: 1..5, service: 1..5 }, content: string (10-2000 ký tự), images?: string[] }` | **HTTP 201 Created:**<br>`{ review: { _id, placeId, author, ratings, content, images, createdAt }, updatedPlaceStats: { averageRatings, totalReviews } }`<br>*Lỗi: 400 (DUPLICATE_REVIEW - Đã đánh giá quán này rồi)* |
| **F10** | `PUT /api/v1/reviews/:id` | Bearer Token | **Path Param:** `:id`<br>**Body JSON:** `{ ratings?: { taste, price, hygiene, service }, content?: string, images?: string[] }` | **HTTP 200 OK:**<br>`{ review: { ...đánh giá đã sửa }, updatedPlaceStats: { averageRatings, totalReviews } }`<br>*Lỗi: 403 (Không phải tác giả)* |
| **F10** | `DELETE /api/v1/reviews/:id` | Bearer Token | **Path Param:** `:id` | **HTTP 200 OK:**<br>`{ deletedReviewId: string, updatedPlaceStats: { averageRatings, totalReviews } }`<br>*Lỗi: 403 (Không phải tác giả hoặc Admin)* |

