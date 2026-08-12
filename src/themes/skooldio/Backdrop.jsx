/**
 * พื้นหลังธีม Skooldio — เกือบเปล่า โดยตั้งใจ
 *
 * ดีไซน์แบบนี้ขายความสะอาดและที่ว่าง พื้นหลังที่มีลายจะขัดกับตัวตนของธีมทันที
 * จึงเหลือแค่แถบสองสีที่ขอบบน กับบล็อกเหลี่ยมที่มุม — พอให้รู้ว่าธีมนี้คือฟ้ากับเขียว
 * โดยไม่แย่งที่จากเนื้อหา
 */
export default function SkooldioBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-bg">
      {/* แถบแบรนด์ที่ขอบบนสุด — ฟ้านำ เขียวตาม บอกลำดับความสำคัญของสองสี */}
      <div className="absolute inset-x-0 top-0 flex h-1">
        <span className="h-full flex-3 bg-primary" />
        <span className="h-full flex-1 bg-accent" />
      </div>

      {/* บล็อกฟ้ามุมขวาบน — เหลี่ยม ไม่ฟุ้ง ให้เข้ากับภาษาเส้นคมของธีม */}
      <div
        className="absolute right-0 top-0 h-[34vh] w-[30vw] opacity-[0.07]"
        style={{
          background:
            'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 50%, transparent 50%)',
        }}
      />

      {/* บล็อกเขียวมุมซ้ายล่าง คู่กับบล็อกฟ้าเพื่อคุมสมดุลสองสี */}
      <div
        className="absolute bottom-0 left-0 h-[30vh] w-[26vw] opacity-[0.09]"
        style={{
          background:
            'linear-gradient(315deg, var(--color-accent) 0%, var(--color-accent) 50%, transparent 50%)',
        }}
      />

      {/* เส้นเฉียงคู่ที่มุมขวาล่าง — รับกับบล็อกเขียวฝั่งตรงข้าม */}
      <div
        className="absolute bottom-[8%] right-[4%] h-24 w-24 opacity-[0.16]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, var(--color-accent) 0 2px, transparent 2px 11px)',
        }}
      />

      {/* เส้นตารางบางมาก เห็นตอนมองใกล้เท่านั้น */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--color-text) 1px, transparent 1px), linear-gradient(to bottom, var(--color-text) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
    </div>
  );
}
