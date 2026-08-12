import { useState } from 'react';

export const meta = {
  id: 'ib-icon-rotate',
  group: 'iconbuttons',
  name: { th: 'รีเฟรชหมุนหนึ่งรอบ', en: 'Rotating Refresh' },
  tags: ['action', 'feedback', 'css-only'],
};

export const css = `
@keyframes v-rot-spin { to { rotate: 360deg } }

.v-rot {
  display: grid;
  place-items: center;
  border-radius: var(--radius-ui);
  color: var(--color-text);
  background: transparent;
  border: var(--ui-border-width) solid var(--color-border);
  box-shadow: var(--ui-panel-shadow);
  transition: background-color var(--dur-fast) var(--ease-smooth), color var(--dur-fast) var(--ease-smooth);
}
.v-rot:hover:not(:disabled) { background: var(--color-surface-2); color: var(--color-primary); }
.v-rot:disabled             { opacity: .5; cursor: not-allowed; }

.v-rot svg { transition: rotate var(--dur-base) var(--ease-smooth); }
.v-rot:hover:not(:disabled) svg { rotate: -35deg; }
/* ตอนกำลังทำงานจริงให้หมุนต่อเนื่อง — บอกว่า "รับคำสั่งแล้ว" ชัดกว่าแค่เปลี่ยนสี */
.v-rot[data-busy='true'] svg { animation: v-rot-spin .7s linear infinite; rotate: 0deg; }
`;

const SIZES = { sm: { box: 34, ico: 16 }, md: { box: 42, ico: 19 }, lg: { box: 52, ico: 23 } };

export default function IconRotate({ size = 'md', disabled, loading }) {
  const [busy, setBusy] = useState(false);
  const s = SIZES[size] ?? SIZES.md;
  const isBusy = busy || Boolean(loading);

  const run = () => {
    setBusy(true);
    setTimeout(() => setBusy(false), 1600);
  };

  return (
    <button
      type="button"
      aria-label="โหลดรายการใหม่"
      title="โหลดใหม่"
      disabled={disabled}
      data-busy={isBusy}
      onClick={run}
      className="v-rot ui-focusable"
      style={{ width: s.box, height: s.box }}
    >
      <svg
        width={s.ico} height={s.ico} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      >
        <path d="M20 11a8 8 0 1 0-.6 4M20 5v6h-6" />
      </svg>
    </button>
  );
}
