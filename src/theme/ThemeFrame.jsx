import { createContext, useContext, useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { THEMES, DEFAULT_THEME } from './themes';

const ThemeCtx = createContext(null);

/**
 * ขอบเขตของธีม — วาง data-theme บน div ครอบ ไม่ใช่บน <html>
 * เพราะ CSS custom properties สืบทอดลงมาอยู่แล้ว การ scope จึงแม่นยำ
 * และนี่คือเหตุผลที่โหมดเทียบข้างกัน (หลายธีมในหน้าเดียว) ทำได้ตั้งแต่แรก
 *
 * โครงสร้างภายในตั้งใจแบ่ง 3 ชั้น:
 *   backdrop (นิ่ง) → scroll container (เนื้อหา) → overlay host (modal)
 * เพื่อให้ modal ลอยอยู่กับกรอบที่มองเห็น ไม่เลื่อนตามเนื้อหา
 * และยังอยู่ใน [data-theme] จึงได้ token ครบ
 */
export function ThemeFrame({
  themeId = DEFAULT_THEME,
  children,
  backdrop = true,
  live3d = true,
  scroll = false,
  className,
  style,
}) {
  const theme = THEMES[themeId] ?? THEMES[DEFAULT_THEME];
  const Backdrop = theme.Backdrop;
  const [overlayHost, setOverlayHost] = useState(null);

  const value = useMemo(() => ({ ...theme, overlayHost }), [theme, overlayHost]);

  return (
    <ThemeCtx.Provider value={value}>
      <div
        data-theme={theme.id}
        className={cn('relative isolate bg-bg font-sans text-text antialiased', className)}
        style={style}
      >
        {backdrop && <Backdrop live={live3d} />}
        <div className={cn('relative z-10', scroll && 'h-full overflow-y-auto overflow-x-hidden')}>
          {children}
        </div>
        <div ref={setOverlayHost} className="pointer-events-none absolute inset-0 z-40 empty:hidden" />
      </div>
    </ThemeCtx.Provider>
  );
}

/** ใช้ในหน้าจอเพื่ออ่าน decor slot — ห้ามใช้เพื่อ branch สไตล์ (นั่นคือหน้าที่ของ token) */
export function useThemeMeta() {
  return useContext(ThemeCtx) ?? { ...THEMES[DEFAULT_THEME], overlayHost: null };
}
