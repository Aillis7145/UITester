export const meta = {
  id: 'card-reveal-actions',
  group: 'cards',
  name: { th: 'การ์ดคลี่ปุ่มออกมา', en: 'Reveal Actions Card' },
  tags: ['hover', 'grid-rows', 'progressive'],
};

export const css = `
.v-reveal {
  width: 15rem;
  padding: 1.15rem;
  border-radius: var(--radius-card);
  background: var(--ui-card-bg);
  border: var(--ui-border-width) solid var(--color-border);
  box-shadow: var(--shadow-raised);
  transition: box-shadow var(--dur-base) var(--ease-smooth), translate var(--dur-base) var(--ease-smooth);
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-reveal:hover, .v-reveal:focus-within { translate: 0 -3px; box-shadow: var(--ui-hover-shadow); }
.v-reveal[data-disabled='true'] { opacity: .5; pointer-events: none; }

/* grid-template-rows 0fr → 1fr คลี่ความสูงอัตโนมัติได้จริงโดยไม่ต้องเดาค่า max-height
   focus-within ทำให้คนที่ใช้คีย์บอร์ดเข้าถึงปุ่มได้เหมือนกัน ไม่ใช่เฉพาะคนใช้เมาส์ */
.v-reveal .v-reveal-slot {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows var(--dur-base) var(--ease-smooth),
    opacity var(--dur-base) var(--ease-smooth);
}
.v-reveal:hover .v-reveal-slot,
.v-reveal:focus-within .v-reveal-slot { grid-template-rows: 1fr; opacity: 1; }
.v-reveal .v-reveal-slot > div { min-height: 0; overflow: hidden; }

.v-reveal .v-reveal-btn {
  flex: 1;
  height: 2.25rem;
  border-radius: var(--radius-ui);
  font-size: .8125rem;
  font-weight: 600;
  transition: background-color var(--dur-fast) var(--ease-smooth);
}
.v-reveal .v-reveal-primary { background: var(--color-primary); color: var(--color-on-primary); }
.v-reveal .v-reveal-ghost   { background: var(--color-surface-2); color: var(--color-text); }
`;

const SIZES = { sm: 'text-sm', md: '', lg: 'text-lg' };

export default function CardRevealActions({ size = 'md', disabled }) {
  return (
    <article className={`v-reveal ${SIZES[size]}`} data-disabled={Boolean(disabled)}>
      <span className="ui-heading block">คณิตศาสตร์ ม.3</span>
      <span className="mt-1 block text-sm text-muted">ครูวราภรณ์ ทองดี</span>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-primary" style={{ width: '45%' }} />
      </div>

      <div className="v-reveal-slot">
        <div>
          <div className="flex gap-2 pt-3.5">
            <button type="button" className="v-reveal-btn v-reveal-primary ui-focusable">
              เรียนต่อ
            </button>
            <button type="button" className="v-reveal-btn v-reveal-ghost ui-focusable">
              รายละเอียด
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
