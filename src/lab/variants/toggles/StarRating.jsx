import { useState } from 'react';

export const meta = {
  id: 'tog-star-rating',
  group: 'toggles',
  name: { th: 'ให้ดาวคะแนน', en: 'Star Rating' },
  tags: ['rating', 'hover', 'keyboard'],
};

export const css = `
@keyframes v-star-pop { 0% { scale: 1 } 45% { scale: 1.35 } 100% { scale: 1 } }

.v-stars { display: inline-flex; gap: .125rem; }
.v-stars[data-disabled='true'] { opacity: .5; pointer-events: none; }

.v-stars button {
  color: var(--color-border);
  border-radius: .25rem;
  transition: color var(--dur-fast) var(--ease-smooth), scale var(--dur-fast) var(--ease-back);
}
/* ดาวที่ "ติด" คือดาวที่ index น้อยกว่าค่าปัจจุบัน — ส่งผ่าน data-on
   ตอน hover ใช้ค่าชั่วคราวแทน ทำให้พรีวิวคะแนนก่อนกดจริงได้ */
.v-stars button[data-on='true'] { color: var(--color-warn); }
.v-stars button:hover { scale: 1.15; }
.v-stars button[data-just='true'] svg { animation: v-star-pop var(--dur-base) var(--ease-back); }
`;

const SIZES = { sm: 18, md: 24, lg: 30 };
const LABELS = ['แย่มาก', 'พอใช้', 'ปานกลาง', 'ดี', 'ดีมาก'];

export default function StarRating({ size = 'md', disabled }) {
  const [value, setValue] = useState(4);
  const [hover, setHover] = useState(0);
  const [just, setJust] = useState(0);
  const shown = hover || value;
  const s = SIZES[size] ?? SIZES.md;

  const pick = (n) => {
    setValue(n);
    setJust(n);
    setTimeout(() => setJust(0), 400);
  };

  return (
    <div className="text-center">
      <div
        className="v-stars"
        role="radiogroup"
        aria-label="ให้คะแนนบทเรียนนี้"
        data-disabled={Boolean(disabled)}
        onMouseLeave={() => setHover(0)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') pick(Math.min(5, value + 1));
          if (e.key === 'ArrowLeft') pick(Math.max(1, value - 1));
        }}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === value}
            aria-label={`${n} ดาว — ${LABELS[n - 1]}`}
            tabIndex={n === value ? 0 : -1}
            data-on={n <= shown}
            data-just={n === just}
            onMouseEnter={() => setHover(n)}
            onClick={() => pick(n)}
            className="ui-focusable"
          >
            <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="m12 3 2.7 5.9 6.3.7-4.7 4.3 1.3 6.3L12 17.1 6.4 20.2l1.3-6.3L3 9.6l6.3-.7L12 3Z" />
            </svg>
          </button>
        ))}
      </div>
      <p aria-live="polite" className="mt-1.5 text-sm text-muted">
        {LABELS[shown - 1] ?? ' '}
      </p>
    </div>
  );
}
