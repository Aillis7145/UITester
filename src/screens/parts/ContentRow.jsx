import { useI18n } from '@/i18n/I18nProvider';
import { formatDuration } from '@/mock/data';
import { Icon } from '@/components/Icon';
import { cn } from '@/lib/cn';

/**
 * แถวของสื่อหนึ่งชิ้น — ใช้ทั้งในเพลย์ลิสต์ข้างหน้าสื่อ และในหน้าไล่ระดับชั้นสุดท้าย
 *
 * ตัวเดียวกันสองที่โดยตั้งใจ ผู้เรียนจึงจำได้ว่านี่คือของชิ้นเดียวกัน
 * และเวลาปรับสถานะ (ดูแล้ว/กำลังเล่น/ล็อก) ไม่มีทางที่สองที่จะแสดงไม่ตรงกัน
 *
 * ชนิดสื่อเป็นคำศัพท์สากลของทุกโครงการ จึงใช้ i18n key ไม่ใช่ p()
 * ต่างจากชื่อชั้น (วิชา/หน่วย/บท) ที่เป็นเนื้อหาของแต่ละโครงการ
 */
const KIND_ICONS = {
  video: 'play',
  audio: 'volume',
  doc: 'file',
  activity: 'flask',
  quiz: 'flag',
};

/** ข้อความบรรทัดล่าง — แต่ละชนิดวัดปริมาณคนละหน่วย */
function metaOf(node, t) {
  if (node.kind === 'doc') return t('content.pages', { n: node.pages });
  if (node.kind === 'activity') return t('content.estMin', { n: node.estMin });
  if (node.kind === 'quiz') return t('content.quizMeta');
  return formatDuration(node.durationSec ?? 0);
}

export function ContentRow({ node, current, onSelect, showKind = true }) {
  const { t, p } = useI18n();
  const state = node.locked ? 'locked' : current ? 'current' : node.watched ? 'watched' : 'idle';

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
        disabled={node.locked}
        onClick={() => onSelect?.(node)}
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

        {/* รูปย่อ + ไอคอนสถานะทับมุม — เห็นทั้งภาพและสถานะในพื้นที่เดียว */}
        <span className="relative h-11 w-16 shrink-0 overflow-hidden rounded-[0.4rem] bg-surface-2">
          <img
            src={node.thumb}
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
            ) : state === 'locked' ? (
              <Icon name="lock" size={14} className="text-white" />
            ) : (
              // ไอคอนบอกชนิดสื่อ ไม่ใช่เลขลำดับ — ผู้เรียนต้องรู้ก่อนกดว่าเป็นวิดีโอ เอกสาร หรือแบบทดสอบ
              <Icon name={KIND_ICONS[node.kind] ?? 'play'} size={14} className="text-white" />
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
            {p(node.title)}
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted">
            {showKind && (
              <>
                <span className="font-medium">{t(`content.kind.${node.kind}`)}</span>
                <span aria-hidden="true">·</span>
              </>
            )}
            {metaOf(node, t)}
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

export default ContentRow;
