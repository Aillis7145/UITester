export const meta = {
  id: 'ldr-bar-indeterminate',
  group: 'loaders',
  name: { th: 'แถบวิ่งไม่รู้จบ', en: 'Indeterminate Bar' },
  tags: ['progress', 'unknown-duration', 'css-only'],
};

export const css = `
@keyframes v-bar-run {
  0%   { translate: -100% 0; scale: .6 1 }
  50%  { scale: 1 1 }
  100% { translate: 320% 0;  scale: .6 1 }
}

.v-bar {
  position: relative;
  overflow: hidden;
  width: 100%;
  border-radius: 999px;
  background: var(--color-surface-2);
  box-shadow: var(--shadow-pressed);
}
/* ใช้เมื่อยังไม่รู้ว่าจะเสร็จเมื่อไหร่ — ห้ามใช้แทน progress ที่รู้เปอร์เซ็นต์จริง
   เพราะจะทำให้ผู้ใช้เดาเวลาที่เหลือไม่ได้เลย */
.v-bar::after {
  content: '';
  position: absolute;
  inset: 0;
  width: 32%;
  border-radius: inherit;
  background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
  transform-origin: left;
  animation: v-bar-run 1.5s var(--ease-smooth) infinite;
}
`;

const SIZES = { sm: 4, md: 7, lg: 10 };

export default function BarIndeterminate({ size = 'md' }) {
  return (
    <div className="w-56">
      <div
        className="v-bar"
        role="progressbar"
        aria-label="กำลังโหลด"
        style={{ height: SIZES[size] ?? SIZES.md }}
      />
    </div>
  );
}
