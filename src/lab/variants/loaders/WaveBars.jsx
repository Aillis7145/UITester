export const meta = {
  id: 'ldr-wave-bars',
  group: 'loaders',
  name: { th: 'แท่งคลื่นเสียง', en: 'Wave Bars' },
  tags: ['audio', 'stagger', 'css-only'],
};

export const css = `
@keyframes v-wave { 0%, 100% { scale: 1 .3 } 50% { scale: 1 1 } }

.v-wave { display: inline-flex; align-items: center; }
.v-wave span {
  border-radius: 999px;
  background: var(--color-primary);
  transform-origin: center;
  /* scale แนวตั้งอย่างเดียว จึงไม่กระทบ layout และวิ่งบน compositor ได้ */
  animation: v-wave 1s var(--ease-smooth) infinite;
  animation-delay: calc(var(--i) * 110ms);
}
@media (prefers-reduced-motion: reduce) {
  .v-wave span { animation: none; scale: 1 .6 }
}
`;

const SIZES = { sm: { w: 3, h: 20, g: 3 }, md: { w: 4, h: 30, g: 4 }, lg: { w: 6, h: 42, g: 5 } };

export default function WaveBars({ size = 'md' }) {
  const s = SIZES[size] ?? SIZES.md;
  return (
    <span className="v-wave" role="status" aria-label="กำลังโหลด" style={{ gap: s.g }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} style={{ width: s.w, height: s.h, '--i': i }} />
      ))}
    </span>
  );
}
