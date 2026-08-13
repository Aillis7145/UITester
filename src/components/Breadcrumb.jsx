import { useI18n } from '@/i18n/I18nProvider';
import { Icon } from './Icon';
import { cn } from '@/lib/cn';

/**
 * เส้นทาง — ใช้ร่วมกันระหว่างหน้าไล่ระดับกับหน้าสื่อ
 *
 * ความลึกมาจากข้อมูล ไม่ได้กำหนดไว้ในคอมโพเนนต์
 * โครงการที่มี 3 ชั้นจึงได้ 5 ก้อน ส่วนโครงการ 2 ชั้นได้ 4 ก้อน โดยไม่ต้องแก้อะไรตรงนี้
 *
 * ก้อนที่ไม่มี onClick จะกลายเป็นข้อความอัตโนมัติ
 * โหมด /embed ที่ตั้งใจให้กดอะไรไม่ได้จึงถูกต้องเองโดยไม่ต้องมี prop พิเศษ
 *
 * items: [{ id, label, onClick? }] — ก้อนสุดท้ายคือตำแหน่งปัจจุบันเสมอ
 */
export function Breadcrumb({ items, className }) {
  const { t } = useI18n();
  const last = items.length - 1;

  return (
    <nav aria-label={t('common.breadcrumb')} className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        {items.map((item, i) => (
          <li key={item.id} className="flex items-center gap-1.5">
            {i > 0 && (
              <span aria-hidden="true" className="text-muted">
                <Icon name="chevronRight" size={14} />
              </span>
            )}

            {item.onClick && i !== last ? (
              <button
                type="button"
                onClick={item.onClick}
                className="ui-focusable max-w-50 truncate rounded-ui underline-offset-4 transition-colors duration-(--dur-fast) hover:text-text hover:underline"
              >
                {item.label}
              </button>
            ) : (
              <span
                aria-current={i === last ? 'page' : undefined}
                className={cn('max-w-50 truncate', i === last && 'font-medium text-text')}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
