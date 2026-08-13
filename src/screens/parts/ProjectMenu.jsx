import { useI18n } from '@/i18n/I18nProvider';
import { projects } from '@/mock/projects';
import { useAppRoute } from '../appRoute';
import { MenuPopover } from './MenuPopover';
import { Icon } from '@/components/Icon';
import { cn } from '@/lib/cn';

/**
 * ตัวสลับโครงการบน AppBar
 *
 * สร้างบน MenuPopover ตัวเดียวกับเมนูแจ้งเตือนและโปรไฟล์
 * พฤติกรรมการปิด (คลิกนอกกรอบ / Escape / คืนโฟกัส) จึงเหมือนกันเป๊ะโดยไม่ต้องเขียนซ้ำ
 *
 * แต่ละแถวโชว์บันไดชั้นของโครงการนั้นเป็นบรรทัดรอง
 * ผู้ใช้จึงรู้ก่อนกดว่าโครงการนั้นลึกกี่ชั้นและเรียกชั้นว่าอะไร
 */
export function ProjectMenu({ onNavigate }) {
  const { t, p } = useI18n();
  const { project: current } = useAppRoute();

  return (
    <MenuPopover
      label={t('project.switch')}
      width="w-72"
      trigger={({ open, toggle, ref, props }) => (
        <button
          ref={ref}
          type="button"
          onClick={toggle}
          aria-label={`${t('project.switch')} — ${p(current.name)}`}
          className="ui-interactive ui-focusable ui-panel flex min-w-0 shrink items-center gap-1.5 rounded-ui px-2.5 py-1.5 text-sm font-semibold max-lg:hidden"
          {...props}
        >
          <Icon name={current.icon} size={14} />
          <span className="min-w-0 max-w-32 truncate">{p(current.name)}</span>
          <Icon
            name="chevronDown"
            size={13}
            className="shrink-0 transition-transform duration-(--dur-fast)"
            style={{ rotate: open ? '180deg' : '0deg' }}
          />
        </button>
      )}
    >
      {({ close }) => (
        <ul className="p-1.5" role="none">
          {projects.map((project) => {
            const active = project.id === current.id;
            const ladder = [...project.levels.map((l) => p(l.plural)), p(project.contentLabel)];

            return (
              <li key={project.id}>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    close();
                    // ล้าง node บังคับ ไม่งั้น node ของโครงการเดิมค้างอยู่ใน URL
                    onNavigate?.('subjects', { project: project.id, node: null });
                  }}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-ui p-2.5 text-left',
                    'transition-colors duration-(--dur-fast) hover:bg-surface-2',
                  )}
                >
                  <span
                    className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-ui"
                    style={{
                      background: 'color-mix(in oklch, var(--color-primary) 16%, transparent)',
                      color: 'var(--color-primary-ink)',
                    }}
                  >
                    <Icon name={project.icon} size={16} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className={cn('block truncate text-sm', active && 'font-semibold')}>
                        {p(project.name)}
                      </span>
                      {active && (
                        <span className="shrink-0 text-primary-ink">
                          <Icon name="check" size={14} />
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted">
                      {ladder.join(' › ')}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </MenuPopover>
  );
}

export default ProjectMenu;
