import { useState } from 'react';

export const meta = {
  id: 'btn-loading-morph',
  group: 'buttons',
  name: { th: 'ยุบเป็นวงโหลด', en: 'Loading Morph' },
  tags: ['loading', 'state', 'width'],
};

export const css = `
@keyframes v-morph-spin { to { rotate: 360deg } }

.v-morph {
  display: inline-grid;
  place-items: center;
  background: var(--color-primary);
  color: var(--color-on-primary);
  border-radius: var(--radius-ui);
  box-shadow: var(--shadow-raised);
  font-weight: 600;
  overflow: hidden;
  transition:
    width var(--dur-base) var(--ease-smooth),
    border-radius var(--dur-base) var(--ease-smooth);
}
.v-morph > * { grid-area: 1 / 1; }

/* ยุบเป็นวงกลม: ความกว้างเท่าความสูงพอดี จึงกลายเป็นสปินเนอร์ที่ยังเป็นปุ่มเดิม */
.v-morph[data-busy='true'] {
  width: var(--v-h);
  border-radius: 999px;
  pointer-events: none;
}
.v-morph .v-morph-label  { opacity: 1; transition: opacity var(--dur-fast) var(--ease-smooth); white-space: nowrap; }
.v-morph[data-busy='true'] .v-morph-label { opacity: 0; }

.v-morph .v-morph-ring {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 2.5px solid currentColor;
  border-top-color: transparent;
  opacity: 0;
  transition: opacity var(--dur-fast) var(--ease-smooth);
}
.v-morph[data-busy='true'] .v-morph-ring {
  opacity: 1;
  animation: v-morph-spin .75s linear infinite;
}
.v-morph:disabled { opacity: .5; cursor: not-allowed; }
`;

const SIZES = {
  sm: { cls: 'px-4 text-sm', h: '2.25rem', w: '9rem' },
  md: { cls: 'px-6', h: '2.75rem', w: '11rem' },
  lg: { cls: 'px-8 text-lg', h: '3.25rem', w: '13rem' },
};

export default function LoadingMorph({ label = 'บันทึกความคืบหน้า', size = 'md', disabled, loading }) {
  const [busy, setBusy] = useState(false);
  const s = SIZES[size];
  const isBusy = busy || Boolean(loading);

  const run = () => {
    setBusy(true);
    setTimeout(() => setBusy(false), 1800);
  };

  return (
    <button
      className={`v-morph ui-focusable ${s.cls}`}
      data-busy={isBusy}
      disabled={disabled}
      onClick={run}
      style={{ '--v-h': s.h, width: s.w, height: s.h }}
    >
      <span className="v-morph-label">{label}</span>
      <span className="v-morph-ring" aria-hidden="true" />
    </button>
  );
}
