export const meta = {
  id: 'btn-gradient-shift',
  group: 'buttons',
  name: { th: 'ไล่สีไหลตลอด', en: 'Shifting Gradient' },
  tags: ['gradient', 'ambient', 'css-only'],
};

export const css = `
@keyframes v-grad-shift { to { background-position: 200% 50% } }

.v-gradshift {
  /* ไล่สีกว้าง 200% แล้วเลื่อนตำแหน่งพื้นหลังไปเรื่อยๆ
     ได้สีที่ไหลโดยไม่ต้องแอนิเมตค่าสีทีละตัว ซึ่งกิน GPU น้อยกว่ามาก */
  background-image: linear-gradient(
    100deg,
    var(--color-primary),
    var(--color-accent),
    var(--color-primary)
  );
  background-size: 200% 100%;
  color: var(--color-on-primary);
  border-radius: var(--radius-ui);
  box-shadow: var(--shadow-raised);
  font-weight: 600;
  animation: v-grad-shift 5s linear infinite alternate;
  transition: box-shadow var(--dur-fast) var(--ease-smooth), scale var(--dur-fast) var(--ease-smooth);
}
.v-gradshift:hover:not(:disabled)  { box-shadow: var(--ui-hover-shadow); animation-duration: 2s; }
.v-gradshift:active:not(:disabled) { scale: .97; box-shadow: var(--shadow-pressed); }
.v-gradshift:disabled              { opacity: .5; cursor: not-allowed; animation-play-state: paused; }

@media (prefers-reduced-motion: reduce) { .v-gradshift { animation: none } }
`;

const SIZES = { sm: 'h-9 px-4 text-sm', md: 'h-11 px-6', lg: 'h-13 px-8 text-lg' };

export default function GradientShift({ label = 'อัปเกรดเป็นพรีเมียม', size = 'md', disabled, loading }) {
  return (
    <button className={`v-gradshift ui-focusable ${SIZES[size]}`} disabled={disabled || loading}>
      {loading ? '...' : label}
    </button>
  );
}
