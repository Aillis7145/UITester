import { useI18n } from '@/i18n/I18nProvider';
import { THEMES, THEME_IDS } from '@/theme/themes';
import { cn } from '@/lib/cn';

/**
 * สลับธีมโดยคงหน้าจอเดิมไว้
 * คู่กับ PageSwitcher ที่คงธีมเดิมไว้ — กดครั้งเดียวเปลี่ยนได้ทีละแกน
 * นี่คือ interaction หลักของทั้งเว็บ
 */
export function ThemeSwitcher({ value, onChange, compact = false }) {
  const { t, p } = useI18n();

  return (
    <div className="seg" role="group" aria-label={t('studio.theme')}>
      {THEME_IDS.map((id) => {
        const theme = THEMES[id];
        const active = id === value;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange?.(id)}
            aria-pressed={active}
            title={`${p(theme.name)} — ${p(theme.tagline)}`}
            className={cn(
              'ui-focusable flex items-center gap-2 rounded-ui px-2.5 py-1.5 text-sm font-medium',
              'transition-colors duration-(--dur-fast)',
              active ? 'bg-surface-2 text-text' : 'text-muted hover:text-text',
            )}
          >
            <Swatch colors={theme.swatch} />
            {/* มี 5 ธีมแล้ว ชื่อเต็มทุกอันทำให้แถบล้นบนจอกลาง — เหลือเฉพาะที่ active บนจอเล็กลง */}
            <span className={cn(compact ? 'sr-only' : !active && 'max-xl:sr-only')}>
              {p(theme.name)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function Swatch({ colors, size = 16 }) {
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 overflow-hidden rounded-full ring-1 ring-black/20"
      style={{ width: size, height: size }}
    >
      {colors.map((c) => (
        <span key={c} className="h-full flex-1" style={{ background: c }} />
      ))}
    </span>
  );
}

export default ThemeSwitcher;
