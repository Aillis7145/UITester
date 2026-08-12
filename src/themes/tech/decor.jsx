/**
 * decor slot ของธีม Tech
 * นี่คือทางออกฉุกเฉินเมื่อธีมต้องการ "โครงสร้าง" ต่างกัน ไม่ใช่แค่สไตล์
 * ใช้เท่าที่จำเป็น — ถ้าเริ่มมี slot ที่ 6 แปลว่าความต่างนั้นควรเป็น token มากกว่า
 */

/** วงแหวนไวร์เฟรมข้างการ์ดล็อกอิน (ซ่อนบนจอเล็ก) */
export function LoginAside() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
      <style>{`
        @keyframes tech-orb-spin { to { transform: rotate(360deg) } }
        @keyframes tech-orb-spin-rev { to { transform: rotate(-360deg) } }
      `}</style>
      <div className="absolute left-[10%] top-1/2 -translate-y-1/2">
        <div
          className="h-72 w-72 rounded-full border opacity-30"
          style={{
            borderColor: 'var(--color-primary)',
            animation: 'tech-orb-spin 22s linear infinite',
            transform: 'rotateX(72deg)',
          }}
        />
        <div
          className="absolute inset-6 rounded-full border opacity-25"
          style={{
            borderColor: 'var(--color-accent)',
            animation: 'tech-orb-spin-rev 16s linear infinite',
            transform: 'rotateY(70deg)',
          }}
        />
        <div
          className="absolute inset-16 rounded-full opacity-25 blur-2xl"
          style={{ background: 'var(--color-primary)' }}
        />
      </div>
    </div>
  );
}

/** วงพลังงานตอนแสดงผลสอบ */
export function Celebration() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes tech-pulse {
          0%   { transform: translate(-50%,-50%) scale(.3); opacity: .75 }
          100% { transform: translate(-50%,-50%) scale(2.4); opacity: 0 }
        }
      `}</style>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute left-1/2 top-40 h-64 w-64 rounded-full border-2"
          style={{
            borderColor: i === 1 ? 'var(--color-accent)' : 'var(--color-primary)',
            animation: `tech-pulse 2.6s var(--ease-smooth) ${i * 0.55}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
