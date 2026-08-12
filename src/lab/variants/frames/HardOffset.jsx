export const meta = {
  id: 'frm-hard-offset',
  group: 'frames',
  name: { th: 'เงาแข็งแบบสติกเกอร์', en: 'Hard Offset' },
  tags: ['ธีม school', 'playful', 'css-only'],
};

export const css = `
/* เงาไม่มี blur เลย (ค่าที่สามเป็น 0) จึงได้แผ่นสีทึบใต้การ์ด
   เป็นภาษาของดีไซน์สายสนุก/เด็ก เพราะดูเหมือนสติกเกอร์ที่แปะซ้อนกัน
   ต้องคู่กับเส้นขอบหนา ไม่งั้นแผ่นเงาจะดูเป็นคนละชิ้นกับการ์ด */
.v-frm-hard {
  border-radius: var(--radius-card);
  background: var(--ui-card-bg);
  border: 2px solid color-mix(in oklch, var(--color-primary) 45%, transparent);
  box-shadow: 0 5px 0 color-mix(in oklch, var(--color-primary) 32%, transparent);
  transition: translate var(--dur-fast) var(--ease-smooth), box-shadow var(--dur-fast) var(--ease-smooth);
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-frm-hard:hover {
  translate: 0 -3px;
  box-shadow: 0 8px 0 color-mix(in oklch, var(--color-primary) 32%, transparent);
}
/* กดแล้วยุบลงไปทับเงาตัวเอง — เป็นจุดที่ทำให้รู้สึกว่ากดวัตถุจริง */
.v-frm-hard:active {
  translate: 0 4px;
  box-shadow: 0 1px 0 color-mix(in oklch, var(--color-primary) 32%, transparent);
}
`;

const PAD = { sm: 'p-3 text-xs', md: 'p-4 text-sm', lg: 'p-5' };

export default function HardOffset({ size = 'md' }) {
  return (
    <div className={`v-frm-hard w-48 ${PAD[size] ?? PAD.md}`} tabIndex={0}>
      <p className="ui-heading">พื้นฐาน AI</p>
      <p className="mt-1 text-muted">24 บทเรียน</p>
      <p className="mt-2.5 text-xs text-muted opacity-70">ธีม school ใช้กรอบแบบนี้</p>
    </div>
  );
}
