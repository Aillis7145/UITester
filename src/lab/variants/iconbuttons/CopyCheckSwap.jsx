import { useEffect, useRef, useState } from 'react';

export const meta = {
  id: 'ib-copy-check',
  group: 'iconbuttons',
  name: { th: 'คัดลอกแล้วสลับเป็นถูก', en: 'Copy → Check Swap' },
  tags: ['feedback', 'clipboard', 'state'],
};

export const css = `
.v-copy {
  display: inline-grid;
  place-items: center;
  border-radius: var(--radius-ui);
  color: var(--color-muted);
  border: var(--ui-border-width) solid var(--color-border);
  box-shadow: var(--ui-panel-shadow);
  transition: color var(--dur-base) var(--ease-smooth), background-color var(--dur-fast) var(--ease-smooth);
}
.v-copy:hover:not(:disabled) { background: var(--color-surface-2); color: var(--color-text); }
.v-copy:disabled             { opacity: .5; cursor: not-allowed; }
.v-copy[data-done='true']    { color: var(--color-success); }

/* ไอคอนสองตัวซ้อนใน grid ช่องเดียวกัน แล้วสลับกันด้วย scale + opacity
   ไม่ใช้ display: none เพราะจะกระโดดทันทีไม่มีจังหวะเปลี่ยน */
.v-copy > svg { grid-area: 1 / 1; transition: scale var(--dur-base) var(--ease-back), opacity var(--dur-fast) var(--ease-smooth); }
.v-copy .v-copy-a { scale: 1; opacity: 1 }
.v-copy .v-copy-b { scale: .4; opacity: 0 }
.v-copy[data-done='true'] .v-copy-a { scale: .4; opacity: 0 }
.v-copy[data-done='true'] .v-copy-b { scale: 1; opacity: 1 }
`;

const SIZES = { sm: { box: 32, ico: 15 }, md: { box: 40, ico: 18 }, lg: { box: 48, ico: 22 } };

export default function CopyCheckSwap({ size = 'md', disabled }) {
  const [done, setDone] = useState(false);
  const timer = useRef(null);
  const s = SIZES[size] ?? SIZES.md;

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText('https://learnspace.example/course/ai-foundations');
    } catch {
      /* clipboard ต้องใช้ secure context — ในคลังตัวอย่างล้มเหลวได้ ยังโชว์สถานะให้ดู */
    }
    setDone(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={copy}
      disabled={disabled}
      data-done={done}
      aria-label={done ? 'คัดลอกลิงก์แล้ว' : 'คัดลอกลิงก์คอร์ส'}
      aria-live="polite"
      className="v-copy ui-focusable ui-interactive"
      style={{ width: s.box, height: s.box }}
    >
      <svg className="v-copy-a" width={s.ico} height={s.ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 9V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-4M5 9h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" />
      </svg>
      <svg className="v-copy-b" width={s.ico} height={s.ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 12.5 9.5 18 20 6.5" />
      </svg>
    </button>
  );
}
