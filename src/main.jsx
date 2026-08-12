import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from './router';
import { checkLocaleParity } from './i18n/I18nProvider';
import './styles/index.css';

// ตรวจว่า key ของ th กับ en ตรงกันหมด — รันเฉพาะตอน dev
if (import.meta.env.DEV) checkLocaleParity();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
