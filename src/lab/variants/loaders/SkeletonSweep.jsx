export const meta = {
  id: 'ldr-skeleton-sweep',
  group: 'loaders',
  name: { th: 'โครงร่างแสงกวาด', en: 'Skeleton Sweep' },
  tags: ['skeleton', 'placeholder', 'css-only'],
};

export const css = `
@keyframes v-skel-sweep { to { translate: 220% 0 } }

.v-skel {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-ui);
  /* currentColor + opacity ทำให้ใช้ได้ทั้งธีมสว่างและธีมมืดโดยไม่ต้องแยกโค้ด */
  background: currentColor;
  opacity: .12;
}
.v-skel::after {
  content: '';
  position: absolute;
  inset-block: 0;
  left: 0;
  width: 45%;
  translate: -120% 0;
  background: linear-gradient(90deg, transparent, oklch(100% 0 0 / .55), transparent);
  animation: v-skel-sweep 1.4s var(--ease-smooth) infinite;
}
`;

const SIZES = { sm: 0.8, md: 1, lg: 1.25 };

export default function SkeletonSweep({ size = 'md' }) {
  const k = SIZES[size] ?? 1;
  const row = (w, h) => (
    <div className="v-skel" style={{ width: w, height: h * k }} />
  );

  return (
    <div className="w-56" role="status" aria-label="กำลังโหลด">
      <div className="flex items-center gap-3">
        <div className="v-skel shrink-0" style={{ width: 40 * k, height: 40 * k, borderRadius: '50%' }} />
        <div className="flex-1 space-y-2">
          {row('100%', 10)}
          {row('60%', 8)}
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {row('100%', 8)}
        {row('85%', 8)}
      </div>
    </div>
  );
}
