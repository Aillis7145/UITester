/**
 * พื้นหลังธีม School — SVG + CSS ล้วน ไม่มี canvas ไม่ import three.js
 * ก้อนเมฆนุ่ม จุดลายพื้น และรูปทรงลอยด้วย keyframe คาบยาว
 */
export default function SchoolBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-bg">
      <style>{`
        @keyframes school-float-a { 0%,100% { transform: translate3d(0,0,0) rotate(0deg) } 50% { transform: translate3d(14px,-22px,0) rotate(7deg) } }
        @keyframes school-float-b { 0%,100% { transform: translate3d(0,0,0) rotate(0deg) } 50% { transform: translate3d(-18px,16px,0) rotate(-9deg) } }
      `}</style>

      {/* จุดลายพื้น */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(color-mix(in oklch, var(--color-primary) 22%, transparent) 1.5px, transparent 1.5px)',
          backgroundSize: '26px 26px',
        }}
      />

      {/* ก้อนสีนุ่ม */}
      <div
        className="absolute -left-[12%] -top-[14%] h-[42vw] w-[42vw] rounded-full opacity-45 blur-2xl"
        style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }}
      />
      <div
        className="absolute -bottom-[16%] -right-[8%] h-[38vw] w-[38vw] rounded-full opacity-40 blur-2xl"
        style={{ background: 'radial-gradient(circle, var(--color-primary), transparent 70%)' }}
      />

      {/* เนินโค้งด้านล่าง */}
      <svg
        className="absolute inset-x-0 bottom-0 w-full opacity-55"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        style={{ height: '18vh' }}
      >
        <path
          d="M0,120 C240,190 420,50 720,90 C1020,130 1200,200 1440,140 L1440,220 L0,220 Z"
          fill="color-mix(in oklch, var(--color-accent) 35%, transparent)"
        />
        <path
          d="M0,170 C260,210 500,120 780,150 C1060,180 1240,210 1440,180 L1440,220 L0,220 Z"
          fill="color-mix(in oklch, var(--color-primary) 22%, transparent)"
        />
      </svg>

      {/* รูปทรงลอย — เกาะขอบจอและจางพอที่จะอ่านเป็นพื้นหลัง ไม่ใช่สิ่งแปลกปลอมทับเนื้อหา */}
      <div
        className="absolute -left-6 top-[34%] h-16 w-16 rounded-[35%] opacity-25 blur-[1px]"
        style={{
          background: 'var(--color-warn)',
          animation: 'school-float-a 9s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -right-4 top-[14%] h-12 w-12 rotate-12 rounded-2xl opacity-25 blur-[1px]"
        style={{
          background: 'var(--color-accent)',
          animation: 'school-float-b 11s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -left-3 bottom-[24%] h-10 w-10 rounded-full opacity-25 blur-[1px]"
        style={{
          background: 'var(--color-success)',
          animation: 'school-float-a 13s ease-in-out infinite',
        }}
      />
    </div>
  );
}
