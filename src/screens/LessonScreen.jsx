import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { useScreenState } from './screenState';
import {
  getLesson,
  getSection,
  getSubject,
  currentLessonId,
  currentLessonProgressSec,
} from '@/mock/data';
import { VideoPlayerMock } from './parts/VideoPlayerMock';
import { PlaylistPanel } from './parts/PlaylistPanel';
import { LessonTabs } from './parts/LessonTabs';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Icon } from '@/components/Icon';
import { Skeleton } from '@/components/Skeleton';
import { cn } from '@/lib/cn';

export function LessonScreen({ onNavigate }) {
  const { t, p } = useI18n();
  const { showSkeleton } = useScreenState();

  const [activeId, setActiveId] = useState(currentLessonId);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const lesson = getLesson(activeId) ?? getLesson(currentLessonId);
  const section = getSection(lesson.sectionId);
  const subject = getSubject(lesson.subjectId);

  if (showSkeleton) return <LessonSkeleton />;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-24 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* ---------- คอลัมน์ซ้าย ---------- */}
        <div className="min-w-0 space-y-5">
          <VideoPlayerMock lesson={lesson} hue={subject.hue} startSec={currentLessonProgressSec} />

          <div>
            {/* เส้นทาง */}
            <nav aria-label="breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
                <li className="max-w-50 truncate">{p(subject.title)}</li>
                <li aria-hidden="true">
                  <Icon name="chevronRight" size={14} />
                </li>
                <li className="max-w-50 truncate">{p(section.title)}</li>
                <li aria-hidden="true">
                  <Icon name="chevronRight" size={14} />
                </li>
                <li className="font-medium text-text">#{lesson.order}</li>
              </ol>
            </nav>

            <h1 className="ui-heading mt-2.5 text-2xl sm:text-3xl">{p(lesson.title)}</h1>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar name={p(subject.instructor)} size="sm" />
                <div>
                  <p className="text-sm font-semibold">{p(subject.instructor)}</p>
                  <p className="text-xs text-muted">{t('lesson.instructor')}</p>
                </div>
                <Badge tone="primary" size="sm" className="ml-1">
                  {p(subject.level)}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-1">
                <ActionButton
                  icon="heart"
                  label={t('lesson.like')}
                  count="1.2k"
                  active={liked}
                  onClick={() => setLiked((v) => !v)}
                />
                <ActionButton
                  icon="bookmark"
                  label={t('lesson.save')}
                  active={saved}
                  onClick={() => setSaved((v) => !v)}
                />
                <ActionButton icon="download" label={t('lesson.download')} />
                <ActionButton icon="share" label={t('lesson.share')} />
              </div>
            </div>
          </div>

          <LessonTabs />
        </div>

        {/* ---------- คอลัมน์ขวา ---------- */}
        <aside className="min-w-0">
          <PlaylistPanel
            currentId={activeId}
            onSelect={setActiveId}
            onTakeQuiz={() => onNavigate?.('quiz')}
          />
        </aside>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={onClick ? Boolean(active) : undefined}
      className={cn(
        'ui-interactive ui-focusable inline-flex items-center gap-1.5 rounded-ui px-2.5 py-2 text-sm font-medium',
        active ? 'text-primary-ink' : 'text-muted hover:text-text',
      )}
    >
      <Icon name={icon} size={17} style={active ? { fill: 'currentColor' } : undefined} />
      <span className="max-sm:sr-only">{label}</span>
      {count && <span className="text-xs opacity-80">{count}</span>}
    </button>
  );
}

function LessonSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-24 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <Skeleton className="aspect-video w-full" rounded="card" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-8 w-3/4" />
          <div className="ui-surface space-y-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
        <div className="ui-surface space-y-3">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="flex gap-2.5">
              <Skeleton className="h-5 w-5" rounded="full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-2.5 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LessonScreen;
