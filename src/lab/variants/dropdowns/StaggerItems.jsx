import { useState } from 'react';

export const meta = {
  id: 'dd-stagger-items',
  group: 'dropdowns',
  name: { th: 'รายการไล่ทีละอัน', en: 'Staggered Items' },
  tags: ['enter', 'stagger', 'css-only'],
};

export const css = `
@keyframes v-dd-item-in {
  from { opacity: 0; translate: 0 -8px }
  to   { opacity: 1; translate: 0 0 }
}

.v-dd-stagger {
  display: block;
  background: var(--ui-menu-bg, var(--ui-card-bg));
  border: var(--ui-border-width) solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-raised);
  opacity: 1;
  transition:
    opacity var(--dur-fast) var(--ease-smooth),
    display var(--dur-fast) allow-discrete;
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-dd-stagger[data-open='false'] { display: none; opacity: 0; }
@starting-style { .v-dd-stagger[data-open='true'] { opacity: 0 } }

/* ดัชนีของแต่ละแถวส่งมาทาง --i แล้วคำนวณ delay จากมัน
   วิธีนี้ทำ stagger ได้โดยไม่ต้องเขียน keyframe ซ้ำ n ชุด */
.v-dd-stagger[data-open='true'] li {
  animation: v-dd-item-in var(--dur-base) var(--ease-smooth) backwards;
  animation-delay: calc(var(--i) * 45ms);
}
`;

const OPTIONS = ['บทเรียนที่ 1', 'บทเรียนที่ 2', 'บทเรียนที่ 3', 'บทเรียนที่ 4', 'บทเรียนที่ 5'];
const H = { sm: 'h-9 text-sm', md: 'h-11', lg: 'h-13 text-lg' };

export default function StaggerItems({ size = 'md', disabled }) {
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
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
          style={{ rotate: open ? '180deg' : '0deg', transition: 'rotate var(--dur-fast) var(--ease-smooth)' }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <ul data-open={open} className="v-dd-stagger absolute inset-x-0 z-20 mt-2 p-1.5">
        {OPTIONS.map((opt, i) => (
          <li key={opt} style={{ '--i': i }}>
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
