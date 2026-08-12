import { useState } from 'react';

export const meta = {
  id: 'ib-hamburger-morph',
  group: 'iconbuttons',
  name: { th: 'แฮมเบอร์เกอร์แปลงเป็นกากบาท', en: 'Hamburger → X' },
  tags: ['morph', 'nav', 'css-only'],
};

export const css = `
.v-burger {
  display: grid;
  place-items: center;
  border-radius: var(--radius-ui);
  color: var(--color-text);
  transition: background-color var(--dur-fast) var(--ease-smooth);
}
.v-burger:hover:not(:disabled) { background: var(--color-surface-2); }
.v-burger:disabled             { opacity: .5; cursor: not-allowed; }

.v-burger .v-burger-box { position: relative; width: var(--v-w); height: var(--v-h); }
.v-burger .v-burger-bar {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
  transition:
    translate var(--dur-base) var(--ease-smooth),
    rotate var(--dur-base) var(--ease-smooth),
    opacity var(--dur-fast) var(--ease-smooth);
}
.v-burger .v-burger-bar:nth-child(1) { top: 0 }
.v-burger .v-burger-bar:nth-child(2) { top: 50%; translate: 0 -50% }
.v-burger .v-burger-bar:nth-child(3) { bottom: 0 }

/* เส้นบนกับล่างเลื่อนมากึ่งกลางก่อนแล้วค่อยหมุนไขว้ ส่วนเส้นกลางจางหาย
   ลำดับนี้สำคัญ ถ้าหมุนพร้อมเลื่อนจะดูสะบัดไม่นุ่ม */
.v-burger[data-open='true'] .v-burger-bar:nth-child(1) { top: 50%; translate: 0 -50%; rotate: 45deg }
.v-burger[data-open='true'] .v-burger-bar:nth-child(2) { opacity: 0; scale: .4 1 }
.v-burger[data-open='true'] .v-burger-bar:nth-child(3) { bottom: 50%; translate: 0 50%; rotate: -45deg }
`;

const SIZES = { sm: { box: 32, w: 15, h: 11 }, md: { box: 40, w: 19, h: 14 }, lg: { box: 48, w: 23, h: 17 } };

export default function HamburgerMorph({ size = 'md', disabled }) {
  const [open, setOpen] = useState(false);
  const s = SIZES[size] ?? SIZES.md;

  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
      disabled={disabled}
      data-open={open}
      onClick={() => setOpen((v) => !v)}
      className="v-burger ui-focusable ui-interactive"
      style={{ width: s.box, height: s.box, '--v-w': `${s.w}px`, '--v-h': `${s.h}px` }}
    >
      <span className="v-burger-box" aria-hidden="true">
        <span className="v-burger-bar" />
        <span className="v-burger-bar" />
        <span className="v-burger-bar" />
      </span>
    </button>
  );
}
