import { useState } from 'react';

export const meta = {
  id: 'tog-switch-slide',
  group: 'toggles',
  name: { th: 'สวิตช์เลื่อน', en: 'Sliding Switch' },
  tags: ['switch', 'a11y', 'css-only'],
};

export const css = `
.v-sw {
  position: relative;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  border-radius: 999px;
  background: color-mix(in oklch, var(--color-text) 22%, transparent);
  box-shadow: var(--shadow-pressed);
  cursor: pointer;
  transition: background-color var(--dur-base) var(--ease-smooth);
}
.v-sw[data-on='true'] { background: var(--color-primary); }
.v-sw:disabled          { opacity: .5; cursor: not-allowed; }

.v-sw .v-sw-knob {
  position: absolute;
  top: 50%;
  left: var(--v-pad);
  translate: 0 -50%;
  border-radius: 50%;
  background: var(--color-bg);
  box-shadow: 0 1px 3px oklch(0% 0 0 / .3);
  transition: translate var(--dur-base) var(--ease-back);
}
.v-sw[data-on='true'] .v-sw-knob { translate: var(--v-travel) -50%; }
`;

const SIZES = {
  sm: { w: 40, h: 22, knob: 16, pad: 3 },
  md: { w: 52, h: 30, knob: 22, pad: 4 },
  lg: { w: 64, h: 36, knob: 28, pad: 4 },
};

export default function SwitchSlide({ size = 'md', disabled, label = 'รับการแจ้งเตือน' }) {
  const [on, setOn] = useState(true);
  const s = SIZES[size] ?? SIZES.md;

  return (
    <label className="inline-flex cursor-pointer items-center gap-3 text-sm">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        disabled={disabled}
        data-on={on}
        onClick={() => setOn((v) => !v)}
        className="v-sw ui-focusable"
        style={{
          width: s.w,
          height: s.h,
          '--v-pad': `${s.pad}px`,
          '--v-travel': `${s.w - s.knob - s.pad * 2}px`,
        }}
      >
        <span className="v-sw-knob" style={{ width: s.knob, height: s.knob }} />
      </button>
      <span>{label}</span>
    </label>
  );
}
