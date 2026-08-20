import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { formatDuration } from '@/mock/data';
import { Icon } from '@/components/Icon';
import { cn } from '@/lib/cn';

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

/**
 * แทร็กคำบรรยายที่เลือกได้จากปุ่ม CC
 *
 * 'off' อยู่บนสุดเพราะเป็นสิ่งที่คนกดหาบ่อยที่สุดในเมนูนี้ ไม่ใช่เพราะเรียงตามตัวอักษร
 *
 * ข้อความตัวอย่างเก็บเป็นสตริงเดี่ยวต่อแทร็ก ไม่ใช่ { th, en } ที่อ่านผ่าน p()
 * เพราะคำบรรยายคือ "เสียงในคลิปแปลเป็นภาษานั้น" ไม่ใช่ข้อความ UI ที่ตามภาษาหน้าเว็บ
 * ถ้าใช้ p() การเลือก "ภาษาจีน" แล้วสลับหน้าเว็บเป็นอังกฤษจะทำให้คำบรรยายเปลี่ยนตามไปด้วย
 * ซึ่งตรงข้ามกับสิ่งที่ปุ่มนี้สัญญาไว้
 */
const CAPTION_TRACKS = [
  { id: 'off', labelKey: 'lesson.captionsOff' },
  { id: 'en', labelKey: 'lesson.captionEn', text: 'Let us start by loading the dataset with pandas' },
  { id: 'zh', labelKey: 'lesson.captionZh', text: '我们先用 pandas 载入数据集吧' },
  { id: 'th', labelKey: 'lesson.captionTh', text: 'เริ่มจากโหลดชุดข้อมูลด้วย pandas ก่อนนะครับ' },
];

/**
 * เครื่องเล่นวิดีโอจำลอง — ตั้งใจไม่ใช้ <video> จริง
 * เหตุผล: ไม่ต้องแนบไฟล์วิดีโอเข้าโปรเจค และแถบควบคุมทั้งแถบเป็น DOM ที่ทาธีมได้
 * ซึ่งเป็นจุดประสงค์ทั้งหมดของหน้านี้ — เทียบว่าแต่ละธีมทำแถบควบคุมออกมาหน้าตาแบบไหน
 * scrubber ลากได้จริงและเวลาเดินจริง เพื่อให้ประเมิน hit target และ feedback ได้
 */
/**
 * variant='audio' ย่อเวทีให้เตี้ยลงแทนการแยกเป็นคอมโพเนนต์ใหม่
 * เพราะสิ่งที่ต้องประเมินจริงคือแถบควบคุมที่ทาธีม ซึ่งเสียงกับวิดีโอใช้ของชิ้นเดียวกัน
 */
