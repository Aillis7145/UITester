import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { ThemeFrame } from '@/theme/ThemeFrame';
import { CodePanel } from './CodePanel';
import { Badge } from '@/components/Badge';
import { Icon } from '@/components/Icon';

/**
 * การ์ดหนึ่งใบต่อหนึ่ง variant — หนึ่งใบต่อหนึ่งแถว ข้อมูลซ้าย เวทีพรีวิวขวา
 *
 * วางแบบนี้เพราะเวทีได้ความกว้างเกือบทั้งหน้า คอมโพเนนต์ที่กว้างจริง
 * (แผงใหญ่สองคอลัมน์ 24rem · ช่องค้นหาที่ขยายออก) จึงแสดงเต็มขนาดโดยไม่ต้องยื่นออกนอกการ์ด
 * และตากวาดลงมาเป็นคอลัมน์เดียว เทียบของทีละตัวได้ต่อเนื่องกว่ากริดสามคอลัมน์
 *
 * เวทีห่อด้วย ThemeFrame ของตัวเอง — จึงดู variant เดียวกันในทุกธีมได้
 * ซึ่งเป็นเหตุผลทั้งหมดที่ Lab อยู่ในเว็บเดียวกับหน้าจอตัวอย่าง
 */
export function VariantCard({ variant, themeId, size, state, stageBg, id }) {
  const { t, p } = useI18n();
  const [showCode, setShowCode] = useState(false);
  const Component = variant.Component;

  return (
    <article id={id} className="ui-surface lab-card p-0">
      {/* ข้อมูลมาก่อนเวทีใน DOM เสมอ จอแคบจึงยุบเป็นชื่อบนแล้วของอยู่ล่างเอง
          โดยไม่ต้องสลับลำดับด้วย CSS ซึ่งจะทำให้ลำดับ Tab ไม่ตรงกับที่ตาเห็น */}
      <div className="lab-card-body grid lg:grid-cols-[18rem_minmax(0,1fr)]">
        {/* ---------- ซ้าย: ข้อมูล ---------- */}
        <div className="flex flex-col gap-3 p-5">
          <h3 className="ui-heading text-base">{p(variant.name)}</h3>

          <div className="flex flex-wrap gap-1.5">
            {variant.tags.map((tag) => (
              <Badge key={tag} size="sm">
                {tag}
              </Badge>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowCode((v) => !v)}
            aria-expanded={showCode}
            // ไม่ดันปุ่มลงล่างด้วย mt-auto — การ์ดที่เวทีสูง (คอมมานด์พาเลตต์ 21rem)
            // จะทำให้ปุ่มหลุดไปอยู่คนละที่กับชื่อ อ่านแล้วไม่รู้ว่าปุ่มเป็นของอะไร
            className="ui-interactive ui-focusable ui-panel inline-flex h-8 w-fit items-center gap-1.5 px-3 text-sm font-medium"
          >
            <Icon name="code" size={14} />
            {showCode ? t('lab.hideCode') : t('lab.showCode')}
          </button>
        </div>

        {/* ---------- ขวา: เวทีพรีวิว ---------- */}
        <ThemeFrame themeId={themeId} backdrop={false}>
          {/* meta.stage = สไตล์เสริมของเวทีต่อ variant (ดู lab/registry.js)
              มีไว้ให้ variant ที่กางขึ้นบนหรือคลุมเต็มเวทีขอที่ว่างได้ตามจริง
              แทนการแฮ็ก margin ในตัว variant เอง ซึ่งทำให้การ์ดสูงผิดเพื่อนทั้งที่ยังไม่ได้กด */}
          <div className="preview-stage h-full" data-bg={stageBg} style={variant.stage}>
            <Component
              size={size}
              disabled={state === 'disabled'}
              loading={state === 'loading'}
            />
          </div>
        </ThemeFrame>
      </div>

      {showCode && <CodePanel variant={variant} />}
    </article>
  );
}

export default VariantCard;
