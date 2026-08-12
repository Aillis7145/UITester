export const meta = {
  id: 'card-image-zoom',
  group: 'cards',
  name: { th: 'การ์ดภาพซูมตอน hover', en: 'Image Zoom Card' },
  tags: ['hover', 'image', 'overlay'],
};

export const css = `
.v-zoom {
  display: block;
  width: 15rem;
  text-align: left;
  overflow: hidden;
  border-radius: var(--radius-card);
  background: var(--ui-card-bg);
  border: var(--ui-border-width) solid var(--color-border);
  box-shadow: var(--shadow-raised);
  cursor: pointer;
  transition: box-shadow var(--dur-base) var(--ease-smooth), translate var(--dur-base) var(--ease-smooth);
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-zoom:hover { translate: 0 -4px; box-shadow: var(--ui-hover-shadow); }
.v-zoom[data-disabled='true'] { opacity: .5; pointer-events: none; }

.v-zoom .v-zoom-frame { position: relative; overflow: hidden; aspect-ratio: 16 / 10; background: var(--color-surface-2); }
/* ซูมที่ภาพ ไม่ใช่ที่การ์ด เพื่อไม่ให้ตัวหนังสือถูกขยายตามจนเบลอ */
.v-zoom .v-zoom-img {
  width: 100%; height: 100%; object-fit: cover;
  scale: 1;
  transition: scale var(--dur-slow) var(--ease-smooth);
}
.v-zoom:hover .v-zoom-img { scale: 1.09; }

/* ป้ายเลื่อนขึ้นมาจากขอบล่างของภาพตอน hover */
.v-zoom .v-zoom-tag {
  position: absolute;
  left: .625rem;
  bottom: .625rem;
  translate: 0 calc(100% + .625rem);
  opacity: 0;
  transition: translate var(--dur-base) var(--ease-back), opacity var(--dur-fast) var(--ease-smooth);
}
.v-zoom:hover .v-zoom-tag { translate: 0 0; opacity: 1; }
`;

export default function CardImageZoom({ size = 'md', disabled }) {
  return (
    <button
      type="button"
      data-disabled={Boolean(disabled)}
      className={`v-zoom ui-focusable ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : ''}`}
    >
      <span className="v-zoom-frame block">
        <img className="v-zoom-img" src="/mock/python.jpg" alt="" loading="lazy" decoding="async" />
        <span className="v-zoom-tag inline-flex items-center gap-1 rounded-ui bg-primary px-2 py-1 text-xs font-bold text-on-primary">
          ดูตัวอย่างฟรี
        </span>
      </span>

      <span className="block p-4">
        <span className="ui-heading line-clamp-1 block">ไพทอนสำหรับงานข้อมูล</span>
        <span className="mt-1 block text-sm text-muted">18 บทเรียน · อ. สุชาดา ภูวเดช</span>
      </span>
    </button>
  );
}
