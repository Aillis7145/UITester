import { useI18n } from '@/i18n/I18nProvider';
import { contentCountOf, progressOf, courseOf } from '@/mock/nodes';
import { Icon } from '@/components/Icon';
import { ProgressBar } from '@/components/ProgressBar';

/**
 * การ์ดของกล่องชั้นกลาง (ภาคเรียน / บท / หมวด / หน่วย)
 *
 * รูปทรงเดียวกับ SubjectCard โดยตั้งใจ — ปกเต็มความกว้างด้านบน ข้อมูลด้านล่าง
 * เพราะหน้าไล่ระดับกับหน้าคอร์สคือ "กริดของสิ่งที่กดเข้าไปได้" เหมือนกัน
 * การใช้คนละทรงทำให้ผู้เรียนต้องเรียนรู้วิธีกวาดตาใหม่ทั้งที่เป็นงานเดียวกัน
 *
 * แยกไฟล์จาก SubjectCard ต่อไป เพราะกล่องชั้นกลางไม่มี rating / instructor /
 * durationMin / tags ให้แสดง การยัด SubjectCard มาใช้จะได้การ์ดที่มีช่องว่างหลายช่อง
 *
 * levelLabel ส่งเข้ามาจากหน้าจอ เพราะชื่อชั้นเป็นของวิชา ไม่ใช่ของคอมโพเนนต์
 */
export function NodeCard({ node, levelLabel, onOpen }) {
  const { t, p } = useI18n();
  const total = contentCountOf(node.id);
  const progress = progressOf(node.id);
  const done = progress >= 1;

  // หลักสูตรจริงตั้งชื่อหน่วยเองซึ่งบางทีขึ้นต้นด้วยชื่อชั้นอยู่แล้ว ("ภาคเรียนที่ 1")
  // ปล่อยไว้จะได้ป้าย "ภาคเรียน 1" ทับชื่อ "ภาคเรียนที่ 1" ซึ่งอ่านซ้ำสองรอบ
  // เหลือแค่เลขลำดับก็พอ เพราะเลขคือสิ่งที่ผู้เรียนใช้อ้างอิงกันจริงอยู่แล้ว
  const numbered = p(node.title).startsWith(levelLabel);
  const badge = numbered ? String(node.order) : `${levelLabel} ${node.order}`;

  // กล่องชั้นที่ลึกกว่าหน่วยไม่มีปกของตัวเอง — ยืมของคอร์สแทนการโชว์กล่องเทาเปล่า
  const cover = node.cover ?? courseOf(node.id)?.cover;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen?.();
        }
      }}
      className="ui-surface ui-interactive ui-focusable group flex cursor-pointer flex-col overflow-hidden p-0 text-left"
    >
      {/* ---------- ปก ---------- */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-surface-2">
        <img
          src={cover}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-(--dur-slow) ease-(--ease-smooth) group-hover:scale-105"
        />

        {/* ไล่เฉดมืดทั้งบนและล่างเพื่อให้ป้ายอ่านออกบนภาพทุกแบบ */}
        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-black/25" />

        <span className="absolute left-3 top-3 inline-flex items-center rounded-ui bg-primary px-2.5 py-1 text-xs font-bold tabular-nums text-on-primary shadow-raised">
          {badge}
        </span>

        {done && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-ui bg-black/65 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Icon name="check" size={12} strokeWidth={3} />
            {t('browse.done')}
          </span>
        )}

        {/* ป้ายจำนวนใช้พื้นทึบของตัวเอง ไม่ใช่ token ของธีม
            เพราะภาพถ่ายมีสีอะไรก็ได้ ป้ายโปร่งใสจะอ่านไม่ออกบนภาพสว่าง */}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-ui bg-black/65 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <Icon name="list" size={12} />
          {t('browse.inside', { n: total })}
        </span>
      </div>

      {/* ---------- ข้อมูล ---------- */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="ui-heading line-clamp-2 text-base">{p(node.title)}</h3>

        {/* mt-auto ดันแถบลงล่างสุดเสมอ การ์ดที่ชื่อสั้นกับชื่อยาวจึงมีแถบตรงระดับเดียวกัน */}
        <div className="mt-auto pt-4">
          <ProgressBar value={progress} size="sm" showLabel />
        </div>
      </div>
    </article>
  );
}

export default NodeCard;
