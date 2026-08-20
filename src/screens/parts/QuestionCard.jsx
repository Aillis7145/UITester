import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { AudioScriptPlayer } from './AudioScriptPlayer';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { cn } from '@/lib/cn';

/** ป้ายตัวเลือกตามธรรมเนียมไทย ก ข ค ง แทน A B C D */
export const THAI_LABELS = ['ก', 'ข', 'ค', 'ง', 'จ', 'ฉ'];
export const LATIN_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function QuestionCard({ question, selected = [], onToggle, index }) {
  const { t, p, lang } = useI18n();
  const multi = question.type === 'multi';
  const open = question.type === 'typing' || question.type === 'speaking';
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
        {/* ข้อเขียน/ข้อพูดตรวจอัตโนมัติไม่ได้ ต้องบอกตั้งแต่ก่อนทำ ไม่ใช่ไปเซอร์ไพรส์ที่หน้าผลสอบ */}
        {open && (
          <Badge tone="neutral" size="sm" icon="flag">
            {t('quiz.notAutoGraded')}
          </Badge>
        )}
      </div>

      {/* บทความของข้อการอ่าน — ข้อเดียวกันใช้ร่วมกันหลายข้อ จึงพับได้เพื่อไม่ให้ต้องเลื่อนซ้ำทุกข้อ */}
      {question.passage && <PassagePanel passage={p(question.passage)} blank={question.blank} />}

      <h2 className="ui-heading mt-4 text-xl leading-snug sm:text-2xl">{p(question.prompt)}</h2>

      {question.instruction && (
        <p className="mt-2 text-muted">{p(question.instruction)}</p>
      )}

      {question.audioScript && <AudioScriptPlayer script={question.audioScript} className="mt-5" />}

      {question.guidelines?.length > 0 && (
        <div className="ui-inset mt-5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {t('quiz.guidelines')}
          </p>
          <ul className="mt-2.5 space-y-1.5 text-sm">
            {question.guidelines.map((g, i) => (
              <li key={i} className="flex gap-2.5">
                <Icon name="check" size={14} className="mt-1 shrink-0 text-primary-ink" />
                <span>{p(g)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

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

      {question.type === 'typing' && (
        <TypingAnswer question={question} value={selected[0] ?? ''} onChange={onToggle} />
      )}

      {question.type === 'speaking' && (
        <SpeakingAnswer question={question} done={selected.length > 0} onChange={onToggle} />
      )}

      {!open && (
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
      )}
    </article>
  );
}

/* ============================================================
   บทความของข้อการอ่าน
   ============================================================ */

function PassagePanel({ passage, blank }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(true);
  const [title, ...body] = passage.split('\n');

  return (
    <section className="ui-inset mt-4 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="ui-focusable flex w-full items-center gap-2 p-3.5 text-left transition-colors duration-(--dur-fast) hover:bg-surface-2"
      >
        <Icon
          name="chevronDown"
          size={16}
          className="shrink-0 text-muted transition-transform duration-(--dur-base)"
          style={{ transform: open ? 'none' : 'rotate(-90deg)' }}
        />
        <span className="ui-heading min-w-0 flex-1 truncate text-sm">{title}</span>
        <span className="shrink-0 text-xs text-muted">{open ? t('quiz.hidePassage') : t('quiz.showPassage')}</span>
      </button>

      {/* พับด้วย grid-template-rows: 0fr → 1fr ซึ่งเป็นวิธีเดียวที่ทำ auto-height ได้ด้วย CSS ล้วน */}
      <div
        className="grid transition-[grid-template-rows] duration-(--dur-base) ease-(--ease-smooth)"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="space-y-3 px-3.5 pb-3.5 text-sm leading-relaxed">
            {body.map((para, i) => (
              <p key={i}>
                {/* ไฮไลต์ช่องว่างของข้อนี้ ผู้เรียนจึงรู้ทันทีว่ากำลังเติมตรงไหนของบทความ */}
                {blank
                  ? para.split(new RegExp(`(\\(${blank}\\)\\s*_+)`)).map((part, k) =>
                      new RegExp(`^\\(${blank}\\)`).test(part) ? (
                        <mark
                          key={k}
                          className="rounded px-1 font-semibold"
                          style={{
                            background: 'color-mix(in oklch, var(--color-primary) 22%, transparent)',
                            color: 'var(--color-primary-ink)',
                          }}
                        >
                          {part}
                        </mark>
                      ) : (
                        part
                      ),
                    )
                  : para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ข้อเขียน — พิมพ์ตอบจริง
   ============================================================ */

function TypingAnswer({ question, value, onChange }) {
  const { t, p } = useI18n();
  // ช่องว่างซ้อนไม่ใช่คำ นับแบบนี้ตรงกับที่โจทย์บอกว่า "ประมาณ 20-30 คำ"
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="mt-6">
      {question.starter && (
        <p className="mb-2.5 text-sm text-muted">
          <span className="font-semibold">{t('quiz.starter')}</span> {p(question.starter)}
        </p>
      )}
      <textarea
        rows={7}
        value={value}
        onChange={(e) => onChange?.(e.target.value.trim() ? [e.target.value] : [])}
        placeholder={t('quiz.typeHere')}
        aria-label={p(question.prompt)}
        className="ui-inset ui-focusable w-full resize-y p-4 leading-relaxed"
      />
      <p className="mt-2 text-right text-sm text-muted tabular-nums">{t('quiz.wordCount', { n: words })}</p>
    </div>
  );
}

/* ============================================================
   ข้อพูด — ปุ่มอัดเสียงจำลอง
   ============================================================ */

/**
 * จับเวลาจริงแต่ไม่ได้อัดเสียงจริง
 * เพราะสิ่งที่ต้องประเมินในตัวอย่างหน้าจอคือ "แถบควบคุมที่ทาธีม" ไม่ใช่คุณภาพไฟล์เสียง
 * และการขอสิทธิ์ไมโครโฟนในหน้าตัวอย่างจะทำให้สคริปต์ถ่ายภาพทุกธีมค้างรอ permission
 */
function SpeakingAnswer({ question, done, onChange }) {
  const { t, p } = useI18n();
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timer = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  const start = () => {
    setRecording(true);
    setSeconds(0);
    timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };
  const stop = () => {
    clearInterval(timer.current);
    setRecording(false);
    onChange?.(['recorded']);
  };

  return (
    <div className="mt-6">
      {question.starter && (
        <p className="mb-3 text-sm text-muted">
          <span className="font-semibold">{t('quiz.starter')}</span> {p(question.starter)}
        </p>
      )}

      <div className="ui-inset flex flex-wrap items-center gap-4 p-4">
        <button
          type="button"
          onClick={recording ? stop : start}
          aria-label={recording ? t('quiz.stopRecording') : done ? t('quiz.rerecord') : t('quiz.record')}
          className={cn(
            'ui-interactive ui-focusable grid h-12 w-12 shrink-0 place-items-center rounded-full',
            recording ? 'bg-danger text-white' : 'bg-primary text-on-primary',
          )}
          style={recording ? { background: 'var(--color-danger)' } : undefined}
        >
          <Icon name={recording ? 'pause' : 'volume'} size={20} />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {recording ? t('quiz.recording') : done ? t('quiz.recorded') : t('quiz.record')}
          </p>
          <p className="mt-0.5 font-mono text-sm tabular-nums text-muted">
            {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
          </p>
        </div>

        {done && !recording && (
          <Button variant="ghost" size="sm" icon="refresh" onClick={start}>
            {t('quiz.rerecord')}
          </Button>
        )}
      </div>

      <p className="mt-2 text-xs text-muted">{t('quiz.recordMock')}</p>
    </div>
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
