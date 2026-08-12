export const meta = {
  id: 'ib-tooltip-reveal',
  group: 'iconbuttons',
  name: { th: 'ปุ่มมีทูลทิป', en: 'Tooltip Reveal' },
  tags: ['tooltip', 'a11y', 'css-only'],
};

export const css = `
.v-tip { position: relative; display: inline-grid; place-items: center; border-radius: var(--radius-ui); color: var(--color-muted); }
.v-tip:hover:not(:disabled) { background: var(--color-surface-2); color: var(--color-primary-ink); }
.v-tip:disabled             { opacity: .5; cursor: not-allowed; }

.v-tip .v-tip-bubble {
  position: absolute;
  bottom: calc(100% + .5rem);
  left: 50%;
  translate: -50% 4px;
  padding: .25rem .5rem;
  border-radius: var(--radius-ui);
  background: var(--color-text);
  color: var(--color-bg);
  font-size: .6875rem;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--dur-fast) var(--ease-smooth), translate var(--dur-fast) var(--ease-back);
}
/* โผล่ทั้งตอน hover และตอน focus — คนใช้คีย์บอร์ดต้องเห็นคำอธิบายเหมือนกัน
   ถ้าทำแค่ :hover ทูลทิปจะใช้ไม่ได้เลยกับคนที่ไม่ใช้เมาส์ */
.v-tip:hover .v-tip-bubble,
.v-tip:focus-visible .v-tip-bubble { opacity: 1; translate: -50% 0; }

.v-tip .v-tip-arrow {
  position: absolute;
  top: 100%;
  left: 50%;
  translate: -50% 0;
  border: 4px solid transparent;
  border-top-color: var(--color-text);
}
`;

const SIZES = { sm: { box: 32, ico: 15 }, md: { box: 40, ico: 18 }, lg: { box: 48, ico: 22 } };

export default function TooltipReveal({ size = 'md', disabled, label = 'ดาวน์โหลดเอกสาร' }) {
  const s = SIZES[size] ?? SIZES.md;

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      className="v-tip ui-focusable ui-interactive"
      style={{ width: s.box, height: s.box }}
    >
      <span className="v-tip-bubble" role="tooltip">
        {label}
        <span className="v-tip-arrow" />
      </span>
      <svg
        width={s.ico} height={s.ico} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      >
        <path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 20h16" />
      </svg>
    </button>
  );
}
