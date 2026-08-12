import { useI18n } from '@/i18n/I18nProvider';
import { Badge } from '@/components/Badge';
import { Icon } from '@/components/Icon';
import { cn } from '@/lib/cn';

/** ป้ายตัวเลือกตามธรรมเนียมไทย ก ข ค ง แทน A B C D */
export const THAI_LABELS = ['ก', 'ข', 'ค', 'ง', 'จ', 'ฉ'];
export const LATIN_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function QuestionCard({ question, selected = [], onToggle, index }) {
  const { t, p, lang } = useI18n();
  const multi = question.type === 'multi';
  const labels = lang === 'th' ? THAI_LABELS : LATIN_LABELS;

  const pick = (choiceId) => {
    if (multi) {
      onToggle?.(
        selected.includes(choiceId)
          ? selected.filter((id) => id !== choiceId)
          : [...selected, choiceId],
      );
    } else {
      onToggle?.([choiceId]);
    }
  };

  const onKeyDown = (e) => {
    // ลูกศรเลื่อนระหว่างตัวเลือกตามข้อกำหนดของ radiogroup
    if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) return;
    e.preventDefault();
    const buttons = [...e.currentTarget.querySelectorAll('[data-choice]')];
    const at = buttons.indexOf(document.activeElement);
    const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1;
    const next = buttons[(at + dir + buttons.length) % buttons.length];
    next?.focus();
    if (!multi) pick(next?.dataset.choice);
  };

  return (
    <article className="ui-surface p-5 sm:p-7">
      <div className="flex flex-wrap items-center gap-2.5">
        <Badge tone="primary" size="sm">
          {t('quiz.qOf', { n: index + 1, total: question.total })}
        </Badge>
        {multi && (
          <Badge tone="warn" size="sm" icon="list">
            {t('quiz.multiHint')}
          </Badge>
        )}
      </div>

      <h2 className="ui-heading mt-4 text-xl leading-snug sm:text-2xl">{p(question.prompt)}</h2>

      {question.code && (
        <pre className="ui-inset mt-5 overflow-x-auto p-4 font-mono text-sm leading-relaxed">
          <code>
            {question.code.split('\n').map((line, i) => (
              <span key={i} className="block">
                <span className="mr-4 select-none opacity-40 tabular-nums">
                  {String(i + 1).padStart(2, ' ')}
                </span>
                {line}
              </span>
            ))}
          </code>
        </pre>
      )}

      {question.chart === 'overfit' && <OverfitChart />}

      <div
        role={multi ? 'group' : 'radiogroup'}
        aria-label={p(question.prompt)}
        onKeyDown={onKeyDown}
        className="mt-6 grid gap-2.5"
      >
        {question.choices.map((choice, i) => {
          const isSelected = selected.includes(choice.id);
          return (
            <button
              key={choice.id}
              type="button"
              data-choice={choice.id}
              role={multi ? 'checkbox' : 'radio'}
              aria-checked={isSelected}
              tabIndex={multi || isSelected || (selected.length === 0 && i === 0) ? 0 : -1}
              onClick={() => pick(choice.id)}
              className={cn(
                'ui-interactive ui-focusable flex w-full items-center gap-3.5 p-4 text-left',
                isSelected ? 'ui-surface' : 'ui-panel',
              )}
              style={
                isSelected
                  ? { boxShadow: 'var(--shadow-glow)', borderColor: 'var(--color-primary)' }
                  : undefined
              }
            >
              <span
                className={cn(
                  'grid h-9 w-9 shrink-0 place-items-center font-bold transition-colors duration-(--dur-fast)',
                  multi ? 'rounded-ui' : 'rounded-full',
                  isSelected
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-2 text-muted',
                )}
              >
                {isSelected && multi ? <Icon name="check" size={17} strokeWidth={3} /> : labels[i]}
              </span>
              <span className={cn('min-w-0 flex-1', isSelected && 'font-semibold')}>
                {p(choice.text)}
              </span>
            </button>
          );
        })}
      </div>
    </article>
  );
}

/** กราฟ loss แบบง่าย — SVG ล้วน ไม่ใช้ chart library เพราะต้องการแค่รูปทรงที่สื่อความ */
function OverfitChart() {
  const { p } = useI18n();
  const train = 'M8,20 C40,50 90,84 190,96';
  const validation = 'M8,24 C40,52 84,74 108,72 C140,70 165,44 190,26';

  return (
    <figure className="ui-inset mt-5 p-4">
      <svg viewBox="0 0 200 110" className="h-auto w-full" role="img" aria-label="loss curve">
        {/* แกน */}
        <line x1="8" y1="100" x2="196" y2="100" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        <line x1="8" y1="8" x2="8" y2="100" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        {/* เส้นแบ่งรอบที่ 40 */}
        <line
          x1="108"
          y1="8"
          x2="108"
          y2="100"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="3 3"
          opacity="0.35"
        />
        <path d={train} fill="none" stroke="var(--color-accent)" strokeWidth="2.2" strokeLinecap="round" />
        <path d={validation} fill="none" stroke="var(--color-warn)" strokeWidth="2.2" strokeLinecap="round" />
        <text x="112" y="16" fontSize="7" fill="currentColor" opacity="0.65">
          epoch 40
        </text>
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full" style={{ background: 'var(--color-accent)' }} />
          {p({ th: 'ชุดฝึก (train)', en: 'train' })}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full" style={{ background: 'var(--color-warn)' }} />
          {p({ th: 'ชุดตรวจสอบ (validation)', en: 'validation' })}
        </span>
      </figcaption>
    </figure>
  );
}

export default QuestionCard;
