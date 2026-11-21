import React from 'react';
import { Heart, MessageCircle, Reply, UserPlus } from 'lucide-react';
import { AppNotification, NotificationType } from '@/types/notification.types';
import { formatTimeAgo } from '@/utils/formatDate';
import { cn } from '@/utils/cn';

const TYPE_META: Record<NotificationType, { icon: React.ReactNode; className: string; verb: string }> = {
  YUMMY: {
    icon: <Heart className="w-4 h-4" />,
    className: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
    verb: 'đã thả Yummy bài viết',
  },
  COMMENT: {
    icon: <MessageCircle className="w-4 h-4" />,
    className: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
    verb: 'đã bình luận bài viết',
  },
  REPLY: {
    icon: <Reply className="w-4 h-4" />,
    className: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
    verb: 'đã trả lời bình luận của bạn trong',
  },
  FOLLOW: {
    icon: <UserPlus className="w-4 h-4" />,
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    verb: 'đã bắt đầu theo dõi bạn',
  },
};

export const describeNotification = (n: AppNotification) =>
  `${n.sender.fullName} ${TYPE_META[n.type].verb}${n.post ? ` “${n.post.title}”` : ''}`;

interface NotificationItemProps {
  notification: AppNotification;
  onClick: (n: AppNotification) => void;
  compact?: boolean;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification: n, onClick, compact }) => {
  const meta = TYPE_META[n.type];
  return (
    <button
      type="button"
      onClick={() => onClick(n)}
      className={cn(
        'w-full text-left flex items-start gap-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/60',
        compact ? 'px-4 py-3' : 'px-5 py-4',
        !n.isRead && 'bg-rose-50/60 dark:bg-rose-950/20'
      )}
    >
      <span className={cn('shrink-0 w-9 h-9 rounded-full flex items-center justify-center', meta.className)}>
        {meta.icon}
      </span>
      <span className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span className={cn('text-slate-800 dark:text-slate-200 leading-snug', compact ? 'text-[13px] line-clamp-2' : 'text-sm')}>
          <b className="text-slate-900 dark:text-white">{n.sender.fullName}</b> {meta.verb}
          {n.post && <> “{n.post.title}”</>}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{formatTimeAgo(n.createdAt)}</span>
      </span>
      {!n.isRead && (
        <span className="shrink-0 mt-1.5 w-2.5 h-2.5 rounded-full bg-brand-600">
          <span className="sr-only">Chưa đọc</span>
        </span>
      )}
    </button>
  );
};
