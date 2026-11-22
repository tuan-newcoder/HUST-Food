import { OpeningHours, PlaceCategory, PriceRange } from '@/types/place.types';
import { ReviewRatingsInput } from '@/types/review.types';

export const CATEGORY_LABELS: Record<PlaceCategory, string> = {
  RESTAURANT: 'Nhà hàng',
  CAFE: 'Quán cà phê',
  STREET_FOOD: 'Quán ăn vặt',
  BAKERY: 'Tiệm bánh',
  OTHER: 'Khác',
};

export const CRITERIA: { key: keyof ReviewRatingsInput; label: string }[] = [
  { key: 'taste', label: 'Hương vị' },
  { key: 'price', label: 'Giá cả' },
  { key: 'hygiene', label: 'Vệ sinh' },
  { key: 'service', label: 'Phục vụ' },
];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + (m || 0);
};

/** Kiểm tra quán có đang mở cửa không (hỗ trợ quán mở qua nửa đêm, VD 06:00 – 02:00) */
export function isOpenNow(hours?: OpeningHours, now: Date = new Date()): boolean {
  if (!hours) return false;
  const current = now.getHours() * 60 + now.getMinutes();
  const open = toMinutes(hours.open);
  const close = toMinutes(hours.close);
  if (open === close) return true;
  return open < close ? current >= open && current < close : current >= open || current < close;
}

const shortVnd = (n: number) => n.toLocaleString('vi-VN') + 'đ';

export function formatPriceRange(range: PriceRange): string {
  return `${shortVnd(range.min)} – ${shortVnd(range.max)}`;
}

export function computeOverall(r: ReviewRatingsInput): number {
  return Math.round(((r.taste + r.price + r.hygiene + r.service) / 4) * 10) / 10;
}
