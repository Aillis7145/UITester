import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router';
import { useI18n } from '@/i18n/I18nProvider';
import { THEMES, THEME_IDS } from '@/theme/themes';
import { PAGE_IDS, PAGE_ICONS, isPageId } from '@/screens';
import { DeviceFrame, DEVICES, DEVICE_IDS } from './DeviceFrame';
import { Swatch } from './ThemeSwitcher';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { cn } from '@/lib/cn';

/**
 * เทียบข้างกัน 3 ธีม
 *
 * ใช้ iframe ไม่ใช่ CSS scale ของ DOM เดียวกัน เพราะแต่ละคอลัมน์ต้องมี viewport จริงของตัวเอง
 * ไม่งั้น media query จะอ่านความกว้างหน้าต่างแม่ ทำให้ responsive breakpoint ไม่ทำงานตามที่ควร
 * ซึ่งทำลายจุดประสงค์ของเครื่องมือเทียบดีไซน์ทั้งหมด
 */
export function ComparePage() {
  const { pageId } = useParams();
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const { t, p, lang } = useI18n();

  const [device, setDevice] = useState('mobile');
  const [frameHeight, setFrameHeight] = useState(700);
  const [winWidth, setWinWidth] = useState(1440);

  useEffect(() => {
    const measure = () => {
      setFrameHeight(Math.max(480, window.innerHeight - 200));
      setWinWidth(window.innerWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  if (!isPageId(pageId)) return <Navigate to="/compare/login" replace />;

  const width = DEVICES[device].width;
  // ย่อให้ทุกธีมพอดีความกว้างหน้าต่าง แล้วเผื่อขอบกับช่องไฟไว้
  // คำนวณจากจำนวนธีมจริง ไม่ล็อกค่าไว้ เพิ่มธีมที่ 6 แล้วก็ยังพอดีเอง
  const scale = Math.min(1, (winWidth - 80) / (THEME_IDS.length * (width + 20)));

  const goto = (nextPage) => {
    const qs = sp.toString();
    navigate(`/compare/${nextPage}${qs ? `?${qs}` : ''}`);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 border-b border-border px-4 py-2.5 sm:px-5">
        <div>
          <h1 className="ui-heading text-sm">{t('compare.title')}</h1>
          <p className="text-xs text-muted max-sm:hidden">
            {t('compare.lead', { n: THEME_IDS.length })}
          </p>
        </div>

        <div className="seg" role="group" aria-label={t('studio.page')}>
          {PAGE_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => goto(id)}
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
              className={cn(
                'ui-focusable rounded-ui px-2.5 py-1.5 text-sm font-medium',
                'transition-colors duration-(--dur-fast)',
                id === device ? 'bg-surface-2 text-text' : 'text-muted hover:text-text',
              )}
            >
              {t(DEVICES[id].labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 justify-center gap-5 overflow-auto p-4">
        {THEME_IDS.map((themeId) => {
          const theme = THEMES[themeId];
          // ส่ง query ทั้งก้อนต่อไปแทนการประกอบเอง — ?project กับ ?node จึงไหลเข้า iframe ด้วย
          // ทำให้ /compare/browse?node=x เทียบ node เดียวกันครบทุกธีมได้จริง
          const q = new URLSearchParams(sp);
          q.set('lang', lang);
          q.set('live3d', '0');
          const src = `/embed/${themeId}/${pageId}?${q}`;

          return (
            <section key={themeId} className="flex flex-col gap-2.5">
              <header className="flex items-center gap-2 px-1">
                <Swatch colors={theme.swatch} />
                <span className="ui-heading min-w-0 flex-1 truncate text-sm">{p(theme.name)}</span>
                <IconButton
                  icon="external"
                  label={t('compare.openFull')}
                  size="sm"
                  onClick={() => {
                    // พา query ไปด้วย ไม่งั้นกดออกไปดูเต็มจอแล้วหลุดทั้งภาษาและตำแหน่งที่กำลังดู
                    const qs = sp.toString();
                    navigate(`/showcase/${themeId}/${pageId}${qs ? `?${qs}` : ''}`);
                  }}
                />
              </header>

              <DeviceFrame width={width} height={frameHeight / scale} scale={scale}>
                <iframe
                  src={src}
                  title={`${p(theme.name)} — ${t(`pages.${pageId}`)}`}
                  className="h-full w-full border-0"
                  loading="lazy"
                />
              </DeviceFrame>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default ComparePage;
