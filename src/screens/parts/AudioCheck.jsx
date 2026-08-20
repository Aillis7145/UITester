import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { cn } from '@/lib/cn';

/**
 * ตรวจความพร้อมของเสียงก่อนเข้าห้องสอบ — ลำโพงหนึ่งใบ ไมโครโฟนหนึ่งใบ
 *
 * ─────────────────────────────────────────────────────────────
 * ลำโพงทดสอบของจริง ไมโครโฟนทดสอบแบบจำลอง — และมีเหตุผล ไม่ใช่ความขี้เกียจ
 * ─────────────────────────────────────────────────────────────
 * ลำโพงใช้ SpeechSynthesis เหมือนข้อสอบการฟัง กดแล้วได้ยินเสียงจริง
 * ถ้าได้ยินประโยคทดสอบ แปลว่าข้อสอบการฟังก็จะได้ยินด้วย — เป็นการทดสอบที่ตรงกับของจริง
 *
 * ไมโครโฟนอัดจริงไม่ได้ เพราะ getUserMedia ต้องใช้ HTTPS หรือ localhost เท่านั้น
 * เว็บตัวอย่างนี้ถูกเปิดดูผ่าน http://<ip ในวงแลน>:4173 เป็นหลัก
 * ปุ่มที่กดแล้วเบราว์เซอร์ปฏิเสธเงียบๆ ทุกครั้งแย่กว่าปุ่มจำลองที่บอกตรงๆ ว่าจำลอง
 * (และถ้าขอสิทธิ์ไมค์จริง สคริปต์ตรวจสอบอัตโนมัติจะค้างรอ permission ทุกรอบ)
 *
 * จับเวลาจริงและแถบระดับเสียงขยับจริง สิ่งที่จำลองคือ "การบันทึก" อย่างเดียว
 */

const MAX_SEC = 10;

export function AudioCheck({ onSpeakerTested, onMicTested, className }) {
  return (
    <div className={cn('grid gap-3.5 lg:grid-cols-2', className)}>
      <SpeakerCheck onTested={onSpeakerTested} />
      <MicCheck onTested={onMicTested} />
    </div>
  );
}

/* ============================================================
   ลำโพง
   ============================================================ */
function SpeakerCheck({ onTested }) {
  const { t } = useI18n();
  const [playing, setPlaying] = useState(false);
  const [heard, setHeard] = useState(null);
  // เคยกดฟังแล้วหรือยัง — แยกจาก playing เพราะปุ่มตอบต้องอยู่ต่อหลังเสียงจบ
  const [asked, setAsked] = useState(false);
  const [failed, setFailed] = useState(false);

  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // speechSynthesis เป็น singleton ระดับ window — ไม่ cancel ตอนออกจากหน้า
  // เสียงจะพูดต่อทับหน้าข้อสอบที่กำลังจะเปิด
  useEffect(() => {
    if (!supported) return undefined;
    return () => window.speechSynthesis.cancel();
  }, [supported]);

  const play = () => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(t('exam.speakerSample'));
    utter.lang = 'th-TH';
    utter.rate = 0.95;
    utter.onend = () => setPlaying(false);
    // เบราว์เซอร์ที่ไม่มีเสียงพูดติดตั้ง (เครื่องเซิร์ฟเวอร์ ลินุกซ์บางตัว) ยิง error ทันที
    // ต้องบอกให้รู้ว่าเป็นที่เบราว์เซอร์ ไม่ใช่ที่ลำโพงของผู้เข้าสอบ
    utter.onerror = () => {
      setPlaying(false);
      setFailed(true);
    };
    setAsked(true);
    setFailed(false);
    setPlaying(true);
    window.speechSynthesis.speak(utter);
  };

  const answer = (ok) => {
    setHeard(ok);
    onTested?.(ok);
  };

  return (
    <CheckCard
      icon="volume"
      title={t('exam.speakerTitle')}
      note={t('exam.speakerNote')}
      state={heard === true ? 'ok' : heard === false ? 'bad' : 'idle'}
    >
      {!supported ? (
        <p className="text-sm text-muted">{t('quiz.audioUnsupported')}</p>
      ) : (
        <>
          <Button
            size="sm"
            variant={heard === null ? 'primary' : 'outline'}
            icon={playing ? 'pause' : 'volume'}
            onClick={playing ? () => (window.speechSynthesis.cancel(), setPlaying(false)) : play}
          >
            {playing ? t('exam.speakerPlaying') : t('exam.speakerPlay')}
          </Button>

          {/* ถามหลังกดฟังเท่านั้น — ถามก่อนได้ยินอะไรเลยคือคำถามที่ตอบไม่ได้
              และเมื่อโผล่แล้วต้องอยู่ต่อ ไม่ใช่หายไปตอนเสียงจบ
              เดิมผูกกับ playing ล้วน พอเบราว์เซอร์ไม่มีเสียงติดตั้ง error จะยิงทันที
              ปุ่มตอบก็หายไปในเสี้ยววินาที ผู้เข้าสอบจึงไม่มีทางบอกได้ว่า "ไม่ได้ยิน" */}
          {asked && (
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="ghost" icon="check" onClick={() => answer(true)}>
                {t('exam.speakerYes')}
              </Button>
              <Button size="sm" variant="ghost" icon="x" onClick={() => answer(false)}>
                {t('exam.speakerNo')}
              </Button>
            </div>
          )}
        </>
      )}

      {failed && <p className="w-full text-sm text-warn">{t('exam.speakerNoVoice')}</p>}
      {heard === false && <p className="w-full text-sm text-danger">{t('exam.speakerFix')}</p>}
    </CheckCard>
  );
}

