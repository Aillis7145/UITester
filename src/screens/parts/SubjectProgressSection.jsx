import { childrenOf, contentCountOf, levelDef, progressOf, unlockedCountOf, watchedCountOf } from '@/mock/nodes';
import { attemptsOf, courseQuizAvgOf, certificateOf, dayAt, latestAttemptOf } from '@/mock/records';
import { formatDate, formatShortDate } from '@/lib/datetime';
import { targetFor } from '../nav';
import { Badge } from '@/components/Badge';
import { Icon } from '@/components/Icon';
import { ProgressBar } from '@/components/ProgressBar';
import { cn } from '@/lib/cn';

/**
 * หนึ่งวิชาในหน้าความคืบหน้า — หัววิชา + แถวคอร์ส + แถบเซลล์ต่อบท
 *
 * *** ทุกตัวเลขต้องอยู่บนหน้าตั้งแต่โหลดเสร็จ ***
 * ห้ามมี <details>, accordion, tab, tooltip หรือปุ่มขยายในไฟล์นี้เด็ดขาด
 * ข้อกำหนดของหน้านี้คือ "ไม่ต้องกดหลายครั้งเพื่อดูภาพรวม" ซึ่งทั้งหมดนั้นคือการกด
 * ของที่ต้อง hover ถึงจะเห็นก็ไม่นับ เพราะบนมือถือไม่มี hover
 *
 * รับ t / p / lang เป็น prop ไม่เรียก useI18n ซ้ำ — แนวเดียวกับ HistoryScreen
 */

/**
 * สีของเซลล์มาจาก "รอบล่าสุด" ไม่ใช่รอบที่ดีที่สุด — รอบล่าสุดคือสถานะปัจจุบันของผู้เรียน
 *
 * สองสีเท่านั้น และเส้นแบ่งคือเกณฑ์ผ่าน 60% เท่ากับที่ข้อสอบใช้จริง (passMark)
 * เดิมมีสีเหลืองคั่นช่วง 60–79 ซึ่งกินพื้นที่เกือบครึ่งจอและอ่านเหมือน "เกือบตก"
 * ทั้งที่ 60% คือผ่านเต็มตัวตามเกณฑ์ — สีจึงหมายถึงผ่าน/ไม่ผ่านตรงๆ เหมือนไอคอน ✓ / ✗
 */
const toneOf = (percent) => (percent >= 0.6 ? 'success' : 'danger');

/**
 * ความเข้มของพื้นเซลล์ ต่อโทน — ใช้สูตร color-mix แบบเดียวกับ Badge.jsx
 * ไฟล์นี้จึงไม่รู้จักชื่อธีมสักตัว
 *
 * *** ตัวเลขพวกนี้เพดานถูกกำหนดโดยธีมมืด ไม่ใช่โดยรสนิยม ***
 * ในธีมมืด สีโทนสว่างที่ผสมลงบนพื้นเข้มจะ "ยกความสว่างของพื้น" ขึ้นมาหาตัวหนังสือ
 * ที่ 26% ตัวหนังสือบนเซลล์เหลืองของธีม tech เหลือ contrast 1.3:1 ซึ่งอ่านไม่ออก
 * warn ต่ำสุดเพราะเป็นสีที่สว่างที่สุดในสามตัว (L* ~84 เทียบกับ ~78 และ ~70)
 *
 * ขยับขึ้นเมื่อไรต้องวัด contrast ใหม่ทั้งห้าธีม ไม่ใช่ดูด้วยตาบนธีมเดียว
 */
const CELL_TINT = { success: 18, danger: 18 };

/** จำนวนรอบที่การ์ดโชว์ได้ — ที่เหลืออยู่ใน UnitAttemptsModal */
const CARD_ROUNDS = 3;

