export const meta = {
  id: 'btn-ripple',
  group: 'buttons',
  name: { th: 'ระลอกจากจุดที่กด', en: 'Ripple From Pointer' },
  tags: ['click', 'material', 'pointer'],
};

export const css = `
@keyframes v-ripple-out {
  from { transform: translate(-50%, -50%) scale(0); opacity: .55 }
  to   { transform: translate(-50%, -50%) scale(1); opacity: 0 }
}
.v-ripple {
  position: relative;
  overflow: hidden;
  background: var(--color-primary);
  color: var(--color-on-primary);
  border-radius: var(--radius-ui);
  box-shadow: var(--shadow-raised);
  font-weight: 600;
  transition: box-shadow var(--dur-fast) var(--ease-smooth);
}
/* ตำแหน่งระลอกส่งมาทาง custom property จาก event ไม่ต้องสร้าง DOM เพิ่ม */
.v-ripple::after {
  content: '';
  position: absolute;
  top: var(--v-y, 50%);
  left: var(--v-x, 50%);
  width: 240%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: oklch(100% 0 0 / .6);
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  pointer-events: none;
}
.v-ripple[data-rippling='true']::after {
  animation: v-ripple-out var(--dur-slow) var(--ease-smooth);
}
.v-ripple:active:not(:disabled) { box-shadow: var(--shadow-pressed); }
.v-ripple:disabled              { opacity: .5; cursor: not-allowed; }
`;

const SIZES = { sm: 'h-9 px-4 text-sm', md: 'h-11 px-6', lg: 'h-13 px-8 text-lg' };

export default function Ripple({ label = 'ส่งคำตอบ', size = 'md', disabled, loading }) {
  const onPointerDown = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--v-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--v-y', `${e.clientY - rect.top}px`);
    el.dataset.rippling = 'false';
    // บังคับ reflow เพื่อรีสตาร์ตอนิเมชั่นเมื่อกดรัวๆ
    void el.offsetWidth;
    el.dataset.rippling = 'true';
  };

  return (
    <button
      className={`v-ripple ui-focusable ${SIZES[size]}`}
      disabled={disabled || loading}
      onPointerDown={onPointerDown}
    >
      <span className="relative z-10">{loading ? '...' : label}</span>
    </button>
  );
}
