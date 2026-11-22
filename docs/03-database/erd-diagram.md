# 📊 SƠ ĐỒ QUAN HỆ THỰC THỂ (ERD DIAGRAM)

> **Mã tài liệu:** `DB-ERD-01`  
> **Dự án:** HUST-Food  
> **Công cụ hiển thị:** Mermaid ER Diagram

---

## 1. Sơ đồ Quan hệ Thực thể (Entity-Relationship Diagram)

```mermaid
erDiagram
    USER ||--o{ POST : "tạo (authorId)"
    USER ||--o{ REVIEW : "viết (authorId)"
    USER ||--o{ PLACE : "đóng góp quán (createdBy)"
    USER ||--o{ COMMENT : "viết (authorId)"
    USER ||--o{ REACTION : "thả yummy (userId)"
    USER ||--o{ BOOKMARK : "lưu (userId)"
    USER ||--o{ FOLLOW : "theo dõi (followerId)"
    USER ||--o{ FOLLOW : "được theo dõi (followingId)"
    USER ||--o{ NOTIFICATION : "nhận (recipientId)"
    USER ||--o{ REPORT : "báo cáo (reporterId)"

    PLACE ||--o{ REVIEW : "nhận đánh giá (placeId)"
    PLACE ||--o{ POST : "được gắn thẻ (placeId)"
    PLACE ||--o{ BOOKMARK : "được lưu (placeId)"

    POST ||--o{ COMMENT : "chứa bình luận (postId)"
    POST ||--o{ REACTION : "nhận reaction (postId)"
    POST ||--o{ BOOKMARK : "được lưu (postId)"
    POST ||--o{ REPORT : "bị báo cáo (targetPostId)"

    REVIEW ||--o{ REPORT : "bị báo cáo (targetReviewId)"
    COMMENT ||--o{ COMMENT : "trả lời đệ quy (parentId)"

    USER {
        ObjectId _id PK
        string username UK
        string email UK
        string passwordHash
        string fullName
        string avatarUrl
        string role
        string status
        string refreshToken
        string resetPasswordToken
        date resetPasswordExpires
        number followersCount
        number followingCount
        number postsCount
    }

    PLACE {
        ObjectId _id PK
        string name
        string category
        string address
        string coverImage
        object priceRange
        object openingHours
        array menu
        GeoPoint location
        object averageRatings
        number totalReviews
        number bookmarksCount
        ObjectId createdBy FK
        string status
    }

    REVIEW {
        ObjectId _id PK
        ObjectId placeId FK
        ObjectId authorId FK
        object ratings
        string content
        array images
        string status
    }

    POST {
        ObjectId _id PK
        ObjectId authorId FK
        string postType
        string title
        string content
        array images
        array tags
        ObjectId placeId FK
        object recipeInfo
        object metrics
        string status
    }

    COMMENT {
        ObjectId _id PK
        ObjectId postId FK
        ObjectId authorId FK
        ObjectId parentId FK
        string content
        number repliesCount
    }

    REACTION {
        ObjectId _id PK
        ObjectId postId FK
        ObjectId userId FK
        string type
    }

    BOOKMARK {
        ObjectId _id PK
        ObjectId userId FK
        string targetType
        ObjectId placeId FK
        ObjectId postId FK
    }

    FOLLOW {
        ObjectId _id PK
        ObjectId followerId FK
        ObjectId followingId FK
    }

    NOTIFICATION {
        ObjectId _id PK
        ObjectId recipientId FK
        ObjectId senderId FK
        string type
        ObjectId postId FK
        boolean isRead
    }

    REPORT {
        ObjectId _id PK
        ObjectId reporterId FK
        string targetType
        ObjectId targetPostId FK
        ObjectId targetReviewId FK
        string reason
        string description
        string status
        ObjectId resolvedBy FK
    }
```

---

## 2. Diễn giải các mối quan hệ chính
1. **User $\leftrightarrow$ Place $\leftrightarrow$ Review:**
   * Một `User` có thể tạo nhiều `Place` (đóng góp quán mới).
   * Một `Place` nhận nhiều `Review` từ cộng đồng.
   * Ràng buộc duy nhất: Một cặp `(placeId, authorId)` trong bảng `Review` chỉ được tồn tại **1 lần** duy nhất.
2. **Post $\leftrightarrow$ Place:**
   * Mối quan hệ lỏng (Optional Ref): Bài viết chia sẻ trải nghiệm (`postType: 'EXPERIENCE'`) có thể gắn kèm `placeId` để trỏ tới Quán ăn tương ứng hoặc để trống (`null`).
3. **Comment đệ quy (Parent-Child):**
   * Trường `parentId` trong `Comment` trỏ về chính `_id` của một `Comment` khác (nếu là câu trả lời / Reply). Nếu là bình luận gốc cấp 1 thì `parentId = null`.
4. **Bookmark đa hình (Polymorphic Bookmark):**
   * Trường `targetType` nhận giá trị `'PLACE'` hoặc `'POST'`, kết hợp với `placeId` hoặc `postId` tương ứng.

