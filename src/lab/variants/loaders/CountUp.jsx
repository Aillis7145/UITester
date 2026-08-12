import { useEffect, useRef, useState } from 'react';

export const meta = {
  id: 'ldr-count-up',
  group: 'loaders',
  name: { th: 'ตัวเลขนับขึ้น', en: 'Count Up' },
  tags: ['number', 'stat', 'ease-out'],
};

export const css = `
.v-count {
  font-weight: 800;
  /* tabular-nums ล็อกความกว้างตัวเลขให้เท่ากันทุกหลัก
     ไม่งั้นตอนนับ ตัวเลขจะกระตุกซ้าย-ขวาตลอดเวลา */
  font-variant-numeric: tabular-nums;
  color: var(--color-primary-ink);
  line-height: 1;
}
`;

const SIZES = { sm: 'text-2xl', md: 'text-4xl', lg: 'text-5xl' };
const TARGET = 16500;
const DURATION = 1800;

export default function CountUp({ size = 'md' }) {
  const [n, setN] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    let start = null;
    const tick = (t) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / DURATION);
      // ease-out cubic ทำให้ตัวเลขพุ่งเร็วตอนต้นแล้วค่อยๆ หยุด ดูเป็นธรรมชาติกว่าเชิงเส้น
      setN(Math.round(TARGET * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          start = null;
          setN(0);
          raf.current = requestAnimationFrame(tick);
        }, 1200);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div className="text-center">
      <p className={`v-count ${SIZES[size]}`}>{n.toLocaleString('th-TH')}+</p>
      <p className="mt-1.5 text-sm text-muted">ผู้เรียนที่กำลังเรียนอยู่</p>
    </div>
  );
}