/* ============================================================
   ไมโครโฟน
   ============================================================ */
function MicCheck({ onTested }) {
  const { t } = useI18n();
  const reduced = usePrefersReducedMotion();
  const [sec, setSec] = useState(0);
  const [recording, setRecording] = useState(false);
  const [taken, setTaken] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);

  // นาฬิกาต้องหยุดตอนออกจากหน้า ไม่งั้น setState ยิงใส่คอมโพเนนต์ที่ถูกถอดไปแล้ว
  useEffect(
    () => () => {
      clearInterval(timer.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    },
    [],
  );

  const stop = (elapsed) => {
    clearInterval(timer.current);
    setRecording(false);
    setTaken(elapsed);
    onTested?.(elapsed > 0);
  };

  const start = () => {
    setSec(0);
    setTaken(0);
    setRecording(true);
    timer.current = setInterval(() => {
      setSec((s) => {
        const next = s + 1;
        // หยุดเองที่เพดาน ไม่งั้นคนที่เดินออกจากหน้าจอไปจะปล่อยให้นับต่อไม่รู้จบ
        if (next >= MAX_SEC) stop(next);
        return next;
      });
    }, 1000);
  };

  const playBack = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(t('exam.micSample'));
    utter.lang = 'th-TH';
    utter.onend = () => setPlaying(false);
    utter.onerror = () => setPlaying(false);
    setPlaying(true);
    window.speechSynthesis.speak(utter);
  };

  const clock = `0:${String(recording ? sec : taken).padStart(2, '0')}`;

  return (
    <CheckCard
      icon="user"
      title={t('exam.micTitle')}
      note={t('exam.micNote')}
      state={taken > 0 ? 'ok' : 'idle'}
    >
      {recording ? (
        <>
          <Button size="sm" variant="outline" icon="pause" onClick={() => stop(sec)}>
            {t('exam.micStop')}
          </Button>
          <span className="font-mono text-sm tabular-nums text-danger">● {clock}</span>
          <LevelMeter active={!reduced} />
        </>
      ) : taken > 0 ? (
        <>
          <Button
            size="sm"
            variant="outline"
            icon={playing ? 'pause' : 'play'}
            onClick={playing ? () => (window.speechSynthesis.cancel(), setPlaying(false)) : playBack}
          >
            {playing ? t('exam.micPlaying') : t('exam.micPlay')}
          </Button>
          <Button size="sm" variant="ghost" icon="refresh" onClick={start}>
            {t('exam.micRetry')}
          </Button>
          <span className="font-mono text-sm tabular-nums text-muted">{clock}</span>
        </>
      ) : (
        <Button size="sm" icon="user" onClick={start}>
          {t('exam.micStart')}
        </Button>
      )}

      {/* บอกตรงๆ ว่าอะไรจำลอง เพราะเสียงที่เล่นกลับไม่ใช่เสียงที่เพิ่งพูด */}
      <p className="w-full text-xs text-muted">{t('exam.micMock')}</p>
    </CheckCard>
  );
}

/**
 * แถบระดับเสียง — ภาพประกอบล้วน ไม่ได้อ่านค่าจากไมค์จริง
 * ซ่อนจาก screen reader และหยุดนิ่งเมื่อผู้ใช้ขอลดการเคลื่อนไหว
 */
function LevelMeter({ active }) {
  return (
    <span aria-hidden="true" className="flex h-6 items-end gap-1">
      <style>{`@keyframes audiocheck-bar { 0%,100% { height: 22% } 50% { height: 100% } }`}</style>
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="w-1 rounded-full bg-primary"
          style={{
            height: active ? undefined : '45%',
            animation: active ? `audiocheck-bar ${0.6 + i * 0.13}s ease-in-out infinite` : undefined,
          }}
        />
      ))}
    </span>
  );
}

/* ============================================================
   กล่องของแต่ละอย่างที่ตรวจ
   ============================================================ */
function CheckCard({ icon, title, note, state, children }) {
  const { t } = useI18n();
  return (
    <section className="ui-panel p-4">
      <div className="flex items-start gap-3">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-ui"
          style={{
            background: 'color-mix(in oklch, var(--color-primary) 14%, transparent)',
            color: 'var(--color-primary-ink)',
          }}
        >
          <Icon name={icon} size={19} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="ui-heading text-base">{title}</h3>
            {state === 'ok' && (
              <Badge tone="success" size="sm" icon="check">
                {t('exam.checkOk')}
              </Badge>
            )}
            {state === 'bad' && (
              <Badge tone="danger" size="sm" icon="x">
                {t('exam.checkBad')}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">{note}</p>

          <div className="mt-3.5 flex flex-wrap items-center gap-2.5">{children}</div>
        </div>
      </div>
    </section>
  );
}

export default AudioCheck;
