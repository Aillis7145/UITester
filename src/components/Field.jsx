import { useId } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

const SIZES = { sm: 'h-9 text-sm', md: 'h-11', lg: 'h-13 text-lg' };

/**
 * ช่องกรอกข้อความ
 * ธีม neu ใช้เงา inset ทำให้ดูเป็นรอยกด ธีมอื่นใช้เส้นขอบ — คุมด้วย .ui-inset ตัวเดียว
 */
export function Field({
  label,
  hint,
  error,
  icon,
  trailing,
  size = 'md',
  id: idProp,
  className,
  wrapperClassName,
  ...rest
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;

  return (
    <div className={cn('w-full', wrapperClassName)}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text">
          {label}
        </label>
      )}

      <div
        className={cn(
          'ui-inset ui-interactive flex items-center gap-2 px-3.5',
          'focus-within:shadow-(--ui-focus-ring)',
          SIZES[size],
          error && 'border-danger',
          className,
        )}
        style={error ? { borderColor: 'var(--color-danger)' } : undefined}
      >
        {icon && <Icon name={icon} size={18} className="shrink-0 text-muted" />}
        <input
          id={id}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className="w-full min-w-0 bg-transparent text-text outline-none placeholder:text-muted"
          {...rest}
        />
        {trailing}
      </div>

      {error ? (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default Field;
