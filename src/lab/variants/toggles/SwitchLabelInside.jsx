import { useState } from 'react';

export const meta = {
  id: 'tog-switch-label-inside',
  group: 'toggles',
  name: { th: 'สวิตช์มีข้อความในตัว', en: 'Switch with Inline Label' },
  tags: ['switch', 'label', 'css-only'],
};

export const css = `
.v-swl {
  position: relative;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: color-mix(in oklch, var(--color-text) 22%, transparent);
  box-shadow: var(--shadow-pressed);
  cursor: pointer;
  overflow: hidden;
  transition: background-color var(--dur-base) var(--ease-smooth);
}
.v-swl[data-on='true'] { background: var(--color-primary); }
.v-swl:disabled        { opacity: .5; cursor: not-allowed; }

.v-swl .v-swl-knob {
  position: absolute;
  top: .1875rem;
  bottom: .1875rem;
  left: .1875rem;
  aspect-ratio: 1;
  border-radius: 999px;
  background: var(--color-bg);
  box-shadow: 0 1px 3px oklch(0% 0 0 / .3);
  transition: translate var(--dur-base) var(--ease-back);
}
.v-swl[data-on='true'] .v-swl-knob { translate: var(--v-travel) 0; }

/* ข้อความสองชุดอยู่คนละฝั่ง แล้วสลับกันจางเข้า-ออกตามสถานะ
   ผู้ใช้จึงรู้ว่า "ตอนนี้คืออะไร" โดยไม่ต้องจำว่าซ้าย/ขวาแปลว่าอะไร */
.v-swl .v-swl-txt {
  font-size: .6875rem;
  font-weight: 700;
  transition: opacity var(--dur-base) var(--ease-smooth);
}
.v-swl .v-swl-on  { color: var(--color-on-primary); opacity: 0; }
.v-swl .v-swl-off { color: var(--color-muted);      opacity: 1; }
.v-swl[data-on='true'] .v-swl-on  { opacity: 1; }
.v-swl[data-on='true'] .v-swl-off { opacity: 0; }
`;

const SIZES = {
  sm: { w: 74, h: 26, pad: 3 },
  md: { w: 88, h: 32, pad: 3 },
  lg: { w: 104, h: 38, pad: 3 },
};

export default function SwitchLabelInside({ size = 'md', disabled, label = 'บันทึกอัตโนมัติ' }) {
  const [on, setOn] = useState(true);
  const s = SIZES[size] ?? SIZES.md;
  const knob = s.h - s.pad * 2;

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
        className="v-swl ui-focusable"
        style={{ width: s.w, height: s.h, '--v-travel': `${s.w - knob - s.pad * 2}px` }}
      >
        <span className="v-swl-knob" style={{ width: knob }} />
        <span className="v-swl-txt v-swl-on absolute left-2.5">เปิด</span>
        <span className="v-swl-txt v-swl-off absolute right-2.5">ปิด</span>
      </button>
      <span>{label}</span>
    </label>
  );
}
