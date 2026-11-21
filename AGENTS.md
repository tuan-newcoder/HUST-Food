# 🤖 HƯỚNG DẪN DÀNH CHO AI AGENT & QUY TRÌNH PHÁT TRIỂN UI/UX (HUST-FOOD)

Tài liệu này quy định quy chuẩn làm việc cho AI Coding Agents (Antigravity, Claude Code, Cursor, Codex...) khi tham gia phát triển giao diện người dùng (Frontend) cho dự án **HUST-Food**.

Dự án đã tích hợp hai bộ kỹ năng thiết kế chuyên sâu:
1. **`ui-ux-pro-max`** (Design Intelligence Engine): Tra cứu phong cách, bảng màu, typography, layout blueprint và UX guidelines từ cơ sở dữ liệu tri thức thiết kế cục bộ.
2. **`impeccable`** (Design Director & Slop Killer): Thiết lập ngữ cảnh sản phẩm bền vững (`PRODUCT.md`, `DESIGN.md`), thực thi chuẩn mực hoàn thiện cao cấp, review đánh giá heuristic (`critique`, `audit`), tinh chỉnh thị giác (`bolder`, `polish`, `harden`) và chặn lỗi thiết kế tự động qua Hooks.

---

## 1. Phân định Vai trò (Skill Responsibility Matrix)

| Giai đoạn phát triển | Kỹ năng phụ trách chính | Công cụ / Lệnh sử dụng | Mục tiêu cụ thể |
| :--- | :--- | :--- | :--- |
| **1. Lập kế hoạch & Kiến trúc** | `ui-ux-pro-max` | `python .agents/skills/ui-ux-pro-max/scripts/search.py` | Tra cứu bảng màu chuẩn ẩm thực/review, cặp font chữ tối ưu, quy chuẩn bố cục (Bento Grid, Card layout). |
| **2. Định nghĩa hệ thống** | `impeccable` | `PRODUCT.md`, `/impeccable document` | Ghi nhận sự thật sản phẩm, ràng buộc thương hiệu, tạo và duy trì `DESIGN.md`. |
| **3. Xây dựng Component & Page** | Cả hai | React 18 + TailwindCSS + `craft-floor.md` | Viết code chuẩn theo quy chuẩn `client/src/features/`, đảm bảo zero "AI Slop". |
| **4. Đánh giá Heuristic & UX** | `impeccable` | `/impeccable critique <target>` | Chấm điểm UX theo các nguyên tắc Nielsen Heuristics, xếp hạng các điểm cần cải thiện từ P0 đến P3. |
| **5. Audit Kỹ thuật & a11y** | `impeccable` | `/impeccable audit <target>` | Kiểm tra tương phản màu (WCAG AA), responsive, phím điều hướng, kích thước touch target. |
| **6. Hoàn thiện & Tinh chỉnh** | `impeccable` | `/impeccable polish`, `bolder`, `harden` | Đánh bóng visual rhythm, bổ sung trạng thái rỗng/lỗi, tăng cá tính thị giác hoặc kiểm thử qua `live`. |

---

## 2. Quy trình 4 Bước Phát triển Giao diện Chuẩn (SOP)

Khi nhận nhiệm vụ xây dựng hoặc cải tiến bất kỳ màn hình / component nào, AI Agent **bắt buộc tuân theo 4 bước sau**:

### 📍 Bước 1: Tra cứu Tri thức & Định hình Phong cách (`ui-ux-pro-max`)
Trước khi viết mã giao diện mới, chạy script tìm kiếm của `ui-ux-pro-max` để lấy cảm hứng thiết kế và các thông số chuẩn xác thay vì tự suy đoán bừa bãi:

```bash
# Tra cứu bảng màu theo chủ đề ẩm thực & review
python .agents/skills/ui-ux-pro-max/scripts/search.py "food review" -d color

# Tra cứu cặp font chữ tối ưu hiển thị
python .agents/skills/ui-ux-pro-max/scripts/search.py "modern clean" -d typography

# Tra cứu best practices cho React hoặc UX
python .agents/skills/ui-ux-pro-max/scripts/search.py "card list mobile" -d ux
python .agents/skills/ui-ux-pro-max/scripts/search.py "virtual list modal" -s react
```

* **Quy tắc:** Sử dụng dữ liệu tra cứu được để áp dụng nhất quán vào `tailwind.config.js` hoặc component styling. Không tự ý dùng các màu neon lòe loẹt hoặc gradient tím-xanh rập khuôn ("AI Slop gradient").

---

### 📍 Bước 2: Hiện thực hóa theo Tiêu chuẩn Thủ công (`impeccable`)
Khi code UI, đọc và tuân thủ các nguyên tắc cốt lõi từ `impeccable`:

* **Đọc ngữ cảnh:** Kiểm tra `PRODUCT.md` để đảm bảo UI phục vụ đúng người dùng mục tiêu (cộng đồng ẩm thực, review quán ăn, bản đồ địa điểm).
* **Tuân thủ Craft Floor:**
  * **Hoàn thiện 100%:** Tuyệt đối không để lại code giả dạng `// TODO: add later` hay nút bấm bấm vào không có phản hồi.
  * **Trạng thái đầy đủ:** Mọi màn hình/component có dữ liệu động bắt buộc xử lý đủ 4 trạng thái: `Loading` (Skeleton), `Empty` (Trống), `Error` (Báo lỗi kèm nút thử lại), `Success` (Hiển thị dữ liệu).
  * **Biểu tượng:** Không dùng emoji làm icon giao diện chuyên nghiệp. Bắt buộc dùng thư viện SVG chuẩn của dự án: `lucide-react`.
  * **Tương tác cảm ứng:** Mọi vùng có thể click/tap (Button, Card, Icon) trên mobile phải có kích thước tối thiểu $44 \times 44\text{px}$ và có thuộc tính `cursor-pointer`.

