import { useI18n } from '@/i18n/I18nProvider';
import { attemptsOf, dayAt } from '@/mock/records';
import { courseOf, levelDef, getProject } from '@/mock/nodes';
import { formatDate } from '@/lib/datetime';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';

/**
 * รายการทำแบบทดสอบท้ายบท "ทุกรอบ" ของบทเดียว
 *
 * การ์ดบนหน้าความคืบหน้าโชว์ได้แค่สามรอบล่าสุด เพราะถ้าโชว์ครบห้ารอบทุกใบ
 * แถวคอร์สที่มีสามสิบบทจะสูงจนเลื่อนหาคอร์สถัดไปไม่เจอ
 * ที่นี่คือที่ที่เห็นครบ — เรียงเก่า → ใหม่ พัฒนาการอ่านจากบนลงล่าง
 *
 * ใช้ Modal ตัวเดิมของโปรเจค ไม่เขียน popup ใหม่ —
 * ตัวนั้นขังโฟกัส ปิดด้วย Escape และ portal เข้า overlay host ของธีมให้แล้ว
 */
export function UnitAttemptsModal({ unit, onClose, onNavigate }) {
  const { t, p, lang } = useI18n();

  // Modal ต้องอยู่ในต้นไม้ตลอดเพื่อให้ transition ทำงาน จึงส่ง open=false แทนการไม่เรนเดอร์
  const rounds = unit ? attemptsOf(unit.id) : [];
  const course = unit ? courseOf(unit.id) : undefined;
  const project = unit ? getProject(unit.projectId) : undefined;
  const best = rounds.length ? Math.max(...rounds.map((a) => a.percent)) : 0;

  return (
    <Modal
      open={Boolean(unit)}
      onClose={onClose}
      title={unit ? `${p(levelDef(project, unit.level).label)} ${unit.order} · ${p(unit.title)}` : ''}
      description={course ? p(course.title) : ''}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.close')}
          </Button>
          <Button
            icon="flag"
            onClick={() => {
              onClose?.();
              onNavigate?.('quiz', { node: unit.id, set: 'unit' });
            }}
          >
            {t('progress.goToQuiz')}
          </Button>
        </>
      }
    >
      {rounds.length === 0 ? (
        <p className="text-sm text-muted">{t('progress.noAttempt')}</p>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge tone="primary" size="sm" icon="refresh">
              {t('progress.attemptCount', { n: rounds.length })}
            </Badge>
            <Badge tone="success" size="sm" icon="star">
              {t('progress.bestScore', { n: Math.round(best * 100) })}
            </Badge>
            {/* บอกตรงๆ ว่าบทไหนคิดจากคำถามจริง บทไหนเป็นข้อมูลจำลอง */}
            {rounds[0].real && (
              <Badge tone="neutral" size="sm" icon="file">
                {t('progress.realBank')}
              </Badge>
            )}
          </div>

          <ol className="grid gap-2">
            {rounds.map((a) => (
              <li
                key={a.id}
                className="ui-panel flex flex-wrap items-center gap-x-3 gap-y-1 p-3"
                style={{
                  background: `color-mix(in oklch, var(--color-${a.passed ? 'success' : 'danger'}) 12%, transparent)`,
                }}
              >
                <span className="w-16 shrink-0 text-xs font-semibold">{t('progress.round', { n: a.round })}</span>
                <span className="min-w-0 flex-1 text-sm">{formatDate(dayAt(a.dayOffset), lang)}</span>
                <span className="shrink-0 text-sm tabular-nums">
                  {a.score}/{a.total}
                </span>
                <span className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums">
                  {Math.round(a.percent * 100)}%
                </span>
                <span
                  className="inline-flex w-20 shrink-0 items-center justify-end gap-1 text-xs font-semibold"
                  style={{ color: `var(--color-${a.passed ? 'success' : 'danger'})` }}
                >
                  <Icon name={a.passed ? 'check' : 'x'} size={13} strokeWidth={2.5} />
                  {a.passed ? t('progress.passed') : t('progress.failed')}
                </span>
              </li>
            ))}
          </ol>
        </>
      )}
    </Modal>
  );
}

export default UnitAttemptsModal;
