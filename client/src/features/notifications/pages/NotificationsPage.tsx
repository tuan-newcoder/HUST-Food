import React, { useMemo, useState } from 'react';
import { CheckCheck } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/feedback/EmptyState';
import { AppNotification } from '@/types/notification.types';
import { cn } from '@/utils/cn';
import { NotificationItem } from '../components/NotificationItem';
import { selectUnreadCount, useNotificationStore } from '../useNotificationStore';

interface NotificationsPageProps {
  onOpenNotification: (n: AppNotification) => void;
}

const PAGE_SIZE = 15;

const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString();

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onOpenNotification }) => {
  const items = useNotificationStore((s) => s.items);
  const unread = useNotificationStore(selectUnreadCount);
  const { markRead, markAllRead } = useNotificationStore();
  const [tab, setTab] = useState<'ALL' | 'UNREAD'>('ALL');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const list = useMemo(
    () => (tab === 'UNREAD' ? items.filter((n) => !n.isRead) : items).slice(0, visible),
    [items, tab, visible]
  );
  const total = tab === 'UNREAD' ? unread : items.length;
  const today = list.filter((n) => isToday(n.createdAt));
  const older = list.filter((n) => !isToday(n.createdAt));

  const handleClick = (n: AppNotification) => {
    markRead(n._id);
    onOpenNotification(n);
  };

  const group = (title: string, data: AppNotification[]) =>
    data.length > 0 && (
      <div>
        <h2 className="px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
          {title}
        </h2>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((n) => (
            <NotificationItem key={n._id} notification={n} onClick={handleClick} />
          ))}
        </div>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Hộp thư thông báo</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {unread > 0 ? `Bạn có ${unread} thông báo chưa đọc` : 'Bạn đã đọc hết thông báo'}
          </p>
        </div>
        <Button variant="outline" onClick={markAllRead} disabled={unread === 0} leftIcon={<CheckCheck className="w-4 h-4" />}>
          Đánh dấu đọc tất cả
        </Button>
      </div>

      <div role="tablist" className="flex gap-2">
        {(
          [
            ['ALL', 'Tất cả'],
            ['UNREAD', `Chưa đọc (${unread})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => {
              setTab(id);
              setVisible(PAGE_SIZE);
            }}
            className={cn(
              'min-h-[40px] px-4 rounded-full text-sm font-semibold border transition',
              tab === id
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon="inbox"
          title={tab === 'UNREAD' ? 'Không còn thông báo chưa đọc' : 'Chưa có thông báo nào'}
          description="Khi ai đó thả Yummy, bình luận hoặc theo dõi bạn, thông báo sẽ hiện ở đây."
        />
      ) : (
        <section className="bg-white dark:bg-[#151D2C] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden">
          {group('Hôm nay', today)}
          {group('Trước đó', older)}
        </section>
      )}

      {visible < total && (
        <Button variant="outline" className="self-center" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
          Tải thêm thông báo
        </Button>
      )}
    </div>
  );
};
