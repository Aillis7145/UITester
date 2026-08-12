export const meta = {
  id: 'card-border-beam',
  group: 'cards',
  name: { th: 'ลำแสงวิ่งรอบขอบ', en: 'Border Beam' },
  tags: ['hover', 'conic', 'trendy'],
};

export const css = `
/* @property จำเป็นจริงๆ ตรงนี้ ถ้าไม่ประกาศ เบราว์เซอร์มอง --v-a เป็นสตริง
   แล้ว conic-gradient จะกระโดดเป็นช่วงแทนที่จะหมุนลื่น */
@property --v-a {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
@keyframes v-beam-spin { to { --v-a: 360deg } }

.v-beam {
  position: relative;
  display: block;
  width: 15rem;
  padding: 1.15rem;
  text-align: left;
  border-radius: var(--radius-card);
  background: var(--ui-card-bg);
  box-shadow: var(--shadow-raised);
  cursor: pointer;
  isolation: isolate;
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-beam[data-disabled='true'] { opacity: .5; pointer-events: none; }

/* ขอบเรืองแสงเป็น pseudo-element ที่ใหญ่กว่าการ์ด 1.5px แล้วโดนการ์ดทับตรงกลาง
   จึงเห็นเฉพาะเป็นเส้นขอบ ไม่ต้องใช้ mask ให้ยุ่ง */
.v-beam::before {
  content: '';
  position: absolute;
  inset: -1.5px;
  z-index: -1;
  border-radius: inherit;
  background: conic-gradient(
    from var(--v-a),
    transparent 0turn,
    var(--color-primary) .12turn,
    var(--color-accent) .2turn,
    transparent .32turn,
    transparent 1turn
  );
  opacity: 0;
  transition: opacity var(--dur-base) var(--ease-smooth);
  animation: v-beam-spin 3s linear infinite;
}
.v-beam:hover::before,
.v-beam:focus-visible::before { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .v-beam::before { animation: none }
}
`;

export default function CardBorderBeam({ size = 'md', disabled }) {
  return (
    <button
      type="button"
      data-disabled={Boolean(disabled)}
      className={`v-beam ui-focusable ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : ''}`}
    >
      <span className="ui-heading block">แพ็กเกจพรีเมียม</span>
      <span className="mt-1.5 block text-sm text-muted">
        เข้าถึงทุกคอร์ส ดาวน์โหลดได้ พร้อมใบประกาศ
      </span>
      <span className="mt-4 flex items-baseline gap-1">
        <span className="ui-heading text-2xl">฿590</span>
        <span className="text-sm text-muted">/ เดือน</span>
      </span>
    </button>
  );
}
