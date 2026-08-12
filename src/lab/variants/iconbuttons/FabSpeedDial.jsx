import { useState } from 'react';

export const meta = {
  id: 'ib-fab-speed-dial',
  group: 'iconbuttons',
  name: { th: 'ปุ่มลอยกางเมนู', en: 'FAB Speed Dial' },
  tags: ['fab', 'stagger', 'mobile'],
};

export const css = `
.v-fab-wrap { position: relative; display: inline-grid; place-items: center; }

.v-fab {
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: var(--color-primary);
  color: var(--color-on-primary);
  box-shadow: var(--shadow-raised);
  transition: rotate var(--dur-base) var(--ease-back), box-shadow var(--dur-fast) var(--ease-smooth);
}
.v-fab[data-open='true'] { rotate: 135deg; }
.v-fab:disabled          { opacity: .5; cursor: not-allowed; }

/* ลูกๆ โผล่ไล่ทีละอันจากล่างขึ้นบน โดยหน่วงตาม --i
   ตอนปิดใช้ delay กลับด้าน (reverse) จึงหุบเรียงจากบนลงล่างเหมือนพับเก็บ */
.v-fab-item {
  position: absolute;
  bottom: 0;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: var(--ui-card-bg);
  color: var(--color-text);
  border: var(--ui-border-width) solid var(--color-border);
  box-shadow: var(--shadow-raised);
  opacity: 0;
  scale: .4;
  translate: 0 0;
  pointer-events: none;
  transition:
    opacity var(--dur-fast) var(--ease-smooth),
    scale var(--dur-base) var(--ease-back),
    translate var(--dur-base) var(--ease-back);
  transition-delay: calc((2 - var(--i)) * 45ms);
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-fab-wrap[data-open='true'] .v-fab-item {
  opacity: 1;
  scale: 1;
  translate: 0 calc(var(--i) * -3.25rem - 3.25rem);
  pointer-events: auto;
  transition-delay: calc(var(--i) * 45ms);
}
`;

const ITEMS = [
  { d: 'M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 20h16', label: 'ดาวน์โหลด' },
  { d: 'M18 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM6 15a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm12 6a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM8.2 11.4l7.6-3.8m-7.6 5.2 7.6 3.8', label: 'แชร์' },
  { d: 'M6 3h12v18l-6-4.5L6 21V3Z', label: 'บันทึก' },
];

const SIZES = { sm: { fab: 44, item: 34, ico: 16 }, md: { fab: 54, item: 40, ico: 18 }, lg: { fab: 64, item: 46, ico: 21 } };

export default function FabSpeedDial({ size = 'md', disabled }) {
  const [open, setOpen] = useState(false);
  const s = SIZES[size] ?? SIZES.md;

  return (
    <div
      className="v-fab-wrap"
      data-open={open}
      style={{ height: s.fab, marginTop: '10rem' }}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
    >
      {ITEMS.map((item, i) => (
        <button
          key={item.label}
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label={item.label}
          title={item.label}
          className="v-fab-item ui-focusable"
          style={{ width: s.item, height: s.item, '--i': i }}
        >
          <svg width={s.ico} height={s.ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d={item.d} />
          </svg>
        </button>
      ))}

      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? 'ปิดเมนูลัด' : 'เปิดเมนูลัด'}
        disabled={disabled}
        data-open={open}
        onClick={() => setOpen((v) => !v)}
        className="v-fab ui-focusable"
        style={{ width: s.fab, height: s.fab }}
      >
        <svg width={s.ico + 6} height={s.ico + 6} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}
