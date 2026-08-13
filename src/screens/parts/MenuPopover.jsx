import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * แผงลอยที่ผูกกับปุ่มบน AppBar
 *
 * แยกออกมาเพราะเมนูแจ้งเตือนกับเมนูโปรไฟล์ต้องการพฤติกรรมเดียวกันเป๊ะ
 * (คลิกนอกกรอบปิด · Escape ปิด · โฟกัสกลับไปที่ปุ่มเมื่อปิด)
 * ถ้าเขียนแยกกันสองที่ พฤติกรรมจะเริ่มต่างกันเมื่อแก้ทีหลัง
 *
 * ใช้ recipe .ui-menu ซึ่งมีอนิเมชั่นเข้า-ออกด้วย CSS ล้วนอยู่แล้ว
 * และรับ token ของเนื้อหาบนพื้นผิว จึงอ่านออกทุกธีมรวมถึงธีมพื้นเข้ม-การ์ดสว่าง
 */
export function MenuPopover({ label, width = 'w-72', trigger, children }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={rootRef} className="relative">
      {trigger({
        open,
        toggle: () => setOpen((v) => !v),
        ref: triggerRef,
        props: { 'aria-expanded': open, 'aria-haspopup': 'menu', 'aria-controls': id },
      })}

      <div
        id={id}
        data-open={open}
        role="menu"
        aria-label={label}
        className={cn('ui-menu absolute right-0 z-50 mt-2 overflow-hidden p-0', width)}
        style={{ transformOrigin: 'top right' }}
      >
        {children({ close })}
      </div>
    </div>
  );
}

export default MenuPopover;
