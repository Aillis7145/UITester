import { Navigate, useParams, useSearchParams } from 'react-router';
import { isThemeId } from '@/theme/themes';
import { ThemeFrame } from '@/theme/ThemeFrame';
import { SCREENS, isPageId } from '@/screens';
import { ScreenStateProvider, DEFAULT_SCREEN_STATE } from '@/screens/screenState';
import { AppShell } from '@/screens/AppShell';

/**
 * หน้าจอเปล่า ไม่มีเปลือกสตูดิโอ — เป้าหมายของ iframe ในโหมดเทียบข้าง
 * ใช้ SCREENS[pageId] ตัวเดียวกับ ShowcasePage จึงไม่มีทางเรนเดอร์ต่างกัน
 *
 * ?live3d=0 ปิด WebGL — 3 context พร้อมกันในหน้าเดียวไม่คุ้ม
 * และเบราว์เซอร์จำกัดจำนวน context ไว้ราว 16 อยู่แล้ว
 */
export function EmbedPage() {
  const { themeId, pageId } = useParams();
  const [sp] = useSearchParams();

  if (!isThemeId(themeId) || !isPageId(pageId)) {
    return <Navigate to="/embed/tech/login" replace />;
  }

  const Screen = SCREENS[pageId];
  const live3d = sp.get('live3d') !== '0';

  return (
    <ThemeFrame themeId={themeId} live3d={live3d} scroll className="h-full">
      <ScreenStateProvider value={DEFAULT_SCREEN_STATE}>
        <AppShell pageId={pageId} onNavigate={() => {}}>
          <Screen onNavigate={() => {}} />
        </AppShell>
      </ScreenStateProvider>
    </ThemeFrame>
  );
}

export default EmbedPage;
