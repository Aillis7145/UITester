import { useState } from 'react';

export const meta = {
  id: 'inp-range-bubble',
  group: 'inputs',
  name: { th: 'แถบเลื่อนมีป้ายค่า', en: 'Range with Bubble' },
  tags: ['range', 'slider', 'feedback'],
};

export const css = `
.v-range { position: relative; width: 100%; }

.v-range input[type='range'] {
  width: 100%;
  height: 1.5rem;
  background: transparent;
  appearance: none;
  cursor: pointer;
}
.v-range input[type='range']:disabled { opacity: .5; cursor: not-allowed; }

/* ต้องเขียนรางแยกกันสองชุด เพราะ WebKit กับ Firefox ใช้ pseudo-element คนละชื่อ
   และรวมไว้ใน selector เดียวกันไม่ได้ — เบราว์เซอร์จะทิ้งทั้งบล็อก */
.v-range input[type='range']::-webkit-slider-runnable-track {
  height: .375rem;
  border-radius: 999px;
  background: linear-gradient(
    to right,
    var(--color-primary) var(--v-pct),
    var(--color-surface-2) var(--v-pct)
  );
}
.v-range input[type='range']::-moz-range-track {
  height: .375rem;
  border-radius: 999px;
  background: var(--color-surface-2);
}
.v-range input[type='range']::-moz-range-progress {
  height: .375rem;
  border-radius: 999px;
  background: var(--color-primary);
}

.v-range input[type='range']::-webkit-slider-thumb {
  appearance: none;
  margin-top: -.3125rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: var(--shadow-raised);
  transition: scale var(--dur-fast) var(--ease-back);
}
.v-range input[type='range']::-moz-range-thumb {
  width: 1rem;
  height: 1rem;
  border: 0;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: var(--shadow-raised);
}
.v-range input[type='range']:active::-webkit-slider-thumb { scale: 1.25; }

/* ป้ายลอยตามหัวเลื่อน โผล่เฉพาะตอน hover/ลาก จึงไม่รกตอนอยู่เฉยๆ */
.v-range .v-range-bubble {
  position: absolute;
  top: -1.75rem;
  left: var(--v-pct);
  translate: -50% 0;
  padding: .15rem .5rem;
  border-radius: var(--radius-ui);
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-size: .75rem;
  font-weight: 700;
  opacity: 0;
  scale: .8;
  pointer-events: none;
  transition: opacity var(--dur-fast) var(--ease-smooth), scale var(--dur-fast) var(--ease-back);
}
.v-range:hover .v-range-bubble,
.v-range:focus-within .v-range-bubble { opacity: 1; scale: 1; }
`;

const WIDTHS = { sm: 'w-44', md: 'w-60', lg: 'w-72' };

export default function RangeBubble({ size = 'md', disabled }) {
  const [value, setValue] = useState(1.25);
  const min = 0.5;
  const max = 2;
  const pct = `${((value - min) / (max - min)) * 100}%`;

  return (
    <div className={`pt-6 ${WIDTHS[size] ?? WIDTHS.md}`}>
      <div className="mb-1 flex items-baseline justify-between">
        <label htmlFor="v-range" className="text-sm font-medium">
          ความเร็ววิดีโอ
        </label>
        <span className="font-mono text-sm font-semibold text-primary-ink">{value.toFixed(2)}x</span>
      </div>

      <div className="v-range" style={{ '--v-pct': pct }}>
        <span className="v-range-bubble" aria-hidden="true">
          {value.toFixed(2)}x
        </span>
        <input
          id="v-range"
          type="range"
          min={min}
          max={max}
          step={0.05}
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
