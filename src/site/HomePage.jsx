import { Link } from 'react-router';
import { useI18n } from '@/i18n/I18nProvider';
import { THEMES, THEME_IDS } from '@/theme/themes';
import { ThemeFrame } from '@/theme/ThemeFrame';
import { PAGE_IDS, PAGE_ICONS } from '@/screens';
import { Swatch } from './ThemeSwitcher';
import { ThemeSpec } from './ThemeSpec';
import { Badge } from '@/components/Badge';
import { Icon } from '@/components/Icon';

export function HomePage() {
  const { t, p } = useI18n();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ---------- ฮีโร่ ---------- */}
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-ink">
          {t('home.kicker')}
        </p>
        <h1 className="ui-heading mt-2 text-3xl sm:text-4xl lg:text-5xl">{t('home.title')}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{t('home.lead')}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/compare/login"
            className="ui-interactive ui-focusable inline-flex h-11 items-center gap-2 rounded-ui bg-primary px-5 font-semibold text-on-primary shadow-raised"
          >
            <Icon name="grid" size={18} />
            {t('home.compareAll', { n: THEME_IDS.length })}
          </Link>
          <Link
            to="/lab"
            className="ui-interactive ui-focusable ui-panel inline-flex h-11 items-center gap-2 px-5 font-semibold"
          >
            <Icon name="sparkle" size={18} />
            {t('home.openLab')}
          </Link>
        </div>
      </header>

      {/* ---------- หน้าจอที่มี ---------- */}
      <section className="mt-12">
        <h2 className="ui-heading text-lg">{t('home.screensTitle')}</h2>
        <ul className="mt-4 flex flex-wrap gap-2.5">
          {PAGE_IDS.map((id) => (
            <li key={id}>
              <span className="ui-panel inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium">
                <Icon name={PAGE_ICONS[id]} size={16} className="text-primary-ink" />
                {t(`pages.${id}`)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- การ์ดธีม ---------- */}
      <section className="mt-10">
        <h2 className="ui-heading text-lg">{t('home.themesTitle')}</h2>

        <div className="mt-4 grid gap-5 lg:grid-cols-3">
          {THEME_IDS.map((themeId) => {
            const theme = THEMES[themeId];
            return (
              <article key={themeId} className="ui-surface overflow-hidden p-0">
                {/* พรีวิวสด — ธีมจริงใน ThemeFrame ย่อส่วน ไม่ใช่ภาพนิ่ง */}
                <ThemeFrame
                  themeId={themeId}
                  live3d={false}
                  className="h-40 overflow-hidden"
                  aria-hidden="true"
                >
                  <div className="grid h-40 place-items-center px-6">
                    <div className="ui-surface w-full p-4">
                      <div className="h-2.5 w-1/2 rounded-full bg-current opacity-25" />
                      <div className="mt-2 h-2 w-3/4 rounded-full bg-current opacity-15" />
                      <div className="mt-4 flex gap-2">
                        <span className="h-8 flex-1 rounded-ui bg-primary shadow-raised" />
                        <span className="ui-panel h-8 w-16 rounded-ui" />
                      </div>
                    </div>
                  </div>
                </ThemeFrame>

                <div className="p-5">
                  <div className="flex items-center gap-2.5">
                    <Swatch colors={theme.swatch} size={18} />
                    <h3 className="ui-heading min-w-0 flex-1 truncate text-base">
                      {p(theme.name)}
                    </h3>
                    {theme.has3D ? (
                      <Badge tone="accent" size="sm" icon="layers">
                        {t('home.stat3d')}
                      </Badge>
                    ) : (
                      <Badge size="sm" icon="code">
                        {t('home.statCss')}
                      </Badge>
                    )}
                  </div>

                  <p className="mt-1 text-sm font-medium text-primary-ink">{p(theme.tagline)}</p>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">{p(theme.blurb)}</p>

                  {/* สเปก: ฟอนต์ ความมน และแบบกรอบ — ชื่อกรอบกดไปดูโค้ดในคลังได้ */}
                  <div className="mt-4 border-t border-border pt-4">
                    <ThemeSpec theme={theme} />
                  </div>

                  <Link
                    to={`/showcase/${themeId}/login`}
                    className="ui-interactive ui-focusable group mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-ui bg-primary font-semibold text-on-primary shadow-raised"
                  >
                    {t('home.openTheme')}
                    <Icon
                      name="arrowRight"
                      size={17}
                      className="transition-transform duration-(--dur-base) group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
