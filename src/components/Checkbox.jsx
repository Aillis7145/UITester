import { useId } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

/** ช่องติ๊ก — ซ่อน input จริงไว้แต่ยังรับคีย์บอร์ดและ screen reader ได้เต็มที่ */
export function Checkbox({ label, checked, onChange, disabled, radio = false, className, id: idProp }) {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <label
      htmlFor={id}
      className={cn(
        'group inline-flex cursor-pointer select-none items-center gap-2.5 text-sm',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <input
        id={id}
        type={radio ? 'radio' : 'checkbox'}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          'ui-interactive grid h-5 w-5 shrink-0 place-items-center border-2',
          'peer-focus-visible:shadow-(--ui-focus-ring)',
          radio ? 'rounded-full' : 'rounded-[0.375rem]',
          checked
            ? 'border-transparent bg-primary text-on-primary'
            : // ตอนยังไม่กดต้องใช้เฉดของสีตัวหนังสือ ไม่ใช่ --color-border
              // เพราะธีมที่ไม่มีเส้นขอบ (neu ตั้ง border เป็น transparent, edura ตั้ง 0px)
              // จะทำให้ช่องหายไปทั้งช่องจนไม่รู้ว่ากดได้
              'border-current/35 bg-current/8 shadow-[inset_0_1px_2px_rgb(0_0_0/0.06)]',
        )}
      >
        {checked &&
          (radio ? (
            <span className="h-2 w-2 rounded-full bg-current" />
          ) : (
            <Icon name="check" size={13} strokeWidth={3} />
          ))}
      </span>
      {label && <span className="text-text">{label}</span>}
    </label>
  );
}

export default Checkbox;
