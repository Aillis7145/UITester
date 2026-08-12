import { useState } from 'react';

export const meta = {
  id: 'inp-float-label',
  group: 'inputs',
  name: { th: 'ป้ายลอยขึ้น', en: 'Floating Label' },
  tags: ['label', 'placeholder-shown', 'css-only'],
};

export const css = `
.v-float { position: relative; display: block; width: 100%; }

.v-float .v-float-input {
  width: 100%;
  background: var(--ui-field-bg);
  border: var(--ui-border-width) solid var(--ui-field-border);
  border-radius: var(--radius-ui);
  box-shadow: var(--ui-field-shadow);
  color: var(--color-text);
  outline: none;
  transition: border-color var(--dur-fast) var(--ease-smooth), box-shadow var(--dur-fast) var(--ease-smooth);
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-float .v-float-input:focus { border-color: var(--color-primary); box-shadow: var(--ui-focus-ring); }
.v-float .v-float-input:disabled { opacity: .5; cursor: not-allowed; }

.v-float .v-float-label {
  position: absolute;
  left: .9rem;
  top: 0;
  translate: 0 -50%;
  padding-inline: .35rem;
  font-size: .75rem;
  font-weight: 600;
  color: var(--color-primary);
  background: var(--color-bg);
  border-radius: .25rem;
  pointer-events: none;
  transition: top var(--dur-base) var(--ease-smooth),
              font-size var(--dur-base) var(--ease-smooth),
              color var(--dur-base) var(--ease-smooth);
}
/* :placeholder-shown = ช่องยังว่าง → ป้ายลงไปนั่งกลางช่องแทน placeholder
   ต้องมี placeholder=" " ใน HTML ไม่งั้น selector นี้ไม่ทำงาน */
.v-float .v-float-input:placeholder-shown:not(:focus) + .v-float-label {
  top: 50%;
  font-size: .95rem;
  font-weight: 400;
  color: var(--color-muted);
  background: transparent;
}
`;

const H = { sm: 'h-10 px-3.5 text-sm', md: 'h-12 px-4', lg: 'h-14 px-4 text-lg' };

export default function FloatLabel({ size = 'md', disabled }) {
  const [value, setValue] = useState('');

  return (
    <div className="w-60">
      <label className="v-float">
        <input
          className={`v-float-input ${H[size]}`}
          placeholder=" "
          disabled={disabled}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <span className="v-float-label">อีเมล</span>
      </label>
    </div>
  );
}
