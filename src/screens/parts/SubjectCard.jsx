import { useI18n } from '@/i18n/I18nProvider';
import { splitMinutes } from '@/mock/data';
import { Badge } from '@/components/Badge';
import { Icon } from '@/components/Icon';
import { ProgressBar } from '@/components/ProgressBar';
import { Avatar } from '@/components/Avatar';

/**
 * การ์ดวิชา — ภาพประกอบเต็มความกว้างด้านบน
 * ภาพเป็นสิ่งแรกที่ผู้เรียนใช้คัดว่าจะสนใจคอร์สไหน จึงให้พื้นที่มันมากที่สุด
 *
 * ป้ายบนภาพใช้พื้นทึบของตัวเอง ไม่ใช่ token ของธีม
 * เพราะภาพถ่ายมีสีอะไรก็ได้ ป้ายที่โปร่งใสจะอ่านไม่ออกบนภาพสว่าง
 */
export function SubjectCard({ subject, onOpen }) {
  const { t, p } = useI18n();
  const { h, m } = splitMinutes(subject.durationMin);
  const started = subject.progress > 0;

  return (
    <article
      className="ui-surface ui-interactive ui-focusable group flex cursor-pointer flex-col overflow-hidden p-0 text-left"
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen?.();
        }
      }}
    >
      {/* ---------- ภาพประกอบ ---------- */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-surface-2">
        <img
          src={subject.cover}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-(--dur-slow) ease-(--ease-smooth) group-hover:scale-105"
        />

        {/* ไล่เฉดมืดด้านล่างเพื่อให้ป้ายเวลาอ่านออกบนภาพทุกแบบ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />

        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-ui bg-primary px-2.5 py-1 text-xs font-bold text-on-primary shadow-raised">
          <Icon name={subject.icon} size={13} />
          {p(subject.level)}
        </span>

        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-ui bg-black/65 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <Icon name="clock" size={12} />
          {h} {t('common.hourShort')} {m} {t('common.minuteShort')}
        </span>

        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-ui bg-black/65 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          <Icon name="star" size={12} />
          {subject.rating.toFixed(1)}
        </span>
      </div>

      {/* ---------- เนื้อหา ---------- */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="ui-heading line-clamp-2 text-base">{p(subject.title)}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted">{p(subject.subtitle)}</p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {subject.tags.map((tag) => (
            <Badge key={p(tag)} size="sm">
              {p(tag)}
            </Badge>
          ))}
        </div>

        <div className="mt-3.5 flex items-center gap-2">
          <Avatar name={p(subject.instructor)} size="xs" />
          <span className="min-w-0 flex-1 truncate text-sm text-muted">
            {p(subject.instructor)}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted">
            <Icon name="list" size={12} />
            {subject.lessonCount}
          </span>
        </div>

        <div className="mt-auto pt-4">
          {started ? (
            <>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-muted">{t('subjects.continueCta')}</span>
                <span className="font-semibold text-primary-ink">
                  {Math.round(subject.progress * 100)}%
                </span>
              </div>
              <ProgressBar value={subject.progress} size="sm" label={p(subject.title)} />
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-ink">
              {t('subjects.start')}
              <Icon
                name="arrowRight"
                size={15}
                className="transition-transform duration-(--dur-base) group-hover:translate-x-1"
              />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default SubjectCard;
