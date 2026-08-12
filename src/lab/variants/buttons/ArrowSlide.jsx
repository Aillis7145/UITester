export const meta = {
  id: 'btn-arrow-slide',
  group: 'buttons',
  name: { th: 'ลูกศรเลื่อนออก', en: 'Arrow Slide' },
  tags: ['hover', 'icon', 'css-only'],
};

export const css = `
.v-arrow {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  background: transparent;
  color: var(--color-primary);
  border-radius: var(--radius-ui);
  font-weight: 600;
  transition: background-color var(--dur-base) var(--ease-smooth), gap var(--dur-base) var(--ease-smooth);
}
.v-arrow:hover:not(:disabled)  { background: color-mix(in oklch, var(--color-primary) 12%, transparent); gap: .875rem; }
.v-arrow:active:not(:disabled) { scale: .97; }
.v-arrow:disabled              { opacity: .5; cursor: not-allowed; }

.v-arrow .v-arrow-icon {
  transition: translate var(--dur-base) var(--ease-back);
}
.v-arrow:hover:not(:disabled) .v-arrow-icon { translate: 4px 0; }

/* ขีดใต้ที่วาดจากซ้ายไปขวา */
.v-arrow .v-arrow-text { position: relative; }
.v-arrow .v-arrow-text::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 2px;
  background: currentColor;
  scale: 0 1;
  transform-origin: left;
  transition: scale var(--dur-base) var(--ease-smooth);
}
.v-arrow:hover:not(:disabled) .v-arrow-text::after { scale: 1 1; }
`;

const SIZES = { sm: 'h-9 px-3 text-sm', md: 'h-11 px-4', lg: 'h-13 px-5 text-lg' };

export default function ArrowSlide({ label = 'เรียนบทถัดไป', size = 'md', disabled, loading }) {
  return (
    <button className={`v-arrow ui-focusable ${SIZES[size]}`} disabled={disabled || loading}>
      <span className="v-arrow-text">{loading ? '...' : label}</span>
      <svg
        className="v-arrow-icon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 12h15m-6-7 7 7-7 7" />
      </svg>
    </button>
  );
}
