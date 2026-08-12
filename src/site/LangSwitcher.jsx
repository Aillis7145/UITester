import { useI18n } from '@/i18n/I18nProvider';
import { cn } from '@/lib/cn';

const LABELS = { th: 'ไทย', en: 'EN' };

/** สลับภาษาไทย/อังกฤษ — ค่าเก็บใน localStorage แต่ ?lang ใน URL ชนะเสมอ */
export function LangSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="seg" role="group" aria-label={t('nav.language')}>
      {Object.entries(LABELS).map(([code, label]) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          lang={code}
          className={cn(
            'ui-focusable rounded-ui px-2.5 py-1.5 text-sm font-medium transition-colors duration-(--dur-fast)',
            lang === code ? 'bg-surface-2 text-text' : 'text-muted hover:text-text',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default LangSwitcher;
