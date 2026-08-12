import { useLayoutEffect, useRef, useState } from 'react';

export const meta = {
  id: 'tog-segmented-slide',
  group: 'toggles',
  name: { th: 'แถบเลือกมีตัวชี้เลื่อน', en: 'Segmented with Slider' },
  tags: ['segmented', 'indicator', 'keyboard'],
};

export const css = `
.v-seg {
  position: relative;
  display: inline-flex;
  gap: .125rem;
  padding: .25rem;
  border-radius: var(--radius-ui);
  background: color-mix(in oklch, var(--color-text) 12%, transparent);
  box-shadow: var(--shadow-pressed);
}
.v-seg[data-disabled='true'] { opacity: .5; pointer-events: none; }

/* ตัวชี้เป็น element เดียวที่เลื่อนไปมา ไม่ใช่พื้นหลังของปุ่มแต่ละอัน
   ทำให้ได้ความรู้สึกต่อเนื่องแทนการกระพริบสลับ */
.v-seg .v-seg-thumb {
  position: absolute;
  top: .25rem;
  bottom: .25rem;
  border-radius: calc(var(--radius-ui) - .2rem);
  background: var(--color-primary);
  box-shadow: var(--shadow-raised);
  transition:
    translate var(--dur-base) var(--ease-back),
    width var(--dur-base) var(--ease-back);
}
.v-seg .v-seg-btn {
  position: relative;
  z-index: 1;
  border-radius: calc(var(--radius-ui) - .2rem);
  font-weight: 600;
  color: var(--color-muted);
  /* ไทยไม่มีเว้นวรรคระหว่างคำ ถ้าไม่ล็อกไว้จะถูกตัดกลางคำเมื่อพื้นที่แคบ */
  white-space: nowrap;
  transition: color var(--dur-base) var(--ease-smooth);
}
.v-seg .v-seg-btn[aria-checked='true'] { color: var(--color-on-primary); }
`;

const OPTIONS = ['ทั้งหมด', 'เรียนอยู่', 'จบแล้ว'];
const H = { sm: 'h-8 px-2.5 text-xs', md: 'h-10 px-3.5 text-sm', lg: 'h-12 px-4' };

export default function SegmentedSlide({ size = 'md', disabled }) {
  const [active, setActive] = useState(0);
  const [thumb, setThumb] = useState({ left: 0, width: 0 });
  const btns = useRef([]);
  const rootRef = useRef(null);

  // ต้องวัดหลัง commit ไม่ใช่ตอน render — ตอน render แรก ref ยังว่าง
  // ถ้าคำนวณตรงนั้นตัวชี้จะกว้าง 0 จนกว่าจะมีอะไรไปสั่ง re-render
  // ResizeObserver คอยวัดใหม่เมื่อกล่องเปลี่ยนขนาด เช่นตอนสลับภาษาแล้วป้ายยาวขึ้น
  useLayoutEffect(() => {
    const measure = () => {
      const el = btns.current[active];
      if (el) setThumb({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (rootRef.current) ro.observe(rootRef.current);
    return () => ro.disconnect();
  }, [active]);

  const onKeyDown = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (active + (e.key === 'ArrowRight' ? 1 : -1) + OPTIONS.length) % OPTIONS.length;
    setActive(next);
    btns.current[next]?.focus();
  };

  return (
    <div
      ref={rootRef}
      className="v-seg"
      role="radiogroup"
      aria-label="ตัวกรองสถานะ"
      data-disabled={Boolean(disabled)}
      onKeyDown={onKeyDown}
    >
      <span
        className="v-seg-thumb"
        aria-hidden="true"
        style={{ translate: `${thumb.left - 4}px 0`, width: thumb.width }}
      />
      {OPTIONS.map((opt, i) => (
        <button
          key={opt}
          ref={(el) => (btns.current[i] = el)}
          type="button"
          role="radio"
          aria-checked={i === active}
          tabIndex={i === active ? 0 : -1}
          onClick={() => setActive(i)}
          className={`v-seg-btn ui-focusable ${H[size]}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
