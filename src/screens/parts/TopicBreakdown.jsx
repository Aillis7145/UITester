import { useEffect, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/** ผลแยกตามหัวข้อ — แท่ง CSS ล้วน ไม่ต้องพึ่ง chart library เพื่อกราฟแท่ง 3 แท่ง */
export function TopicBreakdown({ topics }) {
  const { t, p } = useI18n();
  const reduced = usePrefersReducedMotion();
  const [grown, setGrown] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setGrown(true)));
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  return (
    <section className="ui-surface p-5 sm:p-6">
      <h2 className="ui-heading text-lg">{t('result.byTopic')}</h2>

      <ul className="mt-4 grid gap-4">
        {topics.map((topic, i) => {
          const ratio = topic.total ? topic.correct / topic.total : 0;
          const tone = ratio >= 0.8 ? 'success' : ratio >= 0.5 ? 'warn' : 'danger';

          return (
            <li key={topic.id}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate font-medium">{p(topic.label)}</span>
                <span className="shrink-0 font-mono text-sm font-semibold tabular-nums">
                  {t('result.itemsCorrect', { correct: topic.correct, total: topic.total })}
                </span>
              </div>

              <div className="ui-inset h-2.5 w-full overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: grown ? `${ratio * 100}%` : '0%',
                    background: `var(--color-${tone})`,
                    transition: `width var(--dur-slower) var(--ease-smooth) ${i * 120}ms`,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default TopicBreakdown;
