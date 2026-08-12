export const meta = {
  id: 'frm-corner-brackets',
  group: 'frames',
  name: { th: 'ขอบเฉพาะสี่มุม', en: 'Corner Brackets' },
  tags: ['hover', 'accent', 'css-only'],
};

export const css = `
/* กรอบที่มีแค่สี่มุม — ทำด้วย gradient สี่ก้อนใน background เดียว
   ไม่ต้องมี element เพิ่มเลยแม้แต่ตัวเดียว และย่อขยายตามการ์ดเอง
   แต่ละก้อนคือเส้นหนา 2px ยาวตามความยาวที่กำหนดใน background-size */
.v-frm-corner {
  --v-len: 18px;
  --v-w: 2px;
  position: relative;
  border-radius: var(--radius-card);
  background-color: var(--ui-card-bg);
  background-image:
    linear-gradient(var(--color-primary), var(--color-primary)),
    linear-gradient(var(--color-primary), var(--color-primary)),
    linear-gradient(var(--color-primary), var(--color-primary)),
    linear-gradient(var(--color-primary), var(--color-primary));
  background-repeat: no-repeat;
  background-size:
    var(--v-len) var(--v-w),
    var(--v-w) var(--v-len),
    var(--v-len) var(--v-w),
    var(--v-w) var(--v-len);
  background-position: left top, left top, right bottom, right bottom;
  box-shadow: 0 4px 14px oklch(0% 0 0 / .12);
  transition: background-size var(--dur-base) var(--ease-smooth);
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
/* hover แล้วเส้นมุมยืดออกจนเกือบบรรจบเป็นกรอบเต็ม */
.v-frm-corner:hover {
  --v-len: 46px;
}
`;

const PAD = { sm: 'p-3.5 text-xs', md: 'p-4.5 text-sm', lg: 'p-5' };

export default function CornerBrackets({ size = 'md' }) {
  return (
    <div className={`v-frm-corner w-48 ${PAD[size] ?? PAD.md}`} tabIndex={0}>
      <p className="ui-heading">พื้นฐาน AI</p>
      <p className="mt-1 text-muted">24 บทเรียน</p>
      <p className="mt-2.5 text-xs text-muted opacity-70">ยังไม่มีธีมไหนใช้ — หยิบไปใช้ได้</p>
    </div>
  );
}
