import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { useScreenState } from './screenState';
import { useAppRoute } from './appRoute';
import { crumbsFor, targetFor } from './nav';
import { currentLessonProgressSec } from '@/mock/data';
import { getNode, childrenOf, courseOf, unitOf, nextLevel, levelDef } from '@/mock/nodes';
import { ContentStage } from './parts/ContentStage';
import { PlaylistPanel } from './parts/PlaylistPanel';
import { LessonTabs } from './parts/LessonTabs';
import { Avatar } from '@/components/Avatar';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Badge } from '@/components/Badge';
import { Icon } from '@/components/Icon';
import { Skeleton } from '@/components/Skeleton';
import { cn } from '@/lib/cn';

export function LessonScreen({ onNavigate }) {
  const { t, p } = useI18n();
  const { showSkeleton } = useScreenState();

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  // ตำแหน่งมาจาก URL ไม่ใช่ useState — deep link จึงตรงกับสิ่งที่เห็นจริง
  // และภาพในโหมดเทียบข้างกับภาพถ่ายอัตโนมัติได้ผลเหมือนกันทุกครั้ง
  const { project, node: content } = useAppRoute();
  const course = courseOf(content.id);

  /**
   * เพลย์ลิสต์ = "ทุกอย่างในหน่วยที่เลือก" เท่านั้น
   *
   * เดิมใช้พี่น้องของกล่องแม่ ซึ่งลากหัวข้อของ *ทุกหน่วยพี่น้อง* เข้ามาด้วย
   * พอเป็นหลักสูตรจริง หน้าวิดีโอของภาคเรียนที่ 1 จะโชว์หัวข้อของภาคเรียนที่ 2 ปนมาทั้งชุด
   *
   * ถามความลึกจาก "ประกาศของวิชา" ไม่ใช่จากตัวอย่างลูกใบแรก
   * เพราะหน่วยที่ว่างจะพาไปกิ่งผิดเงียบๆ โดยไม่มีอะไรฟ้อง
   */
  const unit = unitOf(content.id) ?? getNode(content.parentId);
  const grouped = nextLevel(project, unit.level) !== 'content';
  // ชื่อหน่วยจากหลักสูตรจริงบางทีขึ้นต้นด้วยชื่อชั้นอยู่แล้ว ("ภาคเรียนที่ 1")
  // ปล่อยไว้หัวแผงจะอ่านว่า "ภาคเรียน 1 / ภาคเรียนที่ 1" ซ้อนกัน
  const unitLabel = p(levelDef(project, unit.level).label);
  const unitKicker = p(unit.title).startsWith(unitLabel) ? undefined : `${unitLabel} ${unit.order}`;
  const groups = grouped
    ? childrenOf(unit.id).map((g) => ({ node: g, items: childrenOf(g.id) }))
    : [{ node: unit, items: childrenOf(unit.id) }];

  if (showSkeleton) return <LessonSkeleton />;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-24 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* ---------- คอลัมน์ซ้าย ---------- */}
        <div className="min-w-0 space-y-5">
          {/* เส้นทางอยู่ "เหนือวิดีโอ" — ตำแหน่งเดียวกับทุกหน้าอื่นในแอป
              ผู้เรียนจึงหาทางกลับได้จากที่เดิมเสมอ ไม่ต้องเลื่อนผ่านวิดีโอลงไปหา

              ต้องอยู่ในคอลัมน์ซ้าย ห้ามย้ายออกไปเหนือกริด
              เพราะ PlaylistPanel คำนวณความสูงจาก calc(var(--frame-h) - 8rem)
              ของที่แทรกเหนือกริดจะดันคอลัมน์ขวาลง แล้วปุ่มท้ายเพลย์ลิสต์ตกนอกกรอบเครื่อง */}
          <Breadcrumb items={crumbsFor({ project, node: content, onNavigate, p, t })} />

          <ContentStage node={content} hue={course.hue} startSec={currentLessonProgressSec} />

          <div>
            <h1 className="ui-heading text-2xl sm:text-3xl">{p(content.title)}</h1>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar name={p(course.instructor)} size="sm" />
                <div>
                  <p className="text-sm font-semibold">{p(course.instructor)}</p>
                  <p className="text-xs text-muted">{t('lesson.instructor')}</p>
                </div>
                {/* วิชาก่อน แล้วค่อยระดับ — เส้นทางขึ้นต้นด้วย "คอร์สทั้งหมด" จึงไม่ได้บอกวิชา */}
                <Badge tone="primary" size="sm" icon={project.icon} className="ml-1">
                  {p(project.short)}
                </Badge>
                <Badge tone="neutral" size="sm">
                  {p(course.difficulty)}
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

          {/* เอกสารเป็นของ "หน่วย" ไม่ใช่ของคลิป จึงส่งมาจาก unit ไม่ใช่ content
              คอร์สที่ไม่มี unit.resources ตกไปใช้ไฟล์กลางของ detail เหมือนเดิม */}
          <LessonTabs detail={content.detail ?? course.detail} resources={unit.resources} />
        </div>

        {/* ---------- คอลัมน์ขวา ---------- */}
        <aside className="min-w-0">
          <PlaylistPanel
            groups={groups}
            currentId={content.id}
            title={p(unit.title)}
            kicker={unitKicker}
            onSelect={(n) => onNavigate?.(...targetFor(n))}
            onPractice={course.practice?.length ? () => onNavigate?.('practice', { node: content.id }) : undefined}
            onTakeQuiz={() => onNavigate?.('quiz', { node: content.id, set: 'unit' })}
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
