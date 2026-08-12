import { useI18n } from '@/i18n/I18nProvider';
import { THEMES, THEME_IDS } from '@/theme/themes';
import { Swatch } from '@/site/ThemeSwitcher';
import { Checkbox } from '@/components/Checkbox';
import { Field } from '@/components/Field';
import { cn } from '@/lib/cn';

const SIZES = ['sm', 'md', 'lg'];
const STATES = ['normal', 'disabled', 'loading'];
const SLOWMO = [1, 2, 4, 8];

/**
 * ตัวควบคุมที่มีผลกับทั้งกริดพร้อมกัน
 * slow-motion ได้มาฟรีเพราะ duration ทุกตัวเป็น token — แค่ตั้ง --dur-scale ตัวเดียว
 * และมันจำเป็นมากเวลาต้องตัดสินว่าอนิเมชั่นตัวไหนดีกว่ากัน
 */
export function ControlsPanel({ value, onChange, query, onQuery }) {
  const { t, p } = useI18n();
  const set = (patch) => onChange({ ...value, ...patch });

  return (
    <aside className="ui-surface p-4 lg:sticky lg:top-20">
      <h2 className="ui-heading text-sm">{t('lab.controls')}</h2>

      <div className="mt-4 grid gap-5">
        <Field
          type="search"
          icon="search"
          placeholder={t('lab.searchPh')}
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          size="sm"
        />

        <Group label={t('lab.previewTheme')}>
          <div className="grid gap-1">
            {THEME_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => set({ themeId: id })}
                aria-pressed={value.themeId === id}
                className={cn(
                  'ui-focusable flex items-center gap-2 rounded-ui px-2.5 py-2 text-left text-sm font-medium',
                  'transition-colors duration-(--dur-fast)',
                  value.themeId === id ? 'bg-surface-2 text-text' : 'text-muted hover:text-text',
                )}
              >
                <Swatch colors={THEMES[id].swatch} />
                <span className="min-w-0 truncate">{p(THEMES[id].name)}</span>
              </button>
            ))}
          </div>
        </Group>

        <Group label={t('lab.size')}>
          <Segmented
            options={SIZES.map((s) => ({ value: s, label: s.toUpperCase() }))}
            value={value.size}
            onChange={(v) => set({ size: v })}
          />
        </Group>

        <Group label={t('lab.state')}>
          <div className="grid gap-1">
            {STATES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => set({ state: s })}
                aria-pressed={value.state === s}
                className={cn(
                  'ui-focusable rounded-ui px-2.5 py-1.5 text-left text-sm font-medium',
                  'transition-colors duration-(--dur-fast)',
                  value.state === s ? 'bg-surface-2 text-text' : 'text-muted hover:text-text',
                )}
              >
                {t(`lab.state${s[0].toUpperCase()}${s.slice(1)}`)}
              </button>
            ))}
          </div>
        </Group>

        <Group label={t('lab.slowMo')}>
          <Segmented
            options={SLOWMO.map((n) => ({ value: n, label: `×${n}` }))}
            value={value.slowMo}
            onChange={(v) => set({ slowMo: v })}
          />
        </Group>

        <Group label={t('lab.stageBg')}>
          <Segmented
            options={[
              { value: 'solid', label: t('lab.bgSolid') },
              { value: 'checker', label: t('lab.bgChecker') },
            ]}
            value={value.stageBg}
            onChange={(v) => set({ stageBg: v })}
          />
        </Group>

        <Checkbox
          label={t('lab.reduceMotion')}
          checked={value.reduceMotion}
          onChange={(v) => set({ reduceMotion: v })}
        />
      </div>
    </aside>
  );
}

function Group({ label, children }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      {children}
    </div>
  );
}

function Segmented({ options, value, onChange }) {
  return (
    <div className="seg w-full">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={cn(
            'ui-focusable min-w-0 flex-1 truncate rounded-ui px-2 py-1.5 text-sm font-medium',
            'transition-colors duration-(--dur-fast)',
            value === opt.value ? 'bg-surface-2 text-text' : 'text-muted hover:text-text',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default ControlsPanel;
