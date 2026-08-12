export const meta = {
  id: 'card-spotlight',
  group: 'cards',
  name: { th: 'การ์ดไฟฉายตามเมาส์', en: 'Pointer Spotlight Card' },
  tags: ['hover', 'pointer', 'gradient'],
};

export const css = `
.v-spot {
  position: relative;
  display: block;
  width: 15rem;
  padding: 1.15rem;
  text-align: left;
  overflow: hidden;
  border-radius: var(--radius-card);
  background: var(--ui-card-bg);
  border: var(--ui-border-width) solid var(--color-border);
  box-shadow: var(--shadow-raised);
  cursor: pointer;
  transition: border-color var(--dur-base) var(--ease-smooth);
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-spot:hover { border-color: var(--color-primary); }
.v-spot[data-disabled='true'] { opacity: .5; pointer-events: none; }

/* ตำแหน่งเมาส์ส่งเข้ามาทาง --v-mx / --v-my แล้ว CSS วาดวงแสงตรงนั้น
   JS แตะแค่ค่าตัวแปรสองตัว ส่วนการวาดทั้งหมดเป็นงานของ CSS */
.v-spot::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  background: radial-gradient(
    16rem circle at var(--v-mx, 50%) var(--v-my, 50%),
    color-mix(in oklch, var(--color-primary) 26%, transparent),
    transparent 68%
  );
  transition: opacity var(--dur-base) var(--ease-smooth);
  pointer-events: none;
}
.v-spot:hover::before { opacity: 1; }

.v-spot > * { position: relative; z-index: 1; }
`;

const SIZES = { sm: 'text-sm', md: '', lg: 'text-lg' };

export default function CardSpotlight({ size = 'md', disabled }) {
  const onPointerMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--v-mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--v-my', `${e.clientY - r.top}px`);
  };

  return (
    <button
      type="button"
      onPointerMove={onPointerMove}
      className={`v-spot ui-focusable ${SIZES[size]}`}
      data-disabled={Boolean(disabled)}
    >
      <span className="ui-heading block">แบบทดสอบท้ายบท</span>
      <span className="mt-1.5 block text-sm text-muted">
        10 ข้อ · จำกัดเวลา 15 นาที · ผ่านที่ 60%
      </span>
      <span className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary-ink">
        เริ่มทำแบบทดสอบ
      </span>
    </button>
  );
}
