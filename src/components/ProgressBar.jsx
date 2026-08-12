import { cn } from '@/lib/cn';

const SIZES = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' };

const TONE_VAR = {
  primary: 'var(--color-primary)',
  accent: 'var(--color-accent)',
  success: 'var(--color-success)',
  warn: 'var(--color-warn)',
  danger: 'var(--color-danger)',
};

/** แถบความคืบหน้า — value เป็น 0..1 */
export function ProgressBar({ value = 0, size = 'md', tone = 'primary', label, className }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn('ui-inset w-full overflow-hidden rounded-full', SIZES[size], className)}
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
}

export default ProgressBar;
