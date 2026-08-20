import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { useScreenState } from './screenState';
import { targetFor } from './nav';
import { history, historyByDay, dayAt } from '@/mock/records';
import { getNode, getProject, courseOf, unitOf } from '@/mock/nodes';
import { formatDuration } from '@/mock/data';
import { formatTimeOfDay, formatWeekday } from '@/lib/datetime';
import { Badge } from '@/components/Badge';
import { Field } from '@/components/Field';
import { Icon } from '@/components/Icon';
import { Skeleton } from '@/components/Skeleton';

/**
 * ประวัติการเรียน — รายการของที่เปิดดูไปแล้ว จัดกลุ่มตามวันแบบประวัติของเบราว์เซอร์
 *
 * ต่างจากแถว "เรียนต่อจากที่ค้างไว้" ในหน้าแรกตรงที่แถวนั้นตอบว่า *จะไปต่อที่ไหน*
 * (คอร์สละหนึ่งใบ ชี้ไปข้างหน้า) ส่วนหน้านี้ตอบว่า *ผ่านอะไรมาแล้วบ้าง* เรียงตามเวลาถอยหลัง
 * สองคำถามนี้คนละคำถาม การเอามารวมกันจะได้หน้าที่ตอบไม่ได้ทั้งคู่
 *
 * ทุกแถวกดได้และพาไปที่เดิม ผ่าน targetFor ตัวเดียวกับปุ่มอื่นทั้งแอป
 * ประวัติจึงไม่มีทางพาไปคนละที่กับที่ผู้เรียนเคยกดเข้าไป
 */
const ACTION_ICON = { watch: 'play', quiz: 'flag' };

export function HistoryScreen({ onNavigate }) {
  const { t, p, lang } = useI18n();
  const { showSkeleton } = useScreenState();
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return history;
    // ค้นทั้งชื่อสื่อ ชื่อบท และชื่อคอร์ส — คนจำได้อย่างใดอย่างหนึ่งเสมอ แต่ไม่แน่ว่าอันไหน
    return history.filter((row) => {
      const node = getNode(row.nodeId);
      if (!node) return false;
      const hay = [p(node.title), p(courseOf(node.id)?.title), p(unitOf(node.id)?.title)]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query, p]);

  if (showSkeleton) return <HistorySkeleton />;

  const days = historyByDay(rows);

  return (
    <div className="mx-auto max-w-4xl px-4 pt-6 pb-24 sm:px-6 lg:px-8">
      <header>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="ui-heading text-2xl sm:text-3xl">{t('history.title')}</h1>
          <Badge tone="primary" size="sm" icon="clock">
            {t('history.count', { n: history.length })}
          </Badge>
        </div>
        <p className="mt-2 max-w-2xl text-muted">{t('history.lead')}</p>
      </header>

      <div className="mt-5 max-w-md">
        <Field
          type="search"
          icon="search"
          aria-label={t('history.searchLabel')}
          placeholder={t('history.searchPh')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {days.length === 0 ? (
        <div className="ui-surface mt-6 grid place-items-center px-6 py-16 text-center">
          <Icon name="search" size={26} className="text-muted" />
          <p className="mt-3 text-muted">{t('history.noMatch', { q: query })}</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6">
          {days.map(({ dayOffset, items }) => (
            <section key={dayOffset}>
              <h2 className="ui-heading mb-2.5 flex items-baseline gap-2 text-sm">
                {dayLabel(dayOffset, lang, t)}
                <span className="text-xs font-normal text-muted">
                  {t('history.dayCount', { n: items.length })}
                </span>
              </h2>

              <ul className="ui-surface divide-y divide-border overflow-hidden p-0">
                {items.map((row) => (
                  <HistoryRow key={row.id} row={row} onNavigate={onNavigate} t={t} p={p} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * "วันนี้ / เมื่อวาน" แล้วค่อยเป็นชื่อวัน — เหมือนประวัติของเบราว์เซอร์
 * เกินสองวันไปแล้วคำว่า "3 วันก่อน" เริ่มต้องนับนิ้ว ชื่อวันกับวันที่ตรงกว่า
 */
function dayLabel(offset, lang, t) {
  if (offset === 0) return t('history.today');
  if (offset === 1) return t('history.yesterday');
  return formatWeekday(dayAt(offset), lang);
}

function HistoryRow({ row, onNavigate, t, p }) {
  const node = getNode(row.nodeId);
  // แถวที่ชี้ไปสื่อที่ไม่มีแล้วต้องหายไปเงียบๆ ไม่ใช่พังทั้งหน้า
  if (!node) return null;

  const course = courseOf(node.id);
  const unit = unitOf(node.id);
  const project = getProject(node.projectId);
  const isQuiz = row.action === 'quiz';

  // แถวแบบทดสอบพาไปข้อสอบท้ายบทของบทนั้น ไม่ใช่กลับไปที่คลิป
  const go = () =>
    isQuiz
      ? onNavigate?.('quiz', { node: node.id, set: 'unit' })
      : onNavigate?.(...targetFor(node));

  return (
    <li>
      <button
        type="button"
        onClick={go}
        className="ui-interactive ui-focusable flex w-full items-center gap-3.5 p-3.5 text-left"
      >
        <span className="w-12 shrink-0 text-sm tabular-nums text-muted">
          {formatTimeOfDay(row.minuteOfDay)}
        </span>

        <span className="relative h-11 w-16 shrink-0 overflow-hidden rounded-ui bg-surface-2">
          <img src={node.thumb} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          <span className="absolute inset-0 grid place-items-center bg-black/35">
            <Icon name={ACTION_ICON[row.action] ?? 'play'} size={13} className="text-white" />
          </span>
        </span>

        <span className="min-w-0 flex-1">
          <span className="ui-heading block truncate text-sm">
            {isQuiz ? t('history.quizOf', { unit: p(unit?.title) }) : p(node.title)}
          </span>
          {/* คอร์ส › บท — ตอบว่า "วิชาอะไร บทอะไร" ในบรรทัดเดียว */}
          <span className="mt-0.5 block truncate text-xs text-muted">
            {p(course?.title)}
            {unit && ` › ${p(unit.title)}`}
          </span>
        </span>

        <Badge tone="neutral" size="sm" className="shrink-0 max-sm:hidden" icon={project.icon}>
          {p(project.short)}
        </Badge>

        <span className="w-14 shrink-0 text-right text-xs tabular-nums text-muted">
          {formatDuration(row.secondsSpent)}
        </span>
      </button>
    </li>
  );
}

function HistorySkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-6 pb-24 sm:px-6 lg:px-8">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="mt-3 h-3 w-3/5" />
      <Skeleton className="mt-5 h-11 w-full max-w-md" />
      <div className="mt-6 grid gap-6">
        {Array.from({ length: 2 }, (_, g) => (
          <div key={g}>
            <Skeleton className="mb-2.5 h-3 w-24" />
            <div className="ui-surface divide-y divide-border p-0">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex items-center gap-3.5 p-3.5">
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-11 w-16" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-2/3" />
                    <Skeleton className="h-2.5 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistoryScreen;
