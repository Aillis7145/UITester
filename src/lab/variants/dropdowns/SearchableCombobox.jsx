import { useMemo, useRef, useState } from 'react';

export const meta = {
  id: 'dd-searchable',
  group: 'dropdowns',
  name: { th: 'ค้นหาได้ในตัว', en: 'Searchable Combobox' },
  tags: ['search', 'keyboard', 'a11y'],
};

export const css = `
.v-dd-search {
  display: block;
  background: var(--ui-menu-bg, var(--ui-card-bg));
  border: var(--ui-border-width) solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-raised);
  transform-origin: top center;
  opacity: 1;
  translate: 0 0;
  transition:
    opacity   var(--dur-base) var(--ease-smooth),
    translate var(--dur-base) var(--ease-smooth),
    display   var(--dur-base) allow-discrete;
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-dd-search[data-open='false'] { display: none; opacity: 0; translate: 0 -.5rem; }
@starting-style {
  .v-dd-search[data-open='true'] { opacity: 0; translate: 0 -.5rem; }
}
.v-dd-search mark {
  background: color-mix(in oklch, var(--color-primary) 32%, transparent);
  color: inherit;
  border-radius: .2em;
}
`;

const OPTIONS = [
  'พื้นฐานปัญญาประดิษฐ์',
  'ไพทอนสำหรับงานข้อมูล',
  'การเขียนพรอมต์ให้ได้ผล',
  'พัฒนาเว็บสมัยใหม่',
  'คณิตศาสตร์ ม.3',
  'ฟิสิกส์ ม.5',
  'ชีววิทยา ม.4',
  'ประวัติศาสตร์ไทย',
];
const H = { sm: 'h-9 text-sm', md: 'h-11', lg: 'h-13 text-lg' };

export default function SearchableCombobox({ size = 'md', disabled }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [value, setValue] = useState(OPTIONS[0]);
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  const filtered = useMemo(
    () => OPTIONS.filter((o) => o.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );

  const pick = (opt) => {
    if (!opt) return;
    setValue(opt);
    setQuery('');
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      pick(filtered[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div
      className="relative w-64"
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
    >
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => {
          setOpen(true);
          setActive(0);
          requestAnimationFrame(() => inputRef.current?.focus());
        }}
        className={`ui-inset ui-focusable flex w-full items-center justify-between gap-2 px-3.5 font-medium disabled:opacity-50 ${H[size]}`}
      >
        <span className="truncate">{value}</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
        >
          <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35" />
        </svg>
      </button>

      <div data-open={open} className="v-dd-search absolute inset-x-0 z-20 mt-2 p-1.5">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="พิมพ์เพื่อค้นหา..."
          aria-label="ค้นหาวิชา"
          className="ui-inset ui-focusable mb-1.5 h-9 w-full px-3 text-sm outline-none placeholder:text-muted"
        />

        <ul role="listbox" className="max-h-56 overflow-y-auto">
          {filtered.length === 0 && (
            <li className="px-3 py-3 text-center text-sm text-muted">ไม่พบรายการที่ค้นหา</li>
          )}
          {filtered.map((opt, i) => (
            <li key={opt} role="option" aria-selected={opt === value}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(opt)}
                className={`w-full rounded-ui px-3 py-2.5 text-left text-sm transition-colors duration-(--dur-fast) ${
                  i === active ? 'bg-surface-2' : ''
                } ${opt === value ? 'font-semibold text-primary-ink' : ''}`}
              >
                <Highlight text={opt} query={query} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** เน้นส่วนที่ตรงกับคำค้น — ทำให้เห็นว่าทำไมรายการนั้นถูกกรองไว้ */
function Highlight({ text, query }) {
  const q = query.trim();
  if (!q) return text;
  const at = text.toLowerCase().indexOf(q.toLowerCase());
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + q.length)}</mark>
      {text.slice(at + q.length)}
    </>
  );
}
