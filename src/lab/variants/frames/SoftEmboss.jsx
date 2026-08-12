export const meta = {
  id: 'frm-soft-emboss',
  group: 'frames',
  name: { th: 'เงานูนคู่ ไม่มีขอบ', en: 'Soft Emboss' },
  tags: ['ธีม neu', 'neumorphism', 'css-only'],
};

export const css = `
/* ไม่มีเส้นขอบเลย ขอบเขตของการ์ดมาจากเงาคู่ล้วนๆ
   ด้านสว่างบนซ้าย + ด้านมืดล่างขวา = สมองอ่านว่าวัตถุนูนขึ้นมาจากพื้น
   เงื่อนไขสำคัญ: พื้นการ์ดต้องเป็นสีเดียวกับพื้นหลัง ไม่งั้นภาพลวงตาพังทันที */
.v-frm-emboss {
  border-radius: var(--radius-card);
  background: var(--color-bg);
  box-shadow:
    -7px -7px 14px oklch(100% 0 0 / .85),
    7px 7px 16px color-mix(in oklch, var(--color-text) 22%, transparent);
  transition: box-shadow var(--dur-base) var(--ease-smooth);
}
/* นูนขึ้นอีก ไม่ใช่ลอยขึ้น — neumorphism ไม่มีแนวคิดเรื่องระยะห่างจากพื้น */
.v-frm-emboss:hover {
  box-shadow:
    -10px -10px 20px oklch(100% 0 0 / .95),
    10px 10px 22px color-mix(in oklch, var(--color-text) 26%, transparent);
}
.v-frm-emboss:active {
  box-shadow:
    inset -5px -5px 10px oklch(100% 0 0 / .85),
    inset 5px 5px 11px color-mix(in oklch, var(--color-text) 24%, transparent);
}
`;

const PAD = { sm: 'p-3 text-xs', md: 'p-4 text-sm', lg: 'p-5' };

export default function SoftEmboss({ size = 'md' }) {
  return (
    <div className={`v-frm-emboss w-48 ${PAD[size] ?? PAD.md}`} tabIndex={0}>
      <p className="ui-heading">พื้นฐาน AI</p>
      <p className="mt-1 text-muted">24 บทเรียน</p>
      <p className="mt-2.5 text-xs text-muted opacity-70">ธีม neu ใช้กรอบแบบนี้</p>
    </div>
  );
}
