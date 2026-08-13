import { useEffect, useMemo, useRef, useState } from 'react';

export const meta = {
  id: 'dd-command-palette',
  group: 'dropdowns',
  name: { th: 'คอมมานด์พาเลตต์ (⌘K)', en: 'Command Palette' },
  tags: ['search', 'keyboard', 'modern'],
  // ฉากคลุมกินพื้นที่ทั้งกรอบ + แผงสูงราว 17.5rem จึงต้องขอเวทีที่สูงพอ
  // ไม่งั้นแผงจะยาวเลยฉากคลุมออกไปทั้งใบ
  stage: { minHeight: '21rem' },
};

export const css = `
.v-cmd-overlay {
  display: grid;
  place-items: start center;
  position: absolute;
  inset: 0;
  padding-top: 2.5rem;
  background: var(--ui-overlay);
  -webkit-backdrop-filter: var(--ui-overlay-blur);
  backdrop-filter: var(--ui-overlay-blur);
  opacity: 1;
  transition: opacity var(--dur-base) var(--ease-smooth), display var(--dur-base) allow-discrete;
}
.v-cmd-overlay[data-open='false'] { display: none; opacity: 0; }
@starting-style { .v-cmd-overlay[data-open='true'] { opacity: 0 } }

.v-cmd-panel {
  width: 100%;
  max-width: 22rem;
  background: var(--ui-menu-bg, var(--ui-card-bg));
  border: var(--ui-border-width) solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-raised);
  overflow: hidden;
  translate: 0 0;
  scale: 1;
  transition: translate var(--dur-base) var(--ease-smooth), scale var(--dur-base) var(--ease-smooth);
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-cmd-overlay[data-open='false'] .v-cmd-panel { translate: 0 -.75rem; scale: .97; }
@starting-style { .v-cmd-overlay[data-open='true'] .v-cmd-panel { translate: 0 -.75rem; scale: .97 } }

.v-cmd-item[data-active='true'] { background: var(--color-surface-2); }
.v-cmd-kbd {
  font-family: var(--font-mono);
  font-size: .6875rem;
  padding: .1rem .35rem;
  border-radius: .25rem;
  background: var(--color-surface-2);
  color: var(--color-muted);
}
`;

const ITEMS = [
  { icon: 'play', label: 'ไปที่บทเรียนล่าสุด', hint: 'บทเรียน' },
  { icon: 'flag', label: 'ทำแบบทดสอบท้ายบท', hint: 'แบบทดสอบ' },
  { icon: 'trophy', label: 'ดูผลสอบของฉัน', hint: 'ผลสอบ' },
  { icon: 'grid', label: 'ค้นหาวิชาทั้งหมด', hint: 'วิชา' },
  { icon: 'gear', label: 'ตั้งค่าบัญชี', hint: 'ตั้งค่า' },
];

const PATHS = {
  play: 'M7 4.5v15l13-7.5-13-7.5Z',
  flag: 'M5 21V4m0 0h13l-2.5 4L18 12H5',
  trophy: 'M8 4h8v5a4 4 0 0 1-8 0V4Zm0 1H5v2a3 3 0 0 0 3 3m8-5h3v2a3 3 0 0 1-3 3m-4 4v4m-3 2h6',
  grid: 'M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z',
  gear: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm8-3.5a8 8 0 0 0-.13-1.4l2.1-1.6-2-3.5-2.5 1a8 8 0 0 0-2.4-1.4L14.7 2h-4l-.37 2.6a8 8 0 0 0-2.4 1.4l-2.5-1-2 3.46 2.1 1.6a8 8 0 0 0 0 2.8l-2.1 1.6 2 3.47 2.5-1a8 8 0 0 0 2.4 1.4l.37 2.6h4l.37-2.6a8 8 0 0 0 2.4-1.4l2.5 1 2-3.46-2.1-1.6c.08-.46.13-.93.13-1.4Z',
};

export default function CommandPalette({ size = 'md', disabled }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  const filtered = useMemo(
    () => ITEMS.filter((i) => (i.label + i.hint).toLowerCase().includes(q.trim().toLowerCase())),
    [q],
  );

  // ⌘K / Ctrl+K เปิดพาเลตต์ — คนคุ้นกับคีย์ลัดนี้จาก VS Code, Linear, Notion
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
    else setQ('');
  }, [open]);

  const H = { sm: 'h-9 text-sm', md: 'h-11', lg: 'h-13 text-lg' }[size] ?? 'h-11';

  return (
    // ไม่ตั้ง relative ที่ตัวห่อโดยตั้งใจ — ฉากคลุมต้องอ้างกับ "กรอบทั้งอัน"
    // (ในโปรเจคจริงคือทั้งหน้าจอ ในคลังคือเวทีพรีวิว)
    // ถ้าตั้ง relative ตรงนี้ inset: 0 จะกลายเป็นกล่องขนาดปุ่มแล้วแผงจะหลุดออกไปหมด
    <div className="w-60">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={`ui-inset ui-focusable flex w-full items-center justify-between gap-2 px-3.5 text-muted disabled:opacity-50 ${H}`}
      >
        <span className="flex items-center gap-2">
          <Ico d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35" />
          ค้นหาคำสั่ง...
        </span>
        <kbd className="v-cmd-kbd">⌘K</kbd>
      </button>

      <div
        data-open={open}
        className="v-cmd-overlay"
        onPointerDown={(e) => e.target === e.currentTarget && setOpen(false)}
      >
        <div className="v-cmd-panel" role="dialog" aria-modal="true" aria-label="คอมมานด์พาเลตต์">
          <div className="flex items-center gap-2 border-b border-border px-3.5 py-2.5">
            <Ico d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setActive(0);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setActive((i) => Math.min(filtered.length - 1, i + 1));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setActive((i) => Math.max(0, i - 1));
                } else if (e.key === 'Enter') {
                  setOpen(false);
                }
              }}
              placeholder="พิมพ์คำสั่งหรือค้นหา..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </div>

          <ul className="max-h-56 overflow-y-auto p-1.5">
            {filtered.length === 0 && (
              <li className="px-3 py-4 text-center text-sm text-muted">ไม่พบคำสั่ง</li>
            )}
            {filtered.map((item, i) => (
              <li key={item.label}>
                <button
                  type="button"
                  data-active={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setOpen(false)}
                  className="v-cmd-item flex w-full items-center gap-2.5 rounded-ui px-3 py-2.5 text-left text-sm transition-colors duration-(--dur-fast)"
                >
                  <Ico d={PATHS[item.icon]} />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  <span className="shrink-0 text-xs text-muted">{item.hint}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Ico({ d }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
