import { useI18n } from '@/i18n/I18nProvider';
import { APP_NAV_IDS, PAGE_ICONS } from '@/screens';
import { ProjectMenu } from './ProjectMenu';
import { NotificationMenu } from './NotificationMenu';
import { ProfileMenu } from './ProfileMenu';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { cn } from '@/lib/cn';

/**
 * แถบเมนูของ "ตัวแอป" ไม่ใช่ของสตูดิโอ
 * มีไว้เพราะโปรเจคจริงที่มีหลายส่วนต้องมีที่ให้ผู้เรียนสลับหน้า
 * และเป็นจุดที่ธีมต่างกันชัดอีกจุดหนึ่ง (แถบติดขอบบน + เมนูที่กำลังใช้งาน)
 *
 * ไม่แสดงในหน้าล็อกอิน เพราะผู้ใช้ยังไม่ได้เข้าระบบจึงยังไม่มีเมนูให้ไป
 */
const NAV_IDS = APP_NAV_IDS;

export function AppBar({ current, onNavigate, showNav = true }) {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-30">
      {/* พื้นหลังแยกชั้นเพื่อให้เบลอกระจกของธีม tech ทำงานได้โดยไม่กระทบตัวหนังสือ */}
      <div className="ui-panel rounded-none border-x-0 border-t-0">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
          {/* แบรนด์ */}
          <button
            type="button"
            onClick={() => onNavigate?.(showNav ? 'subjects' : 'projects')}
            className="ui-focusable flex shrink-0 items-center gap-2 rounded-ui pr-1"
          >
            <span className="grid h-8 w-8 place-items-center rounded-ui bg-primary text-on-primary">
              <Icon name="sparkle" size={17} />
            </span>
            <span className="ui-heading text-sm max-md:sr-only">{t('login.brand')}</span>
          </button>

          {/* โครงการที่กำลังดูอยู่ + ทางสลับ — วางติดแบรนด์เพราะเป็นบริบทที่ครอบทุกอย่างด้านล่าง
              ซ่อนในหน้าเลือกโครงการ เพราะที่นั่นทั้งหน้าคือตัวเลือกโครงการอยู่แล้ว */}
          {showNav && <ProjectMenu onNavigate={onNavigate} />}

          {/* เมนูหลัก — เลื่อนแนวนอนได้บนจอเล็กแทนที่จะยุบเป็นแฮมเบอร์เกอร์
              เพราะมีแค่ 4 รายการ การซ่อนไว้ทำให้กดยากกว่าเดิม
              ไม่มีเมนูก็ยังต้องมี div กินที่ไว้ ไม่งั้นเครื่องมือฝั่งขวาจะเลื่อนมาชิดแบรนด์ */}
          {showNav ? (
            <nav aria-label={t('nav.pages')} className="min-w-0 flex-1">
              <ul className="flex gap-1 overflow-x-auto px-1 py-1.5">
                {NAV_IDS.map((id) => {
                  const active = id === current;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => onNavigate?.(id)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'ui-interactive ui-focusable flex shrink-0 items-center gap-1.5 rounded-ui px-3 py-2 text-sm font-semibold',
                          // ไทยไม่มีเว้นวรรคระหว่างคำ ถ้าไม่ล็อกไว้จะถูกตัดกลางคำเมื่อแถบแคบ
                          'whitespace-nowrap',
                          active
                            ? 'bg-primary text-on-primary shadow-raised'
                            : 'text-muted hover:text-text',
                        )}
                      >
                        <Icon name={PAGE_ICONS[id]} size={15} />
                        {t(`pages.${id}`)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ) : (
            <div className="flex-1" />
          )}

          {/* เครื่องมือฝั่งขวา — กระดิ่งกับโปรไฟล์กดเปิดเมนูได้จริง */}
          <div className="flex shrink-0 items-center gap-1.5">
            <IconButton icon="search" label={t('common.search')} size="sm" className="max-sm:hidden" />
            <NotificationMenu />
            <ProfileMenu onNavigate={onNavigate} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppBar;
