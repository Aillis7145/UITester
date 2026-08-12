export const meta = {
  id: 'frm-no-border',
  group: 'frames',
  name: { th: 'ไม่มีขอบ ใช้สีตัดกัน', en: 'Borderless Contrast' },
  tags: ['ธีม edura', 'flat', 'css-only'],
};

export const css = `
/* ไม่มีทั้งเส้นและเงาเป็นตัวบอกขอบเขต — ใช้ความต่างของสีล้วนๆ
   ใช้ได้เฉพาะเมื่อพื้นหน้ากับพื้นการ์ดต่างกันมากพอ (เช่น กรมท่าเข้ม vs ขาว)
   ถ้าสองสีใกล้กัน วิธีนี้จะทำให้การ์ดหายไปเลย ต้องเปลี่ยนไปใช้เส้นแทน */
.v-frm-flat {
  border-radius: var(--radius-card);
  background: var(--color-surface);
  color: var(--ui-on-surface);
  box-shadow: 0 8px 22px oklch(0% 0 0 / .28);
  transition: translate var(--dur-base) var(--ease-smooth), box-shadow var(--dur-base) var(--ease-smooth);
}
.v-frm-flat:hover { translate: 0 -3px; box-shadow: 0 16px 34px oklch(0% 0 0 / .38); }

/* แถบสีที่ขอบบนเป็นตัวเน้นแทนเส้นรอบรูป ให้การ์ดยังมี "จุดเริ่ม" ที่ชัด */
.v-frm-flat .v-frm-flat-bar {
  display: block;
  height: 3px;
  border-radius: 999px;
  width: 2.5rem;
  background: var(--color-primary);
  margin-bottom: .75rem;
}
`;

const PAD = { sm: 'p-3 text-xs', md: 'p-4 text-sm', lg: 'p-5' };

export default function NoBorderContrast({ size = 'md' }) {
  return (
    <div className={`v-frm-flat w-48 ${PAD[size] ?? PAD.md}`}>
      <span className="v-frm-flat-bar" />
      <p className="ui-heading">พื้นฐาน AI</p>
      <p className="mt-1 opacity-70">24 บทเรียน</p>
      <p className="mt-2.5 text-xs opacity-55">ธีม edura ใช้กรอบแบบนี้</p>
    </div>
  );
}
