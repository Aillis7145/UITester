export const meta = {
  id: 'ldr-dots-pulse',
  group: 'loaders',
  name: { th: 'สามจุดเต้น', en: 'Pulsing Dots' },
  tags: ['dots', 'stagger', 'css-only'],
};

export const css = `
@keyframes v-dot-bounce {
  0%, 60%, 100% { translate: 0 0;      opacity: .35 }
  30%           { translate: 0 -55%;   opacity: 1 }
}

.v-dots { display: inline-flex; align-items: center; }
.v-dots span {
  border-radius: 50%;
  background: var(--color-primary);
  /* หน่วงตามดัชนี --i เหมือนกับ dropdown แบบไล่ทีละอัน — เทคนิคเดียวกัน */
  animation: v-dot-bounce 1.1s var(--ease-smooth) infinite;
  animation-delay: calc(var(--i) * 130ms);
}
`;

const SIZES = { sm: { d: 6, g: 5 }, md: { d: 9, g: 7 }, lg: { d: 12, g: 9 } };

export default function DotsPulse({ size = 'md' }) {
  const s = SIZES[size] ?? SIZES.md;
  return (
    <span className="v-dots" role="status" aria-label="กำลังโหลด" style={{ gap: s.g }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: s.d, height: s.d, '--i': i }} />
      ))}
    </span>
  );
}
