import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { useScreenState } from './screenState';
import { purchasedProjects } from '@/mock/projects';
import { childrenOf, contentCountOf, progressOf, rootsOf, watchedCountOf } from '@/mock/nodes';
import { certificateOf, courseQuizAvgOf, latestAttemptOf } from '@/mock/records';
import { SubjectProgressSection } from './parts/SubjectProgressSection';
import { UnitAttemptsModal } from './parts/UnitAttemptsModal';
import { Badge } from '@/components/Badge';
import { Chip } from '@/components/Chip';
import { Dropdown } from '@/components/Dropdown';
import { Icon } from '@/components/Icon';
import { ProgressRing } from '@/components/ProgressRing';
import { Skeleton } from '@/components/Skeleton';

/**
 * ความคืบหน้าการเรียน — ทุกวิชา ทุกคอร์ส ทุกบท ในหน้าเดียว
 *
 * ─────────────────────────────────────────────────────────────
 * คำถามที่สี่ของผู้เรียน และห้ามดูดอีกสามหน้าเข้ามา
 * ─────────────────────────────────────────────────────────────
 *   แถวเรียนต่อ (หน้าแรก)  จะไปต่อที่ไหน
 *   ประวัติการเรียน        ผ่านอะไรมาแล้วบ้าง เรียงตามเวลา
 *   ใบประกาศ              ทำอะไรสำเร็จแล้ว
 *   หน้านี้                *ยืนอยู่ตรงไหนของทั้งหมด*
 *
 * จึงไม่มีปุ่ม "เรียนต่อ" ไม่เรียงตามเวลา และไม่วาดตัวใบประกาศในนี้
 *
 * ─────────────────────────────────────────────────────────────
 * "ไม่ต้องกดหลายครั้ง" คือข้อกำหนด ไม่ใช่ความชอบ
 * ─────────────────────────────────────────────────────────────
 * *ภาพรวม* ต้องครบตั้งแต่โหลดเสร็จ เลื่อนอย่างเดียวก็เห็นหมด —
 * วิชาไหน บทไหนจบ คะแนนล่าสุดเท่าไร จบคอร์สหรือยัง ได้วุฒิบัตรหรือยัง
 * ห้ามเพิ่ม accordion / tab / tooltip / ปุ่มขยาย มาบังข้อมูลชุดนี้
 *
 * ยาวได้ ไม่เป็นไร — สิ่งที่ผิดข้อกำหนดคือ "ต้องกด" ไม่ใช่ "ต้องเลื่อน"
 *
 * ข้อยกเว้นเดียวคือ *รายละเอียดทุกรอบของบทเดียว* ซึ่งการ์ดใส่ไม่ไหว (มากสุดห้ารอบ)
 * อยู่ใน UnitAttemptsModal — การ์ดยังโชว์สามรอบล่าสุดไว้เสมอ popup จึงเป็นส่วนขยาย
 * ไม่ใช่ที่ซ่อนคำตอบ
 */

const SORTS = ['syllabus', 'progress', 'worst'];

