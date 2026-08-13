import { useState } from 'react';

export const meta = {
  id: 'dd-accordion-height',
  group: 'dropdowns',
  name: { th: 'คลี่ความสูงอัตโนมัติ', en: 'Auto-height Accordion' },
  tags: ['expand', 'grid-rows', 'css-only'],
};

export const css = `
/* grid-template-rows: 0fr → 1fr คือวิธีเดียวที่แอนิเมตความสูง "auto" ได้ด้วย CSS ล้วน
   (height: auto แอนิเมตไม่ได้ และ max-height ต้องเดาค่าซึ่งจะกระตุกเมื่อเนื้อหายาวไม่เท่ากัน) */
.v-dd-acc {
  display: grid;
  grid-template-rows: 1fr;
  background: var(--ui-menu-bg, var(--ui-card-bg));
  border: var(--ui-border-width) solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-raised);
  opacity: 1;
  transition:
    grid-template-rows var(--dur-base) var(--ease-smooth),
    opacity var(--dur-base) var(--ease-smooth),
    box-shadow var(--dur-base) var(--ease-smooth);
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-dd-acc[data-open='false'] {
  grid-template-rows: 0fr;
  opacity: 0;
  box-shadow: none;
  border-color: transparent;
}
.v-dd-acc > div { min-height: 0; overflow: hidden; }
`;

const OPTIONS = ['ทุกระดับ', 'เริ่มต้น', 'ปานกลาง', 'ขั้นสูง'];
const H = { sm: 'h-9 text-sm', md: 'h-11', lg: 'h-13 text-lg' };

export default function AccordionHeight({ size = 'md', disabled }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(OPTIONS[0]);

  return (
    <div
      className="w-56"
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

      {/* ไม่ absolute โดยตั้งใจ — แผงดันเนื้อหาข้างล่างลงไป เหมาะกับฟอร์มบนมือถือ */}
      <div data-open={open} className="v-dd-acc mt-2">
        <div>
          <ul className="p-1.5">
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
      </div>
    </div>
  );
}
