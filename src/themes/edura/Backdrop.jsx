/**
 * พื้นหลังธีม Edura — กรมท่าเข้ม มีลายเส้นบางๆ แบบเทมเพลตเว็บสถาบัน
 * SVG + CSS ล้วน ไม่มี canvas
 *
 * ลายต้องจางมาก เพราะการ์ดขาวที่วางทับต้องเป็นจุดสนใจ
 * พื้นหลังมีหน้าที่แค่ทำให้พื้นกรมท่าไม่ตายสนิท
 */
export default function EduraBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-bg">
      {/* ไล่เฉดให้ด้านบนสว่างกว่าเล็กน้อย เหมือนมีแสงจากข้างบน */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, oklch(100% 0 0 / 0.07), transparent 45%, oklch(0% 0 0 / 0.14))',
        }}
      />

      {/* ลายเส้นวงกลมซ้อน มุมขวาบน */}
      <svg
        className="absolute right-[-6%] top-[-10%] h-[62vh] w-[62vh] opacity-[0.13]"
        viewBox="0 0 400 400"
        fill="none"
      >
        {[190, 150, 110, 70].map((r) => (
          <circle key={r} cx="200" cy="200" r={r} stroke="var(--color-primary)" strokeWidth="1" />
        ))}
      </svg>

      {/* ลายเส้นโค้งไหลมุมซ้ายล่าง */}
      <svg
        className="absolute bottom-[-8%] left-[-10%] h-[54vh] w-[70vw] opacity-[0.12]"
        viewBox="0 0 700 400"
        preserveAspectRatio="xMinYMax slice"
        fill="none"
      >
        {[0, 26, 52, 78].map((o) => (
          <path
            key={o}
            d={`M-40 ${250 + o} C 120 ${170 + o}, 260 ${330 + o}, 420 ${250 + o} S 660 ${150 + o}, 760 ${210 + o}`}
            stroke="var(--color-accent)"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* ลายจุดเกาะขอบ */}
      <div
        className="absolute left-[4%] top-[30%] h-24 w-28 opacity-[0.22]"
        style={{
          backgroundImage: 'radial-gradient(var(--color-primary) 1.4px, transparent 1.4px)',
          backgroundSize: '14px 14px',
        }}
      />
      <div
        className="absolute bottom-[26%] right-[5%] h-20 w-24 opacity-[0.16]"
        style={{
          backgroundImage: 'radial-gradient(var(--color-accent) 1.4px, transparent 1.4px)',
          backgroundSize: '14px 14px',
        }}
      />
    </div>
  );
}
