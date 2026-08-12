import { Outlet } from 'react-router';
import { TopBar } from './TopBar';

/** เปลือกสตูดิโอที่ครอบทุกหน้า ยกเว้น /embed ซึ่งต้องเป็นหน้าจอเปล่า */
export function SiteLayout() {
  return (
    <div className="studio flex min-h-full flex-col bg-bg font-sans text-text antialiased">
      <TopBar />
      <main className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}

export default SiteLayout;
