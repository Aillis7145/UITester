import { useState } from 'react';

export const meta = {
  id: 'dd-multi-chips',
  group: 'dropdowns',
  name: { th: 'เลือกหลายอันเป็นชิป', en: 'Multi-select Chips' },
  tags: ['multi-select', 'chips', 'filter'],
};

export const css = `
.v-multi {
  display: block;
  background: var(--ui-card-bg);
  border: var(--ui-border-width) solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-raised);
  opacity: 1;
  translate: 0 0;
  transition:
    opacity var(--dur-base) var(--ease-smooth),
    translate var(--dur-base) var(--ease-smooth),
    display var(--dur-base) allow-discrete;
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-multi[data-open='false'] { display: none; opacity: 0; translate: 0 -.5rem; }
@starting-style { .v-multi[data-open='true'] { opacity: 0; translate: 0 -.5rem } }

/* ชิปที่เพิ่งถูกเลือกจะเด้งเข้ามา ทำให้เห็นชัดว่าคลิกแล้วมีผลอะไร */
@keyframes v-chip-in { from { scale: .6; opacity: 0 } to { scale: 1; opacity: 1 } }
.v-multi-chip { animation: v-chip-in var(--dur-base) var(--ease-back); }
`;

const OPTIONS = ['ไอที & เอไอ', 'คณิตศาสตร์', 'วิทยาศาสตร์', 'ภาษาไทย', 'ภาษาอังกฤษ', 'สังคมศึกษา'];
const H = { sm: 'min-h-9 text-sm', md: 'min-h-11', lg: 'min-h-13 text-lg' };

export default function MultiSelectChips({ size = 'md', disabled }) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState(['ไอที & เอไอ']);

  const toggle = (opt) =>
    setPicked((p) => (p.includes(opt) ? p.filter((x) => x !== opt) : [...p, opt]));

  return (
    <div
      className="relative w-64"
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
    >
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`ui-inset ui-focusable flex w-full flex-wrap items-center gap-1.5 px-2.5 py-1.5 disabled:opacity-50 ${H[size]}`}
      >
        {picked.length === 0 && <span className="px-1 text-muted">เลือกหมวดวิชา...</span>}
        {picked.map((p) => (
          <span
            key={p}
            className="v-multi-chip inline-flex items-center gap-1 rounded-ui bg-primary px-2 py-0.5 text-xs font-semibold text-on-primary"
          >
            {p}
            <span
              role="button"
              tabIndex={-1}
              aria-label={`เอา ${p} ออก`}
              onClick={(e) => {
                e.stopPropagation();
                toggle(p);
              }}
              className="cursor-pointer opacity-70 hover:opacity-100"
            >
              ✕
            </span>
          </span>
        ))}
      </button>

      <ul data-open={open} className="v-multi absolute inset-x-0 z-20 mt-2 max-h-52 overflow-y-auto p-1.5">
        {OPTIONS.map((opt) => {
          const on = picked.includes(opt);
          return (
            <li key={opt}>
              <button
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => toggle(opt)}
                className="flex w-full items-center gap-2.5 rounded-ui px-3 py-2.5 text-left text-sm transition-colors duration-(--dur-fast) hover:bg-surface-2"
              >
                <span
                  className={`grid h-4 w-4 shrink-0 place-items-center rounded-[0.25rem] border-2 transition-colors duration-(--dur-fast) ${
                    on ? 'border-transparent bg-primary text-on-primary' : 'border-current/35'
                  }`}
                >
                  {on && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12.5 9.5 18 20 6.5" />
                    </svg>
                  )}
                </span>
                {opt}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
