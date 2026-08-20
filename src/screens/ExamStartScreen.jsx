import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { useScreenState } from './screenState';
import { useAppRoute } from './appRoute';
import { courseOf, unitOf } from '@/mock/nodes';
import { quizFor, UNIT_SET, COURSE_SET } from '@/mock/quizzes';
import { formatClock } from '@/hooks/useCountdown';
import { AudioCheck } from './parts/AudioCheck';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Skeleton } from '@/components/Skeleton';

/**
 * หน้าเตรียมพร้อมก่อนเข้าห้องสอบ — คั่นระหว่างการเลือกวิชากับข้อสอบจริง
 *
 * มีเพราะข้อสอบชุดนี้มีข้อการฟังกับข้อการพูดปนอยู่ ผู้เข้าสอบที่รู้ตอนข้อ 7 ว่าลำโพงไม่ดัง
 * เสียข้อนั้นไปแล้วโดยไม่มีทางแก้ เวลาก็เดินไปแล้ว — ต้องรู้ก่อนกดเริ่ม
 *
 * ปุ่ม "เริ่มทำแบบทดสอบ" กดได้เสมอ ไม่บังคับให้ตรวจเสียงครบก่อน
 * เพราะคนที่รู้อยู่แล้วว่าอุปกรณ์ตัวเองพร้อมไม่ควรถูกขวาง และการบังคับจะกลายเป็น
 * ปุ่มที่กดไม่ได้โดยไม่มีคำอธิบายสำหรับคนที่เบราว์เซอร์ไม่รองรับ SpeechSynthesis
 *
 * รับ ?node ได้ทั้งจากหน้าเลือกวิชา (สื่อชิ้นแรกที่ควรเรียนต่อ) และจากปุ่มท้ายเพลย์ลิสต์
 * (สื่อที่กำลังดูอยู่) — appRoute ดันให้เป็นชั้น content ให้แล้วทั้งสองทาง
 */
