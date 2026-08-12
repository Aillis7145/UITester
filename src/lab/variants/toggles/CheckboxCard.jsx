import { useState } from 'react';

export const meta = {
  id: 'tog-checkbox-card',
  group: 'toggles',
  name: { th: 'การ์ดเลือกได้', en: 'Selectable Card' },
  tags: ['checkbox', 'card', 'onboarding'],
};

export const css = `
.v-cbcard {
  display: flex;
  align-items: flex-start;
  gap: .75rem;
  width: 100%;
  padding: .875rem;
  text-align: left;
  cursor: pointer;
  border-radius: var(--radius-card);
  background: var(--ui-card-bg);
  border: 2px solid color-mix(in oklch, var(--color-text) 20%, transparent);
  transition:
    border-color var(--dur-base) var(--ease-smooth),
    background-color var(--dur-base) var(--ease-smooth),
    scale var(--dur-fast) var(--ease-back);
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-cbcard:active { scale: .985; }
.v-cbcard[data-disabled='true'] { opacity: .5; pointer-events: none; }
/* ขอบสีหลัก + พื้นจางบอกว่าถูกเลือก โดยไม่พึ่งแค่ติ๊กถูกเล็กๆ มุมเดียว */
.v-cbcard[data-on='true'] {
  border-color: var(--color-primary);
  background: color-mix(in oklch, var(--color-primary) 8%, var(--ui-card-bg));
}

.v-cbcard .v-cbcard-box {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: .125rem;
  border-radius: .375rem;
  border: 2px solid color-mix(in oklch, currentColor 32%, transparent);
  transition: background-color var(--dur-base) var(--ease-smooth), border-color var(--dur-base) var(--ease-smooth);
}
.v-cbcard[data-on='true'] .v-cbcard-box {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-on-primary);
}
.v-cbcard .v-cbcard-tick { scale: 0; transition: scale var(--dur-base) var(--ease-back); }
.v-cbcard[data-on='true'] .v-cbcard-tick { scale: 1; }
`;

const ITEMS = [
  { id: 'ai', title: 'ไอที และ เอไอ', desc: 'เขียนโปรแกรม ข้อมูล และปัญญาประดิษฐ์' },
  { id: 'sci', title: 'วิทยาศาสตร์', desc: 'ฟิสิกส์ เคมี ชีววิทยา' },
];

const SIZES = { sm: 'text-xs', md: 'text-sm', lg: '' };

export default function CheckboxCard({ size = 'md', disabled }) {
  const [on, setOn] = useState(['ai']);
  const toggle = (id) => setOn((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className={`grid w-60 gap-2.5 ${SIZES[size]}`}>
      {ITEMS.map((item) => {
        const checked = on.includes(item.id);
        return (
          <label
            key={item.id}
            className="v-cbcard ui-focusable"
            data-on={checked}
            data-disabled={Boolean(disabled)}
          >
            <input
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onChange={() => toggle(item.id)}
              className="sr-only"
            />
            <span className="v-cbcard-box" aria-hidden="true">
              <svg className="v-cbcard-tick" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12.5 9.5 18 20 6.5" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block font-semibold">{item.title}</span>
              <span className="mt-0.5 block text-xs text-muted">{item.desc}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
