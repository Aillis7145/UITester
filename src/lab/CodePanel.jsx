import { useI18n } from '@/i18n/I18nProvider';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { REQUIRED_TOKENS } from './registry';
import { Icon } from '@/components/Icon';
import { cn } from '@/lib/cn';

/**
 * แผงโค้ด — แสดง JSX กับ CSS คู่กันเสมอ
 * เพราะโค้ดที่คัดลอกไปต้องใช้ได้ทันที การให้แต่ JSX จะได้ปุ่มที่ไม่มีอนิเมชั่นอะไรเลย
 */
export function CodePanel({ variant }) {
  const { t } = useI18n();
  const [copiedJsx, copyJsx] = useCopyToClipboard();
  const [copiedCss, copyCss] = useCopyToClipboard();
  const [copiedAll, copyAll] = useCopyToClipboard();

  const both = variant.css ? `/* CSS */\n${variant.css.trim()}\n\n/* JSX */\n${variant.code}` : variant.code;

  return (
    <div className="lab-code border-t border-border">
      <div className="flex flex-wrap gap-2 p-3">
        <CopyButton copied={copiedJsx} onClick={() => copyJsx(variant.code)} label={t('lab.copyJsx')} />
        {variant.css && (
          <CopyButton copied={copiedCss} onClick={() => copyCss(variant.css.trim())} label={t('lab.copyCss')} />
        )}
        <CopyButton copied={copiedAll} onClick={() => copyAll(both)} label={t('lab.copyAll')} primary />
      </div>

      <div className="max-h-96 overflow-auto border-t border-border bg-black/25 p-4">
        <pre className="code-block text-text">{both}</pre>
      </div>

      <div className="border-t border-border p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {t('lab.requiresTokens')}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {REQUIRED_TOKENS.map((token) => (
            <code
              key={token}
              className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted"
            >
              {token}
            </code>
          ))}
        </div>
      </div>
    </div>
  );
}

function CopyButton({ copied, onClick, label, primary }) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'ui-interactive ui-focusable inline-flex h-8 items-center gap-1.5 rounded-ui px-3 text-sm font-medium',
        primary ? 'bg-primary text-on-primary' : 'ui-panel text-text',
      )}
    >
      <Icon name={copied ? 'check' : 'copy'} size={14} />
      {copied ? t('common.copied') : label}
    </button>
  );
}

export default CodePanel;
