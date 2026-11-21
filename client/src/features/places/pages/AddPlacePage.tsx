import React, { useRef, useState } from 'react';
import { ArrowLeft, Crosshair, ImagePlus, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { toast } from '@/components/feedback/Toast';
import { HUST_COORDINATES } from '@/features/maps/mockPlaces';
import { useAuthStore } from '@/stores/useAuthStore';
import { MenuItem, Place, PlaceCategory } from '@/types/place.types';
import { PlaceMiniMap } from '../components/PlaceMiniMap';
import { usePlaceStore } from '../usePlaceStore';
import { CATEGORY_LABELS } from '../placeUtils';

interface AddPlacePageProps {
  onCancel: () => void;
  onCreated: (placeId: string) => void;
}

type MenuDraft = { name: string; price: string };

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop';
const MAX_IMAGES = 10;

const fieldClass =
  'h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-brand-600';

const toNumber = (v: string) => Number(v.replace(/\D/g, '')) || 0;

const Section: React.FC<{ title: string; children: React.ReactNode; action?: React.ReactNode }> = ({ title, children, action }) => (
  <section className="bg-white dark:bg-[#151D2C] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

export const AddPlacePage: React.FC<AddPlacePageProps> = ({ onCancel, onCreated }) => {
  const addPlace = usePlaceStore((s) => s.addPlace);
  const { user } = useAuthStore();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<PlaceCategory>('RESTAURANT');
  const [address, setAddress] = useState('');
  const [position, setPosition] = useState<[number, number]>(HUST_COORDINATES);
  const [open, setOpen] = useState('07:00');
  const [close, setClose] = useState('22:00');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [menu, setMenu] = useState<MenuDraft[]>([{ name: '', price: '' }]);
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const updateMenu = (i: number, field: keyof MenuDraft, value: string) =>
    setMenu((m) => m.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.warning('Trình duyệt không hỗ trợ định vị');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      () => toast.warning('Không lấy được vị trí, hãy ghim thủ công trên bản đồ')
    );
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const room = MAX_IMAGES - images.length;
    // Xem trước cục bộ; khi có API dùng postService.uploadImages để lấy URL Cloudinary
    setImages((prev) => [...prev, ...Array.from(files).slice(0, room).map((f) => URL.createObjectURL(f))]);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 3) e.name = 'Tên quán tối thiểu 3 ký tự';
    if (address.trim().length < 5) e.address = 'Vui lòng nhập địa chỉ cụ thể';
    const min = toNumber(minPrice);
    const max = toNumber(maxPrice);
    if (!min || !max) e.price = 'Nhập khoảng giá tham khảo';
    else if (min > max) e.price = 'Giá thấp nhất phải nhỏ hơn giá cao nhất';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      toast.warning('Vui lòng kiểm tra lại các trường bắt buộc');
      return;
    }
    const cleanMenu: MenuItem[] = menu
      .filter((m) => m.name.trim())
      .map((m) => ({ name: m.name.trim(), price: toNumber(m.price) }));

    // Payload khớp với POST /api/v1/places (placeService.createPlace) khi Backend sẵn sàng
    const place: Place = {
      _id: `place_${Date.now()}`,
      name: name.trim(),
      category,
      address: address.trim(),
      coverImage: images[0] ?? FALLBACK_COVER,
      images: images.length ? images : [FALLBACK_COVER],
      priceRange: { min: toNumber(minPrice), max: toNumber(maxPrice) },
      openingHours: { open, close },
      menu: cleanMenu,
      location: { type: 'Point', coordinates: [position[1], position[0]] },
      averageRatings: { taste: 0, price: 0, hygiene: 0, service: 0, overall: 0 },
      totalReviews: 0,
      bookmarksCount: 0,
      authorId: user?._id,
      createdAt: new Date().toISOString(),
    };
    addPlace(place);
    toast.success('Cảm ơn bạn đã đóng góp quán mới!');
    onCreated(place._id);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex flex-col gap-5" noValidate>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          aria-label="Quay lại danh bạ quán"
          className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Đóng góp quán mới</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Các mục có dấu * là bắt buộc</p>
        </div>
      </div>

      <Section title="1. Thông tin cơ bản">
        <Input label="Tên quán *" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} placeholder="VD: Bún Cá Cay Gia Truyền – Tạ Quang Bửu" />
        <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Danh mục *
            <select value={category} onChange={(e) => setCategory(e.target.value as PlaceCategory)} className={fieldClass}>
              {(['RESTAURANT', 'CAFE', 'STREET_FOOD', 'BAKERY', 'OTHER'] as PlaceCategory[]).map((c) => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
              ))}
            </select>
          </label>
          <Input label="Địa chỉ *" value={address} onChange={(e) => setAddress(e.target.value)} error={errors.address} placeholder="Số nhà, ngõ, phố…" />
        </div>
      </Section>

      <Section
        title="2. Ghim vị trí trên bản đồ"
        action={
          <Button type="button" variant="outline" size="sm" onClick={handleUseMyLocation} leftIcon={<Crosshair className="w-4 h-4" />}>
            Dùng vị trí hiện tại
          </Button>
        }
      >
        <div className="relative rounded-2xl overflow-hidden">
          <PlaceMiniMap position={position} onChange={setPosition} zoom={16} className="h-72 w-full z-0" />
          <span className="absolute left-3 bottom-3 z-[400] px-2.5 py-1.5 rounded-lg bg-white/95 dark:bg-slate-900/90 text-xs text-slate-700 dark:text-slate-200 shadow">
            Bấm vào bản đồ hoặc kéo ghim để chọn vị trí chính xác
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Tọa độ: {position[0].toFixed(5)}, {position[1].toFixed(5)}
        </p>
      </Section>

      <Section title="3. Giờ mở cửa & Khoảng giá">
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Mở cửa
            <input type="time" value={open} onChange={(e) => setOpen(e.target.value)} className={fieldClass} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Đóng cửa
            <input type="time" value={close} onChange={(e) => setClose(e.target.value)} className={fieldClass} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Giá thấp nhất *
            <input inputMode="numeric" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="25.000" className={fieldClass} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Giá cao nhất *
            <input inputMode="numeric" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="70.000" className={fieldClass} />
          </label>
        </div>
        {errors.price && <p className="text-xs font-medium text-red-600">{errors.price}</p>}
      </Section>

      <Section title="4. Thực đơn (không bắt buộc)">
        {menu.map((row, i) => (
          <div key={i} className="flex gap-2.5 items-center">
            <input aria-label={`Tên món ${i + 1}`} value={row.name} onChange={(e) => updateMenu(i, 'name', e.target.value)} placeholder="Tên món" className={`${fieldClass} flex-[2] min-w-0`} />
            <input aria-label={`Giá món ${i + 1}`} inputMode="numeric" value={row.price} onChange={(e) => updateMenu(i, 'price', e.target.value)} placeholder="Giá (đ)" className={`${fieldClass} flex-1 min-w-0`} />
            <button
              type="button"
              aria-label={`Xóa món ${i + 1}`}
              onClick={() => setMenu((m) => (m.length > 1 ? m.filter((_, idx) => idx !== i) : [{ name: '', price: '' }]))}
              className="w-11 h-11 shrink-0 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="self-start" onClick={() => setMenu((m) => [...m, { name: '', price: '' }])} leftIcon={<Plus className="w-4 h-4" />}>
          Thêm món
        </Button>
      </Section>

      <Section title="5. Ảnh quán (không bắt buộc)">
        <div className="flex flex-wrap gap-3">
          {images.map((src, i) => (
            <div key={src} className="relative w-24 h-24">
              <img src={src} alt={`Ảnh quán ${i + 1}`} className="w-full h-full rounded-xl object-cover" />
              {i === 0 && <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-bold">Ảnh bìa</span>}
              <button
                type="button"
                aria-label={`Xóa ảnh ${i + 1}`}
                onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-900 text-white border-2 border-white flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {images.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-brand-500 hover:text-brand-600 flex flex-col items-center justify-center gap-1 text-xs font-semibold"
            >
              <ImagePlus className="w-6 h-6" /> Chọn ảnh
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} />
        </div>
      </Section>

      <div className="flex justify-end gap-3 pb-6">
        <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
        <Button type="submit">Gửi đóng góp</Button>
      </div>
    </form>
  );
};
