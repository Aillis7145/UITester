export const meta = {
  id: 'btn-ghost-fill',
  group: 'buttons',
  name: { th: 'ปุ่มโปร่งเติมสี', en: 'Ghost Fill' },
  tags: ['hover', 'outline', 'css-only'],
};

export const css = `
.v-ghost-fill {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  color: var(--color-primary);
  border: 2px solid currentColor;
  border-radius: var(--radius-ui);
  background: transparent;
  font-weight: 600;
  transition: color var(--dur-base) var(--ease-smooth);
}
/* ชั้นสีที่โตขึ้นจากขอบล่าง — ใช้ scaleY จึงไม่ทำให้ layout ขยับ */
.v-ghost-fill::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--color-primary);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform var(--dur-base) var(--ease-smooth);
}
.v-ghost-fill:hover:not(:disabled)::before { transform: scaleY(1); }
.v-ghost-fill:hover:not(:disabled)         { color: var(--color-on-primary); }
.v-ghost-fill:active:not(:disabled)        { scale: .97; }
.v-ghost-fill:disabled                     { opacity: .5; cursor: not-allowed; }
`;

const SIZES = { sm: 'h-9 px-4 text-sm', md: 'h-11 px-6', lg: 'h-13 px-8 text-lg' };

export default function GhostFill({ label = 'ดูรายละเอียด', size = 'md', disabled, loading }) {
  return (
    <button className={`v-ghost-fill ui-focusable ${SIZES[size]}`} disabled={disabled || loading}>
      {loading ? '...' : label}
    </button>
  );
}
