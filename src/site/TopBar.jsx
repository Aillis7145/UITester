import { NavLink, useLocation } from 'react-router';
import { useI18n } from '@/i18n/I18nProvider';
import { LangSwitcher } from './LangSwitcher';
import { Icon } from '@/components/Icon';
import { cn } from '@/lib/cn';

const LINKS = [
  { to: '/', end: true, icon: 'palette', key: 'nav.home' },
  { to: '/showcase', icon: 'layers', key: 'nav.showcase' },
  { to: '/compare', icon: 'grid', key: 'nav.compare' },
  { to: '/lab', icon: 'sparkle', key: 'nav.lab' },
];

/** แถบบนของสตูดิโอ — ไม่ทาธีม ใช้สีกลางตลอด */
export function TopBar({ children }) {
  const { t } = useI18n();
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-3 px-4 py-2.5 sm:px-5">
        <NavLink to="/" className="ui-focusable flex shrink-0 items-center gap-2 rounded-ui pr-2">
          <span className="grid h-8 w-8 place-items-center rounded-ui bg-primary text-on-primary">
            <Icon name="palette" size={18} />
          </span>
          <span className="ui-heading text-sm max-sm:sr-only">UITester</span>
        </NavLink>

        <nav className="seg" aria-label={t('nav.home')}>
          {LINKS.map((link) => {
            const active = link.end ? pathname === '/' : pathname.startsWith(link.to);
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={cn(
                  'ui-focusable flex items-center gap-1.5 rounded-ui px-2.5 py-1.5 text-sm font-medium',
                  'transition-colors duration-(--dur-fast)',
                  active ? 'bg-surface-2 text-text' : 'text-muted hover:text-text',
                )}
              >
                <Icon name={link.icon} size={15} />
                <span className="max-md:sr-only">{t(link.key)}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          {children}
          <LangSwitcher />
        </div>
      </div>
    </header>
  );
}

export default TopBar;
