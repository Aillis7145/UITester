import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { notifications as seed } from '@/mock/data';
import { MenuPopover } from './MenuPopover';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { cn } from '@/lib/cn';

/**
 * เมนูแจ้งเตือนบน AppBar
 *
 * กดอ่านทีละรายการหรือกด "อ่านทั้งหมด" ได้จริง ตัวเลขบนกระดิ่งลดตามทันที
 * ทำให้กดเล่นได้จริง เพราะจุดประสงค์ของเว็บนี้คือให้คนทดลองสัมผัสก่อนเลือกธีม
 */
export function NotificationMenu() {
  const { t, p } = useI18n();
  const [items, setItems] = useState(seed);
  const unread = items.filter((n) => n.unread).length;

  const markAll = () => setItems((list) => list.map((n) => ({ ...n, unread: false })));
  const markOne = (id) =>
    setItems((list) => list.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  return (
    <MenuPopover
      label={t('subjects.notifications')}
      width="w-80"
      trigger={({ toggle, ref, props }) => (
        <IconButton
          ref={ref}
          icon="bell"
          size="sm"
          badge={unread}
          onClick={toggle}
          label={
            unread
              ? `${t('subjects.notifications')} — ${t('appbar.unread', { n: unread })}`
              : t('subjects.notifications')
          }
          {...props}
        />
      )}
    >
      {() => (
        <>
          <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <span className="ui-heading text-sm">{t('subjects.notifications')}</span>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAll}
                className="ui-focusable rounded-ui text-xs font-semibold text-primary-ink underline-offset-4 hover:underline"
              >
                {t('appbar.markAllRead')}
              </button>
            )}
          </header>

          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">{t('appbar.noNotifications')}</p>
          ) : (
            <ul className="max-h-72 overflow-y-auto p-1.5">
              {items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => markOne(n.id)}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-ui p-2.5 text-left',
                      'transition-colors duration-(--dur-fast) hover:bg-surface-2',
                    )}
                  >
                    <span
                      className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-ui"
                      style={{
                        background: 'color-mix(in oklch, var(--color-primary) 16%, transparent)',
                        color: 'var(--color-primary-ink)',
                      }}
                    >
                      <Icon name={n.icon} size={16} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={cn('block text-sm', n.unread ? 'font-semibold' : 'text-muted')}
                      >
                        {p(n.text)}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted">{p(n.at)}</span>
                    </span>

                    {/* จุดบอกว่ายังไม่อ่าน — จองที่ไว้เสมอ ข้อความจึงไม่ขยับตอนกดอ่าน */}
                    <span className="mt-1.5 h-2 w-2 shrink-0">
                      {n.unread && (
                        <span
                          className="block h-2 w-2 rounded-full bg-primary"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <footer className="border-t border-border p-1.5">
            <button
              type="button"
              role="menuitem"
              className="ui-focusable w-full rounded-ui py-2 text-center text-sm font-semibold text-primary-ink transition-colors duration-(--dur-fast) hover:bg-surface-2"
            >
              {t('appbar.viewAll')}
            </button>
          </footer>
        </>
      )}
    </MenuPopover>
  );
}

export default NotificationMenu;