---

### 📍 Bước 3: Rà soát & Đánh giá Chất lượng (`impeccable critique / audit`)
Sau khi viết mã hoặc sửa đổi component/trang, Agent tiến hành kiểm thử chất lượng:

1. **Đánh giá trải nghiệm người dùng (UX Review):**
   ```text
   /impeccable critique client/src/features/posts/components/PostCard.tsx
   ```
   *Kiểm tra tính dễ đọc, phân cấp thị giác (hierarchy), độ rõ ràng của các nút hành động (Yummy/Like, Comment, Share, Bookmark).*

2. **Kiểm tra kỹ thuật & Tiếp cận (Technical Audit):**
   ```text
   /impeccable audit client/src/features/places/pages/PlaceDetailPage.tsx
   ```
   *Kiểm tra độ tương phản màu chữ với nền, tỷ lệ co giãn trên thiết bị di động, thẻ alt của hình ảnh.*

---

### 📍 Bước 4: Tinh chỉnh Chi tiết & Hoàn thiện Cuối cùng
Áp dụng các lệnh tinh chỉnh chuyên biệt của `impeccable` theo tình trạng thực tế:

* **UI quá nhạt nhòa, đơn điệu:** Sử dụng `/impeccable bolder <target>` để tăng độ tương phản, nhấn mạnh các món ăn nổi bật hoặc huy hiệu rating.
* **UI quá rối mắt, thừa chi tiết:** Sử dụng `/impeccable quieter <target>` hoặc `/impeccable distill <target>` để lược bỏ các đường viền thừa, làm dịu nền.
* **Chuẩn bị bàn giao / Đóng gói:** Sử dụng `/impeccable polish <target>` để căn chỉnh lại padding/margin, viền bo tròn, shadow và typography scale.
* **Phòng chống lỗi góc (Edge Cases):** Sử dụng `/impeccable harden <target>` để kiểm tra chữ quá dài gây vỡ layout, tràn ảnh, timeout mạng.

---

## 3. Bảng Màu & Nhận diện Thương hiệu HUST-Food

Mọi thiết kế UI phải tuân thủ bảng màu nhận diện đã định hình trong `PRODUCT.md` và `docs/05-ui-ux/design-system.md`:

| Thành phần UI | Token Tailwind / Hex | Mục đích sử dụng |
| :--- | :--- | :--- |
| **Primary (Đỏ ấm)** | `#E11D48` (`rose-600`) | Nút CTA chính, icon Yummy đã thả, badge số lượng, thanh tab active. |
| **Secondary (Vàng Cam)** | `#F59E0B` (`amber-500`) | Chấm sao đánh giá 4 tiêu chí, huy hiệu quán ăn được đánh giá cao. |
| **Background (Nền sáng)** | `#F8FAFC` (`slate-50`) | Màu nền ứng dụng, sạch sẽ, tôn vinh hình ảnh món ăn thực tế. |
| **Card Surface (Nền thẻ)** | `#FFFFFF` (`white`) | Nền Card bài viết, Modal, Popup bản đồ Leaflet. |
| **Text Primary (Chữ chính)** | `#0F172A` (`slate-900`) | Tiêu đề quán ăn, tên tác giả, tiêu đề bài viết. |
| **Text Muted (Chữ phụ)** | `#64748B` (`slate-500`) | Địa chỉ quán, ngày đăng, lượt tương tác, ghi chú phụ. |
| **Font chữ chính** | `Plus Jakarta Sans`, sans-serif | Hiện đại, thân thiện, dễ đọc ở mọi kích cỡ hiển thị. |

---

## 4. Danh sách Điều cấm kỵ (Anti-Patterns to Avoid)

Khi thiết kế giao diện trong dự án này, Agent **tuyệt đối không được**:
1. ❌ **Lồng thẻ trong thẻ vô tội vạ (Nested Cards):** Không đặt card xám bên trong card trắng bên trong card xám viền bo. Sử dụng khoảng trắng (whitespace) và phân cấp chữ thay vì chia quá nhiều hộp.
2. ❌ **Chữ xám mờ trên nền xám:** Luôn đảm bảo tương phản tối thiểu 4.5:1 cho văn bản thông thường (WCAG AA).
3. ❌ **Cramped Padding:** Không để nội dung dính sát mép thẻ hoặc các nút dính sát nhau. Tối thiểu padding `p-4` (16px) cho thẻ card.
4. ❌ **Gradient tím-xanh rập khuôn ("AI Slop"):** Không lạm dụng gradient tím hồng làm nền hoặc border nếu không có chủ đích thương hiệu ẩm thực rõ ràng.
5. ❌ **Bỏ quên Mobile:** HUST-Food là ứng dụng phục vụ thực khách tìm quán ngay trên điện thoại; luôn kiểm tra khả năng hiển thị ở kích thước viewport $375\text{px} - 430\text{px}$.

---

## 5. Các File Cần Duy trì và Đồng bộ

* `PRODUCT.md`: Ngữ cảnh bền vững của dự án (người dùng, định vị, nguyên tắc). Không tự ý sửa nếu không có yêu cầu thay đổi nghiệp vụ.
* `DESIGN.md`: Tài liệu hệ thống thiết kế trích xuất từ mã nguồn thực tế (tạo qua `/impeccable document`).
* `.agents/hooks.json`: Bộ hook tự động quét mã frontend để báo lỗi slop trước khi hoàn thành công việc.
* `.impeccable/config.json`: Cấu hình quy trình làm việc (`buildPath: code`).
