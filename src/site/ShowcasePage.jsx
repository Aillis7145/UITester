import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router';
import { useI18n } from '@/i18n/I18nProvider';
import { isThemeId, THEMES } from '@/theme/themes';
import { ThemeFrame } from '@/theme/ThemeFrame';
import { SCREENS, PAGE_IDS, PAGE_ICONS, isPageId } from '@/screens';
import { ScreenStateProvider } from '@/screens/screenState';
import { AppRouteProvider } from '@/screens/appRoute';
import { AppShell } from '@/screens/AppShell';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ThemeSpec } from './ThemeSpec';
import { DeviceFrame, DEVICES, DEVICE_IDS } from './DeviceFrame';
import { Icon } from '@/components/Icon';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { cn } from '@/lib/cn';

/** ย่อกรอบให้พอดีพื้นที่ว่าง แต่ไม่ขยายเกิน 1 เท่า */
function useFitScale(contentWidth) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const avail = entry.contentRect.width - 32;
      setScale(Math.min(1, avail / contentWidth));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [contentWidth]);

  return [ref, scale];
}

export function ShowcasePage() {
  const { themeId, pageId } = useParams();
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const { t, p } = useI18n();

  const [device, setDevice] = useState('desktop');
  const [full, setFull] = useState(false);
  const [state, setState] = useState({
    forceError: false,
    forceLoading: false,
    showSkeleton: false,
  });
  const [frameHeight, setFrameHeight] = useState(760);

  const width = DEVICES[device].width;
  const [fitRef, scale] = useFitScale(width);

  // ความสูงกรอบ = พื้นที่ว่างจริงในหน้าต่าง เพื่อให้เนื้อหาเลื่อนอยู่ข้างในเหมือนเครื่องจริง
  useEffect(() => {
    const measure = () => setFrameHeight(Math.max(520, window.innerHeight - 190));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Escape ออกจากโหมดเต็มจอ — เป็นทางออกที่ผู้ใช้คาดหวังเสมอเมื่อมีอะไรบังทั้งจอ
  useEffect(() => {
    if (!full) return;
    const onKey = (e) => e.key === 'Escape' && setFull(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [full]);

  /**
   * ย้ายหน้า/ธีม โดยทับ query ทีละคีย์ (ค่า null = ลบทิ้ง)
   * ?lang กับ ?live3d จึงรอดทุกครั้งโดยที่ goto ไม่ต้องรู้จักมัน
   * และ ?project / ?node ก็อยู่ต่อเวลาสลับธีม ผู้ใช้จึงไม่หลุดจากตำแหน่งที่กำลังดู
   */
  const goto = useCallback(
    (nextTheme, nextPage, params) => {
      const next = new URLSearchParams(sp);
      for (const [k, v] of Object.entries(params ?? {})) {
        if (v == null) next.delete(k);
        else next.set(k, v);
      }
      const qs = next.toString();
      navigate(`/showcase/${nextTheme}/${nextPage}${qs ? `?${qs}` : ''}`);
    },
    [navigate, sp],
  );

  if (!isThemeId(themeId) || !isPageId(pageId)) {
    return <Navigate to="/showcase/tech/login" replace />;
  }

  const Screen = SCREENS[pageId];
  const theme = THEMES[themeId];
  // หน้าจอส่งได้ทั้ง onNavigate('quiz') เฉยๆ และ onNavigate('browse', { node: id })
  const nav = (next, params) => goto(themeId, next, params);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* ---------- แถบควบคุม ---------- */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 border-b border-border px-4 py-2.5 sm:px-5">
        <ThemeSwitcher value={themeId} onChange={(id) => goto(id, pageId)} />

        <div className="seg" role="group" aria-label={t('studio.page')}>
          {PAGE_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => goto(themeId, id)}
              aria-pressed={id === pageId}
              className={cn(
                'ui-focusable flex items-center gap-1.5 rounded-ui px-2.5 py-1.5 text-sm font-medium',
                'transition-colors duration-(--dur-fast)',
                id === pageId ? 'bg-surface-2 text-text' : 'text-muted hover:text-text',
              )}
            >
              <Icon name={PAGE_ICONS[id]} size={15} />
              <span className="max-lg:sr-only">{t(`pages.${id}`)}</span>
            </button>
          ))}
        </div>

        <div className="seg" role="group" aria-label={t('nav.device')}>
          {DEVICE_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setDevice(id)}
              aria-pressed={id === device}
              title={`${t(DEVICES[id].labelKey)} · ${DEVICES[id].width}px`}
              className={cn(
                'ui-focusable rounded-ui px-2.5 py-1.5 text-sm font-medium',
                'transition-colors duration-(--dur-fast)',
                id === device ? 'bg-surface-2 text-text' : 'text-muted hover:text-text',
              )}
            >
              {DEVICES[id].width}
            </button>
          ))}
        </div>

        <fieldset className="flex flex-wrap items-center gap-4">
          <legend className="sr-only">{t('studio.stateTools')}</legend>
          <Checkbox
            label={t('studio.forceError')}
            checked={state.forceError}
            onChange={(v) => setState((s) => ({ ...s, forceError: v }))}
          />
          <Checkbox
            label={t('studio.forceLoading')}
            checked={state.forceLoading}
            onChange={(v) => setState((s) => ({ ...s, forceLoading: v }))}
          />
          <Checkbox
            label={t('studio.showSkeleton')}
            checked={state.showSkeleton}
            onChange={(v) => setState((s) => ({ ...s, showSkeleton: v }))}
          />
        </fieldset>

        <div className="ml-auto flex items-center gap-3">
          <div className="text-right max-xl:hidden">
            <p className="text-sm text-muted">
              {p(theme.name)} · {p(theme.tagline)}
              {scale < 1 && <span className="ml-2 opacity-70">{Math.round(scale * 100)}%</span>}
            </p>
            {/* ฟอนต์ ความมน และแบบกรอบของธีมที่กำลังดูอยู่ */}
            <ThemeSpec theme={theme} compact className="mt-1 justify-end" />
          </div>
          <Button
            size="sm"
            variant="subtle"
            icon="expand"
            title={t('studio.fullscreenHint')}
            aria-label={t('studio.fullscreenHint')}
            onClick={() => setFull(true)}
          >
            <span className="max-lg:sr-only">{t('studio.fullscreen')}</span>
          </Button>
        </div>
      </div>

      {/* ---------- กรอบเครื่อง ---------- */}
      <div ref={fitRef} className="flex flex-1 justify-center overflow-auto p-4">
        <DeviceFrame width={width} height={frameHeight} scale={scale}>
          {/* --frame-h ให้หน้าจอข้างในคำนวณความสูงจากกรอบเครื่องจริง ไม่ใช่ viewport ของหน้าต่าง */}
          <ThemeFrame
            themeId={themeId}
            scroll
            className="h-full"
            style={{ '--frame-h': `${frameHeight}px` }}
          >
            <ScreenStateProvider value={state}>
              <AppRouteProvider pageId={pageId} projectId={sp.get('project')} nodeId={sp.get('node')}>
                <AppShell pageId={pageId} onNavigate={nav}>
                  <Screen onNavigate={nav} />
                </AppShell>
              </AppRouteProvider>
            </ScreenStateProvider>
          </ThemeFrame>
        </DeviceFrame>
      </div>

      {/* ---------- โหมดเต็มจอ ----------
          เรนเดอร์หน้าจอเดิมโดยไม่มีกรอบเครื่องและไม่ย่อส่วน
          ใช้ ThemeFrame ตัวเดียวกับด้านบน จึงไม่มีทางแสดงผลต่างกัน */}
      {full && (
        <FullscreenView
          themeId={themeId}
          pageId={pageId}
          onClose={() => setFull(false)}
          onNavigate={nav}
          state={state}
          Screen={Screen}
          projectId={sp.get('project')}
          nodeId={sp.get('node')}
        />
      )}
    </div>
  );
}

