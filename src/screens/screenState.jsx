import { createContext, useContext } from 'react';

/**
 * สถานะที่ "สตูดิโอ" บังคับให้หน้าจอเข้าไปได้
 * มีไว้เพื่อให้ตรวจสอบสถานะ error / loading / skeleton ของทุกธีมได้โดยไม่ต้องเดา
 * ตัวเลือกพวกนี้เป็นเครื่องมือประเมิน ไม่ใช่ส่วนหนึ่งของหน้าจอจริง
 */
const DEFAULT = { forceError: false, forceLoading: false, showSkeleton: false };

const Ctx = createContext(DEFAULT);

export function ScreenStateProvider({ value, children }) {
  return <Ctx.Provider value={value ?? DEFAULT}>{children}</Ctx.Provider>;
}

export function useScreenState() {
  return useContext(Ctx);
}

export const DEFAULT_SCREEN_STATE = DEFAULT;
