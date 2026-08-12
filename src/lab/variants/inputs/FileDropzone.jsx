import { useRef, useState } from 'react';

export const meta = {
  id: 'inp-dropzone',
  group: 'inputs',
  name: { th: 'ลากไฟล์มาวาง', en: 'File Dropzone' },
  tags: ['upload', 'drag-drop', 'state'],
};

export const css = `
.v-drop {
  display: grid;
  place-items: center;
  gap: .5rem;
  padding: 1.5rem 1rem;
  text-align: center;
  cursor: pointer;
  border-radius: var(--radius-card);
  background: var(--ui-field-bg);
  /* เส้นประบอกว่า "วางของตรงนี้ได้" ชัดกว่าเส้นทึบมาก */
  border: 2px dashed color-mix(in oklch, var(--ui-on-surface) 28%, transparent);
  transition:
    border-color var(--dur-base) var(--ease-smooth),
    background-color var(--dur-base) var(--ease-smooth),
    scale var(--dur-base) var(--ease-back);
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-drop:hover { border-color: var(--color-primary); }
.v-drop[data-over='true'] {
  border-color: var(--color-primary);
  background: color-mix(in oklch, var(--color-primary) 10%, transparent);
  scale: 1.02;
}
.v-drop[data-disabled='true'] { opacity: .5; pointer-events: none; }

.v-drop .v-drop-ico { transition: translate var(--dur-base) var(--ease-back), color var(--dur-base) var(--ease-smooth); }
.v-drop[data-over='true'] .v-drop-ico { translate: 0 -4px; color: var(--color-primary); }
`;

export default function FileDropzone({ size = 'md', disabled }) {
  const [over, setOver] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const take = (f) => f && setFile({ name: f.name, kb: Math.round(f.size / 1024) });

  return (
    <div className="w-64">
      <div
        className="v-drop ui-focusable"
        role="button"
        tabIndex={disabled ? -1 : 0}
        data-over={over}
        data-disabled={Boolean(disabled)}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          take(e.dataTransfer.files?.[0]);
        }}
      >
        <svg
          className="v-drop-ico text-muted"
          width={size === 'lg' ? 34 : size === 'sm' ? 24 : 29}
          height={size === 'lg' ? 34 : size === 'sm' ? 24 : 29}
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
        >
          <path d="M12 16V4m0 0 4.5 4.5M12 4 7.5 8.5M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
        </svg>

        {file ? (
          <>
            <span className="text-sm font-semibold">{file.name}</span>
            <span className="text-xs text-muted">{file.kb} KB · กดเพื่อเปลี่ยนไฟล์</span>
          </>
        ) : (
          <>
            <span className="text-sm font-semibold">ลากไฟล์มาวาง หรือกดเลือก</span>
            <span className="text-xs text-muted">รองรับ PDF, PNG, JPG ไม่เกิน 10 MB</span>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          onChange={(e) => take(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
