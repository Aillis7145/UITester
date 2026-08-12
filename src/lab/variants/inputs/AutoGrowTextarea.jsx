import { useState } from 'react';

export const meta = {
  id: 'inp-autogrow',
  group: 'inputs',
  name: { th: 'ช่องข้อความยืดเอง', en: 'Auto-grow Textarea' },
  tags: ['textarea', 'css-grid', 'counter'],
};

export const css = `
/* เทคนิค: ซ้อน textarea กับ <span> เงาที่มีข้อความเดียวกันใน grid ช่องเดียวกัน
   span ดันความสูงให้ ส่วน textarea ยืดตาม — ได้ auto-grow โดยไม่ต้องวัดความสูงด้วย JS เลย
   ต้องมี white-space: pre-wrap ทั้งคู่ ไม่งั้นการขึ้นบรรทัดจะไม่ตรงกัน */
.v-grow {
  display: grid;
  padding: .625rem .875rem;
  background: var(--ui-field-bg);
  border: var(--ui-border-width) solid var(--ui-field-border);
  border-radius: var(--radius-ui);
  box-shadow: var(--ui-field-shadow);
  transition: border-color var(--dur-fast) var(--ease-smooth), box-shadow var(--dur-fast) var(--ease-smooth);
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-grow:focus-within { border-color: var(--color-primary); box-shadow: var(--ui-focus-ring); }
.v-grow[data-disabled='true'] { opacity: .5; pointer-events: none; }

.v-grow > textarea,
.v-grow > .v-grow-ghost {
  grid-area: 1 / 1;
  font: inherit;
  line-height: inherit;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.v-grow > .v-grow-ghost { visibility: hidden; pointer-events: none; }
.v-grow > textarea { resize: none; overflow: hidden; background: transparent; border: 0; outline: none; color: var(--color-text); }
`;

const MAX = 180;
const H = { sm: 'text-sm', md: '', lg: 'text-lg' };

export default function AutoGrowTextarea({ size = 'md', disabled }) {
  const [text, setText] = useState('');
  const over = text.length > MAX;

  return (
    <div className="w-64">
      <label className="mb-1.5 block text-sm font-medium">บันทึกย่อของบทเรียนนี้</label>
      <div className={`v-grow ${H[size]}`} data-disabled={Boolean(disabled)}>
        {/* บวก space ท้ายเพื่อให้เงาสูงขึ้นทันทีเมื่อผู้ใช้ขึ้นบรรทัดใหม่ */}
        <span className="v-grow-ghost" aria-hidden="true">
          {text + ' '}
        </span>
        <textarea
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="จดสิ่งที่เพิ่งเรียนไว้ตรงนี้..."
          aria-describedby="v-grow-count"
        />
      </div>
      <p
        id="v-grow-count"
        aria-live="polite"
        className="mt-1.5 text-right text-xs"
        style={{ color: over ? 'var(--color-danger)' : 'var(--color-muted)' }}
      >
        {text.length} / {MAX}
      </p>
    </div>
  );
}
