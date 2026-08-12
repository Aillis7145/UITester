export const meta = {
  id: 'frm-crisp-line',
  group: 'frames',
  name: { th: 'เส้นคมชัด', en: 'Crisp Line' },
  tags: ['ธีม skooldio', 'border', 'css-only'],
};

export const css = `
/* เส้นทำงานหนัก เงาแทบไม่มี — ภาษาของดีไซน์สายมินิมอล
   เส้นสีเข้มจางทำให้การ์ดขาวบนพื้นขาวยังแยกออกจากกันได้
   ซึ่งเงาฟุ้งทำไม่ได้ดีเท่าเวลาสีพื้นเหมือนกันเป๊ะ */
.v-frm-crisp {
  border-radius: var(--radius-card);
  background: var(--ui-card-bg);
  box-shadow:
    0 0 0 1.5px color-mix(in oklch, var(--color-text) 14%, transparent),
    0 4px 12px color-mix(in oklch, var(--color-text) 6%, transparent);
  transition: box-shadow var(--dur-base) var(--ease-smooth), translate var(--dur-base) var(--ease-smooth);
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
/* hover เข้มเส้นแทนที่จะเพิ่มเงา — คงความ "แบน" ของภาษาไว้ */
.v-frm-crisp:hover {
  translate: 0 -3px;
  box-shadow:
    0 0 0 1.5px var(--color-text),
    0 10px 22px color-mix(in oklch, var(--color-text) 12%, transparent);
}
`;

const PAD = { sm: 'p-3 text-xs', md: 'p-4 text-sm', lg: 'p-5' };

export default function CrispLine({ size = 'md' }) {
  return (
    <div className={`v-frm-crisp w-48 ${PAD[size] ?? PAD.md}`}>
      <p className="ui-heading">พื้นฐาน AI</p>
      <p className="mt-1 text-muted">24 บทเรียน</p>
      <p className="mt-2.5 text-xs text-muted opacity-70">ธีม skooldio ใช้กรอบแบบนี้</p>
    </div>
  );
}
