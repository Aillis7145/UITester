import { useState } from 'react';

export const meta = {
  id: 'ib-icon-pop',
  group: 'iconbuttons',
  name: { th: 'ถูกใจเด้งพร้อมระลอก', en: 'Like Pop' },
  tags: ['toggle', 'like', 'spring'],
};

export const css = `
@keyframes v-pop-ring {
  from { scale: .4; opacity: .55 }
  to   { scale: 1.9; opacity: 0 }
}
@keyframes v-pop-icon {
  0%   { scale: 1 }
  40%  { scale: 1.45 }
  100% { scale: 1 }
}

.v-pop {
  position: relative;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: var(--color-muted);
  transition: color var(--dur-base) var(--ease-smooth), background-color var(--dur-fast) var(--ease-smooth);
}
.v-pop:hover:not(:disabled)  { background: var(--color-surface-2); }
.v-pop:disabled              { opacity: .5; cursor: not-allowed; }
.v-pop[data-on='true']       { color: var(--color-danger); }
.v-pop[data-on='true'] svg   { fill: currentColor; animation: v-pop-icon var(--dur-slow) var(--ease-spring); }

/* ระลอกวาดด้วย ::after จึงไม่ต้องเพิ่ม DOM และไม่กระทบ layout */
.v-pop[data-on='true']::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid var(--color-danger);
  animation: v-pop-ring var(--dur-slow) var(--ease-smooth);
  pointer-events: none;
}
`;

const SIZES = { sm: { box: 34, ico: 16 }, md: { box: 42, ico: 20 }, lg: { box: 52, ico: 25 } };

export default function IconPop({ size = 'md', disabled }) {
  const [on, setOn] = useState(false);
  const s = SIZES[size] ?? SIZES.md;

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label="ถูกใจบทเรียนนี้"
      title="ถูกใจ"
      disabled={disabled}
      data-on={on}
      onClick={() => setOn((v) => !v)}
      className="v-pop ui-focusable"
      style={{ width: s.box, height: s.box }}
    >
      <svg
        width={s.ico} height={s.ico} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      >
        <path d="M12 20s-7.5-4.7-7.5-9.8A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.9C19.5 15.3 12 20 12 20Z" />
      </svg>
    </button>
  );
}
