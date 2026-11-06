# 📝 ĐẶC TẢ API CỤM 2: BẢNG TIN, BÀI VIẾT, CÔNG THỨC & BÌNH LUẬN (10 APIS)

> **Mã tài liệu:** `API-SPEC-02`  
> **Phụ trách:** BE 1 (Vương - Code API) | FE 1 (Tuấn - Ghép UI)  
> **Phục vụ:** `features/posts/`

---

## Danh mục 10 Endpoints

| Mã CN | Phương thức & URL | Xác thực | Đầu vào (Input: Params / Query / Body) | Đầu ra (Output: HTTP Status & Data) |
| :--- | :--- | :--- | :--- | :--- |
| **F08, F15** | `POST /api/v1/upload/images` | Bearer Token | **Content-Type:** `multipart/form-data`<br>**Field:** `images` (Tối đa 5 files `.jpg`, `.png`, `.webp`; mỗi file $\le 5\text{MB}$) | **HTTP 200 OK:**<br>`{ urls: [ 'https://res.cloudinary.com/.../img1.jpg', ... ] }`<br>*Lỗi: 400 (Quá dung lượng hoặc sai định dạng)* |
| **F14** | `GET /api/v1/posts/feed` | Optional Auth | **Query Params:**<br>`?postType=ALL\|EXPERIENCE\|RECIPE&cursor=<id>&limit=10` | **HTTP 200 OK:**<br>`data: [ { _id, postType, title, content, images, tags, author, place: { _id, name, address, averageRatings } \| null, recipeInfo, metrics, isYummied, isBookmarked, createdAt } ], meta: { nextCursor, hasMore }` |
| **F15** | `POST /api/v1/posts` | Bearer Token | **Body JSON:**<br>`{ postType: 'EXPERIENCE' \| 'RECIPE', title: string, content: string, images: string[], tags: string[], placeId?: string \| null, recipeInfo?: { cookingTimeMinutes, estimatedCost, servings, difficulty, ingredients: [{name, amount}], steps: [{stepNumber, instruction, imageUrl}] } }` | **HTTP 201 Created:**<br>`{ post: { _id, authorId, postType, title, content, images, tags, placeId, recipeInfo, metrics, status: 'PUBLISHED', createdAt } }` |
| **F14, F15** | `GET /api/v1/posts/:id` | Optional Auth | **Path Param:** `:id` (postId) | **HTTP 200 OK:**<br>`{ post: { _id, postType, title, content, images, tags, author, place, recipeInfo, metrics, isYummied, isBookmarked, createdAt } }`<br>*Lỗi: 404 (Không tồn tại bài viết)* |
| **F17** | `PUT /api/v1/posts/:id` | Bearer Token | **Path Param:** `:id`<br>**Body JSON:** `{ title?, content?, images?, tags?, placeId?, recipeInfo? }` | **HTTP 200 OK:**<br>`{ post: { ...thông tin bài viết đã cập nhật } }`<br>*Lỗi: 403 (Không phải tác giả)* |
| **F17** | `DELETE /api/v1/posts/:id` | Bearer Token | **Path Param:** `:id` | **HTTP 200 OK:**<br>`{ deletedPostId: string }`<br>*Lỗi: 403 (Không phải tác giả)* |
| **F16** | `GET /api/v1/posts/search` | Optional Auth | **Query Params:**<br>`?q=<từ_khóa>&postType=ALL\|EXPERIENCE\|RECIPE&difficulty=EASY\|MEDIUM\|HARD&tag=<tag>&cursor=<id>&limit=10` | **HTTP 200 OK:**<br>`data: [ PostItem ], meta: { nextCursor, hasMore }` |
| **F16** | `GET /api/v1/posts/tags/trending` | Public | **Query:** `?limit=10` | **HTTP 200 OK:**<br>`data: [ { tag: 'an-sang', postsCount: 42 }, { tag: 'bun-cha', postsCount: 35 } ]` |
| **F18** | `POST /api/v1/posts/:id/yummy` | Bearer Token | **Path Param:** `:id` (postId) | **HTTP 200 OK:**<br>`{ postId: string, isYummied: boolean, yummyCount: number }` *(Bắn Socket YUMMY)* |
| **F19** | `GET /api/v1/posts/:id/comments`<br>`POST /api/v1/posts/:id/comments`<br>`DELETE /api/v1/comments/:id` | Public / Bearer | • **GET Query:** `?parentId=<null\|commentId>&cursor=<id>&limit=10`<br>• **POST Body:** `{ content: string, parentId?: string \| null }`<br>• **DELETE Param:** `:id` (commentId) | • **GET 200:** `data: [ CommentItem ], meta: { nextCursor, hasMore }`<br>• **POST 201:** `{ comment, postCommentsCount }` *(Bắn Socket COMMENT/REPLY)*<br>• **DELETE 200:** `{ deletedCommentId, postCommentsCount }` |