export function ProgressScreen({ onNavigate }) {
  const { t, p, lang } = useI18n();
  const { showSkeleton } = useScreenState();
  const [sort, setSort] = useState('syllabus');
  const [subject, setSubject] = useState('all');
  const [openUnit, setOpenUnit] = useState(null);

  // ซื้อวิชาเดียวก็ไม่ต้องมีชิป — ตัวกรองที่มีตัวเลือกเดียวคือสิ่งรบกวน ไม่ใช่ตัวช่วย
  // (กติกาเดียวกับหน้าคอร์ส เพื่อให้สองหน้าคุมด้วยตรรกะเดียวกัน)
  const showChips = purchasedProjects.length > 1;

  const subjects = useMemo(
    () =>
      purchasedProjects
        .filter((project) => subject === 'all' || project.id === subject)
        .map((project) => ({
          project,
          courses: sortCourses(rootsOf(project.id), sort),
        })),
    [sort, subject],
  );

  // ยอดรวมบวกจากจำนวนเต็มระดับคอร์ส ไม่ใช่เฉลี่ยเปอร์เซ็นต์
  // เฉลี่ยเปอร์เซ็นต์จะให้น้ำหนักคอร์ส 26 ชิ้นเท่ากับคอร์ส 963 ชิ้น
  const totals = useMemo(() => {
    const courses = purchasedProjects.flatMap((pr) => rootsOf(pr.id));
    const units = courses.flatMap((c) => childrenOf(c.id));
    const latest = units.map((u) => latestAttemptOf(u.id)).filter(Boolean);
    const watched = courses.reduce((s, c) => s + watchedCountOf(c.id), 0);
    const total = courses.reduce((s, c) => s + contentCountOf(c.id), 0);
    return {
      percent: total ? watched / total : 0,
      coursesDone: courses.filter((c) => progressOf(c.id) === 1).length,
      courseTotal: courses.length,
      unitsDone: units.filter((u) => progressOf(u.id) === 1).length,
      unitTotal: units.length,
      avg: latest.length ? latest.reduce((s, a) => s + a.percent, 0) / latest.length : 0,
      certSubjects: purchasedProjects.filter((pr) => rootsOf(pr.id).some((c) => certificateOf(c.id))).length,
      subjectTotal: purchasedProjects.length,
    };
  }, []);

  if (showSkeleton) return <ProgressSkeleton />;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-24 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="ui-heading text-2xl sm:text-3xl">{t('progress.title')}</h1>
            <Badge tone="primary" size="sm" icon="chart">
              {t('progress.count', { n: totals.subjectTotal })}
            </Badge>
          </div>
          <p className="mt-2 max-w-2xl text-muted">{t('progress.lead')}</p>
        </div>

        <Dropdown
          value={sort}
          onChange={setSort}
          label={t('progress.sortLabel')}
          options={SORTS.map((id) => ({ value: id, label: t(`progress.sort.${id}`) }))}
          wrapperClassName="w-56"
        />
      </header>

      {/* overflow-x-auto ตัดแนวตั้งด้วยเสมอ ชิปที่ยกตัวตอน hover จึงโดนตัดขอบบน
          padding รอบด้าน (ชดเชยด้วย -mx/-mt) เปิดที่ให้ทั้งการยกตัวและเงา โดยไม่ทำให้ layout ขยับ */}
      {showChips && (
        <div className="-mx-2 mt-1.5 flex gap-2 overflow-x-auto px-2 pb-1 pt-3">
          <Chip icon="grid" active={subject === 'all'} onClick={() => setSubject('all')}>
            {t('subjects.allSubjects')}
          </Chip>
          {purchasedProjects.map((pr) => (
            <Chip key={pr.id} icon={pr.icon} active={subject === pr.id} onClick={() => setSubject(pr.id)}>
              {p(pr.short)}
            </Chip>
          ))}
        </div>
      )}

      {/* ---------- ชั้น 0: ตอบก่อนที่สีเทาแรกจะปรากฏ ----------
          ยอดรวมคิดจากทุกวิชาที่ซื้อเสมอ ไม่ผูกกับชิปที่เลือกอยู่
          ตัวเลข "ทั้งหมด" ที่ขยับตามตัวกรองไม่ใช่ยอดรวม แต่เป็นยอดของสิ่งที่บังเอิญเห็นอยู่ */}
      <section className="ui-surface mt-5 grid items-center gap-5 p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:p-6">
        <ProgressRing value={totals.percent} size={104} thickness={10}>
          <div>
            <span className="ui-heading block text-2xl tabular-nums">{Math.round(totals.percent * 100)}%</span>
            <span className="text-xs text-muted">{t('progress.overall')}</span>
          </div>
        </ProgressRing>

        <ul className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          <StatTile
            icon="layers"
            label={t('progress.coursesDone')}
            value={`${totals.coursesDone} / ${totals.courseTotal}`}
          />
          <StatTile icon="list" label={t('progress.unitsDone')} value={`${totals.unitsDone} / ${totals.unitTotal}`} />
          <StatTile icon="flag" label={t('progress.avgScore')} value={`${Math.round(totals.avg * 100)}%`} />
          <StatTile
            icon="award"
            label={t('progress.certSubjects')}
            value={`${totals.certSubjects} / ${totals.subjectTotal}`}
          />
        </ul>
      </section>

      {/* ---------- ชั้น 1–3 ---------- */}
      <div className="mt-8 grid gap-8">
        {subjects.map(({ project, courses }) => (
          <SubjectProgressSection
            key={project.id}
            project={project}
            courses={courses}
            t={t}
            p={p}
            lang={lang}
            onNavigate={onNavigate}
            onOpenUnit={setOpenUnit}
          />
        ))}
      </div>

      {/* การ์ดโชว์ได้แค่สามรอบล่าสุด ที่นี่คือที่ที่เห็นครบทุกรอบ */}
      <UnitAttemptsModal unit={openUnit} onClose={() => setOpenUnit(null)} onNavigate={onNavigate} />

      {/* พูดตรงๆ ว่าอะไรของจริง แทนที่จะกลบให้ดูเหมือนกันหมด */}
      <p className="mt-8 flex items-start gap-2 text-xs text-muted">
        <Icon name="file" size={14} className="mt-0.5 shrink-0" />
        {t('progress.realBankNote')}
      </p>
    </div>
  );
}

