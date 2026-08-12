import { useState } from 'react';

export const meta = {
  id: 'inp-password-strength',
  group: 'inputs',
  name: { th: 'รหัสผ่านพร้อมมาตรวัด', en: 'Password with Strength' },
  tags: ['password', 'feedback', 'live-region'],
};

export const css = `
.v-pw { display: block; width: 100%; }

.v-pw .v-pw-shell {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding-inline: .9rem;
  background: var(--ui-field-bg);
  border: var(--ui-border-width) solid var(--ui-field-border);
  border-radius: var(--radius-ui);
  box-shadow: var(--ui-field-shadow);
  transition: border-color var(--dur-fast) var(--ease-smooth), box-shadow var(--dur-fast) var(--ease-smooth);
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-pw .v-pw-shell:focus-within { border-color: var(--color-primary); box-shadow: var(--ui-focus-ring); }
.v-pw[data-disabled='true'] { opacity: .5; pointer-events: none; }

.v-pw input { flex: 1; min-width: 0; background: transparent; border: 0; outline: none; color: var(--color-text); }

/* มาตรวัด 4 ขีด ทีละขีดสว่างขึ้นตามความแข็งแรง
   บอกผลด้วยทั้งสีและข้อความ ไม่พึ่งสีอย่างเดียว เพราะคนตาบอดสีจะอ่านไม่ออก */
.v-pw .v-pw-meter { display: flex; gap: .25rem; margin-top: .5rem; }
.v-pw .v-pw-seg {
  height: 4px;
  flex: 1;
  border-radius: 999px;
  background: var(--color-surface-2);
  transition: background-color var(--dur-base) var(--ease-smooth);
}
.v-pw .v-pw-seg[data-on='true'] { background: var(--v-tone); }
`;

const H = { sm: 'h-10 text-sm', md: 'h-12', lg: 'h-14 text-lg' };

const LEVELS = [
  { label: 'อ่อนมาก', tone: 'var(--color-danger)' },
  { label: 'อ่อน', tone: 'var(--color-danger)' },
  { label: 'พอใช้', tone: 'var(--color-warn)' },
  { label: 'ดี', tone: 'var(--color-success)' },
  { label: 'แข็งแรงมาก', tone: 'var(--color-success)' },
];

function score(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export default function PasswordStrength({ size = 'md', disabled }) {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const s = score(pw);
  const level = LEVELS[s];

  return (
    <div className="v-pw w-60" data-disabled={Boolean(disabled)}>
      <label className="mb-1.5 block text-sm font-medium">รหัสผ่าน</label>
      <div className={`v-pw-shell ${H[size]}`}>
        <input
          type={show ? 'text' : 'password'}
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="อย่างน้อย 8 ตัวอักษร"
          aria-describedby="v-pw-hint"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
          className="ui-focusable shrink-0 rounded-ui text-muted"
        >
          <svg
            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
          >
            <path
              d={
                show
                  ? 'M4 4l16 16M9.9 5.7A9.8 9.8 0 0 1 12 5.5c6.5 0 10 6.5 10 6.5a17 17 0 0 1-3.3 4M6.2 8.2A17 17 0 0 0 2 12s3.5 6.5 10 6.5a10 10 0 0 0 3-.45M9.9 9.9a3 3 0 0 0 4.2 4.2'
                  : 'M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Zm10 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z'
              }
            />
          </svg>
        </button>
      </div>

      <div className="v-pw-meter" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className="v-pw-seg" data-on={s >= i} style={{ '--v-tone': level.tone }} />
        ))}
      </div>
      <p id="v-pw-hint" aria-live="polite" className="mt-1.5 text-xs text-muted">
        {pw ? `ความแข็งแรง: ${level.label}` : 'ผสมตัวพิมพ์ใหญ่ ตัวเลข และอักขระพิเศษ'}
      </p>
    </div>
  );
}
