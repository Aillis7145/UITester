import { useId } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { cn } from '@/lib/cn';

const SIZES = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' };

const TONE_VAR = {
  primary: 'var(--color-primary)',
  accent: 'var(--color-accent)',
  success: 'var(--color-success)',
  warn: 'var(--color-warn)',
  danger: 'var(--color-danger)',
};

/**
 * แถบความคืบหน้า — value เป็น 0..1
 *
 * showLabel เติมบรรทัดกำกับ "ความคืบหน้า … NN%" ไว้เหนือแถบ
 *
 * ตัวเลขอยู่ในคอมโพเนนต์ ไม่ใช่ที่จุดเรียก
 * เดิมทุกจุดเขียน Math.round(v * 100) ซ้ำกันเอง จุดที่ลืมเขียนจึงไม่มีตัวเลขให้อ่าน
 * และไม่มีอะไรฟ้อง — ย้ายเข้ามาแล้วลืมไม่ได้อีก
 *
 * props:
 *   showLabel  เปิดบรรทัดกำกับ
 *   caption    ข้อความซ้ายมือ (ไม่ส่ง = "ความคืบหน้า")
 *   suffix     ต่อท้ายตัวเลข % เช่น "· 5/12 รายการ"
 *
 * className ย้ายไปอยู่กล่องนอกเมื่อ showLabel เพราะกล่องนอกคือสิ่งที่จุดเรียกวางในเลย์เอาต์
 * จุดเรียกที่เคยส่ง flex-1 ให้ตัวแถบจึงต้องเลิกห่อ flex เองพร้อมกัน
 */
export function ProgressBar({
  value = 0,
  size = 'md',
  tone = 'primary',
  label,
  showLabel = false,
  caption,
  suffix,
  className,
}) {
  const { t } = useI18n();
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  const captionId = useId();

  const bar = (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      // ชื่อที่ screen reader อ่านต้องเป็นข้อความเดียวกับที่ตาเห็น
      // จึงชี้ไปที่บรรทัดกำกับด้วย labelledby แทน แล้ว "ห้าม" ใส่ aria-label คู่กัน
      // เพราะ aria-label ชนะเสมอ บรรทัดที่ตาเห็นจะถูกกลบเงียบๆ
      {...(showLabel ? { 'aria-labelledby': captionId } : { 'aria-label': label })}
      className={cn('ui-inset w-full overflow-hidden rounded-full', SIZES[size], !showLabel && className)}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${pct}%`,
          background: TONE_VAR[tone] ?? TONE_VAR.primary,
          transition: 'width var(--dur-slow) var(--ease-smooth)',
        }}
      />
    </div>
  );

  if (!showLabel) return bar;

  return (
    <div className={cn('w-full', className)}>
      <p id={captionId} className="mb-1.5 flex items-baseline justify-between gap-2 text-xs">
        <span className="truncate text-muted">{caption ?? t('common.progress')}</span>
        <span className="shrink-0 font-semibold text-primary-ink">
          {pct}%{suffix ? ` ${suffix}` : ''}
        </span>
      </p>
      {bar}
    </div>
  );
}

export default ProgressBar;
