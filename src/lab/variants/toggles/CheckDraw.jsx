import { useState } from 'react';

export const meta = {
  id: 'tog-check-draw',
  group: 'toggles',
  name: { th: 'ติ๊กถูกวาดเส้น', en: 'Drawn Checkmark' },
  tags: ['checkbox', 'svg', 'stroke'],
};

export const css = `
.v-chk {
  display: inline-flex;
  align-items: center;
  gap: .625rem;
  cursor: pointer;
  user-select: none;
}
.v-chk[data-disabled='true'] { opacity: .5; cursor: not-allowed; }

.v-chk .v-chk-box {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: .4em;
  border: 2px solid color-mix(in oklch, currentColor 32%, transparent);
  background: transparent;
  transition:
    background-color var(--dur-base) var(--ease-smooth),
    border-color var(--dur-base) var(--ease-smooth),
    scale var(--dur-fast) var(--ease-back);
}
.v-chk[data-on='true'] .v-chk-box {
  background: var(--color-primary);
  border-color: var(--color-primary);
}
.v-chk:active .v-chk-box { scale: .88; }

/* เส้นถูกวาดจากศูนย์ไปเต็มความยาว — dashoffset คือกลไกทั้งหมด */
.v-chk .v-chk-tick {
  stroke-dasharray: 22;
  stroke-dashoffset: 22;
  transition: stroke-dashoffset var(--dur-base) var(--ease-smooth);
}
.v-chk[data-on='true'] .v-chk-tick { stroke-dashoffset: 0; }
`;

const SIZES = { sm: 18, md: 22, lg: 27 };

export default function CheckDraw({ size = 'md', disabled, label = 'จดจำฉันไว้' }) {
  const [on, setOn] = useState(false);
  const box = SIZES[size] ?? SIZES.md;

  return (
    <label className="v-chk text-sm" data-on={on} data-disabled={Boolean(disabled)}>
      <input
        type="checkbox"
        checked={on}
        disabled={disabled}
        onChange={(e) => setOn(e.target.checked)}
        className="peer sr-only"
      />
      <span
        className="v-chk-box peer-focus-visible:shadow-(--ui-focus-ring)"
        style={{ width: box, height: box }}
      >
        <svg
          width={box * 0.62}
          height={box * 0.62}
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-on-primary)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path className="v-chk-tick" d="M4 12.5 9.5 18 20 6.5" />
        </svg>
      </span>
      <span>{label}</span>
    </label>
  );
}
