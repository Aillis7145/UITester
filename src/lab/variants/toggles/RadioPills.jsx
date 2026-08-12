import { useState } from 'react';

export const meta = {
  id: 'tog-radio-pills',
  group: 'toggles',
  name: { th: 'ตัวเลือกทรงเม็ดยา', en: 'Radio Pills' },
  tags: ['radio', 'filter', 'keyboard'],
};

export const css = `
.v-pills { display: flex; flex-wrap: wrap; gap: .5rem; }
.v-pills[data-disabled='true'] { opacity: .5; pointer-events: none; }

.v-pill {
  display: inline-flex;
  align-items: center;
  gap: .375rem;
  border-radius: 999px;
  border: 2px solid color-mix(in oklch, currentColor 32%, transparent);
  background: transparent;
  color: var(--color-muted);
  font-weight: 600;
  white-space: nowrap;
  transition:
    border-color var(--dur-base) var(--ease-smooth),
    background-color var(--dur-base) var(--ease-smooth),
    color var(--dur-base) var(--ease-smooth),
    scale var(--dur-fast) var(--ease-back);
}
.v-pill:hover  { color: var(--color-text); border-color: var(--color-primary); }
.v-pill:active { scale: .95; }
.v-pill[aria-checked='true'] {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-on-primary);
}

/* จุดนำหน้าย่อหายไปเมื่อถูกเลือก ทำให้ป้ายขยับเข้ามาแทน — สื่อว่า "ล็อกแล้ว" */
.v-pill .v-pill-dot {
  width: .5rem;
  height: .5rem;
  border-radius: 50%;
  background: currentColor;
  opacity: .35;
  transition: width var(--dur-base) var(--ease-smooth), opacity var(--dur-base) var(--ease-smooth), margin var(--dur-base) var(--ease-smooth);
}
.v-pill[aria-checked='true'] .v-pill-dot { width: 0; opacity: 0; margin-right: -.375rem; }
`;

const OPTIONS = ['ทุกระดับ', 'เริ่มต้น', 'ปานกลาง', 'ขั้นสูง'];
const H = { sm: 'h-8 px-3 text-xs', md: 'h-10 px-4 text-sm', lg: 'h-12 px-5' };

export default function RadioPills({ size = 'md', disabled }) {
  const [value, setValue] = useState(OPTIONS[1]);

  const onKeyDown = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const i = OPTIONS.indexOf(value);
    const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + OPTIONS.length) % OPTIONS.length;
    setValue(OPTIONS[next]);
  };

  return (
    <div
      className="v-pills"
      role="radiogroup"
      aria-label="ระดับความยาก"
      data-disabled={Boolean(disabled)}
      onKeyDown={onKeyDown}
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt}
          type="button"
          role="radio"
          aria-checked={opt === value}
          tabIndex={opt === value ? 0 : -1}
          onClick={() => setValue(opt)}
          className={`v-pill ui-focusable ${H[size]}`}
        >
          <span className="v-pill-dot" aria-hidden="true" />
          {opt}
        </button>
      ))}
    </div>
  );
}