export function SubjectProgressSection({ project, courses, t, p, lang, onNavigate, onOpenUnit }) {
  const unitLevel = project.levels[1]?.level;
  const unitWord = unitLevel ? p(levelDef(project, unitLevel).plural) : '';

  // บวกเป็นจำนวนเต็มจาก ROLLUP ไม่ใช่เฉลี่ยเปอร์เซ็นต์ของคอร์ส
  // เฉลี่ยเปอร์เซ็นต์จะให้น้ำหนักคอร์ส 26 ชิ้นเท่ากับคอร์ส 963 ชิ้น ซึ่งไม่ใช่ความคืบหน้าจริง
  const watched = courses.reduce((s, c) => s + watchedCountOf(c.id), 0);
  const total = courses.reduce((s, c) => s + contentCountOf(c.id), 0);
  const unitCount = courses.reduce((s, c) => s + childrenOf(c.id).length, 0);
  const coursesDone = courses.filter((c) => progressOf(c.id) === 1).length;
  const hasCert = courses.some((c) => certificateOf(c.id));

  return (
    <section data-progress-subject={project.id} data-progress-cert={hasCert ? 'yes' : 'no'}>
      {/* ---------- หัววิชา ---------- */}
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span
          aria-hidden="true"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-ui"
          style={{
            background: 'color-mix(in oklch, var(--color-primary) 14%, transparent)',
            color: 'var(--color-primary-ink)',
          }}
        >
          <Icon name={project.icon} size={18} />
        </span>

        <h2 className="ui-heading text-lg">{p(project.name)}</h2>
        <p className="text-sm text-muted">
          {t('progress.courseCount', { n: courses.length })} · {unitCount} {unitWord}
        </p>

        <span className="ml-auto flex flex-wrap items-center gap-2">
          <span data-progress-subject-pct={Math.round((total ? watched / total : 0) * 100)}>
            <ProgressBar value={total ? watched / total : 0} size="sm" className="w-32" label={p(project.name)} />
          </span>
          <Badge tone={coursesDone > 0 ? 'success' : 'neutral'} size="sm" icon="check">
            {t('progress.doneCount', { n: coursesDone })}
          </Badge>
          {/* บอกแค่ได้/ยังไม่ได้ ไม่บอกจำนวนใบ — หนึ่งวิชาได้อย่างมากใบเดียวอยู่แล้ว
              ตัวเลขตรงนี้จึงเป็นได้แค่ 0 กับ 1 ซึ่งอ่านยากกว่าคำว่า "ได้แล้ว" */}
          <Badge tone={hasCert ? 'primary' : 'neutral'} size="sm" icon="award">
            {hasCert ? t('progress.certEarned') : t('progress.certNotYet')}
          </Badge>
        </span>
      </div>

      {/* ---------- แถวคอร์ส ---------- */}
      <ul className="ui-surface divide-y divide-border overflow-hidden p-0">
        {courses.map((course) => (
          <CourseProgressRow
            key={course.id}
            course={course}
            project={project}
            unitWord={unitWord}
            t={t}
            p={p}
            lang={lang}
            onNavigate={onNavigate}
            onOpenUnit={onOpenUnit}
          />
        ))}
      </ul>
    </section>
  );
}

