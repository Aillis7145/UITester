import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * วงแหวนคะแนน — SVG ล้วน ไม่ใช้ chart library
 * นับขึ้นจาก 0 ถึงค่าจริงครั้งเดียวตอน mount ด้วยการหน่วง 1 เฟรมแล้วปล่อยให้ CSS transition ทำงาน
 */
export function ProgressRing({
  value = 0,
  size = 168,
  thickness = 14,
  tone = 'primary',
  children,
  className,
}) {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setShown(value);
      return;
    }
    setShown(0);
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(value)));
    return () => cancelAnimationFrame(id);
  }, [value, reduced]);

  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(1, Math.max(0, shown));

  return (
    <div className={cn('relative inline-grid place-items-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={thickness}
          stroke="var(--color-surface-2)"
          opacity="0.7"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          stroke={`var(--color-${tone})`}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          style={{ transition: 'stroke-dashoffset var(--dur-slower) var(--ease-smooth)' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}

export default ProgressRing;
