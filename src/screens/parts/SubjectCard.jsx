import { useI18n } from '@/i18n/I18nProvider';
import { splitMinutes } from '@/mock/data';
import { contentCountOf, progressOf, getProject } from '@/mock/nodes';
import { Badge } from '@/components/Badge';
import { Icon } from '@/components/Icon';
import { ProgressBar } from '@/components/ProgressBar';
import { Avatar } from '@/components/Avatar';

/**
 * การ์ดวิชา — ภาพประกอบเต็มความกว้างด้านบน
 * ภาพเป็นสิ่งแรกที่ผู้เรียนใช้คัดว่าจะสนใจคอร์สไหน จึงให้พื้นที่มันมากที่สุด
 *
 * ป้ายบนภาพใช้พื้นทึบของตัวเอง ไม่ใช่ token ของธีม
 * เพราะภาพถ่ายมีสีอะไรก็ได้ ป้ายที่โปร่งใสจะอ่านไม่ออกบนภาพสว่าง
 */
export function SubjectCard({ node, onOpen }) {
  const { t, p } = useI18n();
  const { h, m } = splitMinutes(node.durationMin);
  // ความคืบหน้ากับจำนวนสื่อคิดจากต้นไม้จริง ไม่ใช่ตัวเลขที่เขียนติดไว้กับการ์ด
  // ตัวเลขที่เขียนติดไว้มีโอกาสไม่ตรงกับของจริงเสมอ และเคยไม่ตรงมาแล้ว
  const progress = progressOf(node.id);
  const total = contentCountOf(node.id);
  // หาวิชาเองจาก projectId ไม่รับเป็น prop — BrowseScreen จึงไม่ต้องรู้เรื่องนี้เลย
  const subject = getProject(node.projectId);

  return (
    <article
      className="ui-surface ui-interactive ui-focusable group flex cursor-pointer flex-col overflow-hidden p-0 text-left"
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen?.();
        }
      }}
    >
      {/* ---------- ภาพประกอบ ---------- */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-surface-2">
        <img
          src={node.cover}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-(--dur-slow) ease-(--ease-smooth) group-hover:scale-105"
        />

        {/* ไล่เฉดมืดด้านล่างเพื่อให้ป้ายเวลาอ่านออกบนภาพทุกแบบ */}
        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-black/25" />

        {/* แท็กวิชา — อยู่บนภาพ ไม่ใช่ในแถวแท็กด้านล่าง

            แถวแท็กด้านล่างตอบว่า "ข้างในมีอะไร" ส่วนวิชาตอบว่า "การ์ดนี้มาจากสินค้าตัวไหน"
            ถ้ารวมแถวเดียวกัน ลูกค้าที่ซื้อหลายวิชาจะเห็น "คณิต" น้ำหนักเท่ากับ "หลักสูตรแกนกลาง"
            แล้วการรวมกริดอ่านไม่ออกพอดีในเคสที่มันมีอยู่เพื่อสิ่งนั้น

            ใช้พื้นทึบของตัวเองเหมือนป้ายเวลาข้างล่าง ไม่ใช่ Badge tone="neutral"
            เพราะ Badge พึ่ง --color-surface-2 ซึ่งบางธีมโปร่งจนอ่านไม่ออกบนภาพสว่าง */}
        <span className="absolute right-3 top-3 inline-flex max-w-[45%] items-center gap-1.5 rounded-ui bg-black/65 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          <Icon name={subject.icon} size={12} className="shrink-0" />
          <span className="truncate">{p(subject.short)}</span>
        </span>

        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-ui bg-primary px-2.5 py-1 text-xs font-bold text-on-primary shadow-raised">
          <Icon name={node.icon} size={13} />
          {p(node.difficulty)}
        </span>

        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-ui bg-black/65 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <Icon name="clock" size={12} />
          {h} {t('common.hourShort')} {m} {t('common.minuteShort')}
        </span>

        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-ui bg-black/65 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          <Icon name="star" size={12} />
          {node.rating.toFixed(1)}
        </span>
      </div>

      {/* ---------- เนื้อหา ---------- */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="ui-heading line-clamp-2 text-base">{p(node.title)}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted">{p(node.subtitle)}</p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {node.tags.map((tag) => (
            <Badge key={p(tag)} size="sm">
              {p(tag)}
            </Badge>
          ))}
        </div>

        <div className="mt-3.5 flex items-center gap-2">
          <Avatar name={p(node.instructor)} size="xs" />
          <span className="min-w-0 flex-1 truncate text-sm text-muted">
            {p(node.instructor)}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted">
            <Icon name="list" size={12} />
            {total}
          </span>
        </div>

        <div className="mt-auto pt-4">
          {/* ไม่ส่ง caption — โจทย์ระบุว่าทุกแถบต้องกำกับด้วยคำว่า "ความคืบหน้า"
              เดิมตรงนี้เขียน "เริ่มเรียน / เรียนต่อ" ซึ่งเป็นคำเชิญชวน ไม่ใช่ชื่อของสิ่งที่แถบวัด */}
          <ProgressBar value={progress} size="sm" showLabel />
        </div>
      </div>
    </article>
  );
}

export default SubjectCard;
