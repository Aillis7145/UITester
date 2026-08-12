import { useEffect, useRef, useState } from 'react';

/**
 * นับถอยหลังเป็นวินาที
 * ใช้ timestamp ปลายทางแทนการลบทีละ 1 เพื่อไม่ให้เพี้ยนเมื่อแท็บถูก throttle
 */
export function useCountdown(totalSec, { running = true } = {}) {
  const [left, setLeft] = useState(totalSec);
  const endAtRef = useRef(null);

  useEffect(() => {
    setLeft(totalSec);
    endAtRef.current = null;
  }, [totalSec]);

  useEffect(() => {
    if (!running) {
      endAtRef.current = null;
      return;
    }
    endAtRef.current = performance.now() + left * 1000;

    const id = setInterval(() => {
      const remain = Math.max(0, Math.round((endAtRef.current - performance.now()) / 1000));
      setLeft(remain);
      if (remain === 0) clearInterval(id);
    }, 250);

    return () => clearInterval(id);
    // ตั้งใจไม่ใส่ left ใน deps — ไม่งั้น interval จะถูกสร้างใหม่ทุกวินาที
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const reset = () => {
    setLeft(totalSec);
    endAtRef.current = performance.now() + totalSec * 1000;
  };

  return { left, reset, done: left === 0 };
}

/** 462 -> "07:42" */
export function formatClock(sec) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}