export function ExamStartScreen({ onNavigate }) {
  const { t, p } = useI18n();
  const { showSkeleton } = useScreenState();
  const { project, node, set } = useAppRoute();
  const [speakerOk, setSpeakerOk] = useState(null);
  const [micOk, setMicOk] = useState(null);

  if (showSkeleton) return <ExamStartSkeleton />;

  const course = courseOf(node.id);
  const unit = unitOf(node.id);
  const ready = speakerOk === true && micOk === true;

  // เปิดหน้านี้ตรงๆ โดยไม่มี ?set ให้ถือว่าเป็นข้อสอบปลายคอร์ส
  // เพราะทางเข้าหลักของหน้านี้คือแท็บแบบทดสอบ และ ?node สำรองก็เป็นคอร์สที่เปิดสอบ
  //
  // *** ต้องคิดชุดเองที่นี่ ห้ามใช้ quiz จาก useAppRoute() ***
  // ค่านั้นคิดจาก ?set ดิบซึ่งเป็น null ตอนเปิดตรงๆ แล้วจะได้ข้อสอบท้ายบท
  // เลขบนหน้าจึงบอก 20 ข้อ ขณะที่ปุ่มพาไปข้อสอบ 50 ข้อ
  const setId = set === UNIT_SET ? UNIT_SET : COURSE_SET;
  const exam = quizFor(node, setId);
  const isCourseExam = setId === COURSE_SET;

  return (
    <div className="mx-auto max-w-4xl px-4 pt-6 pb-24 sm:px-6 lg:px-8">
      {/* ---------- หัวเรื่อง ---------- */}
      <header>
        <button
          type="button"
          onClick={() => onNavigate?.('exams', { node: null, set: null })}
          className="ui-focusable -ml-1 inline-flex items-center gap-1.5 rounded-ui px-1 py-0.5 text-sm text-muted hover:text-text"
        >
          <Icon name="arrowLeft" size={15} />
          {t('exam.backToList')}
        </button>

        <div className="mt-2 flex flex-wrap items-center gap-2.5">
          <h1 className="ui-heading text-2xl sm:text-3xl">{p(course.title)}</h1>
          <Badge tone="primary" size="sm" icon={project.icon}>
            {p(project.short)}
          </Badge>
          {/* ป้ายนี้คือสิ่งเดียวที่บอกว่ากำลังจะสอบชุดไหน หน้าตาที่เหลือเหมือนกันหมด */}
          <Badge tone={isCourseExam ? 'accent' : 'neutral'} size="sm" icon={isCourseExam ? 'award' : 'flag'}>
            {isCourseExam ? t('exam.kindCourse') : t('exam.kindUnit')}
          </Badge>
        </div>
        {/* ข้อสอบปลายคอร์สคลุมทั้งคอร์ส การขึ้นชื่อบทที่บังเอิญค้างอยู่ใน ?node จะอ่านเหมือนสอบแค่บทนั้น */}
        <p className="mt-2 text-muted">{isCourseExam ? p(course.subtitle) : p(unit?.title ?? course.subtitle)}</p>
        {isCourseExam && <p className="mt-1 text-sm text-muted">{t('exam.courseNote')}</p>}
      </header>

      {/* ---------- ข้อสอบชุดนี้คืออะไร ---------- */}
      <ul className="mt-6 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <StatTile icon="flag" label={t('exams.itemsLabel')} value={exam.questions.length} />
        <StatTile icon="clock" label={t('exam.timeLimit')} value={formatClock(exam.timeLimitSec)} mono />
        <StatTile icon="check" label={t('exam.passMarkLabel')} value={`${Math.round(exam.passMark * 100)}%`} />
        <StatTile icon="refresh" label={t('exam.attemptsLabel')} value={t('exam.attempts')} />
      </ul>

      {/* เรียงลงมาเป็นชั้น ไม่ใช่สองคอลัมน์ขนานกัน
          เพราะสองก้อนนี้เป็น "อ่านก่อน แล้วค่อยลงมือ" ไม่ใช่ของคู่ที่เทียบกัน
          วางขนานกันแล้วสายตาต้องเลือกเองว่าเริ่มฝั่งไหน และก้อนที่สั้นกว่าจะเหลือที่ว่างค้างไว้ */}
      <div className="mt-5 grid gap-5">
        {/* ---------- ข้อปฏิบัติ ---------- */}
        <section className="ui-surface p-5 sm:p-6">
          <h2 className="ui-heading text-lg">{t('exam.rulesTitle')}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {['rule1', 'rule2', 'rule3', 'rule4'].map((key) => (
              <li key={key} className="flex items-start gap-2.5">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/20 text-primary-ink">
                  <Icon name="check" size={13} strokeWidth={3} />
                </span>
                <span className="text-sm text-muted">{t(`exam.${key}`)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- ตรวจเสียง ---------- */}
        <section>
          <h2 className="ui-heading mb-3 text-lg">{t('exam.checkTitle')}</h2>
          <AudioCheck onSpeakerTested={setSpeakerOk} onMicTested={setMicOk} />
        </section>
      </div>

      {/* ---------- เริ่มสอบ ---------- */}
      <div className="ui-surface mt-5 flex flex-wrap items-center justify-between gap-4 p-5">
        <p className="min-w-0 flex-1 text-sm text-muted">
          {ready ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-success">
              <Icon name="check" size={15} />
              {t('exam.readyNote')}
            </span>
          ) : (
            t('exam.notCheckedNote')
          )}
        </p>
        <Button
          size="lg"
          icon="play"
          onClick={() => onNavigate?.('quiz', { node: node.id, set: setId })}
        >
          {t('exam.start')}
        </Button>
      </div>
    </div>
  );
}

function StatTile({ icon, label, value, mono }) {
  return (
    <li className="ui-surface p-4">
      <div className="flex items-center gap-2 text-muted">
        <Icon name={icon} size={15} className="shrink-0" />
        <span className="min-w-0 truncate text-sm">{label}</span>
      </div>
      <p className={`ui-heading mt-1.5 text-2xl tabular-nums ${mono ? 'font-mono' : ''}`}>{value}</p>
    </li>
  );
}

function ExamStartSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-6 pb-24 sm:px-6 lg:px-8">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-8 w-2/3" />
      <div className="mt-6 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <Skeleton className="mt-5 h-40" />
      <Skeleton className="mt-5 h-48" />
      <Skeleton className="mt-5 h-20" />
    </div>
  );
}

export default ExamStartScreen;
