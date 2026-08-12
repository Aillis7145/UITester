/**
 * decor slot ของธีม Skooldio
 * ไม่มี LoginAside โดยตั้งใจ — ธีมนี้ขายความโล่ง ของประดับข้างฟอร์มจะขัดตัวตนทันที
 */

/** แถบสีอำพันกวาดผ่านตอนแสดงผลสอบ — เน้นเดียวจบ ไม่โปรยของ */
export function Celebration() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes skd-sweep {
          0%   { translate: -110% 0; opacity: 0 }
          25%  { opacity: .5 }
          100% { translate: 110% 0;  opacity: 0 }
        }
        @keyframes skd-pop {
          0%   { scale: .4; opacity: 0 }
          45%  { scale: 1.15; opacity: 1 }
          100% { scale: 1; opacity: 0 }
        }
      `}</style>

      <div
        className="absolute inset-x-0 top-32 h-40 -skew-y-6"
        style={{
          background:
            'linear-gradient(90deg, transparent, color-mix(in oklch, var(--color-primary) 40%, transparent), transparent)',
          animation: 'skd-sweep 2.8s var(--ease-smooth) infinite',
        }}
      />

      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute top-40 block h-3 w-3 rounded-[3px] bg-primary"
          style={{
            left: `${32 + i * 18}%`,
            animation: `skd-pop 2.4s var(--ease-smooth) ${i * 0.3}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
