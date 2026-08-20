import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { useScreenState } from './screenState';
import { useCountdown } from '@/hooks/useCountdown';
import { submittedAnswers } from '@/mock/data';
import { useAppRoute } from './appRoute';
import { QuestionCard } from './parts/QuestionCard';
import { QuestionNavigator } from './parts/QuestionNavigator';
import { QuizTimer } from './parts/QuizTimer';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { ProgressBar } from '@/components/ProgressBar';
import { cn } from '@/lib/cn';

export function QuizScreen({ onNavigate }) {
  const { t, p } = useI18n();
  const { forceLoading } = useScreenState();
  const { quiz } = useAppRoute();

  /**
   * ชุดตัวอย่างเปิดมาแบบ "ทำไปแล้วบางส่วน" เพราะเป็นหน้าโชว์ —
   * เริ่มข้อ 4 ผังข้อสอบจึงมีครบทั้ง 4 สถานะตั้งแต่เปิด และข้อนั้นมีบล็อกโค้ดที่ธีมต่างกันชัด
   *
   * ชุดจริงต้องเริ่มข้อ 1 และว่างเปล่า ไม่งั้นผู้เรียนเปิดมาเจอคำตอบของคนอื่นติดมาแล้ว
   */
  const demo = quiz.demo === true;
  const [index, setIndex] = useState(demo ? 3 : 0);
  const [answers, setAnswers] = useState(() =>
    demo ? { q1a: submittedAnswers.q1a, q2a: submittedAnswers.q2a, q3a: submittedAnswers.q3a } : {},
  );
  const [flagged, setFlagged] = useState(() => new Set(demo ? ['q5a'] : []));
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { left } = useCountdown(quiz.timeLimitSec - (demo ? 155 : 0));

  const questions = quiz.questions;
  const question = questions[index];
  const answeredCount = useMemo(
    () => questions.filter((q) => (answers[q.id] ?? []).length > 0).length,
    [answers, questions],
  );

  const isLast = index === questions.length - 1;

  const setAnswer = (ids) => setAnswers((prev) => ({ ...prev, [question.id]: ids }));

  const toggleFlag = () =>
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(question.id)) next.delete(question.id);
      else next.add(question.id);
      return next;
    });

  const go = (delta) => setIndex((i) => Math.min(questions.length - 1, Math.max(0, i + delta)));

  const submit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setConfirming(false);
      onNavigate?.('results');
    }, 700);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 pb-24 sm:px-6 lg:px-8">
      {/* ---------- แถบบน ---------- */}
      <header className="ui-surface flex flex-wrap items-center gap-4 p-4">
        <div className="min-w-0 flex-1">
          <h1 className="ui-heading truncate text-lg">{p(quiz.title)}</h1>
          <p className="mt-0.5 text-sm text-muted">
            {t('quiz.qOf', { n: index + 1, total: questions.length })}
          </p>
        </div>
        <QuizTimer secondsLeft={left} />
      </header>

      {/* วัดจาก "จำนวนข้อที่ตอบแล้ว" ไม่ใช่ข้อที่กำลังเปิดอยู่
          ของเดิมนับตามข้อที่ไถผ่าน กดข้ามไปข้อสุดท้ายโดยไม่ตอบสักข้อแถบก็เต็มแล้ว
          ซึ่งอ่านว่า "ทำเสร็จแล้ว" ทั้งที่ยังไม่ได้ตอบอะไรเลย
          ตอนนี้เต็มแถบเมื่อตอบครบทุกข้อจริงเท่านั้น จึงติดคำว่า "ความคืบหน้า" ได้ตรงความหมาย
          ส่วน "ข้อ N จาก ทั้งหมด" ย้ายไปอยู่ใต้ชื่อชุดข้อสอบบนหัวแล้ว ไม่ได้หายไป */}
      <ProgressBar
        value={answeredCount / questions.length}
        tone={answeredCount === questions.length ? 'success' : 'primary'}
        showLabel
        suffix={`· ${t('quiz.answered', { n: answeredCount, total: questions.length })}`}
        className="mt-3"
      />

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
        {/* ---------- คำถาม ---------- */}
        <div className="min-w-0">
          <QuestionCard
            key={question.id}
            question={{ ...question, total: questions.length }}
            index={index}
            selected={answers[question.id] ?? []}
            onToggle={setAnswer}
          />

          {/* ---------- แถบล่าง ---------- */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <Button variant="ghost" icon="arrowLeft" disabled={index === 0} onClick={() => go(-1)}>
              {t('common.prev')}
            </Button>

            <button
              type="button"
              onClick={toggleFlag}
              aria-pressed={flagged.has(question.id)}
              className={cn(
                'ui-interactive ui-focusable inline-flex items-center gap-1.5 rounded-ui px-3 py-2.5 text-sm font-medium',
                flagged.has(question.id) ? 'text-warn' : 'text-muted hover:text-text',
              )}
              style={flagged.has(question.id) ? { color: 'var(--color-warn)' } : undefined}
            >
              <Icon name="flag" size={16} />
              {flagged.has(question.id) ? t('quiz.flagged') : t('quiz.flag')}
            </button>

            <div className="ml-auto flex items-center gap-2.5">
              {!isLast && (
                <Button variant="ghost" onClick={() => go(1)}>
                  {t('quiz.skip')}
                </Button>
              )}
              {isLast ? (
                <Button icon="check" onClick={() => setConfirming(true)}>
                  {t('common.submit')}
                </Button>
              ) : (
                <Button iconRight="arrowRight" onClick={() => go(1)}>
                  {t('common.next')}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ---------- ผังข้อสอบ ---------- */}
        <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
          <QuestionNavigator
            questions={questions}
            answers={answers}
            flagged={flagged}
            current={index}
            onJump={setIndex}
          />
        </aside>
      </div>

      {/* ---------- ยืนยันการส่ง ---------- */}
      <Modal
        open={confirming}
        onClose={() => setConfirming(false)}
        title={t('quiz.confirmTitle')}
        description={t('quiz.confirmBody', { answered: answeredCount, total: questions.length })}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirming(false)}>
              {t('quiz.keepGoing')}
            </Button>
            <Button icon="check" loading={submitting || forceLoading} onClick={submit}>
              {t('quiz.confirmSubmit')}
            </Button>
          </>
        }
      >
        {/* ประโยคเหนือแถบในโมดัลอธิบายอยู่แล้ว จึงไม่ต้องมีบรรทัดกำกับซ้ำ
            แต่ต้องมี label ให้ screen reader — เดิมไม่มีเลย อ่านออกมาเป็นแถบไร้ชื่อ */}
        <ProgressBar
          value={answeredCount / questions.length}
          tone={answeredCount === questions.length ? 'success' : 'warn'}
          label={t('quiz.answered', { n: answeredCount, total: questions.length })}
        />
      </Modal>
    </div>
  );
}

export default QuizScreen;
