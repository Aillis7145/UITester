export const meta = {
  id: 'btn-gradient-border',
  group: 'buttons',
  name: { th: 'ขอบไล่สีหมุน', en: 'Gradient Border' },
  tags: ['hover', 'gradient', 'css-only'],
};

export const css = `
/* @property ทำให้ไล่สีที่ใช้มุมองศาแอนิเมตได้จริง
   ถ้าไม่ประกาศ เบราว์เซอร์จะมองว่า --v-angle เป็นสตริง แล้วกระโดดแทนที่จะไหล */
@property --v-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
@keyframes v-spin-angle { to { --v-angle: 360deg } }

.v-grad-border {
  position: relative;
  border-radius: var(--radius-ui);
  background: var(--color-surface-2);
  color: var(--color-text);
  font-weight: 600;
  isolation: isolate;
  transition: color var(--dur-base) var(--ease-smooth);
}
.v-grad-border::before {
  content: '';
  position: absolute;
  inset: -2px;
  z-index: -1;
  border-radius: inherit;
  background: conic-gradient(
    from var(--v-angle),
    var(--color-primary),
    var(--color-accent),
    var(--color-primary)
  );
  opacity: .55;
  transition: opacity var(--dur-base) var(--ease-smooth);
  animation: v-spin-angle 4s linear infinite;
}
.v-grad-border:hover:not(:disabled)::before { opacity: 1; }
.v-grad-border:active:not(:disabled)        { scale: .97; }
.v-grad-border:disabled                     { opacity: .5; cursor: not-allowed; }
.v-grad-border:disabled::before             { animation-play-state: paused; }
`;

const SIZES = { sm: 'h-9 px-4 text-sm', md: 'h-11 px-6', lg: 'h-13 px-8 text-lg' };

export default function GradientBorder({ label = 'อัปเกรดแพ็กเกจ', size = 'md', disabled, loading }) {
  return (
    <button className={`v-grad-border ui-focusable ${SIZES[size]}`} disabled={disabled || loading}>
      {loading ? '...' : label}
    </button>
  );
}
