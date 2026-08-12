import { useState } from 'react';

export const meta = {
  id: 'card-flip',
  group: 'cards',
  name: { th: 'การ์ดพลิกดูอีกด้าน', en: 'Flip Card' },
  tags: ['flip', '3d', 'a11y'],
};

export const css = `
.v-flipcard-wrap { perspective: 1000px; width: 15rem; height: 10.5rem; }

.v-flipcard {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform var(--dur-slow) var(--ease-smooth);
}
.v-flipcard[data-flipped='true'] { transform: rotateY(180deg); }
.v-flipcard[data-disabled='true'] { opacity: .5; pointer-events: none; }

.v-flipcard .v-face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.15rem;
  text-align: left;
  border-radius: var(--radius-card);
  background: var(--ui-card-bg);
  border: var(--ui-border-width) solid var(--color-border);
  box-shadow: var(--shadow-raised);
  /* ซ่อนด้านหลังของแต่ละหน้า ไม่งั้นจะเห็นตัวหนังสือกลับด้านทะลุออกมา */
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-flipcard .v-face-back { transform: rotateY(180deg); }
`;

export default function CardFlip({ size = 'md', disabled }) {
  const [flipped, setFlipped] = useState(false);
  const fs = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : '';

  return (
    <div className="v-flipcard-wrap">
      {/* ใช้ปุ่มจริงเพื่อให้คีย์บอร์ดพลิกได้ และประกาศสถานะผ่าน aria-pressed */}
      <button
        type="button"
        aria-pressed={flipped}
        aria-label={flipped ? 'พลิกกลับด้านหน้า' : 'พลิกดูรายละเอียด'}
        data-flipped={flipped}
        data-disabled={Boolean(disabled)}
        onClick={() => setFlipped((v) => !v)}
        className={`v-flipcard ui-focusable ${fs}`}
      >
        <span className="v-face">
          <span className="ui-heading block">คณิตศาสตร์ ม.3</span>
          <span className="mt-1 block text-sm text-muted">ครูวราภรณ์ ทองดี</span>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-ink">
            กดเพื่อดูรายละเอียด
          </span>
        </span>

        <span className="v-face v-face-back">
          <span className="ui-heading block text-sm">เนื้อหาในคอร์ส</span>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            <li>· อสมการและกราฟ</li>
            <li>· พาราโบลา</li>
            <li>· ตรีโกณมิติเบื้องต้น</li>
          </ul>
          <span className="mt-3 block text-sm font-semibold text-primary-ink">28 บทเรียน · 7 ชม.</span>
        </span>
      </button>
    </div>
  );
}