function CourseProgressRow({ course, project, unitWord, t, p, lang, onNavigate, onOpenUnit }) {
  const units = childrenOf(course.id);
  const pct = progressOf(course.id);
  const state = pct === 0 ? 'none' : pct === 1 ? 'done' : 'partial';
  const cert = certificateOf(course.id);
  const avg = courseQuizAvgOf(course.id);
  const lockedUnits = units.filter((u) => unlockedCountOf(u.id) === 0).length;

  /* คอร์สที่ยังไม่เริ่มบีบเหลือบรรทัดเดียว — ข้อมูลระดับบทเป็นศูนย์ทุกใบตามนิยาม
     วาด 20 เซลล์เทาจึงเพิ่มเสียงรบกวนโดยไม่เพิ่มสัญญาณสักหน่วย */
  if (state === 'none') {
    return (
      <li data-progress-course={course.id} data-progress-state="none" data-progress-done="false">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 px-4 py-3">
          <h3 className="ui-heading text-sm text-muted">{p(course.title)}</h3>
          <p className="text-xs text-muted">
            {t('progress.notStarted')} · {units.length} {unitWord}
          </p>
        </div>
      </li>
    );
  }

  return (
    <li data-progress-course={course.id} data-progress-state={state} data-progress-done={String(pct === 1)}>
      {/* แถบเซลล์อยู่ในคอลัมน์ซ้ายคอลัมน์เดียวกับชื่อคอร์ส ไม่ใช่แถวเต็มความกว้างของตัวเอง
          ถ้าแยกเป็นแถวล่าง คอร์สที่มีสองบทจะเหลือที่ว่างพาดกลางแถวยาวเกือบทั้งจอ
          และแถบความคืบหน้าจะลอยห่างจากสิ่งที่มันสรุปอยู่ไปคนละฝั่ง */}
      <div className="grid gap-x-4 gap-y-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_17rem] sm:items-start">
        <div className="min-w-0">
          <h3 className="ui-heading text-base">{p(course.title)}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {pct === 1 && (
              <Badge tone="success" size="sm" icon="check">
                {t('progress.done')}
              </Badge>
            )}
            {cert && (
              <Badge tone="primary" size="sm" icon="award">
                {t('progress.certEarned')}
              </Badge>
            )}
            {/* ต้องอยู่บรรทัดเดียวกับป้ายใบประกาศ ไม่งั้น "ได้ใบแล้วแต่ยังไม่จบ"
                จะกลายเป็นการบ้านของคนอ่านว่าทำไมสองอย่างนี้ถึงขัดกัน */}
            {pct < 1 && lockedUnits > 0 && (
              <Badge tone="warn" size="sm" icon="lock">
                {t('progress.lockedLeft', { n: lockedUnits })}
              </Badge>
            )}
            {pct < 1 && lockedUnits === 0 && (
              <Badge tone="neutral" size="sm" icon="play">
                {t('progress.inProgress')}
              </Badge>
            )}
          </div>

          <UnitStrip
            units={units}
            project={project}
            t={t}
            p={p}
            lang={lang}
            onNavigate={onNavigate}
            onOpenUnit={onOpenUnit}
          />
        </div>

        <ProgressBar
          value={pct}
          size="sm"
          showLabel
          caption={`${units.length} ${unitWord}`}
          suffix={avg === undefined ? undefined : `· ${t('progress.avgSuffix', { n: Math.round(avg * 100) })}`}
        />
      </div>
    </li>
  );
}

/**
 * grid ไม่ใช่ flex-wrap โดยตั้งใจ
 * เซลล์สูงไม่เท่ากันเพราะแต่ละบททำแบบทดสอบไม่เท่ากัน (1–3 รอบ)
 * flex-wrap จะได้แถวหยักฟันปลา ส่วน grid ยืดทุกเซลล์ในแถวให้สูงเท่ากันเอง
 */
function UnitStrip({ units, project, t, p, lang, onNavigate, onOpenUnit }) {
  return (
    <ul className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(7.25rem,1fr))] gap-1.5">
      {units.map((unit) => (
        <UnitCell
          key={unit.id}
          unit={unit}
          project={project}
          t={t}
          p={p}
          lang={lang}
          onNavigate={onNavigate}
          onOpenUnit={onOpenUnit}
        />
      ))}
    </ul>
  );
}

