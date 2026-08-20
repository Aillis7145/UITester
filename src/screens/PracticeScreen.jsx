import { useI18n } from '@/i18n/I18nProvider';
import { useScreenState } from './screenState';
import { useAppRoute } from './appRoute';
import { crumbsFor } from './nav';
import { courseOf, unitOf, getNode } from '@/mock/nodes';
import { practiceSetsOf, practiceSetId } from '@/mock/quizzes';
import { Badge } from '@/components/Badge';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Icon } from '@/components/Icon';
import { Skeleton } from '@/components/Skeleton';

/**
 * หน้าเลือกชุดแบบฝึกหัด — คั่นระหว่างปุ่ม "ทำแบบฝึกหัด" กับหน้าข้อสอบ
 *
 * มีเพราะแผ่นอังกฤษผู้ใหญ่ (B1/B2) มีแบบฝึกหัดแยกเป็นห้าทักษะจริงในหลักสูตร
 * เดิมข้อ 4.x/5.x ปนอยู่ในเพลย์ลิสต์ ทำให้ผู้เรียนต้องไถผ่านรายการ "เฉลย…" สิบกว่าแถว
 * ย้ายมาอยู่หลังปุ่มแทน แล้วเพลย์ลิสต์เหลือแต่สื่อที่ดูได้จริง
 *
 * รายชื่อทักษะมาจากข้อมูล (course.practice) ไม่ใช่ค่าตายตัวในไฟล์นี้
 * คอร์สที่หลักสูตรไม่มีแบบฝึกหัดจึงไม่มีปุ่มให้กดตั้งแต่ต้น และหน้านี้ไม่มีทางเข้า
 */
const SKILL_ICONS = {
  grammar: 'list',
  reading: 'book',
  listening: 'volume',
  writing: 'file',
  speaking: 'user',
};

export function PracticeScreen({ onNavigate }) {
  const { t, p } = useI18n();
  const { showSkeleton } = useScreenState();
  const { project, node: content } = useAppRoute();

  const course = courseOf(content.id);
  const unit = unitOf(content.id) ?? getNode(content.parentId);
  const skills = course.practice ?? [];
  // ชุดคำถามจริงมีเฉพาะบทที่แปลงจากไฟล์ Word แล้ว บทอื่นยังไม่มีจำนวนข้อให้บอก
  // จึงไม่แสดงบรรทัดจำนวนข้อเลย ดีกว่าเดาตัวเลขขึ้นมาเอง
  const sets = practiceSetsOf(content);

  if (showSkeleton) return <PracticeSkeleton />;

  return (
    <div className="mx-auto max-w-4xl px-4 pt-6 pb-24 sm:px-6 lg:px-8">
      <Breadcrumb items={crumbsFor({ project, node: content, onNavigate, p, t })} />

      <header className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{p(unit.title)}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2.5">
          <h1 className="ui-heading text-2xl sm:text-3xl">{t('practice.title')}</h1>
          <Badge tone="primary" size="sm" icon={project.icon}>
            {p(project.short)}
          </Badge>
        </div>
        <p className="mt-2 max-w-2xl text-muted">{t('practice.lead', { course: p(course.title) })}</p>
      </header>

      {skills.length === 0 ? (
        // คอร์สที่หลักสูตรไม่มีแบบฝึกหัด — ไม่มีปุ่มพามาอยู่แล้ว แต่ ?node ที่พิมพ์เองพามาได้
        <div className="ui-surface mt-7 grid place-items-center px-6 py-16 text-center">
          <Icon name="flag" size={26} className="text-muted" />
          <p className="mt-3 text-muted">{t('practice.none')}</p>
        </div>
      ) : (
        <ul className="mt-7 grid gap-4 sm:grid-cols-2">
          {skills.map((skill) => (
            <li key={skill}>
              <button
                type="button"
                onClick={() => onNavigate?.('quiz', { node: content.id, set: practiceSetId(skill) })}
                className="ui-surface ui-interactive ui-focusable group flex w-full items-center gap-4 p-5 text-left"
              >
                <span
                  aria-hidden="true"
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-ui"
                  style={{
                    background: 'color-mix(in oklch, var(--color-primary) 14%, transparent)',
                    color: 'var(--color-primary-ink)',
                  }}
                >
                  <Icon name={SKILL_ICONS[skill] ?? 'flag'} size={20} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="ui-heading block text-base">{t(`practice.${skill}`)}</span>
                  {sets?.[skill] && (
                    <span className="mt-0.5 block text-sm text-muted">
                      {t('practice.itemCount', { n: sets[skill].questions.length })}
                    </span>
                  )}
                </span>

                <span className="shrink-0 text-muted transition-transform duration-(--dur-base) group-hover:translate-x-1">
                  <Icon name="chevronRight" size={18} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PracticeSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-6 pb-24 sm:px-6 lg:px-8">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="mt-4 h-8 w-2/3" />
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="ui-surface flex items-center gap-4 p-5">
            <Skeleton className="h-12 w-12" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PracticeScreen;
