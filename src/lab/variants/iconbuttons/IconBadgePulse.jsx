import { useState } from 'react';

export const meta = {
  id: 'ib-badge-pulse',
  group: 'iconbuttons',
  name: { th: 'แจ้งเตือนมีตัวเลขเต้น', en: 'Notification Badge' },
  tags: ['badge', 'attention', 'css-only'],
};

export const css = `
@keyframes v-badge-halo {
  0%   { scale: 1;   opacity: .5 }
  70%  { scale: 2.1; opacity: 0 }
  100% { scale: 2.1; opacity: 0 }
}

.v-nb {
  position: relative;
  display: grid;
  place-items: center;
  border-radius: var(--radius-ui);
  color: var(--color-text);
  transition: background-color var(--dur-fast) var(--ease-smooth);
}
.v-nb:hover:not(:disabled) { background: var(--color-surface-2); }
.v-nb:disabled             { opacity: .5; cursor: not-allowed; }
.v-nb svg { transition: rotate var(--dur-base) var(--ease-back); }
.v-nb:hover:not(:disabled) svg { rotate: -12deg; }

.v-nb .v-nb-count {
  position: absolute;
  top: -2px;
  right: -2px;
  display: grid;
  place-items: center;
  min-width: 1.1rem;
  height: 1.1rem;
  padding-inline: .25rem;
  border-radius: 999px;
  background: var(--color-danger);
  color: var(--color-on-primary);
  font-size: .625rem;
  font-weight: 700;
  line-height: 1;
}
/* วงรัศมีเต้นออกจากตัวเลข — ดึงสายตาโดยไม่ทำให้ layout ขยับ
   ปิดเองเมื่อผู้ใช้ขอลดการเคลื่อนไหว */
.v-nb .v-nb-count::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--color-danger);
  animation: v-badge-halo 2s var(--ease-smooth) infinite;
}
@media (prefers-reduced-motion: reduce) {
  .v-nb .v-nb-count::before { animation: none; opacity: 0 }
}
`;

const SIZES = { sm: { box: 34, ico: 17 }, md: { box: 42, ico: 20 }, lg: { box: 52, ico: 24 } };

export default function IconBadgePulse({ size = 'md', disabled }) {
  const [count, setCount] = useState(3);
  const s = SIZES[size] ?? SIZES.md;

  return (
    <button
      type="button"
      aria-label={count > 0 ? `การแจ้งเตือน ${count} รายการ` : 'ไม่มีการแจ้งเตือน'}
      title="การแจ้งเตือน"
      disabled={disabled}
      onClick={() => setCount((c) => (c > 0 ? 0 : 3))}
      className="v-nb ui-focusable"
      style={{ width: s.box, height: s.box }}
    >
      <svg
        width={s.ico} height={s.ico} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      >
        <path d="M18 8a6 6 0 1 0-12 0c0 6-3 7-3 7h18s-3-1-3-7M13.7 20a2 2 0 0 1-3.4 0" />
      </svg>
      {count > 0 && (
        <span className="v-nb-count" aria-hidden="true">
          <span className="relative">{count}</span>
        </span>
      )}
    </button>
  );
}
