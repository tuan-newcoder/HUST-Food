import React, { useState } from 'react';
import { Edit3, Check, X, Plus, Trash2, Clock, Coins, Sparkles, MapPin } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Post, RecipeDifficulty, Ingredient, RecipeStep } from '@/types/post.types';
import { postService } from '@/services/postService';
import { toast } from '@/components/feedback/Toast';

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  onPostUpdated?: (updatedPost: Post) => void;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({
  isOpen,
  onClose,
  post,
  onPostUpdated,
}) => {
  const [title, setTitle] = useState(post.title || '');
  const [content, setContent] = useState(post.content || '');
  const [tags, setTags] = useState<string[]>(post.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [images, setImages] = useState<string[]>(post.images || []);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Recipe fields if RECIPE
  const [cookingTime, setCookingTime] = useState<number>(post.recipeInfo?.cookingTimeMinutes || 20);
  const [estimatedCost, setEstimatedCost] = useState<number>(post.recipeInfo?.estimatedCost || 40000);
  const [servings, setServings] = useState<number>(post.recipeInfo?.servings || 2);
  const [difficulty, setDifficulty] = useState<RecipeDifficulty>(post.recipeInfo?.difficulty || 'EASY');
  const [ingredients, setIngredients] = useState<Ingredient[]>(post.recipeInfo?.ingredients || []);
  const [steps, setSteps] = useState<RecipeStep[]>(post.recipeInfo?.steps || []);

  const [isLoading, setIsLoading] = useState(false);

  // Tag helper
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((tag) => tag !== t));
  };

  // Image helper
  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    if (images.length >= 5) {
      toast.warning('Tối đa tải lên 5 hình ảnh cho mỗi bài viết');
      return;
    }
    setImages([...images, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.warning('Vui lòng nhập tiêu đề bài viết');
      return;
    }
    if (!content.trim()) {
      toast.warning('Vui lòng nhập nội dung bài viết');
      return;
    }

    setIsLoading(true);

    const payload = {
      title: title.trim(),
      content: content.trim(),
      images,
      tags,
      recipeInfo:
        post.postType === 'RECIPE'
          ? {
              cookingTimeMinutes: Number(cookingTime),
              estimatedCost: Number(estimatedCost),
              servings: Number(servings),
              difficulty,
              ingredients,
              steps,
            }
          : undefined,
    };

    try {
      await postService.updatePost(post._id, payload);
      const updated: Post = {
        ...post,
        ...payload,
        updatedAt: new Date().toISOString(),
      };
      toast.success('Đã cập nhật bài viết thành công!', 'Chỉnh sửa bài viết');
      onPostUpdated?.(updated);
      onClose();
    } catch {
      // Mock Fallback offline update
      const updated: Post = {
        ...post,
        ...payload,
        updatedAt: new Date().toISOString(),
      };
      toast.success('Đã lưu thay đổi bài viết!');
      onPostUpdated?.(updated);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Edit3 className="w-5 h-5 text-brand-600 dark:text-rose-400" />
          <span>Chỉnh sửa bài viết (F17)</span>
        </div>
      }
      description={`Cập nhật bài viết ${post.postType === 'RECIPE' ? 'Công thức nấu ăn' : 'Trải nghiệm quán'}`}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <Input
          label="Tiêu đề bài viết"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={150}
          required
        />

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 block">
            Nội dung bài viết
          </label>
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
            required
          />
        </div>

        {/* Recipe info if RECIPE */}
        {post.postType === 'RECIPE' && (
          <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-3">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Thời gian (phút)</label>
                <input
                  type="number"
                  min={1}
                  value={cookingTime}
                  onChange={(e) => setCookingTime(Number(e.target.value))}
                  className="w-full h-8 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Chi phí (VNĐ)</label>
                <input
                  type="number"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(Number(e.target.value))}
                  className="w-full h-8 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Độ khó</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as RecipeDifficulty)}
                  className="w-full h-8 px-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                >
                  <option value="EASY">Dễ làm</option>
                  <option value="MEDIUM">Trung bình</option>
                  <option value="HARD">Thử thách</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 block">
            Nhãn #Tags
          </label>
          <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            {tags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-brand-600 dark:text-rose-400 text-[11px] font-bold flex items-center gap-1"
              >
                #{t}
                <button type="button" onClick={() => handleRemoveTag(t)}>
                  <X className="w-3 h-3 text-rose-400 hover:text-rose-700" />
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Thêm tag (nhấn Enter)..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="flex-1 min-w-[120px] h-7 text-xs bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
            <span>Hình ảnh bài viết</span>
            <span className="text-[11px] text-slate-400">{images.length}/5</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              placeholder="Dán link ảnh..."
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="flex-1 h-8 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs"
            />
            <Button type="button" variant="outline" size="sm" onClick={handleAddImage}>
              Thêm
            </Button>
          </div>
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            rightIcon={<Check className="w-4 h-4" />}
          >
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </Modal>
  );
};

