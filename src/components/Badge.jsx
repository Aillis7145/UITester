import { cn } from '@/lib/cn';
import { Icon } from './Icon';

/**
 * ป้ายสถานะ
 * ใช้ color-mix กับ token แทนสี Tailwind ตายตัว → เปลี่ยนธีมแล้วโทนตามเอง
 */
const TONES = {
  neutral: { bg: 'var(--color-surface-2)', fg: 'var(--color-text)' },
  primary: { bg: 'color-mix(in oklch, var(--color-primary) 18%, transparent)', fg: 'var(--color-primary)' },
  accent: { bg: 'color-mix(in oklch, var(--color-accent) 20%, transparent)', fg: 'var(--color-accent)' },
  success: { bg: 'color-mix(in oklch, var(--color-success) 20%, transparent)', fg: 'var(--color-success)' },
  warn: { bg: 'color-mix(in oklch, var(--color-warn) 24%, transparent)', fg: 'var(--color-warn)' },
  danger: { bg: 'color-mix(in oklch, var(--color-danger) 18%, transparent)', fg: 'var(--color-danger)' },
  solid: { bg: 'var(--color-primary)', fg: 'var(--color-on-primary)' },
};

export function Badge({ tone = 'neutral', icon, size = 'md', className, children, ...rest }) {
  const c = TONES[tone] ?? TONES.neutral;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-ui font-semibold',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        className,
      )}
      style={{ background: c.bg, color: c.fg }}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 12 : 14} />}
      {children}
    </span>
  );
}

export default Badge;
