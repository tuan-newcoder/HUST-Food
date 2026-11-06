# 📐 QUY CHUẨN ĐẶT TÊN MÃ NGUỒN (NAMING CONVENTIONS)

> **Mã tài liệu:** `ARCH-CONV-01`  
> **Dự án:** HUST-Food  
> **Căn cứ:** Đồng bộ 100% với [STRUCTURE.md](file:///d:/Hoc/2026.1/Web/HUST-Food/STRUCTURE.md)

---

## 1. Bảng Quy ước Đặt tên Chung Toàn Dự án

Để 4 thành viên viết code đồng bộ, dễ đọc và tránh xung đột khi merge code, nhóm áp dụng các quy chuẩn sau:

| Đối tượng | Quy ước chuẩn | Ví dụ thực tế trong HUST-Food |
| :--- | :--- | :--- |
| **Thư mục (Folders)** | `kebab-case` hoặc `camelCase` (nhất quán) | `client/src/features/places`, `client/src/components/common`, `server/src/controllers` |
| **Component React** | `PascalCase` kèm đuôi `.tsx` | `PostCard.tsx`, `PlaceDetail.tsx`, `RadiusSlider.tsx`, `ReviewFormModal.tsx` |
| **Custom Hooks** | `camelCase` bắt đầu bằng `use` kèm `.ts` | `useAuth.ts`, `usePlaceFilter.ts`, `useDebounce.ts`, `useSocket.ts` |
| **Zustand Stores** | `camelCase` bắt đầu bằng `use...Store` | `useAuthStore.ts`, `useNotificationStore.ts`, `useMapStore.ts` |
| **File Controller / Service** | `camelCase` kèm hậu tố vai trò (`.ts`) | `place.controller.ts`, `place.service.ts`, `review.service.ts`, `auth.controller.ts` |
| **Route File** | `camelCase` kèm hậu tố `.route.ts` | `auth.route.ts`, `place.route.ts`, `post.route.ts`, `admin.route.ts` |
| **Middleware File** | `camelCase` kèm hậu tố `.middleware.ts` | `auth.middleware.ts`, `role.middleware.ts`, `validate.middleware.ts` |
| **Model / Entity Mongoose** | `PascalCase` kèm đuôi `.ts` | `User.ts`, `Place.ts`, `Review.ts`, `Post.ts`, `Comment.ts`, `Bookmark.ts` |
| **Type / Interface TypeScript** | `PascalCase` (File đặt `*.types.ts`) | `interface IPlace`, `interface IUser`, `type PostType = 'EXPERIENCE' \| 'RECIPE'` |
| **Hàm & Biến nghiệp vụ** | `camelCase` | `getUserProfile()`, `recalculatePlaceRatings()`, `totalReviews`, `isYummied` |
| **Hằng số hệ thống (Constants)** | `UPPER_SNAKE_CASE` | `MAX_IMAGE_COUNT`, `DEFAULT_PAGE_SIZE`, `JWT_EXPIRES_IN`, `HTTP_STATUS` |

---

## 2. Quy tắc Nhập Xuất (Import / Export)
* **Components UI:** Ưu tiên sử dụng `export default` hoặc named export thống nhất theo file `index.ts` của từng thư mục component để đường dẫn import ngắn gọn.
* **Services Backend:** Export các hàm xử lý logic nghiệp vụ riêng lẻ hoặc đóng gói vào một service object rõ ràng:
  ```typescript
  // server/src/services/place.service.ts
  export const placeService = {
    getNearbyPlaces,
    getPlaceById,
    createPlace,
    updatePlace,
  };
  ```

