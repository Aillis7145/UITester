import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { ThemeFrame } from '@/theme/ThemeFrame';
import { CodePanel } from './CodePanel';
import { Badge } from '@/components/Badge';
import { Icon } from '@/components/Icon';
import { cn } from '@/lib/cn';

/**
 * การ์ดหนึ่งใบต่อหนึ่ง variant
 * เวทีพรีวิวห่อด้วย ThemeFrame ของตัวเอง — จึงดู variant เดียวกันในทั้ง 3 ธีมได้
 * ซึ่งเป็นเหตุผลทั้งหมดที่ Lab อยู่ในเว็บเดียวกับหน้าจอตัวอย่าง
 */
export function VariantCard({ variant, themeId, size, state, stageBg, id }) {
  const { t, p } = useI18n();
  const [showCode, setShowCode] = useState(false);
  const Component = variant.Component;

  return (
    <article id={id} className="ui-surface lab-card p-0">
      {/* ---------- เวทีพรีวิว ---------- */}
      <ThemeFrame themeId={themeId} backdrop={false}>
        {/* meta.stage = สไตล์เสริมของเวทีต่อ variant (ดู lab/registry.js)
            มีไว้ให้ variant ที่กางขึ้นบนหรือคลุมเต็มเวทีขอที่ว่างได้ตามจริง
            แทนการแฮ็ก margin ในตัว variant เอง ซึ่งทำให้การ์ดสูงผิดเพื่อนทั้งที่ยังไม่ได้กด */}
        <div className="preview-stage" data-bg={stageBg} style={variant.stage}>
          <Component
            size={size}
            disabled={state === 'disabled'}
            loading={state === 'loading'}
          />
        </div>
      </ThemeFrame>

      {/* ---------- ข้อมูล ---------- */}
      <div className="flex flex-wrap items-start gap-3 p-4">
        <div className="min-w-0 flex-1">
          <h3 className="ui-heading text-base">{p(variant.name)}</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {variant.tags.map((tag) => (
              <Badge key={tag} size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCode((v) => !v)}
          aria-expanded={showCode}
          className={cn(
            'ui-interactive ui-focusable ui-panel inline-flex h-8 shrink-0 items-center gap-1.5 px-3 text-sm font-medium',
          )}
        >
          <Icon name="code" size={14} />
          {showCode ? t('lab.hideCode') : t('lab.showCode')}
        </button>
      </div>

      {showCode && <CodePanel variant={variant} />}
    </article>
  );
}

export default VariantCard;
