import { useEffect, useRef, useState } from 'react';

/** [ref, onScreen] — ใช้หยุด rAF ของฉาก 3D เมื่อเลื่อนพ้นจอ */
export function useOnScreen(rootMargin = '200px') {
  const ref = useRef(null);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setOnScreen(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      rootMargin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return [ref, onScreen];
}
