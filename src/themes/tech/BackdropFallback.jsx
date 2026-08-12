/**
 * พื้นหลังสำรองของธีม Tech — CSS ล้วน ไม่มี JS ไม่มี canvas
 * ใช้ 3 บทบาท: poster ระหว่างรอ chunk ของ three.js, fallback เมื่อไม่มี WebGL,
 * และเป็นภาพนิ่งเมื่อผู้ใช้ตั้งค่าลดการเคลื่อนไหว
 */
export default function BackdropFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-bg">
      {/* กริดลู่เข้าเส้นขอบฟ้า */}
      <div
        className="absolute inset-x-0 bottom-0 h-[65%] opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(to right, color-mix(in oklch, var(--color-primary) 55%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in oklch, var(--color-primary) 55%, transparent) 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
          maskImage: 'linear-gradient(to top, black, transparent 78%)',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent 78%)',
          transform: 'perspective(340px) rotateX(58deg)',
          transformOrigin: 'bottom center',
        }}
      />
      {/* ก้อนแสงนีออนสองจุด — จางมาก ทำหน้าที่แค่ให้พื้นหลังไม่ตายสนิท */}
      <div
        className="absolute top-[-18%] left-[8%] h-[46vw] w-[46vw] rounded-full opacity-[0.16] blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--color-primary), transparent 68%)' }}
      />
      <div
        className="absolute right-[-10%] top-[24%] h-[38vw] w-[38vw] rounded-full opacity-[0.13] blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 68%)' }}
      />
    </div>
  );
}
