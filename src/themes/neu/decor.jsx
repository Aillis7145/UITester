/**
 * decor slot ของธีม Neumorphism
 * ไม่มี LoginAside โดยตั้งใจ — ธีมนี้ให้การ์ดเป็นพระเอกคนเดียว
 * ของประดับข้างๆ จะแย่งความสนใจจากเงาคู่ซึ่งเป็นจุดขายทั้งหมดของ neu
 */

/** ระลอกนุ่มตอนแสดงผลสอบ — ใช้เงาแทนอนุภาค ให้เข้าภาษาของธีม */
export function Celebration() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes neu-ripple {
          0%   { transform: translate(-50%,-50%) scale(.55); opacity: .85 }
          100% { transform: translate(-50%,-50%) scale(1.9);  opacity: 0 }
        }
      `}</style>
      {[0, 1].map((i) => (
        <div
          key={i}
          className="absolute left-1/2 top-40 h-72 w-72 rounded-full"
          style={{
            boxShadow: 'var(--shadow-raised)',
            animation: `neu-ripple 3.2s var(--ease-smooth) ${i * 1.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
