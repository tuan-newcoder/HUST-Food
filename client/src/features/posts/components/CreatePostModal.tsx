import React, { useMemo, useRef, useState } from 'react';
import { BookOpen, ChevronDown, ImagePlus, MapPin, Utensils, X } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Avatar } from '@/components/common/Avatar';
import { Post, PostType, RecipeInfo } from '@/types/post.types';
import { postService } from '@/services/postService';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from '@/components/feedback/Toast';
import { usePlaceStore } from '@/features/places/usePlaceStore';
import { cn } from '@/utils/cn';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: (newPost: Post) => void;
}

const MAX_IMAGES = 5;
const MAX_TITLE = 150;
const DEFAULT_IMAGE: Record<PostType, string> = {
  EXPERIENCE: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop',
  RECIPE: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop',
};

/**
 * Tách nội dung soạn tự do thành các trường API cần:
 *  - Dòng đầu tiên → title (tối đa 150 ký tự)
 *  - Phần còn lại → content (nếu chỉ có 1 dòng thì content = title)
 *  - Các #tag trong bài → tags
 */
export function parseComposerText(raw: string) {
  const text = raw.trim();
  const [firstLine, ...rest] = text.split('\n');
  const title = firstLine.replace(/#[\p{L}\p{N}_-]+/gu, '').trim().slice(0, MAX_TITLE);
  const body = rest.join('\n').trim();
  const tags = Array.from(
    new Set(
      (text.match(/#[\p{L}\p{N}_-]+/gu) ?? []).map((t) =>
        t.slice(1).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
      )
    )
  );
  return { title, content: body || text, tags };
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const { user } = useAuthStore();
  const places = usePlaceStore((s) => s.places);

  const [postType, setPostType] = useState<PostType>('EXPERIENCE');
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [placeId, setPlaceId] = useState<string>('');
  const [showRecipeExtra, setShowRecipeExtra] = useState(false);
  const [ingredientsText, setIngredientsText] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const parsed = useMemo(() => parseComposerText(text), [text]);
  const canSubmit = parsed.title.length > 0;
  const selectedPlace = places.find((p) => p._id === placeId);

  const reset = () => {
    setText('');
    setImages([]);
    setPlaceId('');
    setIngredientsText('');
    setCookingTime('');
    setShowRecipeExtra(false);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const room = MAX_IMAGES - images.length;
    if (files.length > room) toast.warning(`Tối đa ${MAX_IMAGES} ảnh cho mỗi bài viết`);
    // Xem trước cục bộ; khi có API dùng postService.uploadImages để lấy URL Cloudinary
    setImages((prev) => [...prev, ...Array.from(files).slice(0, room).map((f) => URL.createObjectURL(f))]);
  };

  const buildRecipeInfo = (): RecipeInfo | undefined => {
    if (postType !== 'RECIPE') return undefined;
    // Mỗi dòng: "Tên nguyên liệu - định lượng" (định lượng có thể bỏ trống)
    const ingredients = ingredientsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, ...amount] = line.split(/\s+-\s+|:\s*/);
        return { name: name.trim(), amount: amount.join(' ').trim() };
      });
    return {
      cookingTimeMinutes: Number(cookingTime) || 0,
      estimatedCost: 0,
      servings: 1,
      difficulty: 'EASY',
      ingredients,
      steps: [],
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.warning('Hãy viết vài dòng chia sẻ trước khi đăng');
      return;
    }
    setIsLoading(true);

    const payload = {
      postType,
      title: parsed.title,
      content: parsed.content,
      images: images.length > 0 ? images : [DEFAULT_IMAGE[postType]],
      tags: parsed.tags,
      placeId: postType === 'EXPERIENCE' && placeId ? placeId : null,
      recipeInfo: buildRecipeInfo(),
    };

    try {
      const res = await postService.createPost(payload);
      if (res.data?.post) {
        onPostCreated?.(res.data.post);
      }
    } catch {
      // Backend chưa sẵn sàng → tạo bài offline để hiển thị ngay trên bảng tin
      const mockPost: Post = {
        _id: 'post_' + Date.now(),
        authorId: user?._id || 'usr_hust_01',
        author: {
          _id: user?._id || 'usr_hust_01',
          username: user?.username || 'tuan_le',
          fullName: user?.fullName || 'Lê Anh Tuấn',
          avatarUrl: user?.avatarUrl || '',
        },
        ...payload,
        place:
          payload.placeId && selectedPlace
            ? {
                _id: selectedPlace._id,
                name: selectedPlace.name,
                address: selectedPlace.address,
                coverImage: selectedPlace.coverImage,
                averageRatings: selectedPlace.averageRatings,
              }
            : null,
        metrics: { yummyCount: 0, commentsCount: 0, savesCount: 0 },
        status: 'PUBLISHED',
        isYummied: false,
        createdAt: new Date().toISOString(),
      };
      onPostCreated?.(mockPost);
    } finally {
      setIsLoading(false);
    }

    toast.success('Đã đăng bài viết lên bảng tin!');
    reset();
    onClose();
  };

  const typeButton = (type: PostType, label: string, icon: React.ReactNode) => (
    <button
      type="button"
      role="radio"
      aria-checked={postType === type}
      onClick={() => setPostType(type)}
      className={cn(
        'min-h-[36px] px-3.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition',
        postType === type
          ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-rose-300 shadow-sm'
          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
      )}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo bài viết"
      maxWidth="xl"
      footer={
        <Button type="submit" form="create-post-form" size="lg" className="w-full" isLoading={isLoading} disabled={!canSubmit}>
          Đăng bài
        </Button>
      }
    >
      <form id="create-post-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Avatar src={user?.avatarUrl} name={user?.fullName} size="md" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.fullName}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Công khai</div>
          </div>
          <div role="radiogroup" aria-label="Loại bài viết" className="flex p-1 rounded-full bg-slate-100 dark:bg-slate-800">
            {typeButton('EXPERIENCE', 'Trải nghiệm', <Utensils className="w-3.5 h-3.5" />)}
            {typeButton('RECIPE', 'Công thức', <BookOpen className="w-3.5 h-3.5" />)}
          </div>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="sr-only">Nội dung bài viết</span>
          <textarea
            rows={6}
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              postType === 'EXPERIENCE'
                ? 'Hôm nay bạn ăn gì ngon? Kể về món, giá, không gian…'
                : 'Tên món ở dòng đầu, sau đó là cách nấu…'
            }
            className="w-full resize-none bg-transparent text-base leading-relaxed text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Dòng đầu tiên sẽ là tiêu đề · Gõ <b>#tag</b> ngay trong bài để gắn hashtag
            {parsed.tags.length > 0 && (
              <span className="text-brand-600 dark:text-rose-400"> · {parsed.tags.map((t) => `#${t}`).join(' ')}</span>
            )}
          </span>
        </label>

        {/* Ảnh */}
        <div className="flex flex-wrap gap-2">
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
              Ảnh ({images.length}/{MAX_IMAGES})
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

        {/* Gắn quán — chỉ với bài Trải nghiệm, không bắt buộc */}
        {postType === 'EXPERIENCE' && (
          <label className="flex items-center gap-2.5 px-3 min-h-[48px] rounded-xl border border-slate-200 dark:border-slate-700">
            <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
            <span className="sr-only">Gắn quán ăn</span>
            <select
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              className="flex-1 min-w-0 h-11 bg-transparent text-sm text-slate-800 dark:text-slate-100 focus:outline-none"
            >
              <option value="">Gắn quán (không bắt buộc)</option>
              {places.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Chi tiết công thức — thu gọn, không bắt buộc */}
        {postType === 'RECIPE' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowRecipeExtra((v) => !v)}
              aria-expanded={showRecipeExtra}
              className="w-full min-h-[48px] px-3.5 flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              <span>
                Nguyên liệu &amp; thời gian nấu{' '}
                <span className="font-normal text-slate-500 dark:text-slate-400">(không bắt buộc)</span>
              </span>
              <ChevronDown className={cn('w-4 h-4 transition-transform', showRecipeExtra && 'rotate-180')} />
            </button>
            {showRecipeExtra && (
              <div className="px-3.5 pb-3.5 flex flex-col gap-2.5">
                <textarea
                  rows={3}
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                  aria-label="Nguyên liệu"
                  placeholder={'Mỗi dòng một nguyên liệu, VD:\nThịt bò - 200g\nCơm nguội - 2 bát'}
                  className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
                />
                <input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  aria-label="Thời gian nấu (phút)"
                  placeholder="Thời gian (phút)"
                  className="w-44 h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>
            )}
          </div>
        )}
      </form>
    </Modal>
  );
};
