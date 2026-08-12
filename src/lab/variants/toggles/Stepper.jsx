import { useState } from 'react';

export const meta = {
  id: 'tog-stepper',
  group: 'toggles',
  name: { th: 'ตัวเพิ่มลดจำนวน', en: 'Quantity Stepper' },
  tags: ['number', 'a11y', 'form'],
};

export const css = `
.v-step {
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius-ui);
  background: var(--ui-field-bg);
  border: var(--ui-border-width) solid var(--ui-field-border);
  box-shadow: var(--ui-field-shadow);
  overflow: hidden;
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-step[data-disabled='true'] { opacity: .5; pointer-events: none; }

.v-step button {
  display: grid;
  place-items: center;
  color: var(--color-muted);
  transition: background-color var(--dur-fast) var(--ease-smooth), color var(--dur-fast) var(--ease-smooth), scale var(--dur-fast) var(--ease-back);
}
.v-step button:hover:not(:disabled)  { background: var(--color-surface-2); color: var(--color-primary-ink); }
.v-step button:active:not(:disabled) { scale: .85; }
.v-step button:disabled              { opacity: .35; cursor: not-allowed; }

/* ตัวเลขใช้ font-variant-numeric: tabular-nums เพื่อให้ความกว้างคงที่
   ไม่งั้นเลข 1 กับ 8 กว้างไม่เท่ากัน แล้วปุ่มจะขยับตอนกด */
.v-step .v-step-val {
  min-width: 2.5rem;
  text-align: center;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--color-text);
}
`;

const SIZES = { sm: { b: 30, cls: 'text-sm' }, md: { b: 38, cls: '' }, lg: { b: 46, cls: 'text-lg' } };
const MIN = 1;
const MAX = 10;

export default function Stepper({ size = 'md', disabled }) {
  const [n, setN] = useState(3);
  const s = SIZES[size] ?? SIZES.md;

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">จำนวนที่นั่งที่จอง</label>
      <div className={`v-step ${s.cls}`} data-disabled={Boolean(disabled)}>
        <button
          type="button"
          aria-label="ลดจำนวน"
          disabled={n <= MIN}
          onClick={() => setN((v) => Math.max(MIN, v - 1))}
          className="ui-focusable"
          style={{ width: s.b, height: s.b }}
        >
          <Ico d="M5 12h14" />
        </button>

        <span
          className="v-step-val"
          role="spinbutton"
          aria-valuenow={n}
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-label="จำนวนที่นั่ง"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') setN((v) => Math.min(MAX, v + 1));
            if (e.key === 'ArrowDown') setN((v) => Math.max(MIN, v - 1));
          }}
        >
          {n}
        </span>

        <button
          type="button"
          aria-label="เพิ่มจำนวน"
          disabled={n >= MAX}
          onClick={() => setN((v) => Math.min(MAX, v + 1))}
          className="ui-focusable"
          style={{ width: s.b, height: s.b }}
        >
          <Ico d="M12 5v14M5 12h14" />
        </button>
      </div>
    </div>
  );
}

function Ico({ d }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
