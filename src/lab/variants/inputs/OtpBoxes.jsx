import { useRef, useState } from 'react';

export const meta = {
  id: 'inp-otp-boxes',
  group: 'inputs',
  name: { th: 'ช่องกรอกรหัส OTP', en: 'OTP Code Boxes' },
  tags: ['otp', 'paste', 'keyboard'],
};

export const css = `
.v-otp { display: flex; gap: .375rem; width: 100%; }
.v-otp input {
  /* ย่อตามพื้นที่ที่มี แทนที่จะล็อกความกว้าง เพราะ 6 ช่องบนมือถือล้นจอง่ายมาก
     aspect-ratio ทำให้ยังเป็นจัตุรัสเสมอไม่ว่าย่อไปแค่ไหน */
  flex: 1 1 0;
  min-width: 0;
  max-width: var(--v-box);
  aspect-ratio: 1;
  text-align: center;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--color-text);
  background: var(--ui-field-bg);
  border: var(--ui-border-width) solid var(--ui-field-border);
  border-radius: var(--radius-ui);
  box-shadow: var(--ui-field-shadow);
  outline: none;
  transition:
    border-color var(--dur-fast) var(--ease-smooth),
    box-shadow var(--dur-fast) var(--ease-smooth),
    scale var(--dur-fast) var(--ease-back);
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-otp input:focus { border-color: var(--color-primary); box-shadow: var(--ui-focus-ring); scale: 1.06; }
.v-otp input:disabled { opacity: .5; cursor: not-allowed; }
/* ช่องที่กรอกแล้วเน้นด้วยขอบสีหลัก บอกความคืบหน้าโดยไม่ต้องมีตัวนับ */
.v-otp input[data-filled='true'] { border-color: var(--color-primary); }
`;

const LEN = 6;
const SIZES = { sm: '2.25rem', md: '2.75rem', lg: '3.25rem' };

export default function OtpBoxes({ size = 'md', disabled }) {
  const [digits, setDigits] = useState(Array(LEN).fill(''));
  const refs = useRef([]);

  const setAt = (i, v) => {
    setDigits((d) => {
      const next = [...d];
      next[i] = v;
      return next;
    });
  };

  const onChange = (i, raw) => {
    const v = raw.replace(/\D/g, '');
    if (!v) return setAt(i, '');
    // วางรหัสทั้งชุดทีเดียวได้ — คนส่วนใหญ่ก็อปจาก SMS มาวาง ไม่ได้พิมพ์ทีละตัว
    if (v.length > 1) {
      const chars = v.slice(0, LEN - i).split('');
      setDigits((d) => {
        const next = [...d];
        chars.forEach((c, k) => (next[i + k] = c));
        return next;
      });
      refs.current[Math.min(i + chars.length, LEN - 1)]?.focus();
      return;
    }
    setAt(i, v);
    refs.current[i + 1]?.focus();
  };

  const onKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
      setAt(i - 1, '');
    } else if (e.key === 'ArrowLeft') refs.current[i - 1]?.focus();
    else if (e.key === 'ArrowRight') refs.current[i + 1]?.focus();
  };

  return (
    <div className="w-full max-w-60">
      <label className="mb-2 block text-sm font-medium">รหัสยืนยัน 6 หลัก</label>
      <div className="v-otp" style={{ '--v-box': SIZES[size] ?? SIZES.md }}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            value={d}
            data-filled={Boolean(d)}
            disabled={disabled}
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            aria-label={`หลักที่ ${i + 1}`}
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">ส่งรหัสไปที่ 08x-xxx-4521 แล้ว</p>
    </div>
  );
}
