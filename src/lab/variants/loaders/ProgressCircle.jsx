import { useEffect, useState } from 'react';

export const meta = {
  id: 'ldr-progress-circle',
  group: 'loaders',
  name: { th: 'วงกลมบอกเปอร์เซ็นต์', en: 'Progress Circle' },
  tags: ['determinate', 'svg', 'percent'],
};

export const css = `
/* ต่างจากสปินเนอร์ตรงที่บอกได้ว่าเหลืออีกเท่าไร
   ใช้เมื่อรู้เปอร์เซ็นต์จริง ถ้าไม่รู้ให้ใช้ตัวโหลดแบบวิ่งไม่รู้จบแทน */
.v-pcircle { position: relative; display: inline-grid; place-items: center; }
.v-pcircle svg { rotate: -90deg; }
.v-pcircle .v-pcircle-fill {
  transition: stroke-dashoffset var(--dur-slow) var(--ease-smooth);
}
.v-pcircle .v-pcircle-num {
  position: absolute;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--color-text);
}
`;

const SIZES = { sm: { d: 52, t: 5, f: 'text-xs' }, md: { d: 76, t: 7, f: 'text-sm' }, lg: { d: 104, t: 9, f: '' } };

export default function ProgressCircle({ size = 'md' }) {
  const s = SIZES[size] ?? SIZES.md;
  const [pct, setPct] = useState(0);

  // เดินหน้าเองเพื่อให้เห็นอนิเมชั่นในคลัง ของจริงให้ส่ง value เข้ามาแทน
  useEffect(() => {
    const id = setInterval(() => setPct((p) => (p >= 100 ? 0 : p + 4)), 220);
    return () => clearInterval(id);
  }, []);

  const r = (s.d - s.t) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className="v-pcircle" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <svg width={s.d} height={s.d}>
        <circle cx={s.d / 2} cy={s.d / 2} r={r} fill="none" strokeWidth={s.t} stroke="var(--color-surface-2)" />
        <circle
          className="v-pcircle-fill"
          cx={s.d / 2}
          cy={s.d / 2}
          r={r}
          fill="none"
          strokeWidth={s.t}
          strokeLinecap="round"
          stroke="var(--color-primary)"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
        />
      </svg>
      <span className={`v-pcircle-num ${s.f}`}>{pct}%</span>
    </div>
  );
}
