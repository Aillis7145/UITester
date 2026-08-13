import { useI18n } from '@/i18n/I18nProvider';
import { useScreenState } from './screenState';
import { projects } from '@/mock/projects';
import { rootsOf, contentCountOf, progressOf } from '@/mock/nodes';
import { Badge } from '@/components/Badge';
import { Icon } from '@/components/Icon';
import { ProgressBar } from '@/components/ProgressBar';
import { Skeleton } from '@/components/Skeleton';

/**
 * หน้าเลือกโครงการ — ประตูแรกหลังล็อกอิน
 *
 * แถบบันไดชั้นบนการ์ดคือหัวใจของหน้านี้
 * เป็นที่เดียวที่ "แต่ละโครงการลึกไม่เท่ากัน" มองเห็นได้ด้วยตา ไม่ใช่แค่เป็นจริงในโค้ด
 * ผู้ประเมินจึงรู้ตั้งแต่หน้าแรกว่ากดเข้าไปแล้วจะเจอกี่ขั้น
 */
export function ProjectsScreen({ onNavigate }) {
  const { t, p } = useI18n();
  const { showSkeleton } = useScreenState();

  if (showSkeleton) return <ProjectsSkeleton />;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="ui-heading text-2xl sm:text-3xl">{t('project.title')}</h1>
        <p className="mt-2 text-muted">{t('project.lead')}</p>
      </header>

      <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const courses = rootsOf(project.id);
          const total = courses.reduce((sum, c) => sum + contentCountOf(c.id), 0);
          const done = courses.reduce((sum, c) => sum + contentCountOf(c.id) * progressOf(c.id), 0);
          const progress = total ? done / total : 0;

          // บันไดชั้นของโครงการนี้ + ชั้นใบไม้ที่มีเสมอ
          const ladder = [...project.levels.map((l) => p(l.plural)), p(project.contentLabel)];

          return (
            <article
              key={project.id}
              role="button"
              tabIndex={0}
              onClick={() => onNavigate?.('subjects', { project: project.id, node: null })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate?.('subjects', { project: project.id, node: null });
                }
              }}
              className="ui-surface ui-interactive ui-focusable group flex cursor-pointer flex-col overflow-hidden p-0 text-left"
            >
              <div className="relative aspect-16/9 w-full overflow-hidden bg-surface-2">
                <img
                  src={project.cover}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-(--dur-slow) ease-(--ease-smooth) group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/25" />
                <span className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-ui bg-primary text-on-primary shadow-raised">
                  <Icon name={project.icon} size={18} />
                </span>
                <span className="absolute bottom-3 left-3 right-3 truncate text-lg font-bold text-white">
                  {p(project.name)}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <p className="line-clamp-2 text-sm text-muted">{p(project.tagline)}</p>

                {/* ---------- บันไดชั้น ---------- */}
                <div className="mt-3.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {t('project.ladder', { n: project.levels.length })}
                  </p>
                  <ol className="mt-2 flex flex-wrap items-center gap-1">
                    {ladder.map((label, i) => (
                      <li key={label} className="flex items-center gap-1">
                        {i > 0 && (
                          <span aria-hidden="true" className="text-muted">
                            <Icon name="chevronRight" size={12} />
                          </span>
                        )}
                        {/* ชั้นสุดท้ายคือที่อยู่ของสื่อจริง ทำให้เด่นกว่าชั้นกล่อง
                            ใช้ solid ไม่ใช่ primary เพราะ solid เป็นคู่สี on-primary/primary
                            ซึ่งผ่านการตรวจ contrast อยู่แล้วทุกธีม */}
                        <Badge size="sm" tone={i === ladder.length - 1 ? 'solid' : 'neutral'}>
                          {label}
                        </Badge>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="mt-4 flex items-center gap-3 text-sm text-muted">
                  <span className="flex items-center gap-1.5">
                    <Icon name="grid" size={13} />
                    {t('project.courseCount', { n: courses.length, level: p(project.levels[0].plural) })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="list" size={13} />
                    {t('project.contentCount', { n: total })}
                  </span>
                </div>

                <div className="mt-auto pt-4">
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-primary-ink">
                      {t('project.open')}
                      <Icon
                        name="arrowRight"
                        size={15}
                        className="transition-transform duration-(--dur-base) group-hover:translate-x-1"
                      />
                    </span>
                    <span className="font-semibold text-primary-ink">
                      {Math.round(progress * 100)}%
                    </span>
                  </div>
                  <ProgressBar value={progress} size="sm" label={p(project.name)} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <Skeleton className="h-8 w-72" />
      <Skeleton className="mt-2 h-5 w-96" />
      <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="ui-surface overflow-hidden p-0">
            <Skeleton className="aspect-16/9 w-full rounded-none" />
            <div className="space-y-2.5 p-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-2 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectsScreen;
