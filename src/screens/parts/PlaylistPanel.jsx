import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { lessons, sections, formatDuration } from '@/mock/data';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { ProgressBar } from '@/components/ProgressBar';
import { cn } from '@/lib/cn';

/**
 * เพลย์ลิสต์ด้านข้าง — จัดกลุ่มตามบท พับได้
 * รายการที่กำลังเล่นได้ --shadow-glow ของธีม จึงเด่นคนละแบบในแต่ละธีม
 */
export function PlaylistPanel({ currentId, onSelect, onTakeQuiz }) {
  const { t, p } = useI18n();
  const [collapsed, setCollapsed] = useState(() => new Set());

  const done = lessons.filter((l) => l.watched).length;
  const total = lessons.length;

  const toggle = (id) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    // --frame-h ตั้งโดย ShowcasePage ตามความสูงกรอบเครื่องจริง
    // ใน /embed กรอบคือ viewport ของ iframe อยู่แล้ว จึงถอยไปใช้ 100dvh ได้ถูกต้อง
    <div className="ui-surface flex max-h-[calc(var(--frame-h,100dvh)-8rem)] flex-col overflow-hidden p-0 lg:sticky lg:top-6">
      <header className="border-b border-border p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="ui-heading text-base">{t('lesson.playlist')}</h2>
          <span className="shrink-0 text-sm font-medium text-muted">
            {t('lesson.progress', { done, total })}
          </span>
        </div>
        <ProgressBar value={done / total} size="sm" className="mt-2.5" label={t('lesson.playlist')} />
      </header>

      {/* padding กว้างพอให้เงาเรืองแสงของรายการที่กำลังเล่น และเงา hover ของทุกธีม
          แสดงครบทุกด้าน — p-2 เดิมแคบเกินจนขอบแสงโดนกล่องที่เลื่อนได้ตัดทิ้ง */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3.5 py-3">
        {sections.map((section) => {
          const items = lessons.filter((l) => l.sectionId === section.id);
          const isCollapsed = collapsed.has(section.id);
          const sectionDone = items.filter((l) => l.watched).length;

          return (
            <section key={section.id} className="mb-1">
              <button
                type="button"
                onClick={() => toggle(section.id)}
                aria-expanded={!isCollapsed}
                className="ui-focusable flex w-full items-center gap-2 rounded-ui px-2 py-2.5 text-left transition-colors duration-(--dur-fast) hover:bg-surface-2"
              >
                <Icon
                  name="chevronDown"
                  size={16}
                  className="shrink-0 text-muted transition-transform duration-(--dur-base)"
                  style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'none' }}
                />
                <span className="ui-heading min-w-0 flex-1 truncate text-sm">
                  {p(section.title)}
                </span>
                <span className="shrink-0 text-xs text-muted">
                  {sectionDone}/{items.length}
                </span>
              </button>

              {/* พับด้วย grid-template-rows: 0fr → 1fr ซึ่งเป็นวิธีเดียวที่ทำ auto-height ได้ด้วย CSS ล้วน */}
              <div
                className="grid transition-[grid-template-rows] duration-(--dur-base) ease-(--ease-smooth)"
                style={{ gridTemplateRows: isCollapsed ? '0fr' : '1fr' }}
              >
                {/* ul ต้อง overflow-hidden เพื่อให้ 0fr→1fr ทำงาน แต่มันตัดเงาของรายการด้วย
                    ชดเชยด้วย -mx/px คู่กัน: กล่องกว้างขึ้นแต่ตำแหน่งเนื้อหาเท่าเดิม
                    เงาจึงมีที่วาดอยู่ในกล่องที่ถูกตัด */}
                <ul className="-mx-2 min-h-0 overflow-hidden px-2 py-1">
                  {items.map((lesson) => (
                    <PlaylistItem
                      key={lesson.id}
                      lesson={lesson}
                      current={lesson.id === currentId}
                      onSelect={onSelect}
                    />
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>

      <footer className="border-t border-border p-3">
        <Button fullWidth icon="flag" onClick={onTakeQuiz}>
          {t('lesson.takeQuiz')}
        </Button>
      </footer>
    </div>
  );
}

function PlaylistItem({ lesson, current, onSelect }) {
  const { t, p } = useI18n();
  const state = lesson.locked ? 'locked' : current ? 'current' : lesson.watched ? 'watched' : 'idle';

  const stateLabel = {
    locked: t('lesson.locked'),
    current: t('lesson.playing'),
    watched: t('lesson.watched'),
    idle: '',
  }[state];

  return (
    <li>
      <button
        type="button"
        disabled={lesson.locked}
        onClick={() => onSelect?.(lesson.id)}
        aria-current={current ? 'true' : undefined}
        className={cn(
          'ui-focusable ui-interactive flex w-full items-start gap-2.5 rounded-ui p-2 text-left',
          'disabled:pointer-events-none disabled:opacity-45',
          current && 'bg-surface-2',
        )}
        style={current ? { boxShadow: 'var(--shadow-glow)' } : undefined}
      >
        {/* ตัวชี้ขอบซ้ายของรายการปัจจุบัน */}
        <span
          aria-hidden="true"
          className={cn(
            'mt-1 w-0.5 shrink-0 self-stretch rounded-full transition-colors duration-(--dur-base)',
            current ? 'bg-primary' : 'bg-transparent',
          )}
        />

        {/* รูปย่อของบทเรียน + ไอคอนสถานะทับมุม — เห็นทั้งภาพและสถานะในพื้นที่เดียว */}
        <span className="relative h-11 w-16 shrink-0 overflow-hidden rounded-[0.4rem] bg-surface-2">
          <img
            src={lesson.thumb}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <span
            className={cn(
              'absolute inset-0 grid place-items-center',
              state === 'locked' ? 'bg-black/60' : state === 'current' ? 'bg-black/35' : 'bg-black/20',
            )}
          >
            {state === 'watched' ? (
              <Icon name="check" size={15} className="text-white" strokeWidth={3} />
            ) : state === 'current' ? (
              <Icon name="play" size={14} className="text-white" />
            ) : state === 'locked' ? (
              <Icon name="lock" size={14} className="text-white" />
            ) : (
              <span className="text-xs font-semibold tabular-nums text-white">{lesson.order}</span>
            )}
          </span>
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={cn(
              'line-clamp-2 block text-sm',
              current ? 'font-semibold text-primary-ink' : 'text-text',
            )}
          >
            {p(lesson.title)}
          </span>
          <span className="mt-1 flex items-center gap-1.5 text-xs text-muted">
            <Icon name="clock" size={12} />
            {formatDuration(lesson.durationSec)}
            {stateLabel && (
              <>
                <span aria-hidden="true">·</span>
                {stateLabel}
              </>
            )}
          </span>
        </span>
      </button>
    </li>
  );
}

export default PlaylistPanel;
