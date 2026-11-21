import { MOCK_MAP_PLACES } from '@/features/maps/mockPlaces';
import { MenuItem, Place } from '@/types/place.types';
import { Review } from '@/types/review.types';

const img = (id: string) => `https://images.unsplash.com/${id}?w=600&h=400&fit=crop`;

const GALLERY = [
  img('photo-1555396273-367ea4eb4db5'),
  img('photo-1414235077428-338989a2e8c0'),
  img('photo-1504674900247-0877df9cc836'),
  img('photo-1565299624946-b28f40a0ae38'),
];

const MENUS: Record<string, MenuItem[]> = {
  RESTAURANT: [
    { name: 'Suất đặc biệt', price: 55000 },
    { name: 'Suất thường', price: 40000 },
    { name: 'Suất nhỏ', price: 35000 },
    { name: 'Thêm topping', price: 15000 },
    { name: 'Trà đá', price: 5000 },
  ],
  CAFE: [
    { name: 'Cà phê nâu đá', price: 25000 },
    { name: 'Bạc xỉu', price: 30000 },
    { name: 'Trà chanh', price: 15000 },
    { name: 'Trà đào cam sả', price: 35000 },
  ],
  STREET_FOOD: [
    { name: 'Nem chua rán (đĩa)', price: 30000 },
    { name: 'Bánh mì pate', price: 20000 },
    { name: 'Xôi xéo', price: 25000 },
    { name: 'Khoai tây chiên', price: 25000 },
  ],
};

export const INITIAL_PLACES: Place[] = MOCK_MAP_PLACES.map((p, i) => ({
  ...p,
  images: [p.coverImage, ...GALLERY.slice(0, 3 + (i % 2))],
  menu: MENUS[p.category] ?? MENUS.RESTAURANT,
  bookmarksCount: 20 + i * 7,
  createdAt: new Date(Date.now() - (i + 1) * 86400000 * 3).toISOString(),
}));

const AUTHORS = [
  { _id: 'usr_02', username: 'minhanh', fullName: 'Nguyễn Minh Anh', avatarUrl: '' },
  { _id: 'usr_03', username: 'longtran.bk', fullName: 'Trần Hoàng Long', avatarUrl: '' },
  { _id: 'usr_04', username: 'tranglee', fullName: 'Lê Minh Trang', avatarUrl: '' },
];

const SAMPLE_TEXTS = [
  'Đồ ăn ngon, giá hợp lý với sinh viên. Buổi trưa hơi đông nhưng lên món nhanh. Sẽ quay lại!',
  'Phần ăn đầy đặn, chỗ ngồi hơi chật nhưng sạch sẽ, chủ quán vui tính.',
  'Không gian ổn, có chỗ gửi xe máy ngay cổng. Phù hợp đi nhóm.',
];

const SAMPLE_SCORES = [
  { taste: 5, price: 5, hygiene: 5, service: 4 },
  { taste: 5, price: 4, hygiene: 4, service: 5 },
  { taste: 4, price: 5, hygiene: 4, service: 3 },
];

export const INITIAL_REVIEWS: Record<string, Review[]> = Object.fromEntries(
  INITIAL_PLACES.map((p) => [
    p._id,
    AUTHORS.map((author, j) => {
      const s = SAMPLE_SCORES[j];
      return {
        _id: `rv_${p._id}_${j}`,
        placeId: p._id,
        ratings: { ...s, overall: (s.taste + s.price + s.hygiene + s.service) / 4 },
        content: SAMPLE_TEXTS[j],
        images: j === 1 ? [] : GALLERY.slice(j, j + 2),
        author,
        createdAt: new Date(Date.now() - (j + 1) * 3600000 * 20).toISOString(),
      };
    }),
  ])
);