function UnitCell({ unit, project, t, p, lang, onNavigate, onOpenUnit }) {
  const rounds = attemptsOf(unit.id);
  const latest = latestAttemptOf(unit.id);
  const pct = progressOf(unit.id);
  const locked = unlockedCountOf(unit.id) === 0;
  const tone = latest ? toneOf(latest.percent) : undefined;
  const unitLabel = `${p(levelDef(project, unit.level).label)} ${unit.order}`;

  // ประโยคเต็มสำหรับ screen reader — ตาเห็นตัวเลขอยู่แล้ว ตรงนี้เติมบริบทกับปีที่เซลล์ไม่มีที่ใส่
  const spoken = [
    unitLabel,
    p(unit.title),
    locked
      ? t('progress.cellLocked')
      : pct === 1
        ? t('progress.cellDone')
        : t('progress.cellPartial', { n: Math.round(pct * 100) }),
    rounds.length
      ? `${t('progress.attemptCount', { n: rounds.length })} · ${rounds
          .map((a) => `${formatDate(dayAt(a.dayOffset), lang)} ${a.score}/${a.total}`)
          .join(' · ')}`
      : t('progress.noAttempt'),
  ].join(' · ');

  const go = () => {
    if (locked) return;
    // บทที่เคยทำแบบทดสอบแล้วเปิด popup ให้ดูทุกรอบ ไม่ใช่เด้งไปหน้าข้อสอบทันที
    // เพราะการ์ดโชว์ได้แค่สามรอบล่าสุด และรอบที่เหลือคือสิ่งที่ผู้เรียนกดเข้ามาหา
    // (ปุ่มไปหน้าข้อสอบอยู่ท้าย popup)
    if (rounds.length) onOpenUnit?.(unit);
    else onNavigate?.(...targetFor(unit));
  };

  return (
    <li>
      <button
        type="button"
        data-progress-unit={unit.id}
        data-progress-rounds={rounds.length}
        disabled={locked}
        onClick={go}
        aria-label={spoken}
        className={cn(
          'ui-focusable relative flex h-full w-full flex-col gap-1 overflow-hidden rounded-ui p-2 text-left',
          locked ? 'ui-inset opacity-60' : 'ui-interactive',
          !tone && !locked && 'ui-inset',
        )}
        style={tone ? { background: `color-mix(in oklch, var(--color-${tone}) ${CELL_TINT[tone]}%, transparent)` } : undefined}
      >
        {/* แถบเติมของบทที่กำลังเรียน — บอกสัดส่วนที่ดูไปแล้วโดยไม่ต้องมีตัวเลขอีกตัว */}
        {!tone && !locked && pct > 0 && (
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0"
            style={{ width: `${Math.round(pct * 100)}%`, background: 'color-mix(in oklch, var(--color-primary) 14%, transparent)' }}
          />
        )}

        <span className="relative flex items-center justify-between gap-1">
          <span className="truncate text-[0.6875rem] font-semibold">{unitLabel}</span>
          {locked ? (
            <Icon name="lock" size={12} className="shrink-0 text-muted" />
          ) : latest ? (
            <Icon
              name={latest.passed ? 'check' : 'x'}
              size={12}
              strokeWidth={2.5}
              className="shrink-0"
              style={{ color: `var(--color-${latest.passed ? 'success' : 'danger'})` }}
            />
          ) : null}
        </span>

        {rounds.length > 0 ? (
          // เรียงเก่า → ใหม่ จากบนลงล่าง พัฒนาการจึงอ่านได้เหมือนอ่านหนังสือ
          // โชว์แค่สามรอบล่าสุด ที่เหลือกดเปิด popup ดู — โชว์ครบห้ารอบทุกใบ
          // จะทำให้แถวคอร์สที่มีสามสิบบทสูงจนเลื่อนหาคอร์สถัดไปไม่เจอ
          <span className="relative grid gap-0.5">
            {rounds.length > CARD_ROUNDS && (
              <span className="text-[0.6875rem] font-medium opacity-70">
                {t('progress.moreRounds', { n: rounds.length - CARD_ROUNDS })}
              </span>
            )}
            {rounds.slice(-CARD_ROUNDS).map((a) => (
              <span key={a.id} className="flex items-baseline justify-between gap-1.5 text-[0.6875rem] tabular-nums">
                {/* ห้ามใช้ text-muted ในเซลล์ที่มีพื้นสี — พื้นสีในธีมมืดสว่างขึ้นมาใกล้สี muted
                    จนอ่านไม่ออก ลำดับความสำคัญระหว่างวันที่กับคะแนนใช้ "น้ำหนักตัวอักษร" แทนความจาง */}
                <span className="truncate">{formatShortDate(dayAt(a.dayOffset), lang)}</span>
                <span className="shrink-0 font-semibold">{Math.round(a.percent * 100)}%</span>
              </span>
            ))}
          </span>
        ) : (
          <span className="relative text-[0.6875rem] text-muted">
            {locked ? t('progress.cellLocked') : t('progress.noAttempt')}
          </span>
        )}
      </button>
    </li>
  );
}

export default SubjectProgressSection;
