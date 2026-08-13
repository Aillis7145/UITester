import { CHROMELESS_PAGES } from './pages';
import { AppBar } from './parts/AppBar';

/**
 * เปลือกของ "ตัวแอปจำลอง" — ต่างจากเปลือกสตูดิโอ (src/site/) โดยสิ้นเชิง
 * อันนี้ทาธีมและเป็นส่วนหนึ่งของสิ่งที่กำลังประเมิน ส่วนอันนั้นเป็นเครื่องมือ
 *
 * ใช้ร่วมกันทั้ง ShowcasePage และ EmbedPage จึงไม่มีทางแสดงผลต่างกัน
 */
export function AppShell({ pageId, onNavigate, children }) {
  // ประตูทางเข้า (ล็อกอิน เลือกโครงการ) ยังไม่มีเมนู เพราะผู้ใช้ยังไม่ได้อยู่ในคอร์สไหน
  const showBar = !CHROMELESS_PAGES.includes(pageId);

  return (
    <div className="flex min-h-full flex-col">
      {showBar && <AppBar current={pageId} onNavigate={onNavigate} />}
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default AppShell;
