import { cn } from '@/lib/cn';
import { Icon } from './Icon';

/** ชิปกรอง — กดเลือกได้ ใช้ aria-pressed ให้ screen reader รู้สถานะ */
export function Chip({ active = false, icon, className, children, ...rest }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'ui-interactive ui-focusable inline-flex shrink-0 items-center gap-1.5 rounded-ui px-3.5 py-2 text-sm font-medium',
        active
          ? 'bg-primary text-on-primary shadow-raised'
          : 'ui-panel text-muted hover:text-text',
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={15} />}
      {children}
    </button>
  );
}

export default Chip;
