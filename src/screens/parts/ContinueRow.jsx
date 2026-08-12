import { useI18n } from '@/i18n/I18nProvider';
import { continueLearning, getSubject, getLesson, formatDuration } from '@/mock/data';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { ProgressBar } from '@/components/ProgressBar';

/** แถว "เรียนต่อจากที่ค้างไว้" — การ์ดกว้างที่ต่างจากกริดวิชาด้านล่างอย่างชัดเจน */
export function ContinueRow({ onOpen }) {
  const { t, p } = useI18n();

  return (
    <section>
      <h2 className="ui-heading mb-3 text-lg">{t('subjects.continueTitle')}</h2>

      <div className="grid gap-4 lg:grid-cols-2">
        {continueLearning.map((item) => {
          const subject = getSubject(item.subjectId);
          const lesson = getLesson(item.lessonId);
          if (!subject) return null;

          return (
            <article key={item.subjectId} className="ui-surface flex items-center gap-4 p-4">
              {/* ภาพนิ่งของบทเรียนที่ค้างไว้ พร้อมปุ่มเล่นทับ ให้รู้ทันทีว่ากดแล้วเล่นต่อ */}
              <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-ui bg-surface-2">
                <img
                  src={lesson?.thumb ?? subject.cover}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 grid place-items-center bg-black/30">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white/85 text-black">
                    <Icon name="play" size={15} />
                  </span>
                </div>
                <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[0.6875rem] font-medium text-white">
                  {formatDuration(item.leftSec)}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-muted">{p(subject.title)}</p>
                <h3 className="ui-heading mt-0.5 line-clamp-1 text-base">
                  {lesson ? p(lesson.title) : p(subject.subtitle)}
                </h3>
                <div className="mt-2.5 flex items-center gap-2.5">
                  <ProgressBar value={subject.progress} size="sm" className="flex-1" />
                  <span className="shrink-0 text-sm font-semibold text-primary-ink">
                    {Math.round(subject.progress * 100)}%
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                icon="play"
                className="shrink-0 max-sm:hidden"
                onClick={() => onOpen?.(item)}
              >
                {t('subjects.continueCta')}
              </Button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default ContinueRow;
