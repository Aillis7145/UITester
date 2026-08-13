import { useState } from 'react';

export const meta = {
  id: 'dd-fade-slide',
  group: 'dropdowns',
  name: { th: 'จางลงพร้อมเลื่อน', en: 'Fade & Slide' },
  tags: ['enter-exit', 'starting-style', 'css-only'],
};

export const css = `
.v-dd-fade {
  display: block;
  background: var(--ui-menu-bg, var(--ui-card-bg));
  border: var(--ui-border-width) solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-raised);

  opacity: 1;
  translate: 0 0;
  /* display + allow-discrete + @starting-style คือชุดที่ทำให้ทั้ง "เข้า" และ "ออก"
     เป็นอนิเมชั่นได้ด้วย CSS ล้วน โดยไม่ต้องมี JS หน่วงเวลา unmount */
  transition:
    opacity   var(--dur-base) var(--ease-smooth),
    translate var(--dur-base) var(--ease-smooth),
    display   var(--dur-base) allow-discrete;
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-dd-fade[data-open='false'] { display: none; opacity: 0; translate: 0 -.5rem; }
@starting-style {
  .v-dd-fade[data-open='true'] { opacity: 0; translate: 0 -.5rem; }
}
`;

const OPTIONS = ['ล่าสุด', 'ยอดนิยม', 'ความคืบหน้า', 'คะแนนสูงสุด'];
const H = { sm: 'h-9 text-sm', md: 'h-11', lg: 'h-13 text-lg' };

export default function FadeSlide({ size = 'md', disabled }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(OPTIONS[0]);

  return (
    <div
      className="relative w-56"
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
        <Caret open={open} />
      </button>

      <ul data-open={open} className="v-dd-fade absolute inset-x-0 z-20 mt-2 p-1.5">
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

function Caret({ open }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ rotate: open ? '180deg' : '0deg', transition: 'rotate var(--dur-fast) var(--ease-smooth)' }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
