import { Link } from 'react-router';
import { useI18n } from '@/i18n/I18nProvider';
import { Icon } from '@/components/Icon';
import { cn } from '@/lib/cn';

/**
 * ตารางสเปกของธีม — ฟอนต์ ความมน และแบบกรอบ
 *
 * ข้อมูลมาจาก THEMES[id].spec ซึ่งเป็นแค่คำอธิบาย ค่าจริงอยู่ในไฟล์ CSS ของธีม
 * ชื่อกรอบลิงก์ตรงไปยัง variant ในคลัง เพื่อให้กดดูโค้ดของกรอบนั้นได้ทันที
 */
export function ThemeSpec({ theme, compact = false, className }) {
  const { t, p } = useI18n();
  const s = theme.spec;
  if (!s) return null;

  const sameFont = s.fontDisplay === s.fontSans;

  const rows = [
    {
      icon: 'file',
      label: t('spec.font'),
      value: sameFont ? s.fontDisplay : `${s.fontDisplay} / ${s.fontSans}`,
      note: p(s.fontNote),
    },
    { icon: 'layers', label: t('spec.radius'), value: s.radius },
    {
      icon: 'grid',
      label: t('spec.frame'),
      value: p(s.frame),
      to: `/lab/frames/${s.frameId}`,
    },
  ];

  if (compact) {
    return (
      <dl className={cn('flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted', className)}>
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-1.5">
            <Icon name={r.icon} size={12} className="opacity-70" />
            <dt className="sr-only">{r.label}</dt>
            <dd className="font-medium text-text">{r.value}</dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <dl className={cn('grid gap-2 text-sm', className)}>
      {rows.map((r) => (
        <div key={r.label} className="flex items-start gap-2">
          <Icon name={r.icon} size={14} className="mt-0.5 shrink-0 text-muted" />
          <dt className="w-16 shrink-0 text-muted">{r.label}</dt>
          <dd className="min-w-0 flex-1">
            {r.to ? (
              <Link
                to={r.to}
                className="ui-focusable rounded-ui font-medium text-primary-ink underline-offset-4 hover:underline"
              >
                {r.value}
              </Link>
            ) : (
              <span className="font-medium">{r.value}</span>
            )}
            {r.note && <span className="ml-1.5 text-xs text-muted">· {r.note}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default ThemeSpec;
