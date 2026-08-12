import { useI18n } from '@/i18n/I18nProvider';
import { formatClock } from '@/hooks/useCountdown';
import { Icon } from '@/components/Icon';
import { cn } from '@/lib/cn';

/**
 * นาฬิกานับถอยหลัง
 * เปลี่ยนสีที่ 2 นาที และ 30 วินาที — เป็นจุดเทียบธีมที่ดีมาก
 * เพราะบังคับให้ทุกธีมต้องตอบว่า "สีเตือน" กับ "สีอันตราย" ของตัวเองหน้าตาเป็นยังไง
 */
export function QuizTimer({ secondsLeft, className }) {
  const { t } = useI18n();
  const level = secondsLeft <= 30 ? 'danger' : secondsLeft <= 120 ? 'warn' : 'normal';

  return (
    <div
      className={cn(
        'ui-panel flex items-center gap-2 px-3 py-2 tabular-nums',
        level === 'danger' && 'animate-pulse',
        className,
      )}
      style={
        level === 'normal'
          ? undefined
          : {
              color: `var(--color-${level})`,
              borderColor: `var(--color-${level})`,
              background: `color-mix(in oklch, var(--color-${level}) 14%, transparent)`,
            }
      }
      role="timer"
      aria-live={level === 'danger' ? 'assertive' : 'off'}
    >
      <Icon name="clock" size={17} className={level === 'normal' ? 'text-muted' : undefined} />
      <span className="sr-only">{t('quiz.timeLeft')}</span>
      <span className="font-mono font-semibold">{formatClock(secondsLeft)}</span>
    </div>
  );
}

export default QuizTimer;
