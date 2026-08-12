export const meta = {
  id: 'ldr-spinner-ring',
  group: 'loaders',
  name: { th: 'วงแหวนหมุน', en: 'Spinner Ring' },
  tags: ['spinner', 'css-only'],
};

export const css = `
@keyframes v-ring-spin { to { rotate: 360deg } }

.v-ring {
  border-radius: 50%;
  border-style: solid;
  border-color: color-mix(in oklch, var(--color-primary) 22%, transparent);
  border-top-color: var(--color-primary);
  animation: v-ring-spin .8s linear infinite;
}
/* หยุดหมุนเมื่อผู้ใช้ขอลดการเคลื่อนไหว แต่ยังเห็นว่ากำลังโหลดอยู่ */
@media (prefers-reduced-motion: reduce) {
  .v-ring { animation: none; border-top-color: var(--color-primary); opacity: .7 }
}
`;

const SIZES = { sm: { d: 22, b: 2.5 }, md: { d: 34, b: 3.5 }, lg: { d: 48, b: 4.5 } };

export default function SpinnerRing({ size = 'md' }) {
  const s = SIZES[size] ?? SIZES.md;
  return (
    <span
      className="v-ring"
      role="status"
      aria-label="กำลังโหลด"
      style={{ width: s.d, height: s.d, borderWidth: s.b }}
    />
  );
}
