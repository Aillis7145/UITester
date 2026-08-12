import { useI18n } from '@/i18n/I18nProvider';
import { Icon } from '@/components/Icon';
import { cn } from '@/lib/cn';

/** ผังข้อสอบ — 4 สถานะที่ต้องแยกออกจากกันได้ด้วยตาในทุกธีม */
export function QuestionNavigator({ questions, answers, flagged, current, onJump }) {
  const { t } = useI18n();

  return (
    <nav aria-label={t('quiz.navigator')} className="ui-surface p-4">
      <h2 className="ui-heading mb-3 text-sm">{t('quiz.navigator')}</h2>

      <ol className="grid grid-cols-5 gap-2 sm:grid-cols-10 lg:grid-cols-5">
        {questions.map((q, i) => {
          const answered = (answers[q.id] ?? []).length > 0;
          const isFlagged = flagged.has(q.id);
          const isCurrent = i === current;

          return (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => onJump?.(i)}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`${t('quiz.qOf', { n: i + 1, total: questions.length })} — ${
                  answered ? t('quiz.stateAnswered') : t('quiz.stateUnanswered')
                }${isFlagged ? `, ${t('quiz.stateFlagged')}` : ''}`}
                className={cn(
                  'ui-interactive ui-focusable relative grid aspect-square w-full place-items-center rounded-ui text-sm font-semibold',
                  isCurrent
                    ? 'bg-primary text-on-primary'
                    : answered
                      ? 'bg-surface-2 text-text'
                      : 'ui-panel text-muted',
                )}
                style={isCurrent ? { boxShadow: 'var(--shadow-glow)' } : undefined}
              >
                {i + 1}
                {isFlagged && (
                  <Icon
                    name="flag"
                    size={11}
                    className="absolute right-0.5 top-0.5"
                    style={{ color: 'var(--color-warn)' }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ol>

      <dl className="mt-4 grid gap-1.5 text-xs text-muted">
        <LegendRow swatchClass="bg-primary" label={t('quiz.stateCurrent')} />
        <LegendRow swatchClass="bg-surface-2" label={t('quiz.stateAnswered')} />
        <LegendRow swatchClass="ui-panel" label={t('quiz.stateUnanswered')} />
        <LegendRow icon="flag" label={t('quiz.stateFlagged')} />
      </dl>
    </nav>
  );
}

function LegendRow({ swatchClass, icon, label }) {
  return (
    <div className="flex items-center gap-2">
      {icon ? (
        <Icon name={icon} size={13} style={{ color: 'var(--color-warn)' }} className="h-3.5 w-3.5" />
      ) : (
        <span className={cn('h-3.5 w-3.5 rounded-[0.25rem]', swatchClass)} />
      )}
      <dt>{label}</dt>
    </div>
  );
}

export default QuestionNavigator;
