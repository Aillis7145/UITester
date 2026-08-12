import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

const SIZES = { sm: 'h-9 text-sm px-3', md: 'h-11 px-3.5', lg: 'h-13 text-lg px-4' };

/**
 * ดรอปดาวน์เลือกค่าเดียว
 * อนิเมชั่นเข้า-ออกเป็น CSS ล้วน (.ui-menu ใน recipes.css) ไม่มี JS จับเวลา
 * รองรับคีย์บอร์ดครบ: ลูกศร Home End Escape Enter
 *
 * options: [{ value, label, icon? }] — label เป็น string ที่แปลแล้ว
 */
export function Dropdown({
  options,
  value,
  onChange,
  label,
  placeholder = '—',
  size = 'md',
  align = 'start',
  className,
  wrapperClassName,
  buttonClassName,
}) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const id = useId();

  const selectedIdx = options.findIndex((o) => o.value === value);
  const selected = selectedIdx >= 0 ? options[selectedIdx] : null;

  // ปิดเมื่อคลิกนอกกรอบ หรือเมื่อโฟกัสหลุดออกไป
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // เลื่อนรายการที่กำลังโฟกัสให้อยู่ในสายตา
  useEffect(() => {
    if (!open) return;
    listRef.current?.children[activeIdx]?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIdx]);

  const openMenu = (startIdx = selectedIdx >= 0 ? selectedIdx : 0) => {
    setActiveIdx(startIdx);
    setOpen(true);
  };

  const pick = (idx) => {
    onChange?.(options[idx].value);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) openMenu();
        else setActiveIdx((i) => (i + 1) % options.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!open) openMenu(options.length - 1);
        else setActiveIdx((i) => (i - 1 + options.length) % options.length);
        break;
      case 'Home':
        if (open) {
          e.preventDefault();
          setActiveIdx(0);
        }
        break;
      case 'End':
        if (open) {
          e.preventDefault();
          setActiveIdx(options.length - 1);
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (open) pick(activeIdx);
        else openMenu();
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div ref={rootRef} className={cn('relative', wrapperClassName)}>
      {label && (
        <span id={`${id}-label`} className="mb-1.5 block text-sm font-medium text-text">
          {label}
        </span>
      )}

      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-haspopup="listbox"
        aria-labelledby={label ? `${id}-label` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={cn(
          'ui-inset ui-interactive ui-focusable flex w-full items-center justify-between gap-3 font-medium',
          SIZES[size],
          buttonClassName,
        )}
      >
        <span className={cn('flex min-w-0 items-center gap-2', !selected && 'text-muted')}>
          {selected?.icon && <Icon name={selected.icon} size={17} className="shrink-0" />}
          <span className="truncate">{selected ? selected.label : placeholder}</span>
        </span>
        <Icon
          name="chevronDown"
          size={17}
          className="shrink-0 text-muted transition-transform duration-(--dur-fast)"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </button>

      <ul
        id={`${id}-list`}
        ref={listRef}
        role="listbox"
        data-open={open}
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-activedescendant={open ? `${id}-opt-${activeIdx}` : undefined}
        tabIndex={-1}
        className={cn(
          'ui-menu absolute z-50 mt-2 max-h-72 min-w-full overflow-y-auto p-1.5',
          align === 'end' ? 'right-0' : 'left-0',
          className,
        )}
        style={{ transformOrigin: 'top center' }}
      >
        {options.map((opt, i) => {
          const isSelected = opt.value === value;
          return (
            <li
              key={opt.value}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={isSelected}
              onPointerEnter={() => setActiveIdx(i)}
              onClick={() => pick(i)}
              className={cn(
                'flex cursor-pointer items-center gap-2.5 rounded-ui px-3 py-2.5 text-sm',
                'transition-colors duration-(--dur-fast)',
                i === activeIdx && 'bg-surface-2',
                isSelected && 'font-semibold text-primary-ink',
              )}
            >
              {opt.icon && <Icon name={opt.icon} size={17} className="shrink-0" />}
              <span className="min-w-0 flex-1">{opt.label}</span>
              {isSelected && <Icon name="check" size={16} className="shrink-0" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Dropdown;
