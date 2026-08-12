import { cn } from '@/lib/cn';
import { Icon } from './Icon';

const SIZES = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' };
const ICON_SIZE = { sm: 16, md: 19, lg: 22 };

const VARIANTS = {
  ghost: 'bg-transparent text-text hover:bg-current/10',
  subtle: 'ui-panel text-text',
  primary: 'bg-primary text-on-primary shadow-raised',
  outline: 'bg-transparent text-text border-2 border-border',
};

/** ปุ่มไอคอนล้วน — บังคับต้องมี label เพื่อให้ screen reader อ่านออก */
export function IconButton({
  icon,
  label,
  size = 'md',
  variant = 'ghost',
  badge,
  active = false,
  className,
  ...rest
}) {
  const hasBadge = badge != null && badge !== 0;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active || undefined}
      className={cn(
        'ui-interactive ui-focusable inline-grid place-items-center rounded-ui',
        'disabled:pointer-events-none disabled:opacity-50',
        // `relative` เฉพาะตอนมี badge เท่านั้น — ถ้าใส่ไว้ตลอด มันจะไปชนกับ `absolute`
        // ที่ผู้เรียกส่งมาทาง className แล้วปุ่มจะไปโผล่ผิดที่ (Tailwind ไม่ได้เรียงตามลำดับที่เขียน)
        hasBadge && 'relative',
        SIZES[size],
        VARIANTS[variant],
        active && variant !== 'primary' && 'text-primary-ink',
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={ICON_SIZE[size]} />
      {hasBadge && (
        <span
          className="absolute -right-0.5 -top-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-danger px-1 text-[0.625rem] font-bold text-on-primary"
          aria-hidden="true"
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export default IconButton;