/**
 * มุมมองเต็มจอ
 * ปุ่มปิดวางบนเลเยอร์ของสตูดิโอ (สีกลาง) ไม่ใช่ของธีม
 * เพื่อให้หาเจอเสมอไม่ว่าธีมข้างล่างจะสว่างหรือมืด
 */
function FullscreenView({ themeId, pageId, onClose, onNavigate, state, Screen, projectId, nodeId }) {
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 z-50">
      <ThemeFrame
        themeId={themeId}
        scroll
        className="h-full w-full"
        style={{ '--frame-h': '100dvh' }}
      >
        <ScreenStateProvider value={state}>
          <AppRouteProvider pageId={pageId} projectId={projectId} nodeId={nodeId}>
            <AppShell pageId={pageId} onNavigate={onNavigate}>
              <Screen onNavigate={onNavigate} />
            </AppShell>
          </AppRouteProvider>
        </ScreenStateProvider>
      </ThemeFrame>

      <div className="studio pointer-events-none fixed right-4 top-4 z-10 flex items-center gap-2">
        <span className="pointer-events-auto rounded-ui bg-surface/90 px-2.5 py-1.5 text-xs font-medium text-muted shadow-raised backdrop-blur-sm max-sm:hidden">
          Esc
        </span>
        <Button
          size="sm"
          variant="subtle"
          icon="x"
          onClick={onClose}
          className="pointer-events-auto shadow-raised"
        >
          {t('studio.exitFullscreen')}
        </Button>
      </div>
    </div>
  );
}

export default ShowcasePage;
