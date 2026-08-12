import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (cb) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;

/** true เมื่อผู้ใช้ตั้งค่าระบบให้ลดการเคลื่อนไหว — ใช้ปิด 3D / คอนเฟตติ */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
