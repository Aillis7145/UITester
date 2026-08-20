import { useI18n } from '@/i18n/I18nProvider';
import { useThemeMeta } from '@/theme/ThemeFrame';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { quizResult, scoreQuiz } from '@/mock/data';
import { useAppRoute } from './appRoute';
import { formatClock } from '@/hooks/useCountdown';
import { TopicBreakdown } from './parts/TopicBreakdown';
import { AnswerReviewItem } from './parts/AnswerReviewItem';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { ProgressRing } from '@/components/ProgressRing';

export function ResultsScreen({ onNavigate }) {
  const { t, p } = useI18n();
  const { decor } = useThemeMeta();
  const { quiz } = useAppRoute();
  const reduced = usePrefersReducedMotion();

  // คำนวณจากคำตอบจริง ไม่ hardcode คะแนน — ตัวเลขทุกจุดในหน้านี้จึงตรงกันเสมอ
  const result = scoreQuiz(quiz);
  const tone = result.passed ? 'success' : 'danger';

  return (
    <div className="relative mx-auto max-w-5xl px-4 pt-8 pb-24 sm:px-6 lg:px-8">
      {result.passed && !reduced && decor.Celebration && <decor.Celebration />}

      {/* ---------- ฮีโร่ ---------- */}
      <section className="ui-surface relative grid place-items-center p-7 text-center sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">
          {t('result.title')}
        </p>
        <h1 className="ui-heading mt-1 text-xl">{p(quiz.title)}</h1>

        <ProgressRing value={result.percent} tone={tone} className="mt-6">
          <div>
            <span className="ui-heading block text-4xl tabular-nums">
              {Math.round(result.percent * 100)}%
            </span>
            <span className="text-sm text-muted">
              {result.score} / {result.total}
            </span>
          </div>
        </ProgressRing>

        {/* ข้อเขียน/ข้อพูดไม่เข้าตัวหาร ต้องบอกให้ชัดว่าคะแนนนี้คิดจากกี่ข้อ
            ไม่งั้นผู้เรียนเห็น 14/16 ทั้งที่ทำไป 20 ข้อแล้วงงว่าอีก 4 ข้อหายไปไหน */}
        {result.ungraded > 0 && (
          <p className="mt-3 text-sm text-muted">
            {t('result.ungradedNote', { n: result.ungraded, total: result.questionCount })}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          <Badge tone={tone} icon={result.passed ? 'trophy' : 'refresh'}>
            {result.passed ? `${t('result.passed')} 🎉` : t('result.failed')}
          </Badge>
          <Badge tone="primary" icon="sparkle">
            {t('result.xpGained', { n: quizResult.xpGained })}
          </Badge>
          <Badge icon="users">
            {t('result.rank', { n: quizResult.rankInClass, total: quizResult.classSize })}
          </Badge>
        </div>
      </section>

      {/* ---------- สถิติ 4 ช่อง ---------- */}
      <div className="mt-5 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <StatTile icon="check" tone="success" label={t('result.correct')} value={result.score} />
        <StatTile
          icon="x"
          tone="danger"
          label={t('result.wrong')}
          value={result.total - result.score}
        />
        <StatTile
          icon="clock"
          label={t('result.timeUsed')}
          value={formatClock(quizResult.timeSpentSec)}
          mono
        />
        <StatTile
          icon="users"
          label={t('result.classAvg')}
          value={`${Math.round(quizResult.classAverage * 100)}%`}
        />
      </div>

      {/* ---------- หัวข้อ + เหรียญ ---------- */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <TopicBreakdown topics={result.byTopic} />

        <section className="ui-surface p-5 sm:p-6">
          <h2 className="ui-heading text-lg">{t('result.badges')}</h2>
          <ul className="mt-4 grid gap-3">
            {quizResult.badges.map((badge) => (
              <li key={badge.id} className="flex items-center gap-3">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full"
                  style={{
                    background: 'color-mix(in oklch, var(--color-warn) 22%, transparent)',
                    color: 'var(--color-warn)',
                  }}
                >
                  <Icon name={badge.icon} size={21} />
                </span>
                <span className="min-w-0 text-sm font-medium">{p(badge.label)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ---------- ทบทวนคำตอบ ---------- */}
      <section className="mt-5">
        <h2 className="ui-heading mb-3 text-lg">{t('result.review')}</h2>
        <ul className="grid gap-2.5">
          {quiz.questions.map((question, i) => (
            <AnswerReviewItem
              key={question.id}
              question={question}
              index={i}
              // total ที่ส่งไปคือจำนวนข้อ "ทั้งชุด" ไม่ใช่จำนวนข้อที่คิดคะแนน
              // ไม่งั้นแถวทบทวนจะเขียนว่า "ข้อ 20 จาก 16" ในชุดที่มีข้อเขียนปนอยู่
              result={{ ...result.perQuestion[i], total: result.questionCount }}
            />
          ))}
        </ul>
      </section>

      {/* ---------- ปุ่มปิดท้าย ---------- */}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" icon="refresh" onClick={() => onNavigate?.('quiz')}>
          {t('result.retry')}
        </Button>
        <Button variant="ghost" icon="arrowLeft" onClick={() => onNavigate?.('lesson')}>
          {t('result.backToLesson')}
        </Button>
        <Button iconRight="arrowRight" onClick={() => onNavigate?.('lesson')}>
          {t('result.nextLesson')}
        </Button>
      </div>
    </div>
  );
}

function StatTile({ icon, label, value, tone, mono }) {
  return (
    <div className="ui-surface p-4">
      <div className="flex items-center gap-2 text-muted">
        <Icon
          name={icon}
          size={16}
          style={tone ? { color: `var(--color-${tone})` } : undefined}
        />
        <span className="min-w-0 truncate text-sm">{label}</span>
      </div>
      <p className={`ui-heading mt-1.5 text-2xl tabular-nums ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}

export default ResultsScreen;
