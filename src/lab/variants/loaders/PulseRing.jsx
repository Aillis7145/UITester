export const meta = {
  id: 'ldr-pulse-ring',
  group: 'loaders',
  name: { th: 'วงกระเพื่อมออก', en: 'Pulse Ring' },
  tags: ['live', 'attention', 'css-only'],
};

export const css = `
@keyframes v-pulse-out {
  from { scale: 1;   opacity: .55 }
  to   { scale: 2.6; opacity: 0 }
}

.v-pulse { position: relative; display: inline-grid; place-items: center; }
.v-pulse .v-pulse-core {
  border-radius: 50%;
  background: var(--color-primary);
}
/* วงสองชั้นเหลื่อมเวลากัน ทำให้ดูเป็นคลื่นต่อเนื่องแทนที่จะกระพริบเป็นจังหวะ
   ใช้บอกสถานะ "กำลังถ่ายทอดสด" หรือ "กำลังบันทึก" ได้ดีกว่าสปินเนอร์ */
.v-pulse .v-pulse-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--color-primary);
  animation: v-pulse-out 1.8s var(--ease-smooth) infinite;
}
.v-pulse .v-pulse-ring:nth-child(2) { animation-delay: .9s; }

@media (prefers-reduced-motion: reduce) { .v-pulse .v-pulse-ring { animation: none; opacity: .2 } }
`;

const SIZES = { sm: 10, md: 14, lg: 20 };

export default function PulseRing({ size = 'md' }) {
  const d = SIZES[size] ?? SIZES.md;
  return (
    <span className="inline-flex items-center gap-2.5 text-sm font-medium">
      <span className="v-pulse" style={{ width: d, height: d }} role="status" aria-label="กำลังถ่ายทอดสด">
        <span className="v-pulse-ring" />
        <span className="v-pulse-ring" />
        <span className="v-pulse-core" style={{ width: d, height: d }} />
      </span>
      กำลังถ่ายทอดสด
    </span>
  );
}
