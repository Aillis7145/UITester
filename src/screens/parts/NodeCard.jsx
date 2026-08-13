import { useI18n } from '@/i18n/I18nProvider';
import { contentCountOf, progressOf } from '@/mock/nodes';
import { Icon } from '@/components/Icon';
import { ProgressBar } from '@/components/ProgressBar';

/**
 * การ์ดของกล่องเนื้อหาที่ไม่มีรูปปก (หน่วย / บท / หัวข้อ / ตอน)
 *
 * แยกจาก SubjectCard เพราะชั้นกลางไม่มีภาพประกอบ
 * ถ้าเอา SubjectCard มาใช้ทั้งดุ้นจะได้กล่องสีเทาเปล่า 16:10 ซึ่งอ่านว่า "รูปโหลดไม่ขึ้น"
 * ที่นี่จึงแทนภาพด้วยเลขลำดับตัวโต ซึ่งเป็นสิ่งที่ผู้เรียนใช้อ้างอิงกันจริงอยู่แล้ว
 *
 * levelLabel ส่งเข้ามาจากหน้าจอ เพราะชื่อชั้นเป็นของโครงการ ไม่ใช่ของคอมโพเนนต์
 */
export function NodeCard({ node, levelLabel, onOpen }) {
  const { t, p } = useI18n();
  const total = contentCountOf(node.id);
  const progress = progressOf(node.id);
  const done = progress >= 1;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen?.();
        }
      }}
      className="ui-surface ui-interactive ui-focusable group flex cursor-pointer items-start gap-4 p-4 text-left"
    >
      <span
        aria-hidden="true"
        className="grid h-12 w-12 shrink-0 place-items-center rounded-ui text-lg font-bold tabular-nums"
        style={{
          background: 'color-mix(in oklch, var(--color-primary) 14%, transparent)',
          color: 'var(--color-primary-ink)',
        }}
      >
        {node.order}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {levelLabel} {node.order}
        </p>
        <h3 className="ui-heading mt-0.5 line-clamp-2 text-base">{p(node.title)}</h3>

        <div className="mt-2 flex items-center gap-3 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <Icon name="list" size={13} />
            {t('browse.inside', { n: total })}
          </span>
          {done && (
            <span className="flex items-center gap-1.5 text-success">
              <Icon name="check" size={13} strokeWidth={3} />
              {t('browse.done')}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2.5">
          <ProgressBar value={progress} size="sm" label={p(node.title)} className="flex-1" />
          <span className="shrink-0 text-sm font-semibold text-primary-ink">
            {Math.round(progress * 100)}%
          </span>
        </div>
      </div>

      <span className="mt-1 shrink-0 text-muted transition-transform duration-(--dur-base) group-hover:translate-x-1">
        <Icon name="chevronRight" size={18} />
      </span>
    </article>
  );
}

export default NodeCard;
