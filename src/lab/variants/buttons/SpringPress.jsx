export const meta = {
  id: 'btn-spring-press',
  group: 'buttons',
  name: { th: 'กดแล้วเด้งแบบสปริง', en: 'Spring Press' },
  tags: ['active', 'spring', 'css-only'],
};

export const css = `
.v-spring {
  background: var(--color-primary);
  color: var(--color-on-primary);
  border-radius: var(--radius-ui);
  box-shadow: var(--shadow-raised);
  font-weight: 600;
  scale: 1;
  /* ขาลงใช้ ease สั้นๆ ให้รู้สึกตอบสนองทันที
     ขาขึ้นใช้ linear() ที่เป็นสปริงจริง จึงเด้งเกินแล้วค่อยนิ่ง
     แยกจังหวะสองทางแบบนี้คือสิ่งที่ทำให้ปุ่มรู้สึก "มีน้ำหนัก" */
  transition: scale var(--dur-slow) var(--ease-spring), box-shadow var(--dur-fast) var(--ease-smooth);
}
.v-spring:hover:not(:disabled)  { scale: 1.04; }
.v-spring:active:not(:disabled) {
  scale: .92;
  transition: scale 90ms var(--ease-smooth);
  box-shadow: var(--shadow-pressed);
}
.v-spring:disabled { opacity: .5; cursor: not-allowed; }
`;

const SIZES = { sm: 'h-9 px-4 text-sm', md: 'h-11 px-6', lg: 'h-13 px-8 text-lg' };

export default function SpringPress({ label = 'ส่งคำตอบ', size = 'md', disabled, loading }) {
  return (
    <button className={`v-spring ui-focusable ${SIZES[size]}`} disabled={disabled || loading}>
      {loading ? '...' : label}
    </button>
  );
}
