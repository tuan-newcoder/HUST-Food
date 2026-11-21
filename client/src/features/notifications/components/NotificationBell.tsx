import React, { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { toast } from '@/components/feedback/Toast';
import { AppNotification } from '@/types/notification.types';
import { cn } from '@/utils/cn';
import { selectUnreadCount, useNotificationStore } from '../useNotificationStore';
import { NotificationItem, describeNotification } from './NotificationItem';

interface NotificationBellProps {
  onOpenNotification: (n: AppNotification) => void;
  onViewAll: () => void;
}

const DROPDOWN_LIMIT = 5;

export const NotificationBell: React.FC<NotificationBellProps> = ({ onOpenNotification, onViewAll }) => {
  const items = useNotificationStore((s) => s.items);
  const unread = useNotificationStore(selectUnreadCount);
  const { markRead, markAllRead, push } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Đóng khi bấm ra ngoài hoặc nhấn ESC
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  // Giả lập 1 sự kiện Socket.IO (F21) trong môi trường dev để thấy badge + toast realtime.
  // Khi có server: socket.on('notification:new', (n) => { push(n); toast.info(...) })
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const t = setTimeout(() => {
      const n: AppNotification = {
        _id: `n_live_${Date.now()}`,
        type: 'COMMENT',
        sender: { _id: 'u9', fullName: 'Trần Thuỳ Linh', username: 'linhtran.it', avatarUrl: '' },
        post: { _id: 'post-2', title: 'Công thức làm Cơm chiên kim chi bò bằng nồi cơm điện trong KTX' },
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      push(n);
      toast.info(describeNotification(n), 'Thông báo mới');
    }, 20000);
    return () => clearTimeout(t);
  }, [push]);

  const handleClick = (n: AppNotification) => {
    markRead(n._id);
    setIsOpen(false);
    onOpenNotification(n);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-label={unread ? `Thông báo, ${unread} chưa đọc` : 'Thông báo'}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          'min-w-[44px] min-h-[44px] rounded-xl border flex items-center justify-center relative shadow-sm transition',
          isOpen
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-brand-600 dark:text-rose-400'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
        )}
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-brand-600 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Thông báo mới"
          className="absolute right-0 mt-2 w-[min(400px,calc(100vw-2rem))] rounded-2xl bg-white dark:bg-[#151D2C] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-extrabold text-slate-900 dark:text-white">Thông báo</span>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="min-h-[36px] px-2 text-xs font-semibold text-brand-600 dark:text-rose-400 hover:underline"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>
          <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {items.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-slate-500">Chưa có thông báo nào</p>
            ) : (
              items.slice(0, DROPDOWN_LIMIT).map((n) => (
                <NotificationItem key={n._id} notification={n} onClick={handleClick} compact />
              ))
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onViewAll();
            }}
            className="w-full min-h-[48px] border-t border-slate-100 dark:border-slate-800 text-sm font-semibold text-brand-600 dark:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
          >
            Xem tất cả thông báo
          </button>
        </div>
      )}
    </div>
  );
};
