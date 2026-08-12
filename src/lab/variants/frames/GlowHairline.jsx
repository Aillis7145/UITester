export const meta = {
  id: 'frm-glow-hairline',
  group: 'frames',
  name: { th: 'เส้นผมเรืองแสง', en: 'Glowing Hairline' },
  tags: ['ธีม tech', 'ring', 'css-only'],
};

export const css = `
/* กรอบซ้อนสองชั้นในเงาเดียว: เส้นผม 1px + แสงฟุ้งข้างนอก
   ใช้ box-shadow แทน border จึงไม่กินพื้นที่ layout และซ้อนหลายชั้นได้
   เหมาะกับธีมพื้นมืด เพราะเส้นเรืองแสงมองเห็นชัดบนพื้นเข้ม */
.v-frm-glow {
  border-radius: var(--radius-card);
  background: var(--ui-card-bg);
  box-shadow:
    0 0 0 1px color-mix(in oklch, var(--color-primary) 45%, transparent),
    0 0 18px color-mix(in oklch, var(--color-primary) 30%, transparent),
    0 6px 20px oklch(0% 0 0 / .25);
  transition: box-shadow var(--dur-base) var(--ease-smooth);
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-frm-glow:hover {
  box-shadow:
    0 0 0 1px var(--color-primary),
    0 0 28px color-mix(in oklch, var(--color-primary) 55%, transparent),
    0 10px 28px oklch(0% 0 0 / .3);
}
`;

const PAD = { sm: 'p-3 text-xs', md: 'p-4 text-sm', lg: 'p-5' };

export default function GlowHairline({ size = 'md' }) {
  return (
    <div className={`v-frm-glow w-48 ${PAD[size] ?? PAD.md}`}>
      <p className="ui-heading">พื้นฐาน AI</p>
      <p className="mt-1 text-muted">24 บทเรียน</p>
      <p className="mt-2.5 text-xs text-muted opacity-70">ธีม tech ใช้กรอบแบบนี้</p>
    </div>
  );
}
