import { useI18n } from '@/i18n/I18nProvider';
import { VideoPlayerMock } from './VideoPlayerMock';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';

/**
 * เวทีของสื่อหนึ่งชิ้น — เลือกหน้าตาตามชนิดของสื่อ
 *
 * ขอบเขตที่ยอมรับตรงๆ: จำลองแค่พอให้เห็นว่าแต่ละธีมรับมือสื่อหลายชนิดยังไง
 * ไม่ได้ทำตัวเปิดไฟล์จริง เอกสารกับกิจกรรมจึงเป็นการ์ดอธิบาย ไม่ใช่ viewer
 *
 * เสียงใช้ VideoPlayerMock ตัวเดิมเพิ่ม prop เดียว ไม่แยกคอมโพเนนต์
 * เพราะสิ่งที่ต้องประเมินจริงคือแถบควบคุมที่ทาธีม ซึ่งเหมือนกันทั้งวิดีโอและเสียง
 */
export function ContentStage({ node, hue, startSec }) {
  const { t, p } = useI18n();

  if (node.kind === 'video' || node.kind === 'audio') {
    return (
      <VideoPlayerMock
        lesson={node}
        hue={hue}
        startSec={startSec}
        variant={node.kind === 'audio' ? 'audio' : 'video'}
      />
    );
  }

  const meta =
    node.kind === 'doc'
      ? t('content.pages', { n: node.pages })
      : node.kind === 'activity'
        ? t('content.estMin', { n: node.estMin })
        : t('content.quizMeta');

  return (
    <div className="ui-surface grid place-items-center px-6 py-14 text-center">
      <span
        className="grid h-16 w-16 place-items-center rounded-card"
        style={{
          background: 'color-mix(in oklch, var(--color-primary) 16%, transparent)',
          color: 'var(--color-primary-ink)',
        }}
      >
        <Icon name={node.kind === 'doc' ? 'file' : 'flask'} size={28} />
      </span>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">
        {t(`content.kind.${node.kind}`)} · {meta}
      </p>
      <h2 className="ui-heading mt-1.5 max-w-lg text-xl">{p(node.title)}</h2>
      <p className="mt-2 max-w-md text-sm text-muted">{t('content.onlyMock')}</p>

      <Button
        variant="outline"
        icon={node.kind === 'doc' ? 'download' : 'external'}
        className="mt-5"
        disabled
      >
        {node.kind === 'doc' ? t('lesson.download') : t('browse.start')}
      </Button>
    </div>
  );
}

export default ContentStage;
