import { useState } from 'react';

export const meta = {
  id: 'dd-flip-3d',
  group: 'dropdowns',
  name: { th: 'พลิกลงมาแบบ 3 มิติ', en: '3D Flip Down' },
  tags: ['enter-exit', '3d', 'css-only'],
};

export const css = `
/* perspective ต้องอยู่ที่ "พ่อ" ของสิ่งที่หมุน ไม่ใช่ที่ตัวมันเอง
   ถ้าใส่ผิดที่จะได้แค่แบนๆ ไม่มีมิติ */
.v-flip-wrap { perspective: 900px; }

.v-flip {
  display: block;
  transform-origin: top center;
  background: var(--ui-menu-bg, var(--ui-card-bg));
  border: var(--ui-border-width) solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-raised);
  opacity: 1;
  transform: rotateX(0deg);
  transition:
    opacity var(--dur-base) var(--ease-smooth),
    transform var(--dur-base) var(--ease-back),
    display var(--dur-base) allow-discrete;
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-flip[data-open='false'] { display: none; opacity: 0; transform: rotateX(-82deg); }
@starting-style { .v-flip[data-open='true'] { opacity: 0; transform: rotateX(-82deg) } }
`;

const OPTIONS = ['ทั้งหมด', 'วิดีโอ', 'บทความ', 'แบบฝึกหัด'];
const H = { sm: 'h-9 text-sm', md: 'h-11', lg: 'h-13 text-lg' };

export default function Flip3D({ size = 'md', disabled }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(OPTIONS[0]);

  return (
    <div
      className="v-flip-wrap relative w-56"
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
    >
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`ui-inset ui-focusable flex w-full items-center justify-between gap-2 px-3.5 font-medium disabled:opacity-50 ${H[size]}`}
      >
        <span className="truncate">{value}</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
          style={{ rotate: open ? '180deg' : '0deg', transition: 'rotate var(--dur-fast) var(--ease-smooth)' }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <ul data-open={open} className="v-flip absolute inset-x-0 z-20 mt-2 p-1.5">
        {OPTIONS.map((opt) => (
          <li key={opt}>
            <button
              type="button"
              onClick={() => {
                setValue(opt);
                setOpen(false);
              }}
              className={`w-full rounded-ui px-3 py-2.5 text-left text-sm transition-colors duration-(--dur-fast) hover:bg-surface-2 ${opt === value ? 'font-semibold text-primary-ink' : ''}`}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
