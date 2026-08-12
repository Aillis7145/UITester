export const meta = {
  id: 'card-3d-tilt',
  group: 'cards',
  name: { th: 'การ์ดเอียงตามเมาส์', en: '3D Tilt Card' },
  tags: ['hover', 'pointer', '3d'],
};

export const css = `
.v-tilt-wrap { perspective: 800px; }

.v-tilt {
  display: block;
  width: 15rem;
  padding: 1.15rem;
  text-align: left;
  border-radius: var(--radius-card);
  background: var(--ui-card-bg);
  border: var(--ui-border-width) solid var(--color-border);
  box-shadow: var(--shadow-raised);
  cursor: pointer;
  /* มุมเอียงส่งมาจาก JS แค่สองค่า ที่เหลือ CSS จัดการ
     transform-style: preserve-3d ทำให้ลูกที่ยกตัวขึ้นมาลอยจริงในระนาบ */
  transform: rotateX(var(--v-rx, 0deg)) rotateY(var(--v-ry, 0deg));
  transform-style: preserve-3d;
  transition: transform var(--dur-base) var(--ease-smooth), box-shadow var(--dur-base) var(--ease-smooth);
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-tilt:hover { box-shadow: var(--ui-hover-shadow); }
.v-tilt[data-disabled='true'] { opacity: .5; pointer-events: none; }

.v-tilt .v-tilt-pop { transform: translateZ(38px); }
.v-tilt .v-tilt-mid { transform: translateZ(18px); }

@media (prefers-reduced-motion: reduce) {
  .v-tilt { transform: none }
}
`;

const MAX = 9; // องศาสูงสุด มากกว่านี้จะดูบิดจนอ่านตัวหนังสือยาก

export default function Card3DTilt({ size = 'md', disabled }) {
  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--v-ry', `${px * MAX * 2}deg`);
    el.style.setProperty('--v-rx', `${-py * MAX * 2}deg`);
  };

  const reset = (e) => {
    e.currentTarget.style.setProperty('--v-rx', '0deg');
    e.currentTarget.style.setProperty('--v-ry', '0deg');
  };

  return (
    <div className="v-tilt-wrap">
      <button
        type="button"
        onPointerMove={onMove}
        onPointerLeave={reset}
        data-disabled={Boolean(disabled)}
        className={`v-tilt ui-focusable ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : ''}`}
      >
        <span className="v-tilt-pop ui-heading block">พื้นฐาน AI</span>
        <span className="v-tilt-mid mt-1 block text-sm text-muted">24 บทเรียน · 6 ชม. 20 น.</span>
        <span className="v-tilt-pop mt-4 inline-flex items-center gap-1.5 rounded-ui bg-primary px-3 py-1.5 text-sm font-semibold text-on-primary">
          เรียนต่อ
        </span>
      </button>
    </div>
  );
}
