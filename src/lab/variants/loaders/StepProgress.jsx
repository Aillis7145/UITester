import { useEffect, useState } from 'react';

export const meta = {
  id: 'ldr-step-progress',
  group: 'loaders',
  name: { th: 'ความคืบหน้าเป็นขั้น', en: 'Step Progress' },
  tags: ['steps', 'wizard', 'checkout'],
};

export const css = `
.v-steps { display: flex; align-items: center; width: 100%; }

.v-steps .v-steps-dot {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--color-surface-2);
  color: var(--color-muted);
  font-weight: 700;
  transition:
    background-color var(--dur-base) var(--ease-smooth),
    color var(--dur-base) var(--ease-smooth),
    scale var(--dur-base) var(--ease-back);
}
.v-steps .v-steps-dot[data-state='done']    { background: var(--color-success); color: oklch(100% 0 0); }
.v-steps .v-steps-dot[data-state='current'] { background: var(--color-primary); color: var(--color-on-primary); scale: 1.15; }

/* เส้นเชื่อมเติมจากซ้ายไปขวา บอกว่าผ่านขั้นนั้นมาแล้วจริง
   ดีกว่าแค่เปลี่ยนสีจุด เพราะเห็นทิศทางของกระบวนการ */
.v-steps .v-steps-line {
  flex: 1;
  height: 3px;
  background: var(--color-surface-2);
  position: relative;
  overflow: hidden;
}
.v-steps .v-steps-line::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-success);
  transform-origin: left;
  scale: 0 1;
  transition: scale var(--dur-slow) var(--ease-smooth);
}
.v-steps .v-steps-line[data-done='true']::after { scale: 1 1; }
`;

const STEPS = ['เลือกคอร์ส', 'ยืนยันข้อมูล', 'ชำระเงิน', 'เริ่มเรียน'];
const SIZES = { sm: { d: 24, f: 'text-[0.625rem]' }, md: { d: 32, f: 'text-xs' }, lg: { d: 40, f: 'text-sm' } };

export default function StepProgress({ size = 'md' }) {
  const [at, setAt] = useState(1);
  const s = SIZES[size] ?? SIZES.md;

  useEffect(() => {
    const id = setInterval(() => setAt((v) => (v >= STEPS.length - 1 ? 0 : v + 1)), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-64">
      <div className="v-steps" role="progressbar" aria-valuenow={at + 1} aria-valuemin={1} aria-valuemax={STEPS.length}>
        {STEPS.map((label, i) => (
          <div key={label} className="contents">
            {i > 0 && <span className="v-steps-line" data-done={i <= at} />}
            <span
              className={`v-steps-dot ${s.f}`}
              data-state={i < at ? 'done' : i === at ? 'current' : 'idle'}
              style={{ width: s.d, height: s.d }}
              title={label}
            >
              {i < at ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12.5 9.5 18 20 6.5" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
          </div>
        ))}
      </div>
      <p aria-live="polite" className="mt-2.5 text-center text-sm font-medium">
        {STEPS[at]}
      </p>
    </div>
  );
}
