import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Icon } from '@/components/Icon';
import { THAI_LABELS, LATIN_LABELS } from './QuestionCard';
import { cn } from '@/lib/cn';

/** แถวทบทวนคำตอบ — พับด้วย grid-template-rows: 0fr → 1fr ให้ auto-height ทำงานด้วย CSS ล้วน */
export function AnswerReviewItem({ question, result, index }) {
  const { t, p, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const labels = lang === 'th' ? THAI_LABELS : LATIN_LABELS;
  // ข้อเขียน/ข้อพูดไม่มี choices ให้แปลงเป็นป้าย ก/ข/ค/ง — ต้องแยกกิ่งไม่งั้นพังเป็นจอขาว
  const graded = result.graded !== false;

  const labelOf = (ids) =>
    ids.length
      ? ids
          .map((id) => labels[question.choices.findIndex((c) => c.id === id)])
          .filter(Boolean)
          .join(', ')
      : t('result.noAnswer');

  return (
    <li className="ui-panel overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="ui-focusable flex w-full items-start gap-3 p-4 text-left transition-colors duration-(--dur-fast) hover:bg-surface-2"
      >
<span
          className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full"
          style={{
            background: `color-mix(in oklch, var(--color-${graded ? (result.correct ? 'success' : 'danger') : 'warn'}) 20%, transparent)`,
            color: `var(--color-${graded ? (result.correct ? 'success' : 'danger') : 'warn'})`,
          }}
        >
          <Icon name={graded ? (result.correct ? 'check' : 'x') : 'flag'} size={15} strokeWidth={3} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="text-xs font-semibold text-muted">
            {t('quiz.qOf', { n: index + 1, total: result.total })}
          </span>
          <span className="mt-0.5 block line-clamp-2 text-sm font-medium">{p(question.prompt)}</span>
        </span>

        <Icon
          name="chevronDown"
          size={17}
          className="mt-1 shrink-0 text-muted transition-transform duration-(--dur-base)"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-(--dur-base) ease-(--ease-smooth)"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-border p-4">
{graded ? (
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted">{t('result.yourAnswer')}</dt>
                  <dd
                    className={cn('mt-0.5 font-semibold')}
                    style={{ color: `var(--color-${result.correct ? 'success' : 'danger'})` }}
                  >
                    {labelOf(result.selectedIds)}
                  </dd>
                </div>
                {!result.correct && (
                  <div>
                    <dt className="text-muted">{t('result.correctAnswer')}</dt>
                    <dd className="mt-0.5 font-semibold" style={{ color: 'var(--color-success)' }}>
                      {labelOf(question.answerIds)}
                    </dd>
                  </div>
                )}
              </dl>
            ) : (
              <div className="text-sm">
                <p className="text-muted">{t('result.yourAnswer')}</p>
                <p className="mt-1 whitespace-pre-line leading-relaxed">
                  {question.type === 'speaking'
                    ? t(result.selectedIds.length ? 'quiz.recorded' : 'result.noAnswer')
                    : result.selectedIds[0] || t('result.noAnswer')}
                </p>
              </div>
            )}

            {/* ตัวอย่างคำตอบเป็นเฉลย — โผล่ได้เฉพาะที่นี่ ห้ามโผล่ตอนกำลังทำข้อสอบ */}
            {question.sample && (
              <div className="ui-inset mt-3.5 p-3.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {t('result.sampleAnswer')}
                </p>
                <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed">{p(question.sample)}</p>
              </div>
            )}

            {/* บทพูดของข้อการฟัง — ระหว่างทำข้อสอบซ่อนไว้ ที่นี่เปิดให้อ่านได้แล้ว */}
            {question.audioScript && (
              <details className="ui-inset mt-3.5 p-3.5">
                <summary className="ui-focusable cursor-pointer text-xs font-semibold uppercase tracking-wide text-muted">
                  {t('result.transcript')}
                </summary>
                <p className="mt-2 text-sm leading-relaxed">{question.audioScript}</p>
              </details>
            )}

            {question.explanation && (
              <div className="ui-inset mt-3.5 p-3.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {t('result.explanation')}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed">{p(question.explanation)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export default AnswerReviewItem;
