import { useI18n } from '@/i18n/I18nProvider';
import { useScreenState } from './screenState';
import { examCourses, getProject, resumeContentOf } from '@/mock/nodes';
import { courseExamFor, COURSE_SET } from '@/mock/quizzes';
import { certificateOf } from '@/mock/records';
import { formatClock } from '@/hooks/useCountdown';
import { Badge } from '@/components/Badge';
import { Icon } from '@/components/Icon';
import { Skeleton } from '@/components/Skeleton';

/**
 * เลือกวิชาที่จะสอบ — ประตูบานแรกของแท็บ "แบบทดสอบ"
 *
 * เดิมกดแท็บแล้วเข้าห้องสอบทันทีโดยไม่ได้บอกด้วยซ้ำว่ากำลังจะสอบวิชาอะไร
 * ซึ่งเป็นสิ่งที่ระบบสอบจริงไม่ทำ — ผู้เข้าสอบต้องรู้ก่อนว่าเลือกอะไรอยู่
 *
 * แสดงเฉพาะวิชาที่มีการสอบวัดระดับจริง (EXAM_PROJECT_IDS ใน projects.js)
 * วิชาประถมวัดผลด้วยแบบทดสอบท้ายบทระหว่างเรียน ไม่มีการสอบทั้งคอร์ส
 * เอามาเรียงรวมกันจะกลายเป็นรายการ 38 บรรทัดที่ส่วนใหญ่กดไม่ได้
 *
 * ข้อมูลข้อสอบทุกตัว (จำนวนข้อ เวลา เกณฑ์ผ่าน) อ่านจากชุดข้อสอบจริงที่จะได้
 * ไม่ใช่ตัวเลขที่พิมพ์ไว้บนการ์ด การ์ดกับห้องสอบจึงไม่มีทางบอกคนละเลข
 */
export function ExamsScreen({ onNavigate }) {
  const { t, p } = useI18n();
  const { showSkeleton } = useScreenState();

  if (showSkeleton) return <ExamsSkeleton />;

  // จัดกลุ่มตามวิชา — CEFR กับ HSK เป็นคนละระบบวัดระดับ เรียงปนกันจะอ่านเหมือนสุ่ม
  const groups = [];
  for (const course of examCourses()) {
    const project = getProject(course.projectId);
    const last = groups[groups.length - 1];
    if (last?.project.id === project.id) last.courses.push(course);
    else groups.push({ project, courses: [course] });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 pb-24 sm:px-6 lg:px-8">
      <header>
        <h1 className="ui-heading text-2xl sm:text-3xl">{t('exams.title')}</h1>
        <p className="mt-2 max-w-2xl text-muted">{t('exams.lead')}</p>
      </header>

      <div className="mt-7 grid gap-8">
        {groups.map(({ project, courses }) => (
          <section key={project.id}>
            <div className="mb-3 flex flex-wrap items-baseline gap-2.5">
              <h2 className="ui-heading text-lg">{p(project.name)}</h2>
              <span className="text-sm text-muted">{t('exams.courseCount', { n: courses.length })}</span>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {courses.map((course) => (
                <li key={course.id}>
                  <ExamCard course={course} onNavigate={onNavigate} t={t} p={p} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function ExamCard({ course, onNavigate, t, p }) {
  // ชุดข้อสอบที่จะได้จริงเมื่อกดเข้าไป — ถามจากที่เดียวกับที่ห้องสอบถาม
  // เป็นข้อสอบ "ปลายคอร์ส" 50 ข้อ ไม่ใช่ท้ายบท ทางเข้านี้จึงต่างจากปุ่มบนหน้าวิดีโอ
  const start = resumeContentOf(course.id);
  const exam = courseExamFor(course);
  const earned = certificateOf(course.id);

  return (
    <button
      type="button"
      onClick={() => onNavigate?.('examstart', { node: start?.id ?? course.id, set: COURSE_SET })}
      className="ui-surface ui-interactive ui-focusable group flex w-full flex-col overflow-hidden p-0 text-left"
    >
      <span className="relative block aspect-[16/7] w-full overflow-hidden bg-surface-2">
        <img
          src={course.cover}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-(--dur-slow) ease-(--ease-smooth) group-hover:scale-105"
        />
        {/* เหลือเฉพาะป้ายระดับบนรูป เพราะ tone="solid" เป็นพื้นทึบจึงอ่านออกทับภาพถ่ายได้
            ป้ายโทนอื่นพื้นโปร่งแสง 20% วางบนรูปแล้วแทบมองไม่เห็น */}
        <span className="absolute left-2.5 top-2.5">
          <Badge tone="solid" size="sm" icon={course.icon}>
            {p(course.difficulty)}
          </Badge>
        </span>
      </span>

      <span className="flex min-w-0 flex-1 flex-col p-4">
        <span className="flex flex-wrap items-center gap-2">
          <span className="ui-heading line-clamp-1 text-base">{p(course.title)}</span>
          {earned && (
            <Badge tone="success" size="sm" icon="award">
              {t('exams.alreadyPassed')}
            </Badge>
          )}
        </span>
        <span className="mt-0.5 line-clamp-1 text-sm text-muted">{p(course.subtitle)}</span>

        <span className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
          <Fact icon="flag" text={t('exams.items', { n: exam.questions.length })} />
          <Fact icon="clock" text={formatClock(exam.timeLimitSec)} />
          <Fact icon="check" text={t('exams.passMark', { n: Math.round(exam.passMark * 100) })} />
        </span>

        <span className="mt-3.5 flex items-center gap-1.5 text-sm font-semibold text-primary-ink">
          {t('exams.enter')}
          <Icon
            name="chevronRight"
            size={16}
            className="transition-transform duration-(--dur-base) group-hover:translate-x-1"
          />
        </span>
      </span>
    </button>
  );
}

function Fact({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon name={icon} size={13} className="shrink-0" />
      {text}
    </span>
  );
}

function ExamsSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 pb-24 sm:px-6 lg:px-8">
      <Skeleton className="h-8 w-2/5" />
      <Skeleton className="mt-3 h-3 w-3/5" />
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="ui-surface overflow-hidden p-0">
            <Skeleton className="aspect-[16/7] w-full" rounded="card" />
            <div className="space-y-2.5 p-4">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExamsScreen;
