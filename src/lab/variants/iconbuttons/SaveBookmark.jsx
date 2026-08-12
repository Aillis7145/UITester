import { useState } from 'react';

export const meta = {
  id: 'ib-save-bookmark',
  group: 'iconbuttons',
  name: { th: 'บันทึกแบบเติมสี', en: 'Bookmark Fill' },
  tags: ['toggle', 'fill', 'css-only'],
};

export const css = `
@keyframes v-bm-drop {
  0%   { translate: 0 -30%; scale: .8 }
  60%  { translate: 0 8%;   scale: 1.05 }
  100% { translate: 0 0;    scale: 1 }
}

.v-bm {
  display: grid;
  place-items: center;
  border-radius: var(--radius-ui);
  color: var(--color-muted);
  overflow: clip;
  transition: color var(--dur-base) var(--ease-smooth), background-color var(--dur-fast) var(--ease-smooth);
}
.v-bm:hover:not(:disabled) { background: var(--color-surface-2); color: var(--color-text); }
.v-bm:disabled             { opacity: .5; cursor: not-allowed; }
.v-bm[data-on='true']      { color: var(--color-primary-ink); }

/* ใช้ clip-path ค่อยๆ เผยสีเติมจากล่างขึ้นบน แทนที่จะสลับ fill ทันที
   ได้ความรู้สึกว่า "หมึกไหลเข้าไป" ซึ่งอ่านง่ายกว่าการกระพริบเปลี่ยนสี */
.v-bm .v-bm-fill {
  grid-area: 1 / 1;
  fill: currentColor;
  clip-path: inset(100% 0 0 0);
  transition: clip-path var(--dur-base) var(--ease-smooth);
}
.v-bm[data-on='true'] .v-bm-fill { clip-path: inset(0 0 0 0); }
.v-bm[data-on='true'] svg        { animation: v-bm-drop var(--dur-slow) var(--ease-spring); }
.v-bm .v-bm-outline { grid-area: 1 / 1; }
`;

const SIZES = { sm: { box: 32, ico: 16 }, md: { box: 40, ico: 20 }, lg: { box: 48, ico: 24 } };
const PATH = 'M6 3h12v18l-6-4.5L6 21V3Z';

export default function SaveBookmark({ size = 'md', disabled }) {
  const [on, setOn] = useState(false);
  const s = SIZES[size] ?? SIZES.md;

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? 'เอาออกจากรายการบันทึก' : 'บันทึกคอร์สนี้'}
      title="บันทึก"
      disabled={disabled}
      data-on={on}
      onClick={() => setOn((v) => !v)}
      className="v-bm ui-focusable ui-interactive"
      style={{ width: s.box, height: s.box }}
    >
      <svg className="v-bm-outline" width={s.ico} height={s.ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={PATH} />
      </svg>
      <svg className="v-bm-fill" width={s.ico} height={s.ico} viewBox="0 0 24 24" aria-hidden="true">
        <path d={PATH} />
      </svg>
    </button>
  );
}
