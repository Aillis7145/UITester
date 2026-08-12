export const meta = {
  id: 'card-stat-ring',
  group: 'cards',
  name: { th: 'การ์ดสถิติวงแหวนวิ่ง', en: 'Stat Ring Card' },
  tags: ['hover', 'svg', 'dashboard'],
};

export const css = `
.v-ringcard {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 15rem;
  padding: 1.15rem;
  text-align: left;
  border-radius: var(--radius-card);
  background: var(--ui-card-bg);
  border: var(--ui-border-width) solid var(--color-border);
  box-shadow: var(--shadow-raised);
  cursor: pointer;
  transition: translate var(--dur-base) var(--ease-smooth), box-shadow var(--dur-base) var(--ease-smooth);
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-ringcard:hover { translate: 0 -3px; box-shadow: var(--ui-hover-shadow); }
.v-ringcard[data-disabled='true'] { opacity: .5; pointer-events: none; }

.v-ringcard svg { rotate: -90deg; flex-shrink: 0; }
/* วงแหวนเต็มตอน hover — ใช้ dashoffset เหมือน ProgressRing ของจริง
   จึงเอาไปต่อยอดเป็นการ์ดสถิติที่ผูกค่าจริงได้ทันที */
.v-ringcard .v-ringcard-fill {
  stroke-dasharray: var(--v-c);
  stroke-dashoffset: calc(var(--v-c) * (1 - var(--v-idle)));
  transition: stroke-dashoffset var(--dur-slow) var(--ease-smooth);
}
.v-ringcard:hover .v-ringcard-fill { stroke-dashoffset: calc(var(--v-c) * (1 - var(--v-full))); }

.v-ringcard .v-ringcard-num { transition: color var(--dur-base) var(--ease-smooth); }
.v-ringcard:hover .v-ringcard-num { color: var(--color-primary-ink); }
`;

const D = 62;
const T = 7;
const R = (D - T) / 2;
const C = 2 * Math.PI * R;

export default function CardStatRing({ size = 'md', disabled }) {
  return (
    <button
      type="button"
      data-disabled={Boolean(disabled)}
      className={`v-ringcard ui-focusable ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : ''}`}
      style={{ '--v-c': C, '--v-idle': 0.33, '--v-full': 1 }}
    >
      <span className="relative grid place-items-center">
        <svg width={D} height={D} aria-hidden="true">
          <circle cx={D / 2} cy={D / 2} r={R} fill="none" strokeWidth={T} stroke="var(--color-surface-2)" />
          <circle
            className="v-ringcard-fill"
            cx={D / 2}
            cy={D / 2}
            r={R}
            fill="none"
            strokeWidth={T}
            strokeLinecap="round"
            stroke="var(--color-primary)"
          />
        </svg>
        <span className="v-ringcard-num absolute text-sm font-bold tabular-nums">33%</span>
      </span>

      <span className="min-w-0">
        <span className="ui-heading line-clamp-1 block text-sm">พื้นฐาน AI</span>
        <span className="mt-1 block text-xs text-muted">เรียนไปแล้ว 8 จาก 24 บทเรียน</span>
        <span className="mt-2 block text-xs font-semibold text-primary-ink">เรียนต่อ →</span>
      </span>
    </button>
  );
}
