import { useState } from 'react';

export const meta = {
  id: 'dd-profile-menu',
  group: 'dropdowns',
  name: { th: 'เมนูโปรไฟล์แบ่งกลุ่ม', en: 'Profile Menu' },
  tags: ['avatar', 'grouped', 'app-shell'],
};

export const css = `
.v-prof {
  display: block;
  width: 15rem;
  transform-origin: top right;
  background: var(--ui-menu-bg, var(--ui-card-bg));
  border: var(--ui-border-width) solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-raised);
  opacity: 1;
  scale: 1;
  translate: 0 0;
  transition:
    opacity var(--dur-base) var(--ease-smooth),
    scale var(--dur-base) var(--ease-back),
    translate var(--dur-base) var(--ease-smooth),
    display var(--dur-base) allow-discrete;
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-prof[data-open='false'] { display: none; opacity: 0; scale: .93; translate: 0 -.35rem; }
@starting-style { .v-prof[data-open='true'] { opacity: 0; scale: .93; translate: 0 -.35rem } }

.v-prof-row { transition: background-color var(--dur-fast) var(--ease-smooth); }
.v-prof-row:hover { background: var(--color-surface-2); }
`;

const SECTIONS = [
  [
    { icon: 'user', label: 'โปรไฟล์ของฉัน' },
    { icon: 'trophy', label: 'ใบประกาศนียบัตร' },
    { icon: 'bookmark', label: 'คอร์สที่บันทึกไว้' },
  ],
  [
    { icon: 'gear', label: 'ตั้งค่า' },
    { icon: 'logout', label: 'ออกจากระบบ', danger: true },
  ],
];

const PATHS = {
  user: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  trophy: 'M8 4h8v5a4 4 0 0 1-8 0V4Zm0 1H5v2a3 3 0 0 0 3 3m8-5h3v2a3 3 0 0 1-3 3m-4 4v4m-3 2h6',
  bookmark: 'M6 3h12v18l-6-4.5L6 21V3Z',
  gear: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm8-3.5a8 8 0 0 0-.13-1.4l2.1-1.6-2-3.5-2.5 1a8 8 0 0 0-2.4-1.4L14.7 2h-4l-.37 2.6a8 8 0 0 0-2.4 1.4l-2.5-1-2 3.46 2.1 1.6a8 8 0 0 0 0 2.8l-2.1 1.6 2 3.47 2.5-1a8 8 0 0 0 2.4 1.4l.37 2.6h4l.37-2.6a8 8 0 0 0 2.4-1.4l2.5 1 2-3.46-2.1-1.6c.08-.46.13-.93.13-1.4Z',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9',
};

const SIZES = { sm: 34, md: 40, lg: 48 };

export default function ProfileMenu({ size = 'md', disabled }) {
  const [open, setOpen] = useState(false);
  const box = SIZES[size] ?? SIZES.md;

  return (
    <div
      className="relative"
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
    >
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="เมนูบัญชีผู้ใช้"
        onClick={() => setOpen((v) => !v)}
        className="ui-focusable ui-interactive grid place-items-center rounded-full bg-primary font-semibold text-on-primary disabled:opacity-50"
        style={{ width: box, height: box }}
      >
        ณ
      </button>

      <div data-open={open} role="menu" className="v-prof absolute right-0 z-20 mt-2 p-1.5">
        <div className="flex items-center gap-2.5 border-b border-border px-2.5 pb-2.5 pt-1.5">
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-on-primary"
            aria-hidden="true"
          >
            ณ
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">ณัฐพล ศรีสุข</span>
            <span className="block truncate text-xs text-muted">nattapon.s@school.ac.th</span>
          </span>
        </div>

        {SECTIONS.map((section, si) => (
          <div key={si} className={si > 0 ? 'mt-1.5 border-t border-border pt-1.5' : 'pt-1.5'}>
            {section.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="v-prof-row flex w-full items-center gap-2.5 rounded-ui px-2.5 py-2 text-left text-sm"
                style={item.danger ? { color: 'var(--color-danger)' } : undefined}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d={PATHS[item.icon]} />
                </svg>
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
