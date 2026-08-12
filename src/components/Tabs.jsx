import { useId, useRef } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

/**
 * แท็บตามแบบ WAI-ARIA — ลูกศรซ้าย/ขวาเลื่อนแท็บ Home/End ไปหัว-ท้าย
 * ตัวชี้ที่เลื่อนได้ใช้ CSS transition ล้วนบน left/width
 *
 * items: [{ id, label, icon? }]
 */
export function Tabs({ items, value, onChange, className, panelId }) {
  const uid = useId();
  const listRef = useRef(null);
  const idx = items.findIndex((t) => t.id === value);

  const focusTab = (i) => {
    const next = (i + items.length) % items.length;
    onChange?.(items[next].id);
    listRef.current?.querySelectorAll('[role="tab"]')[next]?.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusTab(idx + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusTab(idx - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusTab(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusTab(items.length - 1);
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      onKeyDown={onKeyDown}
      className={cn('relative flex gap-1 overflow-x-auto border-b border-border', className)}
    >
      {items.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            id={`${uid}-${tab.id}`}
            aria-selected={active}
            aria-controls={panelId}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange?.(tab.id)}
            className={cn(
              'ui-focusable relative shrink-0 rounded-t-ui px-4 py-3 text-sm font-semibold',
              'transition-colors duration-(--dur-fast)',
              active ? 'text-primary-ink' : 'text-muted hover:text-text',
            )}
          >
            <span className="inline-flex items-center gap-1.5">
              {tab.icon && <Icon name={tab.icon} size={16} />}
              {tab.label}
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
              style={{
                opacity: active ? 1 : 0,
                transform: active ? 'scaleX(1)' : 'scaleX(0.4)',
                transition: 'opacity var(--dur-base) var(--ease-smooth), transform var(--dur-base) var(--ease-smooth)',
              }}
            />
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
