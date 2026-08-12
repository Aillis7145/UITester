import { createBrowserRouter, Navigate, Outlet, useParams } from 'react-router';
import { I18nProvider } from '@/i18n/I18nProvider';
import { SiteLayout } from '@/site/SiteLayout';
import { HomePage } from '@/site/HomePage';
import { ShowcasePage } from '@/site/ShowcasePage';
import { ComparePage } from '@/site/ComparePage';
import { EmbedPage } from '@/site/EmbedPage';
import { NotFoundPage } from '@/site/NotFoundPage';
import { LabPage } from '@/lab/LabPage';

/**
 * I18nProvider ต้องอยู่ "ใน" router เพราะอ่านภาษาจาก ?lang ผ่าน useSearchParams
 * การวางไว้ที่ root layout ทำให้ทุกหน้ารวมถึง /embed ได้ภาษาเดียวกัน
 */
function Root() {
  return (
    <I18nProvider>
      <Outlet />
    </I18nProvider>
  );
}

export const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      // หน้าจอเปล่าสำหรับ iframe — ต้องอยู่นอก SiteLayout ไม่งั้นจะติดเปลือกสตูดิโอมาด้วย
      { path: '/embed/:themeId/:pageId', element: <EmbedPage /> },
      { path: '/embed', element: <Navigate to="/embed/tech/login" replace /> },

      {
        element: <SiteLayout />,
        children: [
          { index: true, element: <HomePage /> },

          { path: 'showcase', element: <Navigate to="/showcase/tech/login" replace /> },
          { path: 'showcase/:themeId', element: <NavigateToDefaultPage /> },
          { path: 'showcase/:themeId/:pageId', element: <ShowcasePage /> },

          { path: 'compare', element: <Navigate to="/compare/login" replace /> },
          { path: 'compare/:pageId', element: <ComparePage /> },

          { path: 'lab', element: <Navigate to="/lab/buttons" replace /> },
          { path: 'lab/:group', element: <LabPage /> },
          { path: 'lab/:group/:variantId', element: <LabPage /> },

          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);

/** /showcase/:themeId → เติมหน้าเริ่มต้นให้ โดยยังคงธีมที่ผู้ใช้ระบุไว้ */
function NavigateToDefaultPage() {
  const { themeId } = useParams();
  return <Navigate to={`/showcase/${themeId}/login`} replace />;
}

export default router;
