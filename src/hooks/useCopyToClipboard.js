import { useCallback, useEffect, useRef, useState } from 'react';

/** [copied, copy] — copied กลับเป็น false เองหลัง 1.6 วินาที */
export function useCopyToClipboard(resetMs = 1600) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // clipboard API ต้องใช้ secure context — fallback สำหรับ http/iframe
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
        } catch {
          return false;
        } finally {
          ta.remove();
        }
      }
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), resetMs);
      return true;
    },
    [resetMs],
  );

  return [copied, copy];
}
