import { useI18n } from '@/i18n/I18nProvider';
import { user } from '@/mock/data';
import { MenuPopover } from './MenuPopover';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Icon } from '@/components/Icon';
import { cn } from '@/lib/cn';

/**
 * เมนูโปรไฟล์บน AppBar
 *
 * แบ่งเป็นสองกลุ่มคั่นด้วยเส้น — กลุ่มบนคือของผู้เรียน กลุ่มล่างคือการตั้งค่า/ออกจากระบบ
 * การแยก "ออกจากระบบ" ไว้คนละกลุ่มและใส่สีอันตราย ลดโอกาสกดพลาดตอนรีบ
 */
const SECTIONS = [
  [
    { icon: 'user', key: 'appbar.profile' },
    { icon: 'layers', key: 'appbar.myCourses', page: 'subjects' },
    { icon: 'clock', key: 'appbar.history', page: 'history' },
    { icon: 'award', key: 'appbar.certificates', page: 'certificates' },
    { icon: 'bookmark', key: 'appbar.saved' },
  ],
  [
    { icon: 'gear', key: 'appbar.settings' },
    { icon: 'logout', key: 'common.logout', danger: true },
  ],
];

export function ProfileMenu({ onNavigate }) {
  const { t, p } = useI18n();

  return (
    <MenuPopover
      label={t('appbar.accountMenu')}
      width="w-64"
      trigger={({ toggle, ref, props }) => (
        <button
          ref={ref}
          type="button"
          onClick={toggle}
          aria-label={t('appbar.accountMenu')}
          className="ui-focusable ui-interactive rounded-full"
          {...props}
        >
          <Avatar name={p(user.name)} size="sm" />
        </button>
      )}
    >
      {({ close }) => (
        <>
          <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
            <Avatar name={p(user.name)} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{p(user.name)}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <Badge tone="primary" size="sm" icon="sparkle">
              {t('subjects.level', { n: user.level })}
            </Badge>
            <Badge tone="warn" size="sm" icon="flame">
              {t('subjects.streak', { n: user.streakDays })}
            </Badge>
          </div>

          {SECTIONS.map((section, si) => (
            <div key={si} className={cn('p-1.5', si > 0 && 'border-t border-border')}>
              {section.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    close();
                    // ปลายทางมาจากข้อมูลของรายการ ไม่ใช่จากการเทียบชื่อไอคอน
                    // เดิมเทียบไอคอนไว้ พอ "ใบประกาศ" มีหน้าจริงแล้วต้องแก้สองที่จึงจะไม่ผิด
                    if (item.page) onNavigate?.(item.page);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-ui px-2.5 py-2 text-left text-sm',
                    'transition-colors duration-(--dur-fast) hover:bg-surface-2',
                  )}
                  style={item.danger ? { color: 'var(--color-danger)' } : undefined}
                >
                  <Icon name={item.icon} size={16} className="shrink-0" />
                  {t(item.key)}
                </button>
              ))}
            </div>
          ))}
        </>
      )}
    </MenuPopover>
  );
}

export default ProfileMenu;
