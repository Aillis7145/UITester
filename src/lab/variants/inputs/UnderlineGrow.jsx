import { useState } from 'react';

export const meta = {
  id: 'inp-underline-grow',
  group: 'inputs',
  name: { th: 'เส้นใต้วิ่งออกจากกลาง', en: 'Growing Underline' },
  tags: ['minimal', 'focus', 'css-only'],
};

export const css = `
.v-ul { position: relative; display: block; width: 100%; }

.v-ul .v-ul-input {
  width: 100%;
  background: transparent;
  border: 0;
  border-bottom: 2px solid var(--color-border);
  color: var(--color-text);
  outline: none;
  transition: border-color var(--dur-base) var(--ease-smooth);
}
.v-ul .v-ul-input:disabled { opacity: .5; cursor: not-allowed; }

/* เส้นที่สองซ้อนทับเส้นแรก แล้วขยายจากกลางออกไปสองข้าง
   ใช้ scaleX จึงไม่ทำให้ layout ขยับแม้แต่พิกเซลเดียว */
.v-ul .v-ul-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--color-primary);
  scale: 0 1;
  transform-origin: center;
  transition: scale var(--dur-base) var(--ease-smooth);
}
.v-ul .v-ul-input:focus ~ .v-ul-bar { scale: 1 1; }

.v-ul .v-ul-label {
  display: block;
  margin-bottom: .35rem;
  font-size: .8125rem;
  font-weight: 600;
  color: var(--color-muted);
  transition: color var(--dur-base) var(--ease-smooth);
}
.v-ul:focus-within .v-ul-label { color: var(--color-primary); }
`;

const H = { sm: 'h-9 text-sm', md: 'h-11', lg: 'h-13 text-lg' };

export default function UnderlineGrow({ size = 'md', disabled }) {
  const [value, setValue] = useState('');

  return (
    <div className="w-60">
      <label className="v-ul">
        <span className="v-ul-label">ชื่อผู้เรียน</span>
        <input
          className={`v-ul-input ${H[size]}`}
          placeholder="พิมพ์ชื่อของคุณ"
          disabled={disabled}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <span className="v-ul-bar" aria-hidden="true" />
      </label>
    </div>
  );
}
