export const meta = {
  id: 'btn-border-draw',
  group: 'buttons',
  name: { th: 'ขอบวาดรอบตัว', en: 'Border Draw' },
  tags: ['hover', 'svg', 'outline'],
};

export const css = `
.v-draw {
  position: relative;
  background: transparent;
  color: var(--color-primary-ink);
  border-radius: var(--radius-ui);
  font-weight: 600;
}
.v-draw:disabled { opacity: .5; cursor: not-allowed }
.v-draw:active:not(:disabled) { scale: .97 }

/* เส้นพื้นจางค้างไว้ตลอด แล้วมีเส้นสีทับวาดจากมุมเดียวไปรอบตัว
   ใช้ stroke-dashoffset ซึ่งเป็นวิธีเดียวที่ทำให้ "เส้นถูกวาด" ได้จริง
   ต่างจาก scaleX ที่ได้แค่แถบยืดออก */
.v-draw .v-draw-svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.v-draw .v-draw-bg   { stroke: var(--color-border); }
.v-draw .v-draw-line {
  stroke: var(--color-primary);
  stroke-dasharray: var(--v-len);
  stroke-dashoffset: var(--v-len);
  transition: stroke-dashoffset var(--dur-slow) var(--ease-smooth);
}
.v-draw:hover:not(:disabled) .v-draw-line { stroke-dashoffset: 0; }
`;

const SIZES = {
  sm: { cls: 'h-9 px-4 text-sm', w: 128, h: 36 },
  md: { cls: 'h-11 px-6', w: 152, h: 44 },
  lg: { cls: 'h-13 px-8 text-lg', w: 184, h: 52 },
};

export default function BorderDraw({ label = 'ดูตัวอย่างฟรี', size = 'md', disabled, loading }) {
  const s = SIZES[size] ?? SIZES.md;
  const len = (s.w + s.h) * 2;

  return (
    <button
      className={`v-draw ui-focusable ${s.cls}`}
      disabled={disabled || loading}
      style={{ width: s.w, '--v-len': len }}
    >
      <svg className="v-draw-svg" viewBox={`0 0 ${s.w} ${s.h}`} fill="none" aria-hidden="true">
        {['v-draw-bg', 'v-draw-line'].map((cls) => (
          <rect
            key={cls}
            className={cls}
            x="1"
            y="1"
            width={s.w - 2}
            height={s.h - 2}
            rx="6"
            strokeWidth="2"
          />
        ))}
      </svg>
      <span className="relative">{loading ? '...' : label}</span>
    </button>
  );
}
