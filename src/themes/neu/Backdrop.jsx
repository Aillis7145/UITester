/**
 * พื้นหลังธีม Neumorphism
 *
 * ข้อจำกัด: พื้นหลังต้อง "เรียบ" พอที่ภาพลวงตาของแหล่งกำเนิดแสงคู่จะยังทำงาน
 * ลายที่คมหรือทึบเกินไปจะทำลายความรู้สึกว่าการ์ดนูนขึ้นมาจากพื้นทันที
 *
 * ทางออก: ใช้รูปทรงเรขาคณิตขนาดใหญ่ที่จางมาก (opacity 0.03–0.09)
 * ได้ความรู้สึกว่ามีอะไรอยู่ข้างหลัง โดยไม่แย่งความสนใจจากเงานูน
 */
export default function NeuBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-bg">
      {/* ทิศทางแสงบนซ้าย — ต้องมาก่อนเสมอ เพราะเงานูนทั้งธีมอ้างอิงทิศนี้ */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(90% 70% at 12% 6%, oklch(100% 0 0 / 0.85), transparent 62%)',
        }}
      />

      {/* ตารางจุดละเอียด — ให้พื้นผิวไม่ว่างเปล่าเวลามองใกล้ */}
      <div
        className="absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage: 'radial-gradient(oklch(45% 0.14 295) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* เส้นโค้งใหญ่ที่ไหลผ่านทั้งจอ */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.085]"
        viewBox="0 0 1200 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="neu-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(52% 0.19 295)" />
            <stop offset="100%" stopColor="oklch(58% 0.16 330)" />
          </linearGradient>
        </defs>

        {/* วงแหวนซ้อนกันมุมขวาบน */}
        <circle cx="1010" cy="130" r="180" stroke="url(#neu-line)" strokeWidth="1.6" />
        <circle cx="1010" cy="130" r="120" stroke="url(#neu-line)" strokeWidth="1.6" />
        <circle cx="1010" cy="130" r="62" stroke="url(#neu-line)" strokeWidth="1.6" />

        {/* คลื่นพาดกลางจอ */}
        <path
          d="M-60 620 C 220 500, 420 740, 700 600 S 1120 470, 1280 560"
          stroke="url(#neu-line)"
          strokeWidth="2"
        />
        <path
          d="M-60 690 C 200 580, 440 800, 720 670 S 1140 540, 1280 630"
          stroke="url(#neu-line)"
          strokeWidth="1.4"
        />

        {/* สี่เหลี่ยมเอียงมุมซ้ายล่าง */}
        <rect
          x="60"
          y="640"
          width="210"
          height="210"
          rx="46"
          stroke="url(#neu-line)"
          strokeWidth="1.8"
          transform="rotate(-18 165 745)"
        />
        {/* สามเหลี่ยมมุมขวาล่าง */}
        <path
          d="M980 800 L1120 800 L1050 686 Z"
          stroke="url(#neu-line)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>

      {/* ก้อนสีม่วงนุ่มมาก ให้พื้นขาวมีอุณหภูมิสี ไม่ซีดจนเลี่ยน */}
      <div
        className="absolute right-[-10%] top-[-8%] h-[46vw] w-[46vw] rounded-full opacity-[0.28] blur-3xl"
        style={{ background: 'radial-gradient(circle, oklch(66% 0.16 295), transparent 68%)' }}
      />
      <div
        className="absolute bottom-[-14%] left-[-8%] h-[42vw] w-[42vw] rounded-full opacity-[0.22] blur-3xl"
        style={{ background: 'radial-gradient(circle, oklch(70% 0.13 330), transparent 68%)' }}
      />

      {/* เงาม่วงมุมล่างขวา ปิดวงจรทิศทางแสง */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(80% 70% at 92% 96%, oklch(62% 0.10 295 / 0.16), transparent 62%)',
        }}
      />
    </div>
  );
}
