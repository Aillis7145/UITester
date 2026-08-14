import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { useI18n } from '@/i18n/I18nProvider';
import { ALL_CSS, GROUPS, byGroup, isGroup } from './registry';
import { ControlsPanel } from './ControlsPanel';
import { VariantCard } from './VariantCard';
import { Icon } from '@/components/Icon';
import { cn } from '@/lib/cn';

const GROUP_ICONS = {
  buttons: 'sparkle',
  dropdowns: 'chevronDown',
  inputs: 'file',
  toggles: 'gear',
  loaders: 'refresh',
  iconbuttons: 'heart',
  cards: 'layers',
  frames: 'grid',
};

export function LabPage() {
  const { group, variantId } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();

  const [query, setQuery] = useState('');
  const [controls, setControls] = useState({
    themeId: 'tech',
    size: 'md',
    state: 'normal',
    slowMo: 1,
    stageBg: 'solid',
    reduceMotion: false,
  });

  // CSS ของทุก variant ยิงเข้า <style> ก้อนเดียว ไม่ใช่ก้อนละ variant
  useEffect(() => {
    const el = document.createElement('style');
    el.dataset.labVariants = 'true';
    el.textContent = ALL_CSS;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  // เลื่อนไปหา variant ที่ deep-link มา
  useEffect(() => {
    if (!variantId) return;
    const el = document.getElementById(`variant-${variantId}`);
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [variantId, group]);

  const items = useMemo(() => {
    if (!isGroup(group)) return [];
    const q = query.trim().toLowerCase();
    if (!q) return byGroup(group);
    return byGroup(group).filter((v) =>
      [v.id, v.name.th, v.name.en, ...v.tags].join(' ').toLowerCase().includes(q),
    );
  }, [group, query]);

  if (!isGroup(group)) return <Navigate to="/lab/buttons" replace />;

  return (
    <div
      className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8"
      style={{ '--dur-scale': controls.slowMo }}
      data-reduce-motion={controls.reduceMotion || undefined}
    >
      <header className="max-w-2xl">
        <h1 className="ui-heading text-2xl sm:text-3xl">{t('lab.title')}</h1>
        <p className="mt-2 text-muted">{t('lab.lead')}</p>
      </header>

      {/* ---------- กลุ่ม ---------- */}
      <nav className="mt-6 flex flex-wrap gap-2" aria-label={t('lab.title')}>
        {GROUPS.map((g) => {
          const count = byGroup(g).length;
          const active = g === group;
          return (
            <button
              key={g}
              type="button"
              disabled={count === 0}
              onClick={() => navigate(`/lab/${g}`)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'ui-interactive ui-focusable inline-flex items-center gap-2 rounded-ui px-3.5 py-2 text-sm font-medium',
                'disabled:pointer-events-none disabled:opacity-40',
                active ? 'bg-primary text-on-primary shadow-raised' : 'ui-panel text-muted',
              )}
            >
              <Icon name={GROUP_ICONS[g]} size={15} />
              {t(`lab.groups.${g}`)}
              <span className="opacity-70">{count}</span>
            </button>
          );
        })}
      </nav>

      {/* ---------- ตัวควบคุม + กริด ---------- */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <ControlsPanel
          value={controls}
          onChange={setControls}
          query={query}
          onQuery={setQuery}
        />

        <div className="min-w-0">
          <p className="mb-3 text-sm text-muted">{t('lab.variantCount', { n: items.length })}</p>

          {items.length === 0 ? (
            <div className="ui-surface grid place-items-center px-6 py-16 text-center">
              <Icon name="search" size={26} className="text-muted" />
              <p className="mt-3 text-muted">{t('lab.empty')}</p>
            </div>
          ) : (
            // หนึ่งการ์ดต่อหนึ่งแถวเสมอ ไม่แบ่งคอลัมน์
            // เวทีจึงได้ความกว้างเกือบทั้งหน้า คอมโพเนนต์ที่กว้างจริงแสดงเต็มขนาดได้
            // (เดิมแบ่งสามคอลัมน์แล้วการ์ดเหลือ ~283px จนแผงใหญ่ 24rem ยื่นพ้นขอบจอ)
            <div className="lab-grid grid gap-5">
              {items.map((variant) => (
                <VariantCard
                  key={variant.id}
                  id={`variant-${variant.id}`}
                  variant={variant}
                  themeId={controls.themeId}
                  size={controls.size}
                  state={controls.state}
                  stageBg={controls.stageBg}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LabPage;
