export const meta = {
  id: 'card-lift-glow',
  group: 'cards',
  name: { th: 'การ์ดยกตัวเรืองแสง', en: 'Lift & Glow Card' },
  tags: ['hover', 'lift', 'css-only'],
};

export const css = `
.v-cardlift {
  display: block;
  width: 15rem;
  padding: 1.15rem;
  text-align: left;
  border-radius: var(--radius-card);
  background: var(--ui-card-bg);
  border: var(--ui-border-width) solid var(--color-border);
  box-shadow: var(--shadow-raised);
  cursor: pointer;
  transition:
    translate var(--dur-base) var(--ease-smooth),
    box-shadow var(--dur-base) var(--ease-smooth),
    border-color var(--dur-base) var(--ease-smooth);
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-cardlift:hover  { translate: 0 -6px; box-shadow: var(--shadow-glow), var(--shadow-raised); border-color: var(--color-primary); }
.v-cardlift:active { translate: 0 -1px; box-shadow: var(--shadow-pressed); }
.v-cardlift[data-disabled='true'] { opacity: .5; pointer-events: none; }

/* ไอคอนเปลี่ยนเป็นสีหลักและโตขึ้นเล็กน้อยพร้อมกับการ์ด */
.v-cardlift .v-cardlift-ico {
  display: grid;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: var(--radius-ui);
  background: var(--color-surface-2);
  color: var(--color-muted);
  transition: background-color var(--dur-base) var(--ease-smooth),
              color var(--dur-base) var(--ease-smooth),
              scale var(--dur-base) var(--ease-back);
}
.v-cardlift:hover .v-cardlift-ico { background: var(--color-primary); color: var(--color-on-primary); scale: 1.08; }

/* ลูกศรโผล่ออกมาตอน hover */
.v-cardlift .v-cardlift-cta { display: inline-flex; align-items: center; gap: .35rem; color: var(--color-primary); font-weight: 600; }
.v-cardlift .v-cardlift-arrow { transition: translate var(--dur-base) var(--ease-back); }
.v-cardlift:hover .v-cardlift-arrow { translate: 5px 0; }
`;

const SIZES = { sm: 'text-sm', md: '', lg: 'text-lg' };

export default function CardLiftGlow({ size = 'md', disabled }) {
  return (
    <button type="button" className={`v-cardlift ui-focusable ${SIZES[size]}`} data-disabled={Boolean(disabled)}>
      <span className="v-cardlift-ico">
        <svg
          width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
        >
          <path d="M9.5 4A2.5 2.5 0 0 0 7 6.5 2.5 2.5 0 0 0 5 9a2.5 2.5 0 0 0 1 2 2.5 2.5 0 0 0 1 4.5 2.5 2.5 0 0 0 2.5 2.5c.83 0 1.5-.4 1.5-1V5c0-.6-.67-1-1.5-1Zm5 0A2.5 2.5 0 0 1 17 6.5 2.5 2.5 0 0 1 19 9a2.5 2.5 0 0 1-1 2 2.5 2.5 0 0 1-1 4.5 2.5 2.5 0 0 1-2.5 2.5c-.83 0-1.5-.4-1.5-1V5c0-.6.67-1 1.5-1Z" />
        </svg>
      </span>

      <span className="ui-heading mt-3 block">พื้นฐาน AI</span>
      <span className="mt-1 block text-sm text-muted">24 บทเรียน · 6 ชม. 20 น.</span>

      <span className="v-cardlift-cta mt-4 text-sm">
        เรียนต่อ
        <svg
          className="v-cardlift-arrow"
          width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
        >
          <path d="M4 12h15m-6-7 7 7-7 7" />
        </svg>
      </span>
    </button>
  );
}
