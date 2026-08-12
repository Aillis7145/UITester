import { useCallback, useState } from 'react';

/** state ที่จำค่าไว้ใน localStorage — กัน error ตอน storage ถูกปิด (iframe/โหมดส่วนตัว) */
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? initial : JSON.parse(raw);
    } catch {
      return initial;
    }
  });

  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* storage ไม่ว่าง หรือถูกบล็อก — ใช้ค่าใน memory ต่อไปได้ */
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, set];
}
