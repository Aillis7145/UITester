import { cn } from '@/lib/cn';
import { Icon } from './Icon';

const SIZES = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 gap-2',
  lg: 'h-13 px-7 text-lg gap-2.5',
};

const VARIANTS = {
  primary: 'bg-primary text-on-primary shadow-raised',
  accent: 'bg-accent text-on-primary shadow-raised',
  danger: 'bg-danger text-on-primary shadow-raised',
  outline: 'bg-transparent text-primary-ink border-2 border-current',
  // ใช้ currentColor แทน surface-2 เพราะปุ่ม ghost อยู่ได้ทั้งบนพื้นหน้าและในการ์ด
  // ซึ่งในธีมพื้นเข้ม-การ์ดขาว สองที่นี้ต้องการสี hover คนละทิศทางกัน
  ghost: 'bg-transparent text-text hover:bg-current/10',
  subtle: 'ui-panel text-text',
};

/**
 * ปุ่มหลักของทั้งโปรเจค
 * สังเกตว่าไม่มี `if (theme === ...)` เลยแม้แต่ตัวเดียว —
 * JSX ชุดนี้เรนเดอร์ออกมาเป็นปุ่มกระจกนีออน / ปุ่มสติกเกอร์คอรัล / ปุ่มนูนม่วง
 * ตามค่า token ที่ธีมตั้งไว้ล้วนๆ
 */
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...rest
}) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'ui-interactive ui-focusable relative inline-flex select-none items-center justify-center rounded-ui font-semibold',
        'disabled:pointer-events-none disabled:opacity-50',
        SIZES[size],
        VARIANTS[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading && <Spinner />}
      <span className={cn('inline-flex items-center gap-2', loading && 'invisible')}>
        {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}
        {children}
        {iconRight && <Icon name={iconRight} size={size === 'sm' ? 16 : 18} />}
      </span>
    </button>
  );
}

function Spinner() {
  return (
    <span className="absolute inset-0 grid place-items-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 12 12"
            to="360 12 12"
            dur="0.75s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </span>
  );
}

export default Button;
