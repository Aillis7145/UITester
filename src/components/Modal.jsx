import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/cn';
import { useThemeMeta } from '@/theme/ThemeFrame';
import { IconButton } from './IconButton';

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Modal — จุดที่ความต่างของ 3 ธีมชัดที่สุด (ฉากหลัง เงา ความมนของกรอบ)
 * portal เข้า overlay host ของ ThemeFrame จึงลอยอยู่กับกรอบที่มองเห็นและยังได้ token ครบ
 */
export function Modal({ open, onClose, title, description, children, footer, size = 'md' }) {
  const { overlayHost } = useThemeMeta();
  const panelRef = useRef(null);
  const restoreRef = useRef(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement;

    const focusFirst = () => {
      const el = panelRef.current?.querySelector(FOCUSABLE);
      (el ?? panelRef.current)?.focus();
    };
    const raf = requestAnimationFrame(focusFirst);

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key !== 'Tab') return;
      // ขังโฟกัสไว้ในกรอบ ไม่ให้หลุดไปโดนเนื้อหาข้างหลัง
      const items = [...(panelRef.current?.querySelectorAll(FOCUSABLE) ?? [])];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown, true);
      restoreRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const content = (
    <div className="pointer-events-auto absolute inset-0 grid place-items-center p-4">
      <style>{`
        @keyframes modal-in { from { opacity: 0; transform: translateY(14px) scale(.96) } to { opacity: 1; transform: none } }
        @keyframes overlay-in { from { opacity: 0 } to { opacity: 1 } }
      `}</style>

      <button
        type="button"
        aria-label="ปิด"
        tabIndex={-1}
        onClick={onClose}
        className="ui-overlay absolute inset-0 cursor-default"
        style={{ animation: 'overlay-in var(--dur-base) var(--ease-smooth)' }}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? `${id}-title` : undefined}
        aria-describedby={description ? `${id}-desc` : undefined}
        tabIndex={-1}
        className={cn(
          'ui-surface relative w-full p-6 outline-none',
          size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-2xl' : 'max-w-md',
        )}
        style={{ animation: 'modal-in var(--dur-base) var(--ease-smooth)' }}
      >
        {onClose && (
          <IconButton
            icon="x"
            label="ปิด"
            size="sm"
            onClick={onClose}
            className="absolute right-3 top-3"
          />
        )}

        {title && (
          <h2 id={`${id}-title`} className="ui-heading pr-8 text-xl">
            {title}
          </h2>
        )}
        {description && (
          <p id={`${id}-desc`} className="mt-2 text-muted">
            {description}
          </p>
        )}

        {children && <div className="mt-4">{children}</div>}
        {footer && <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );

  return overlayHost ? createPortal(content, overlayHost) : content;
}

export default Modal;
