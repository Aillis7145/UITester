export const meta = {
  id: 'btn-solid-lift',
  group: 'buttons',
  name: { th: 'ปุ่มทึบยกตัว', en: 'Solid Lift' },
  tags: ['hover', 'shadow', 'css-only'],
};

export const css = `
.v-lift {
  background: var(--color-primary);
  color: var(--color-on-primary);
  border-radius: var(--radius-ui);
  box-shadow: var(--shadow-raised);
  font-weight: 600;
  transition:
    translate var(--dur-fast) var(--ease-smooth),
    box-shadow var(--dur-fast) var(--ease-smooth),
    filter    var(--dur-fast) var(--ease-smooth);
}
.v-lift:hover:not(:disabled)  { translate: 0 -3px; filter: brightness(1.06); box-shadow: var(--shadow-raised), 0 12px 28px oklch(0% 0 0 / .22); }
.v-lift:active:not(:disabled) { translate: 0 0; box-shadow: var(--shadow-pressed); }
.v-lift:disabled              { opacity: .5; cursor: not-allowed; }
`;

const SIZES = { sm: 'h-9 px-4 text-sm', md: 'h-11 px-6', lg: 'h-13 px-8 text-lg' };

export default function SolidLift({ label = 'เริ่มเรียน', size = 'md', disabled, loading }) {
  return (
    <button className={`v-lift ui-focusable ${SIZES[size]}`} disabled={disabled || loading}>
      {loading ? '...' : label}
    </button>
  );
}
