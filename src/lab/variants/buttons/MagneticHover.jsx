import { useRef } from 'react';

export const meta = {
  id: 'btn-magnetic',
  group: 'buttons',
  name: { th: 'ปุ่มแม่เหล็กตามเมาส์', en: 'Magnetic Hover' },
  tags: ['hover', 'pointer', 'trendy'],
};

export const css = `
.v-mag {
  background: var(--color-primary);
  color: var(--color-on-primary);
  border-radius: var(--radius-ui);
  box-shadow: var(--shadow-raised);
  font-weight: 600;
  /* JS ส่งแค่ระยะเยื้องมาทาง --v-dx/--v-dy ส่วนการเคลื่อนเป็นงานของ CSS
     ตอนปล่อยเมาส์ค่ากลับเป็น 0 แล้ว transition พากลับที่เดิมเอง */
  translate: var(--v-dx, 0) var(--v-dy, 0);
  transition: translate var(--dur-base) var(--ease-spring), box-shadow var(--dur-fast) var(--ease-smooth);
}
.v-mag:hover:not(:disabled)  { box-shadow: var(--ui-hover-shadow); }
.v-mag:active:not(:disabled) { box-shadow: var(--shadow-pressed); }
.v-mag:disabled              { opacity: .5; cursor: not-allowed; }

.v-mag .v-mag-label { display: inline-block; translate: calc(var(--v-dx, 0px) * .35) calc(var(--v-dy, 0px) * .35); transition: inherit; }

@media (prefers-reduced-motion: reduce) { .v-mag { translate: 0 0 } }
`;

const SIZES = { sm: 'h-9 px-4 text-sm', md: 'h-11 px-6', lg: 'h-13 px-8 text-lg' };
const PULL = 0.28; // สัดส่วนที่ปุ่มขยับตามเมาส์ มากกว่านี้จะรู้สึกว่าปุ่มหนีมือ

export default function MagneticHover({ label = 'สมัครเรียน', size = 'md', disabled, loading }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--v-dx', `${(e.clientX - (r.left + r.width / 2)) * PULL}px`);
    el.style.setProperty('--v-dy', `${(e.clientY - (r.top + r.height / 2)) * PULL}px`);
  };

  const reset = () => {
    ref.current?.style.setProperty('--v-dx', '0px');
    ref.current?.style.setProperty('--v-dy', '0px');
  };

  return (
    <button
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      disabled={disabled || loading}
      className={`v-mag ui-focusable ${SIZES[size]}`}
    >
      <span className="v-mag-label">{loading ? '...' : label}</span>
    </button>
  );
}
