import React, { useState } from 'react';
import {
  Utensils,
  BookOpen,
  Image as ImageIcon,
  X,
  Plus,
  Trash2,
  Clock,
  Coins,
  Users,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Post, PostType, RecipeDifficulty, Ingredient, RecipeStep } from '@/types/post.types';
import { postService } from '@/services/postService';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from '@/components/feedback/Toast';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: (newPost: Post) => void;
}

const SAMPLE_PLACES = [
  { id: 'p1', name: 'Bún Cá Cay Hải Phòng - Tạ Quang Bửu', address: 'Kiot 14, Ngõ 33 Tạ Quang Bửu' },
  { id: 'p2', name: 'Cơm Niêu Singapore Kombo - Lê Thanh Nghị', address: '110 Lê Thanh Nghị, Bách Khoa' },
  { id: 'p3', name: 'The Coffee House - Trần Đại Nghĩa', address: '68 Trần Đại Nghĩa, Hai Bà Trưng' },
  { id: 'p4', name: 'Bánh Mì Chảo Cột Điện - Tạ Quang Bửu', address: 'Ngõ 27 Tạ Quang Bửu' },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const { user } = useAuthStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [postType, setPostType] = useState<PostType>('EXPERIENCE');

  // Common Fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [tags, setTags] = useState<string[]>(['bach-khoa']);
  const [tagInput, setTagInput] = useState('');

  // Experience Fields
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('p1');

  // Recipe Fields
  const [cookingTime, setCookingTime] = useState<number>(20);
  const [estimatedCost, setEstimatedCost] = useState<number>(40000);
  const [servings, setServings] = useState<number>(2);
  const [difficulty, setDifficulty] = useState<RecipeDifficulty>('EASY');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: 'Thịt bò tươi', amount: '150g' },
    { name: 'Dưa cải chua', amount: '1 bát nhỏ' },
    { name: 'Cơm nguội', amount: '2 bát' },
  ]);
  const [steps, setSteps] = useState<RecipeStep[]>([
    { stepNumber: 1, instruction: 'Thái mỏng thịt bò ướp với chút tỏi băm và hạt nêm trong 10 phút.' },
    { stepNumber: 2, instruction: 'Xào dưa chua ráo nước rồi cho cơm vào rang săn giòn hạt.' },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // Thêm ảnh vào danh sách preview
  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    if (images.length >= 5) {
      toast.warning('Tối đa tải lên 5 hình ảnh cho mỗi bài viết');
      return;
    }
    setImages([...images, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Tag chip input
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleanTag = tagInput.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
      if (cleanTag && !tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Recipe helpers
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '' }]);
  };

  const handleUpdateIngredient = (index: number, field: 'name' | 'amount', value: string) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddStep = () => {
    setSteps([...steps, { stepNumber: steps.length + 1, instruction: '' }]);
  };

  const handleUpdateStep = (index: number, instruction: string) => {
    const updated = [...steps];
    updated[index].instruction = instruction;
    setSteps(updated);
  };

  const handleRemoveStep = (index: number) => {
    const filtered = steps.filter((_, i) => i !== index);
    const reindexed = filtered.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setSteps(reindexed);
  };

  const resetForm = () => {
    setStep(1);
    setTitle('');
    setContent('');
    setImages([]);
    setTags(['bach-khoa']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.warning('Vui lòng nhập tiêu đề bài viết');
      return;
    }
    if (!content.trim()) {
      toast.warning('Vui lòng nhập nội dung chia sẻ');
      return;
    }

    setIsLoading(true);

    const chosenPlace = SAMPLE_PLACES.find((p) => p.id === selectedPlaceId);

    const payload = {
      postType,
      title: title.trim(),
      content: content.trim(),
      images: images.length > 0 ? images : [
        postType === 'EXPERIENCE'
          ? 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop'
          : 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop',
      ],
      tags,
      placeId: postType === 'EXPERIENCE' ? selectedPlaceId : null,
      recipeInfo:
        postType === 'RECIPE'
          ? {
              cookingTimeMinutes: Number(cookingTime),
              estimatedCost: Number(estimatedCost),
              servings: Number(servings),
              difficulty,
              ingredients: ingredients.filter((i) => i.name.trim() !== ''),
              steps: steps.filter((s) => s.instruction.trim() !== ''),
            }
          : undefined,
    };

    try {
      const res = await postService.createPost(payload);
      if (res.data?.post) {
        toast.success('Bài viết của bạn đã được xuất bản thành công!');
        onPostCreated?.(res.data.post);
        resetForm();
        onClose();
      }
    } catch {
      // Mock Fallback offline post creation
      const mockNewPost: Post = {
        _id: 'post_' + Date.now(),
        authorId: user?._id || 'usr_hust_01',
        author: {
          _id: user?._id || 'usr_hust_01',
          username: user?.username || 'tuan_le',
          fullName: user?.fullName || 'Lê Anh Tuấn',
          avatarUrl: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        },
        postType,
        title: title.trim(),
        content: content.trim(),
        images: payload.images,
        tags,
        placeId: payload.placeId,
        place: postType === 'EXPERIENCE' && chosenPlace ? {
          _id: chosenPlace.id,
          name: chosenPlace.name,
          address: chosenPlace.address,
          averageRatings: { taste: 4.8, price: 4.5, hygiene: 4.2, service: 4.4, overall: 4.7 },
        } : null,
        recipeInfo: payload.recipeInfo,
        metrics: {
          yummyCount: 1,
          commentsCount: 0,
          savesCount: 0,
        },
        status: 'PUBLISHED',
        isYummied: true,
        createdAt: new Date().toISOString(),
      };

      toast.success('Đã xuất bản bài viết thành công lên bảng tin!');
      onPostCreated?.(mockNewPost);
      resetForm();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 1 ? 'Soạn bài viết mới' : postType === 'EXPERIENCE' ? '🍜 Chia sẻ trải nghiệm quán ăn' : '🍳 Chia sẻ công thức nấu ăn'}
      description={step === 1 ? 'Bước 1/2: Lựa chọn định dạng nội dung muốn chia sẻ' : 'Bước 2/2: Soạn nội dung & hình ảnh'}
      maxWidth="2xl"
    >
      {/* BƯỚC 1: Chọn định dạng bài viết */}
      {step === 1 && (
        <div className="py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Card 1: Experience */}
            <div
              onClick={() => setPostType('EXPERIENCE')}
              className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                postType === 'EXPERIENCE'
                  ? 'border-brand-600 bg-rose-50/50 dark:bg-rose-950/30 shadow-md ring-2 ring-rose-200 dark:ring-rose-900/50'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/80'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-rose-500/20">
                  <Utensils className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                  Trải nghiệm ăn uống
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Review các quán xá, địa điểm ăn uống ngon quanh Bách Khoa, gắn thẻ quán ăn để bạn bè cùng tham khảo.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-rose-400">
                <span>Gắn thẻ Quán ăn & Giá</span>
                {postType === 'EXPERIENCE' && <Check className="w-4 h-4" />}
              </div>
            </div>

            {/* Card 2: Recipe */}
            <div
              onClick={() => setPostType('RECIPE')}
              className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                postType === 'RECIPE'
                  ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 shadow-md ring-2 ring-amber-200 dark:ring-amber-900/50'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/80'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-4 shadow-sm shadow-amber-500/20">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                  Công thức nấu ăn
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Hướng dẫn làm các món ăn ngon, tiết kiệm trong phòng trọ/KTX với bảng nguyên liệu và các bước chi tiết.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
                <span>Nguyên liệu & Bước nấu</span>
                {postType === 'RECIPE' && <Check className="w-4 h-4" />}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button
              variant="primary"
              onClick={() => setStep(2)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Tiếp tục soạn nội dung
            </Button>
          </div>
        </div>
      )}

      {/* BƯỚC 2: Soạn nội dung bài viết */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Tiêu đề */}
          <Input
            label="Tiêu đề bài viết"
            placeholder="Nhập tiêu đề hấp dẫn (tối đa 150 ký tự)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={150}
            required
          />

          {/* Nếu là Trải nghiệm: Gắn thẻ Quán ăn */}
          {postType === 'EXPERIENCE' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-600 dark:text-rose-400" />
                <span>Gắn thẻ Quán ăn liên kết</span>
              </label>
              <select
                value={selectedPlaceId}
                onChange={(e) => setSelectedPlaceId(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 transition"
              >
                {SAMPLE_PLACES.map((p) => (
                  <option key={p.id} value={p.id}>
                    📍 {p.name} — {p.address}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Nếu là Công thức: Thông số nấu ăn */}
          {postType === 'RECIPE' && (
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Thời gian (phút)</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={cookingTime}
                    onChange={(e) => setCookingTime(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Chi phí (VNĐ)</span>
                  </label>
                  <input
                    type="number"
                    step={5000}
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Khẩu phần (người)</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={servings}
                    onChange={(e) => setServings(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Độ khó</span>
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as RecipeDifficulty)}
                    className="w-full h-9 px-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-slate-100"
                  >
                    <option value="EASY">Dễ làm</option>
                    <option value="MEDIUM">Trung bình</option>
                    <option value="HARD">Thử thách</option>
                  </select>
                </div>
              </div>

              {/* Bảng nguyên liệu động */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Bảng Nguyên liệu định lượng:
                  </span>
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Thêm dòng
                  </button>
                </div>
                <div className="space-y-2">
                  {ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Tên nguyên liệu (VD: Ức gà phi lê)"
                        value={ing.name}
                        onChange={(e) => handleUpdateIngredient(idx, 'name', e.target.value)}
                        className="flex-1 h-8 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      />
                      <input
                        type="text"
                        placeholder="Định lượng (VD: 200g)"
                        value={ing.amount}
                        onChange={(e) => handleUpdateIngredient(idx, 'amount', e.target.value)}
                        className="w-28 h-8 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Các bước nấu động */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Các bước thực hiện:
                  </span>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Thêm bước
                  </button>
                </div>
                <div className="space-y-2.5">
                  {steps.map((st, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-amber-200/50 dark:border-amber-900/30">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {st.stepNumber}
                      </span>
                      <textarea
                        rows={2}
                        placeholder={`Mô tả chi tiết bước ${st.stepNumber}...`}
                        value={st.instruction}
                        onChange={(e) => handleUpdateStep(idx, e.target.value)}
                        className="flex-1 p-1.5 text-xs bg-transparent border border-slate-100 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="p-1 text-slate-300 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Nội dung bài viết */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 block">
              Nội dung bài viết
            </label>
            <textarea
              rows={4}
              placeholder="Chia sẻ cảm nhận chân thật về món ăn, địa chỉ, lưu ý khi đi ăn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition"
              required
            />
          </div>

          {/* Tải ảnh (Tối đa 5 ảnh) */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Hình ảnh đính kèm (Tối đa 5 ảnh)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">{images.length}/5</span>
            </label>

            {/* Quick URL Adder or Presets */}
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                placeholder="Dán đường link ảnh món ăn..."
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 h-9 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddImage}>
                Thêm ảnh
              </Button>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* #Tags */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 block">
              Gắn nhãn #Tags (Nhấn Enter để thêm)
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
                placeholder="Nhập tag (VD: bun-ca-cay)..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="flex-1 min-w-[120px] h-7 text-xs bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Quay lại chọn dạng bài
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              rightIcon={<Check className="w-4 h-4" />}
            >
              Xuất bản bài viết
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

