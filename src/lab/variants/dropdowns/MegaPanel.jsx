import { useState } from 'react';

export const meta = {
  id: 'dd-mega-panel',
  group: 'dropdowns',
  name: { th: 'แผงใหญ่สองคอลัมน์', en: 'Mega Panel' },
  tags: ['navigation', 'grouped', 'wide'],
};

export const css = `
.v-mega {
  display: block;
  width: 24rem;
  background: var(--ui-menu-bg, var(--ui-card-bg));
  border: var(--ui-border-width) solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-raised);
  /* จัดกึ่งกลางกับปุ่มแทนการชิดซ้าย เพราะแผงกว้าง 24rem ซึ่งกว้างกว่าปุ่มเกือบเท่าตัว
     ถ้าชิดซ้ายมันจะยื่นออกไปทางขวาข้างเดียวจนพ้นขอบจอเมื่อปุ่มอยู่คอลัมน์ขวาสุด
     จัดกึ่งกลางแล้วส่วนที่ยื่นถูกหารสองทั้งสองข้าง จึงอยู่ในจอได้
     ในโปรเจคจริงที่รู้พื้นที่รอบปุ่ม ควรพลิกไปชิดขวาเมื่อทางขวาไม่พอ */
  transform-origin: top center;
  opacity: 1;
  translate: -50% 0;
  scale: 1;
  transition:
    opacity var(--dur-base) var(--ease-smooth),
    translate var(--dur-base) var(--ease-smooth),
    scale var(--dur-base) var(--ease-smooth),
    display var(--dur-base) allow-discrete;
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-mega[data-open='false'] { display: none; opacity: 0; translate: -50% -.5rem; scale: .98; }
@starting-style { .v-mega[data-open='true'] { opacity: 0; translate: -50% -.5rem; scale: .98 } }

.v-mega-item { transition: background-color var(--dur-fast) var(--ease-smooth); }
.v-mega-item:hover { background: var(--color-surface-2); }
.v-mega-item:hover .v-mega-ico { background: var(--color-primary); color: var(--color-on-primary); }
.v-mega-ico { transition: background-color var(--dur-base) var(--ease-smooth), color var(--dur-base) var(--ease-smooth); }
`;

const GROUPS = [
  {
    title: 'สายไอที',
    items: [
      { icon: 'brain', label: 'ปัญญาประดิษฐ์', hint: '4 คอร์ส' },
      { icon: 'code', label: 'เขียนโปรแกรม', hint: '9 คอร์ส' },
    ],
  },
  {
    title: 'วิชาโรงเรียน',
    items: [
      { icon: 'calc', label: 'คณิตศาสตร์', hint: '6 คอร์ส' },
      { icon: 'flask', label: 'วิทยาศาสตร์', hint: '8 คอร์ส' },
    ],
  },
];

const PATHS = {
  brain: 'M9.5 4A2.5 2.5 0 0 0 7 6.5 2.5 2.5 0 0 0 5 9a2.5 2.5 0 0 0 1 2 2.5 2.5 0 0 0 1 4.5 2.5 2.5 0 0 0 2.5 2.5c.83 0 1.5-.4 1.5-1V5c0-.6-.67-1-1.5-1Zm5 0A2.5 2.5 0 0 1 17 6.5 2.5 2.5 0 0 1 19 9a2.5 2.5 0 0 1-1 2 2.5 2.5 0 0 1-1 4.5 2.5 2.5 0 0 1-2.5 2.5c-.83 0-1.5-.4-1.5-1V5c0-.6.67-1 1.5-1Z',
  code: 'm8 6-5 6 5 6m8-12 5 6-5 6M14 4l-4 16',
  calc: 'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm2 3h8v3H8V6Zm0 6h2m3 0h2m-7 4h2m3 0h2',
  flask: 'M9 3h6M10 3v6.2L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 9.2V3M7.4 14h9.2',
};

const H = { sm: 'h-9 text-sm', md: 'h-11', lg: 'h-13 text-lg' };

export default function MegaPanel({ size = 'md', disabled }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
    >
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`ui-inset ui-focusable flex w-48 items-center justify-between gap-2 px-3.5 font-medium disabled:opacity-50 ${H[size]}`}
      >
        หมวดหมู่คอร์ส
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
          style={{ rotate: open ? '180deg' : '0deg', transition: 'rotate var(--dur-fast) var(--ease-smooth)' }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div data-open={open} className="v-mega absolute left-1/2 z-20 mt-2 grid grid-cols-2 gap-1 p-2">
        {GROUPS.map((g) => (
          <div key={g.title}>
            <p className="px-2.5 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">
              {g.title}
            </p>
            {g.items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setOpen(false)}
                className="v-mega-item flex w-full items-center gap-2.5 rounded-ui p-2 text-left"
              >
                <span className="v-mega-ico grid h-8 w-8 shrink-0 place-items-center rounded-ui bg-surface-2 text-muted">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={PATHS[item.icon]} />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{item.label}</span>
                  <span className="block text-xs text-muted">{item.hint}</span>
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
