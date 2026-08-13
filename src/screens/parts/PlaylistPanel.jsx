import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { ContentRow } from './ContentRow';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { ProgressBar } from '@/components/ProgressBar';

/**
 * เพลย์ลิสต์ด้านข้าง — จัดกลุ่มตามกล่องพี่น้องของสื่อที่กำลังเปิด พับได้
 * รายการที่กำลังเล่นได้ --shadow-glow ของธีม จึงเด่นคนละแบบในแต่ละธีม
 *
 * รับ groups เป็น prop ไม่ import ข้อมูลเองอีกแล้ว
 * เดิมมันวน sections ทั้งก้อนโดยไม่กรองตามวิชา ซึ่งพอมีหลายโครงการ
 * หน้าสื่อของโครงการภาษาจีนจะโชว์เพลย์ลิสต์ของโครงการ AI ทั้งชุด
 *
 * groups: [{ node, items }] — node คือกล่องหัวข้อ items คือสื่อข้างใน
 */
export function PlaylistPanel({ groups, currentId, onSelect, onTakeQuiz, title }) {
  const { t, p } = useI18n();
  const [collapsed, setCollapsed] = useState(() => new Set());

  const all = groups.flatMap((g) => g.items);
  const done = all.filter((n) => n.watched).length;
  const total = all.length;

  const toggle = (id) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    // --frame-h ตั้งโดย ShowcasePage ตามความสูงกรอบเครื่องจริง
    // ใน /embed กรอบคือ viewport ของ iframe อยู่แล้ว จึงถอยไปใช้ 100dvh ได้ถูกต้อง
    <div className="ui-surface flex max-h-[calc(var(--frame-h,100dvh)-8rem)] flex-col overflow-hidden p-0 lg:sticky lg:top-6">
      <header className="border-b border-border p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="ui-heading min-w-0 truncate text-base">{title ?? t('lesson.playlist')}</h2>
          <span className="shrink-0 text-sm font-medium text-muted">
            {t('lesson.progress', { done, total })}
          </span>
        </div>
        <ProgressBar
          value={total ? done / total : 0}
          size="sm"
          className="mt-2.5"
          label={t('lesson.playlist')}
        />
      </header>

      {/* padding กว้างพอให้เงาเรืองแสงของรายการที่กำลังเล่น และเงา hover ของทุกธีม
          แสดงครบทุกด้าน — p-2 เดิมแคบเกินจนขอบแสงโดนกล่องที่เลื่อนได้ตัดทิ้ง */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3.5 py-3">
        {groups.map(({ node, items }) => {
          const isCollapsed = collapsed.has(node.id);
          const groupDone = items.filter((n) => n.watched).length;

          return (
            <section key={node.id} className="mb-1">
              <button
                type="button"
                onClick={() => toggle(node.id)}
                aria-expanded={!isCollapsed}
                className="ui-focusable flex w-full items-center gap-2 rounded-ui px-2 py-2.5 text-left transition-colors duration-(--dur-fast) hover:bg-surface-2"
              >
                <Icon
                  name="chevronDown"
                  size={16}
                  className="shrink-0 text-muted transition-transform duration-(--dur-base)"
                  style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'none' }}
                />
                <span className="ui-heading min-w-0 flex-1 truncate text-sm">{p(node.title)}</span>
                <span className="shrink-0 text-xs text-muted">
                  {groupDone}/{items.length}
                </span>
              </button>

              {/* พับด้วย grid-template-rows: 0fr → 1fr ซึ่งเป็นวิธีเดียวที่ทำ auto-height ได้ด้วย CSS ล้วน */}
              <div
                className="grid transition-[grid-template-rows] duration-(--dur-base) ease-(--ease-smooth)"
                style={{ gridTemplateRows: isCollapsed ? '0fr' : '1fr' }}
              >
                {/* ul ต้อง overflow-hidden เพื่อให้ 0fr→1fr ทำงาน แต่มันตัดเงาของรายการด้วย
                    ชดเชยด้วย -mx/px คู่กัน: กล่องกว้างขึ้นแต่ตำแหน่งเนื้อหาเท่าเดิม
                    เงาจึงมีที่วาดอยู่ในกล่องที่ถูกตัด */}
                <ul className="-mx-2 min-h-0 overflow-hidden px-2 py-1">
                  {items.map((item) => (
                    <ContentRow
                      key={item.id}
                      node={item}
                      current={item.id === currentId}
                      onSelect={onSelect}
                      showKind={false}
                    />
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>

      <footer className="border-t border-border p-3">
        <Button fullWidth icon="flag" onClick={onTakeQuiz}>
          {t('lesson.takeQuiz')}
        </Button>
      </footer>
    </div>
  );
}

export default PlaylistPanel;
