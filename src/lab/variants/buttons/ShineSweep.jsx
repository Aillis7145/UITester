export const meta = {
  id: 'btn-shine-sweep',
  group: 'buttons',
  name: { th: 'ปุ่มแสงกวาด', en: 'Shine Sweep' },
  tags: ['hover', 'gradient', 'css-only'],
};

export const css = `
.v-shine {
  position: relative;
  overflow: hidden;
  background: var(--color-primary);
  color: var(--color-on-primary);
  border-radius: var(--radius-ui);
  box-shadow: var(--shadow-raised);
  font-weight: 600;
}
.v-shine::after {
  content: '';
  position: absolute;
  inset: 0;
  translate: -130% 0;
  background: linear-gradient(100deg, transparent 30%, oklch(100% 0 0 / .55) 50%, transparent 70%);
  transition: translate var(--dur-slow) var(--ease-smooth);
}
.v-shine:hover:not(:disabled)::after { translate: 130% 0; }
.v-shine:active:not(:disabled)       { scale: .97; box-shadow: var(--shadow-pressed); }
.v-shine:disabled                    { opacity: .5; cursor: not-allowed; }
`;

const SIZES = { sm: 'h-9 px-4 text-sm', md: 'h-11 px-6', lg: 'h-13 px-8 text-lg' };

export default function ShineSweep({ label = 'สมัครเรียนเลย', size = 'md', disabled, loading }) {
  return (
    <button className={`v-shine ui-focusable ${SIZES[size]}`} disabled={disabled || loading}>
      <span className="relative z-10">{loading ? '...' : label}</span>
    </button>
  );
}
