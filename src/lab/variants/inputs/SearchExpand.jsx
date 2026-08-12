import { useRef, useState } from 'react';

export const meta = {
  id: 'inp-search-expand',
  group: 'inputs',
  name: { th: 'ค้นหาคลี่ออกจากไอคอน', en: 'Expanding Search' },
  tags: ['search', 'width', 'space-saving'],
};

export const css = `
.v-srch {
  display: inline-flex;
  align-items: center;
  overflow: hidden;
  border-radius: 999px;
  background: var(--ui-field-bg);
  border: var(--ui-border-width) solid var(--ui-field-border);
  box-shadow: var(--ui-field-shadow);
  /* ย่อเหลือแค่วงกลมไอคอนตอนปิด แล้วคลี่ออกตอนเปิด
     เหมาะกับแถบเครื่องมือที่พื้นที่จำกัด */
  transition:
    width var(--dur-base) var(--ease-smooth),
    border-color var(--dur-fast) var(--ease-smooth),
    box-shadow var(--dur-fast) var(--ease-smooth);
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-srch[data-open='true'] { border-color: var(--color-primary); }
.v-srch[data-disabled='true'] { opacity: .5; pointer-events: none; }

.v-srch .v-srch-btn {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: var(--color-muted);
  cursor: pointer;
  transition: color var(--dur-fast) var(--ease-smooth);
}
.v-srch[data-open='true'] .v-srch-btn { color: var(--color-primary); }

.v-srch .v-srch-input {
  min-width: 0;
  flex: 1;
  background: transparent;
  border: 0;
  outline: none;
  color: var(--color-text);
  opacity: 0;
  transition: opacity var(--dur-fast) var(--ease-smooth);
}
.v-srch[data-open='true'] .v-srch-input { opacity: 1; }
`;

const SIZES = {
  sm: { h: 36, closed: 36, open: 200, ico: 16 },
  md: { h: 44, closed: 44, open: 244, ico: 18 },
  lg: { h: 52, closed: 52, open: 288, ico: 21 },
};

export default function SearchExpand({ size = 'md', disabled }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  const s = SIZES[size] ?? SIZES.md;

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <div
      className="v-srch"
      data-open={open}
      data-disabled={Boolean(disabled)}
      style={{ height: s.h, width: open ? s.open : s.closed }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget) && !value) setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={toggle}
        aria-label={open ? 'ปิดช่องค้นหา' : 'เปิดช่องค้นหา'}
        aria-expanded={open}
        className="v-srch-btn ui-focusable"
        style={{ width: s.closed, height: s.h }}
      >
        <svg
          width={s.ico} height={s.ico} viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
        >
          <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35" />
        </svg>
      </button>
      <input
        ref={inputRef}
        className="v-srch-input pr-4"
        placeholder="ค้นหาบทเรียน..."
        tabIndex={open ? 0 : -1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