export function VideoPlayerMock({ lesson, hue = 200, startSec = 0, variant = 'video' }) {
  const { t, p, lang } = useI18n();
  const total = lesson?.durationSec ?? 600;

  const [current, setCurrent] = useState(Math.min(startSec, total));
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [muted, setMuted] = useState(false);
  // ค่าเริ่มต้นตามภาษาหน้าเว็บ "ตอนเปิดครั้งแรก" เท่านั้น จากนั้นเป็นของผู้ใช้
  // ถ้าผูกกับ lang ตลอด การสลับภาษาเว็บจะไปเปลี่ยนแทร็กที่ผู้ใช้เพิ่งเลือกเองทิ้ง
  const [captionId, setCaptionId] = useState(() => (lang === 'en' ? 'en' : 'th'));
  const [scrubbing, setScrubbing] = useState(false);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [ccOpen, setCcOpen] = useState(false);
  const trackRef = useRef(null);

  const buffered = Math.min(total, current + total * 0.18);

  useEffect(() => {
    if (!playing || scrubbing) return;
    const id = setInterval(() => {
      setCurrent((c) => {
        const next = c + speed;
        if (next >= total) {
          setPlaying(false);
          return total;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, speed, total, scrubbing]);

  const seekFromEvent = (e) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setCurrent(ratio * total);
  };

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setScrubbing(true);
    seekFromEvent(e);
  };

  const onKeyDown = (e) => {
    const step = e.shiftKey ? 30 : 5;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setCurrent((c) => Math.min(total, c + step));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setCurrent((c) => Math.max(0, c - step));
    } else if (e.key === ' ' || e.key === 'k') {
      e.preventDefault();
      setPlaying((v) => !v);
    }
  };

  const pct = (current / total) * 100;
  const track = CAPTION_TRACKS.find((c) => c.id === captionId) ?? CAPTION_TRACKS[0];

  return (
    <div className="ui-surface overflow-hidden p-0">
      {/* ---------- เวที ---------- */}
      <div
        className={cn(
          'relative w-full overflow-hidden',
          variant === 'audio' ? 'aspect-16/5' : 'aspect-video',
        )}
        style={{
          background: `linear-gradient(150deg, oklch(38% 0.10 ${hue}), oklch(18% 0.06 ${hue + 45}))`,
        }}
      >
        {/* โปสเตอร์ของบทเรียน — ไล่เฉดข้างหลังยังอยู่ เผื่อภาพโหลดไม่ขึ้น */}
        {lesson?.thumb && (
          <img
            src={lesson.thumb}
            alt=""
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/40" />

        <div className="absolute inset-0 grid place-items-center">
          <button
            type="button"
            onClick={() => setPlaying((v) => !v)}
            aria-label={playing ? t('lesson.pause') : t('lesson.play')}
            className="ui-focusable grid h-20 w-20 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-[transform,background-color] duration-(--dur-base) hover:scale-110 hover:bg-white/25"
          >
            <Icon name={playing ? 'pause' : 'play'} size={34} strokeWidth={1.5} />
          </button>
        </div>

        {/* หัวเรื่องบนวิดีโอ */}
        <div className="absolute inset-x-0 top-0 bg-linear-to-b from-black/55 to-transparent p-4">
          <p className="line-clamp-1 font-medium text-white/95">{p(lesson.title)}</p>
        </div>

        {/* คำบรรยาย — ข้อความมาจากแทร็กที่เลือก ไม่ได้ตามภาษาหน้าเว็บ */}
        {track.text && (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-6">
            <span
              lang={track.id}
              className="rounded-md bg-black/70 px-3 py-1.5 text-center text-sm text-white"
            >
              {track.text}
            </span>
          </div>
        )}
      </div>

      {/* ---------- แถบควบคุม ---------- */}
      <div className="px-3 pb-3 pt-2">
        {/* scrubber */}
        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-label={t('lesson.playing')}
          aria-valuemin={0}
          aria-valuemax={Math.round(total)}
          aria-valuenow={Math.round(current)}
          aria-valuetext={`${formatDuration(current)} / ${formatDuration(total)}`}
          onPointerDown={onPointerDown}
          onPointerMove={(e) => scrubbing && seekFromEvent(e)}
          onPointerUp={() => setScrubbing(false)}
          onPointerCancel={() => setScrubbing(false)}
          onKeyDown={onKeyDown}
          className="ui-focusable group relative -mx-1 cursor-pointer touch-none rounded-full px-1 py-2.5"
        >
          <div className="ui-inset relative h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-current opacity-20"
              style={{ width: `${(buffered / total) * 100}%` }}
            />
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-primary"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span
            className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-raised transition-transform duration-(--dur-fast) group-hover:scale-125"
            style={{ left: `calc(${pct}% )`, scale: scrubbing ? 1.3 : 1 }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <ControlButton
            icon={playing ? 'pause' : 'play'}
            label={playing ? t('lesson.pause') : t('lesson.play')}
            onClick={() => setPlaying((v) => !v)}
          />
          <ControlButton
            icon="volume"
            label={t('lesson.volume')}
            active={!muted}
            onClick={() => setMuted((v) => !v)}
          />

          <span className="ml-1.5 mr-auto font-mono text-sm tabular-nums text-muted">
            {formatDuration(current)}
            <span className="opacity-50"> / {formatDuration(total)}</span>
          </span>

          {/* ความเร็ว — ดรอปดาวน์เล็กในบริบทจริง */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSpeedOpen((v) => !v)}
              onBlur={() => setSpeedOpen(false)}
              aria-expanded={speedOpen}
              aria-label={t('lesson.speed')}
              className="ui-focusable ui-interactive rounded-ui px-2.5 py-1.5 font-mono text-sm font-semibold text-muted hover:text-text"
            >
              {speed.toFixed(2).replace(/0$/, '')}x
            </button>
            <ul
              data-open={speedOpen}
              className="ui-menu absolute bottom-full right-0 z-30 mb-2 w-24 p-1.5"
              style={{ transformOrigin: 'bottom center' }}
            >
              {SPEEDS.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setSpeed(s);
                      setSpeedOpen(false);
                    }}
                    className={cn(
                      'w-full rounded-ui px-2.5 py-1.5 text-left font-mono text-sm transition-colors duration-(--dur-fast) hover:bg-surface-2',
                      s === speed && 'font-bold text-primary-ink',
                    )}
                  >
                    {s}x
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* คำบรรยาย — กดแล้วเลือกภาษาได้ ไม่ใช่สวิตช์เปิด/ปิด
              ใช้โครงเดียวกับเมนูความเร็วข้างบนทุกอย่าง (กางขึ้นบน · ปิดตอน blur ·
              onMouseDown + preventDefault ที่รายการ เพื่อให้เลือกได้ก่อนปุ่มเสียโฟกัส) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCcOpen((v) => !v)}
              onBlur={() => setCcOpen(false)}
              aria-expanded={ccOpen}
              aria-label={t('lesson.captions')}
              title={t('lesson.captions')}
              className={cn(
                'ui-focusable ui-interactive grid h-9 w-9 place-items-center rounded-ui',
                track.text ? 'text-primary-ink' : 'text-muted opacity-60',
              )}
            >
              <Icon name="captions" size={18} />
            </button>
            <ul
              role="menu"
              aria-label={t('lesson.captions')}
              data-open={ccOpen}
              className="ui-menu absolute bottom-full right-0 z-30 mb-2 w-36 p-1.5"
              style={{ transformOrigin: 'bottom center' }}
            >
              {CAPTION_TRACKS.map((c) => (
                <li key={c.id} role="none">
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={c.id === captionId}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setCaptionId(c.id);
                      setCcOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-ui px-2.5 py-1.5 text-left text-sm transition-colors duration-(--dur-fast) hover:bg-surface-2',
                      c.id === captionId && 'font-bold text-primary-ink',
                    )}
                  >
                    {/* ที่ว่างของเครื่องหมายถูกจองไว้เสมอ ไม่งั้นข้อความจะขยับตอนเลือก */}
                    <span className="grid w-4 shrink-0 place-items-center">
                      {c.id === captionId && <Icon name="check" size={14} strokeWidth={3} />}
                    </span>
                    {t(c.labelKey)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <ControlButton icon="gear" label={t('lesson.settings')} />
          <ControlButton icon="expand" label={t('lesson.fullscreen')} />
        </div>
      </div>
    </div>
  );
}

function ControlButton({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active === undefined ? undefined : active}
      className={cn(
        'ui-focusable ui-interactive grid h-9 w-9 place-items-center rounded-ui',
        active === false ? 'text-muted opacity-60' : 'text-muted hover:text-text',
        active === true && 'text-primary-ink',
      )}
    >
      <Icon name={icon} size={18} />
    </button>
  );
}

export default VideoPlayerMock;
