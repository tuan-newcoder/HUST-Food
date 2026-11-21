import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { StarRating } from '@/components/common/StarRating';
import { toast } from '@/components/feedback/Toast';
import { Review, ReviewPayload, ReviewRatingsInput } from '@/types/review.types';
import { CRITERIA, computeOverall } from '@/features/places/placeUtils';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeName: string;
  initialReview?: Review | null;
  onSubmit: (payload: ReviewPayload) => void;
}

const WORDS = ['', 'Tệ', 'Tạm', 'Ổn', 'Ngon', 'Tuyệt vời'];
const MIN_LEN = 10;
const MAX_LEN = 2000;
const MAX_IMAGES = 5;
const DEFAULT_RATINGS: ReviewRatingsInput = { taste: 0, price: 0, hygiene: 0, service: 0 };

export const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  isOpen,
  onClose,
  placeName,
  initialReview,
  onSubmit,
}) => {
  const [ratings, setRatings] = useState<ReviewRatingsInput>(DEFAULT_RATINGS);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  // Nạp lại dữ liệu mỗi lần mở (tạo mới hoặc chỉnh sửa)
  useEffect(() => {
    if (!isOpen) return;
    if (initialReview) {
      const { taste, price, hygiene, service } = initialReview.ratings;
      setRatings({ taste, price, hygiene, service });
      setContent(initialReview.content);
      setImages(initialReview.images);
    } else {
      setRatings(DEFAULT_RATINGS);
      setContent('');
      setImages([]);
    }
  }, [isOpen, initialReview]);

  const allRated = CRITERIA.every(({ key }) => ratings[key] > 0);
  const contentLen = content.trim().length;
  const canSubmit = allRated && contentLen >= MIN_LEN && contentLen <= MAX_LEN;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const room = MAX_IMAGES - images.length;
    if (files.length > room) toast.warning(`Chỉ được đính kèm tối đa ${MAX_IMAGES} ảnh`);
    // Xem trước cục bộ; khi có API dùng postService.uploadImages để lấy URL Cloudinary
    const urls = Array.from(files).slice(0, room).map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...urls]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allRated) {
      toast.warning('Vui lòng chấm đủ 4 tiêu chí');
      return;
    }
    if (contentLen < MIN_LEN) {
      toast.warning(`Nhận xét cần tối thiểu ${MIN_LEN} ký tự`);
      return;
    }
    onSubmit({ ratings, content: content.trim(), images });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialReview ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá'}
      description={placeName}
      maxWidth="xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" form="review-form" disabled={!canSubmit}>
            {initialReview ? 'Lưu thay đổi' : 'Gửi đánh giá'}
          </Button>
        </>
      }
    >
      <form id="review-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
          <span className="text-sm font-semibold text-amber-900 dark:text-amber-200">
            Điểm tổng (trung bình 4 tiêu chí)
          </span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {allRated ? computeOverall(ratings).toFixed(1) : '–'}
            <span className="text-sm text-amber-800 dark:text-amber-300"> / 5</span>
          </span>
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-bold text-slate-900 dark:text-white mb-2">Chấm điểm 4 tiêu chí</legend>
          {CRITERIA.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3 min-h-[44px]">
              <span className="w-24 text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
              <StarRating
                value={ratings[key]}
                size="lg"
                readonly={false}
                onChange={(v) => setRatings((r) => ({ ...r, [key]: v }))}
                className="[&_button]:p-1"
              />
              <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
                {ratings[key] ? `${ratings[key]}/5 · ${WORDS[ratings[key]]}` : 'Chưa chấm'}
              </span>
            </div>
          ))}
        </fieldset>

        <label className="flex flex-col gap-2 text-sm font-bold text-slate-900 dark:text-white">
          Nhận xét của bạn
          <textarea
            rows={5}
            value={content}
            maxLength={MAX_LEN}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Món nào ngon? Không gian, giá cả, phục vụ thế nào?"
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-normal leading-relaxed text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-brand-600 resize-y"
          />
          <span
            className={`self-end text-xs font-normal ${
              contentLen > 0 && contentLen < MIN_LEN ? 'text-red-600' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {contentLen} / {MAX_LEN} {contentLen > 0 && contentLen < MIN_LEN && `· tối thiểu ${MIN_LEN} ký tự`}
          </span>
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            Ảnh thực tế <span className="font-normal text-xs text-slate-500">(tối đa {MAX_IMAGES} ảnh)</span>
          </span>
          <div className="flex flex-wrap gap-2.5">
            {images.map((src, i) => (
              <div key={src} className="relative w-20 h-20">
                <img src={src} alt={`Ảnh ${i + 1}`} className="w-full h-full rounded-xl object-cover" />
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
                className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-brand-500 hover:text-brand-600 flex flex-col items-center justify-center gap-1 text-[11px] font-semibold"
              >
                <ImagePlus className="w-5 h-5" />
                Thêm ảnh
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = '';
              }}
            />
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
          Mỗi tài khoản chỉ viết 1 đánh giá cho mỗi quán. Bạn có thể chỉnh sửa hoặc xóa sau.
        </p>
      </form>
    </Modal>
  );
};
