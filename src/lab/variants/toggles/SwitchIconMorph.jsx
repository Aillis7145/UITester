import { useState } from 'react';

export const meta = {
  id: 'tog-switch-icon',
  group: 'toggles',
  name: { th: 'สวิตช์สลับไอคอน', en: 'Icon Morph Switch' },
  tags: ['switch', 'icon', 'css-only'],
};

export const css = `
.v-swi {
  position: relative;
  display: inline-flex;
  border-radius: 999px;
  background: color-mix(in oklch, var(--color-text) 22%, transparent);
  box-shadow: var(--shadow-pressed);
  cursor: pointer;
  transition: background-color var(--dur-base) var(--ease-smooth);
}
.v-swi[data-on='true'] { background: var(--color-primary); }
.v-swi:disabled        { opacity: .5; cursor: not-allowed; }

.v-swi .v-swi-knob {
  position: absolute;
  top: 50%;
  left: var(--v-pad);
  translate: 0 -50%;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--color-bg);
  color: var(--color-primary-ink);
  box-shadow: 0 1px 3px oklch(0% 0 0 / .3);
  transition: translate var(--dur-base) var(--ease-back);
}
.v-swi[data-on='true'] .v-swi-knob { translate: var(--v-travel) -50%; }

/* ไอคอนสองตัวซ้อนกันแล้วสลับกันหมุนเข้า-ออก ทำให้ดูเหมือนไอคอนแปลงร่าง */
.v-swi .v-swi-ico { grid-area: 1 / 1; transition: opacity var(--dur-base) var(--ease-smooth), rotate var(--dur-base) var(--ease-smooth); }
.v-swi .v-swi-on  { opacity: 0; rotate: -90deg; }
.v-swi .v-swi-off { opacity: 1; rotate: 0deg; }
.v-swi[data-on='true'] .v-swi-on  { opacity: 1; rotate: 0deg; }
.v-swi[data-on='true'] .v-swi-off { opacity: 0; rotate: 90deg; }
`;

const SIZES = {
  sm: { w: 46, h: 24, knob: 18, pad: 3, ico: 11 },
  md: { w: 58, h: 32, knob: 24, pad: 4, ico: 14 },
  lg: { w: 70, h: 38, knob: 30, pad: 4, ico: 17 },
};

export default function SwitchIconMorph({ size = 'md', disabled, label = 'โหมดกลางคืน' }) {
  const [on, setOn] = useState(false);
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
        className="v-swi ui-focusable"
        style={{
          width: s.w,
          height: s.h,
          '--v-pad': `${s.pad}px`,
          '--v-travel': `${s.w - s.knob - s.pad * 2}px`,
        }}
      >
        <span className="v-swi-knob" style={{ width: s.knob, height: s.knob }}>
          <Ico className="v-swi-ico v-swi-off" size={s.ico} d="M12 3v2m0 14v2M5 12H3m18 0h-2M6.3 6.3 4.9 4.9m14.2 14.2-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
          <Ico className="v-swi-ico v-swi-on" size={s.ico} d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
        </span>
      </button>
      <span>{label}</span>
    </label>
  );
}

function Ico({ d, size, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