/**
 * ลำดับวิชาตายตัวตาม purchasedProjects เสมอ — เรียงเฉพาะคอร์สข้างใน
 * ถ้าปล่อยให้วิชาเรียงตามความคืบหน้าด้วย วิชาที่มี 100 บทจะกินหัวหน้าทุกครั้ง
 */
function sortCourses(courses, sort) {
  if (sort === 'progress') return [...courses].sort((a, b) => progressOf(b.id) - progressOf(a.id));
  if (sort === 'worst') {
    // คอร์สที่ยังไม่มีคะแนนไปท้าย ไม่ใช่ตีเป็น 0
    // ไม่งั้นคอร์สที่ยังไม่เริ่มจะขึ้นหัวของทุกวิชา ทั้งที่ไม่ใช่คอร์สที่ต้องรีบแก้
    return [...courses].sort((a, b) => (courseQuizAvgOf(a.id) ?? 2) - (courseQuizAvgOf(b.id) ?? 2));
  }
  return courses;
}

function StatTile({ icon, label, value }) {
  return (
    <li className="ui-panel p-3.5">
      <div className="flex items-center gap-1.5 text-muted">
        <Icon name={icon} size={14} className="shrink-0" />
        <span className="min-w-0 truncate text-xs">{label}</span>
      </div>
      <p className="ui-heading mt-1 text-xl tabular-nums">{value}</p>
    </li>
  );
}

function ProgressSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-24 sm:px-6 lg:px-8">
      <Skeleton className="h-8 w-2/5" />
      <Skeleton className="mt-3 h-3 w-3/5" />
      <div className="ui-surface mt-6 grid items-center gap-5 p-5 sm:grid-cols-[auto_minmax(0,1fr)]">
        <Skeleton className="h-26 w-26" rounded="full" />
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-8">
        {Array.from({ length: 2 }, (_, g) => (
          <div key={g}>
            <Skeleton className="mb-3 h-5 w-1/4" />
            <div className="ui-surface divide-y divide-border p-0">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="p-4">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="mt-2 h-3 w-1/5" />
                  <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-1.5">
                    {Array.from({ length: 6 }, (_, k) => (
                      <Skeleton key={k} className="h-14" />
                    ))}
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

export default ProgressScreen;
