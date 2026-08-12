export const meta = {
  id: 'btn-press-depth',
  group: 'buttons',
  name: { th: 'ปุ่มสติกเกอร์กดยุบ', en: 'Press Depth' },
  tags: ['active', 'playful', 'css-only'],
};

export const css = `
/* เงาแข็ง 0 6px 0 คือกลไกทั้งหมด — กดแล้วเงายุบเหลือ 0 1px 0 พร้อมเลื่อนปุ่มลง 5px
   ผลลัพธ์คือความรู้สึกว่ากดวัตถุจริง โดยไม่ต้องใช้ transform 3D เลย */
.v-depth {
  background: var(--color-primary);
  color: var(--color-on-primary);
  border-radius: var(--radius-ui);
  box-shadow: 0 6px 0 color-mix(in oklch, var(--color-primary) 55%, black);
  font-weight: 700;
  transition:
    translate var(--dur-fast) var(--ease-smooth),
    box-shadow var(--dur-fast) var(--ease-smooth);
}
.v-depth:hover:not(:disabled) {
  translate: 0 -2px;
  box-shadow: 0 8px 0 color-mix(in oklch, var(--color-primary) 55%, black);
}
.v-depth:active:not(:disabled) {
  translate: 0 5px;
  box-shadow: 0 1px 0 color-mix(in oklch, var(--color-primary) 55%, black);
}
.v-depth:disabled { opacity: .5; cursor: not-allowed; }
`;

const SIZES = { sm: 'h-9 px-4 text-sm', md: 'h-11 px-6', lg: 'h-13 px-8 text-lg' };

export default function PressDepth({ label = 'ทำแบบทดสอบ', size = 'md', disabled, loading }) {
  return (
    <button className={`v-depth ui-focusable ${SIZES[size]}`} disabled={disabled || loading}>
      {loading ? '...' : label}
    </button>
  );
}
