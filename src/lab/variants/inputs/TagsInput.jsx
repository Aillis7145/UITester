import { useRef, useState } from 'react';

export const meta = {
  id: 'inp-tags',
  group: 'inputs',
  name: { th: 'ช่องใส่แท็ก', en: 'Tags Input' },
  tags: ['tags', 'keyboard', 'chips'],
};

export const css = `
@keyframes v-tag-in { from { scale: .5; opacity: 0 } to { scale: 1; opacity: 1 } }

.v-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: .375rem;
  padding: .5rem .625rem;
  background: var(--ui-field-bg);
  border: var(--ui-border-width) solid var(--ui-field-border);
  border-radius: var(--radius-ui);
  box-shadow: var(--ui-field-shadow);
  cursor: text;
  transition: border-color var(--dur-fast) var(--ease-smooth), box-shadow var(--dur-fast) var(--ease-smooth);
  /* วาดพื้นผิวเอง จึงต้องรับ token ของเนื้อหาบนพื้นผิวด้วย
     ไม่งั้นในธีมที่พื้นหน้าเข้มแต่การ์ดสว่าง (เช่น edura) ตัวหนังสือจะหายไปทั้งหมด */
  --color-text: var(--ui-on-surface);
  --color-muted: var(--ui-on-surface-muted);
  --color-primary-ink: var(--ui-on-surface-primary);
  color: var(--color-text);
}
.v-tags:focus-within { border-color: var(--color-primary); box-shadow: var(--ui-focus-ring); }
.v-tags[data-disabled='true'] { opacity: .5; pointer-events: none; }

.v-tags input { flex: 1; min-width: 5rem; background: transparent; border: 0; outline: none; color: var(--color-text); }
.v-tags .v-tag { animation: v-tag-in var(--dur-fast) var(--ease-back); }
`;

const H = { sm: 'text-sm', md: '', lg: 'text-lg' };

export default function TagsInput({ size = 'md', disabled }) {
  const [tags, setTags] = useState(['Python', 'Machine Learning']);
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  const add = () => {
    const v = draft.trim();
    if (!v || tags.includes(v)) return setDraft('');
    setTags((t) => [...t, v]);
    setDraft('');
  };

  const onKeyDown = (e) => {
    // Enter หรือ comma = จบแท็ก · Backspace ตอนช่องว่าง = ลบแท็กท้ายสุด
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add();
    } else if (e.key === 'Backspace' && !draft) {
      setTags((t) => t.slice(0, -1));
    }
  };

  return (
    <div className="w-64">
      <label className="mb-1.5 block text-sm font-medium">แท็กที่สนใจ</label>
      <div
        className={`v-tags ${H[size]}`}
        data-disabled={Boolean(disabled)}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="v-tag inline-flex items-center gap-1 rounded-ui bg-primary px-2 py-0.5 text-xs font-semibold text-on-primary"
          >
            {tag}
            <button
              type="button"
              aria-label={`เอาแท็ก ${tag} ออก`}
              onClick={(e) => {
                e.stopPropagation();
                setTags((t) => t.filter((x) => x !== tag));
              }}
              className="opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={add}
          placeholder={tags.length ? '' : 'พิมพ์แล้วกด Enter'}
        />
      </div>
      <p className="mt-1.5 text-xs text-muted">กด Enter เพื่อเพิ่ม · Backspace เพื่อลบตัวท้าย</p>
    </div>
  );
}
