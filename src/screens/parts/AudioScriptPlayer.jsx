import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Icon } from '@/components/Icon';
import { ProgressBar } from '@/components/ProgressBar';
import { cn } from '@/lib/cn';

/**
 * ปุ่มฟังบทพูดของข้อสอบการฟัง
 *
 * โปรเจคไม่มีไฟล์เสียง จึงให้เบราว์เซอร์อ่านสคริปต์ให้ด้วย SpeechSynthesis
 * ได้ยินเสียงจริงโดยไม่ต้องแนบไฟล์ และสคริปต์ยังเป็นข้อมูลเดียวกับที่มาจากไฟล์ Word
 *
 * *** ห้ามแสดงสคริปต์เป็นตัวหนังสือ ***
 * ต้นฉบับเขียนกำกับไว้ว่า "(ไม่แสดงข้อความ)" — ถ้าโชว์ ข้อสอบการฟังก็กลายเป็นข้อสอบการอ่าน
 * ผู้เรียนอ่านบทพูดได้ในหน้าผลสอบหลังส่งคำตอบแล้ว
 */
export function AudioScriptPlayer({ script, className }) {
  const { t } = useI18n();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [played, setPlayed] = useState(false);
  const utterRef = useRef(null);

  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  /**
   * speechSynthesis เป็น singleton ระดับ window — ไม่ cancel ตอนออกจากหน้า
   * เสียงจะพูดต่อทับหน้าถัดไป และพูดซ้อนกันเมื่อสลับข้อเร็วๆ
   */
  useEffect(() => {
    if (!supported) return undefined;
    return () => window.speechSynthesis.cancel();
  }, [supported, script]);

  const stop = () => {
    window.speechSynthesis.cancel();
    setPlaying(false);
    setProgress(0);
  };

  const play = () => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(script);
    utter.lang = 'en-US';
    utter.rate = 0.95;
    // onboundary ยิงทุกคำ ใช้ตำแหน่งตัวอักษรเป็นความคืบหน้าได้ตรงกว่าการจับเวลา
    utter.onboundary = (e) => setProgress(Math.min(1, e.charIndex / script.length));
    utter.onend = () => {
      setPlaying(false);
      setProgress(1);
      setPlayed(true);
    };
    utter.onerror = () => setPlaying(false);
    utterRef.current = utter;
    setPlaying(true);
    setProgress(0);
    window.speechSynthesis.speak(utter);
  };

  if (!supported) {
    return (
      <div className={cn('ui-inset flex items-center gap-3 p-4 text-sm text-muted', className)}>
        <Icon name="volume" size={18} />
        {t('quiz.audioUnsupported')}
      </div>
    );
  }

  return (
    <div className={cn('ui-inset flex flex-wrap items-center gap-3 p-4', className)}>
      <button
        type="button"
        onClick={playing ? stop : play}
        aria-label={playing ? t('quiz.stopAudio') : played ? t('quiz.listenAgain') : t('quiz.listen')}
        className="ui-interactive ui-focusable grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-on-primary"
      >
        <Icon name={playing ? 'pause' : 'volume'} size={19} />
      </button>

      <div className="min-w-40 flex-1">
        <p className="text-sm font-semibold">
          {playing ? t('quiz.playing') : played ? t('quiz.listenAgain') : t('quiz.listen')}
        </p>
        <ProgressBar
          value={progress}
          size="sm"
          className="mt-2"
          label={playing ? t('quiz.playing') : t('quiz.listen')}
        />
      </div>

      {/* บอกให้ชัดว่าไม่มีบทพูดให้อ่าน ไม่ใช่ลืมใส่ */}
      <p className="w-full text-xs text-muted sm:w-auto">{t('quiz.audioHidden')}</p>
    </div>
  );
}

export default AudioScriptPlayer;
