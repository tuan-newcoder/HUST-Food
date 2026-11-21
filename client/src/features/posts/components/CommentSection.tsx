import React, { useState } from 'react';
import { Send, CornerDownRight, Trash2, MessageSquare, Loader2 } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { Comment } from '@/types/comment.types';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from '@/components/feedback/Toast';
import { formatDate } from '@/utils/formatDate';

interface CommentSectionProps {
  postId: string;
  initialComments?: Comment[];
  onCommentCountChange?: (newCount: number) => void;
}

// Dữ liệu mẫu bình luận đa cấp
const MOCK_COMMENTS: Comment[] = [
  {
    _id: 'c1',
    postId: 'post-1',
    content: 'Quán này ăn từ hồi K64 đến giờ, bún cá cay vẫn chuẩn vị nhất quanh khu Bách Khoa!',
    author: {
      _id: 'usr_mock_1',
      username: 'hoang_nam',
      fullName: 'Hoàng Nam',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    repliesCount: 1,
    createdAt: '2026-11-08T10:00:00Z',
    replies: [
      {
        _id: 'c1_1',
        postId: 'post-1',
        parentId: 'c1',
        content: 'Chuẩn luôn anh ơi, nhớ xin thêm ớt chưng của cô chủ quán cay xé lưỡi mà cuốn dã man 🤤',
        author: {
          _id: 'usr_hust_01',
          username: 'tuan_le',
          fullName: 'Lê Anh Tuấn',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        },
        repliesCount: 0,
        createdAt: '2026-11-08T10:30:00Z',
      },
    ],
  },
  {
    _id: 'c2',
    postId: 'post-1',
    content: 'Trưa tầm 11h30 - 12h có đông lắm không bạn ơi? Có chỗ để xe máy không nhỉ?',
    author: {
      _id: 'usr_mock_2',
      username: 'thao_linh',
      fullName: 'Trần Thảo Linh',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    repliesCount: 0,
    createdAt: '2026-11-08T11:15:00Z',
  },
];

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  initialComments = MOCK_COMMENTS,
  onCommentCountChange,
}) => {
  const { user, isAuthenticated } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; authorName: string } | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Đếm tổng số bình luận (gồm cả comment con)
  const totalComments = comments.reduce(
    (acc, curr) => acc + 1 + (curr.replies?.length || 0),
    0
  );

  const handleAddRootComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    if (!isAuthenticated || !user) {
      toast.warning('Vui lòng đăng nhập để tham gia thảo luận');
      return;
    }

    setIsSubmitting(true);
    const newComment: Comment = {
      _id: 'c_' + Date.now(),
      postId,
      content: newCommentText.trim(),
      author: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
      },
      repliesCount: 0,
      replies: [],
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      const updated = [newComment, ...comments];
      setComments(updated);
      setNewCommentText('');
      setIsSubmitting(false);
      toast.success('Bình luận của bạn đã được đăng!');
      onCommentCountChange?.(updated.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0));
    }, 300);
  };

  const handleAddReply = (parentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    if (!isAuthenticated || !user) {
      toast.warning('Vui lòng đăng nhập để trả lời bình luận');
      return;
    }

    const newReply: Comment = {
      _id: 'reply_' + Date.now(),
      postId,
      parentId,
      content: replyText.trim(),
      author: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
      },
      repliesCount: 0,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) =>
      prev.map((c) => {
        if (c._id === parentId) {
          return {
            ...c,
            repliesCount: c.repliesCount + 1,
            replies: [...(c.replies || []), newReply],
          };
        }
        return c;
      })
    );

    setReplyText('');
    setReplyingTo(null);
    toast.success('Đã gửi phản hồi bình luận!');
  };

  const handleDeleteComment = (commentId: string, parentId?: string | null) => {
    if (parentId) {
      setComments((prev) =>
        prev.map((c) => {
          if (c._id === parentId) {
            return {
              ...c,
              repliesCount: Math.max(0, c.repliesCount - 1),
              replies: (c.replies || []).filter((r) => r._id !== commentId),
            };
          }
          return c;
        })
      );
    } else {
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    }
    toast.info('Đã xóa bình luận');
  };

  return (
    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 transition-colors duration-150">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-600 dark:text-rose-400" />
          <span>Bình luận ({totalComments})</span>
        </h4>
      </div>

      {/* Input box for new comment */}
      <form onSubmit={handleAddRootComment} className="flex items-center gap-3 mb-6">
        <Avatar
          src={user?.avatarUrl}
          name={user?.fullName || 'User'}
          size="sm"
          className="shrink-0 ring-2 ring-slate-100 dark:ring-slate-700"
        />
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={
              isAuthenticated
                ? 'Viết bình luận hoặc chia sẻ cảm nghĩ của bạn...'
                : 'Đăng nhập để tham gia thảo luận...'
            }
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            disabled={!isAuthenticated || isSubmitting}
            className="w-full h-11 pl-4 pr-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-rose-500/10 transition"
          />
          <button
            type="submit"
            disabled={!newCommentText.trim() || isSubmitting}
            aria-label="Gửi bình luận"
            className="absolute right-1.5 top-1.5 min-w-[32px] min-h-[32px] rounded-lg bg-brand-600 text-white flex items-center justify-center disabled:opacity-40 hover:bg-rose-700 transition"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </form>

      {/* Recursive / Nested Comment Tree */}
      <div className="space-y-4">
        {comments.map((rootComment) => {
          const isOwnRoot = user?._id === rootComment.author._id;

          return (
            <div key={rootComment._id} className="space-y-3">
              {/* Level 1: Root Comment */}
              <div className="flex items-start gap-2.5 group">
                <Avatar
                  src={rootComment.author.avatarUrl}
                  name={rootComment.author.fullName}
                  size="sm"
                  className="mt-0.5 shrink-0"
                />
                <div className="flex-1">
                  <div className="bg-slate-50 dark:bg-slate-800/70 rounded-2xl px-3.5 py-2.5 border border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {rootComment.author.fullName}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          @{rootComment.author.username}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {formatDate(rootComment.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {rootComment.content}
                    </p>
                  </div>

                  {/* Actions for Root Comment */}
                  <div className="flex items-center gap-3 ml-2 mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <button
                      type="button"
                      onClick={() =>
                        setReplyingTo({
                          id: rootComment._id,
                          authorName: rootComment.author.fullName,
                        })
                      }
                      className="hover:text-brand-600 dark:hover:text-rose-400 transition flex items-center gap-1"
                    >
                      <CornerDownRight className="w-3 h-3" />
                      <span>Trả lời</span>
                    </button>

                    {isOwnRoot && (
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(rootComment._id)}
                        className="hover:text-red-600 dark:hover:text-red-400 transition flex items-center gap-1 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Xóa</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Level 2: Replies (Sub-comments) */}
              {rootComment.replies && rootComment.replies.length > 0 && (
                <div className="pl-9 space-y-2.5 border-l-2 border-slate-100 dark:border-slate-800 ml-4">
                  {rootComment.replies.map((reply) => {
                    const isOwnReply = user?._id === reply.author._id;

                    return (
                      <div key={reply._id} className="flex items-start gap-2 group">
                        <Avatar
                          src={reply.author.avatarUrl}
                          name={reply.author.fullName}
                          size="xs"
                          className="mt-0.5 shrink-0"
                        />
                        <div className="flex-1">
                          <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl px-3 py-2 border border-slate-100 dark:border-slate-700/50">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100">
                                {reply.author.fullName}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                {formatDate(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                              {reply.content}
                            </p>
                          </div>

                          {isOwnReply && (
                            <div className="ml-2 mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteComment(reply._id, rootComment._id)
                                }
                                className="hover:text-red-600 dark:hover:text-red-400 transition flex items-center gap-1 opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                                <span>Xóa</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Inline Reply Form when active */}
              {replyingTo?.id === rootComment._id && (
                <form
                  onSubmit={(e) => handleAddReply(rootComment._id, e)}
                  className="pl-9 ml-4 flex items-center gap-2 pt-1 animate-in fade-in"
                >
                  <input
                    type="text"
                    autoFocus
                    placeholder={`Trả lời ${replyingTo.authorName}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 h-9 pl-3 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
                  />
                  <Button type="submit" variant="primary" size="sm" className="h-9 py-0 px-3 text-xs">
                    Gửi
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 py-0 px-2 text-xs"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText('');
                    }}
                  >
                    Hủy
                  </Button>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
