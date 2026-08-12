export const meta = {
  id: 'btn-text-slide-up',
  group: 'buttons',
  name: { th: 'ข้อความเลื่อนสลับ', en: 'Text Slide Up' },
  tags: ['hover', 'text', 'css-only'],
};

export const css = `
/* ข้อความสองชุดซ้อนกันแล้วเลื่อนขึ้นพร้อมกัน ชุดบนออก ชุดล่างเข้า
   overflow: clip ตัดส่วนที่อยู่นอกกรอบ จึงดูเหมือนตัวอักษรม้วนขึ้น
   เป็นลูกเล่นที่เว็บสมัยใหม่ใช้กันมากเพราะไม่รบกวน layout เลย */
.v-slideup {
  position: relative;
  overflow: clip;
  display: inline-grid;
  place-items: center;
  background: var(--color-primary);
  color: var(--color-on-primary);
  border-radius: var(--radius-ui);
  box-shadow: var(--shadow-raised);
  font-weight: 600;
}
.v-slideup > span { grid-area: 1 / 1; transition: translate var(--dur-base) var(--ease-smooth), opacity var(--dur-base) var(--ease-smooth); }
.v-slideup .v-slideup-a { translate: 0 0;    opacity: 1 }
.v-slideup .v-slideup-b { translate: 0 120%; opacity: 0 }

.v-slideup:hover:not(:disabled) .v-slideup-a { translate: 0 -120%; opacity: 0 }
.v-slideup:hover:not(:disabled) .v-slideup-b { translate: 0 0;     opacity: 1 }

.v-slideup:active:not(:disabled) { scale: .97 }
.v-slideup:disabled              { opacity: .5; cursor: not-allowed }
`;

const SIZES = { sm: 'h-9 px-4 text-sm', md: 'h-11 px-6', lg: 'h-13 px-8 text-lg' };

export default function TextSlideUp({
  label = 'ดูรายละเอียด',
  hoverLabel = 'ไปเลย →',
  size = 'md',
  disabled,
  loading,
}) {
  return (
    <button className={`v-slideup ui-focusable ${SIZES[size]}`} disabled={disabled || loading}>
      <span className="v-slideup-a whitespace-nowrap">{loading ? '...' : label}</span>
      <span className="v-slideup-b whitespace-nowrap" aria-hidden="true">
        {hoverLabel}
      </span>
    </button>
  );
}
