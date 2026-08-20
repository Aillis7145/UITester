import { useI18n } from '@/i18n/I18nProvider';
import { useScreenState } from './screenState';
import { useAppRoute } from './appRoute';
import { targetFor, crumbsFor } from './nav';
import {
  childrenOf,
  nextLevel,
  levelDef,
  contentCountOf,
  progressOf,
  resumeContentOf,
} from '@/mock/nodes';
import { SubjectCard } from './parts/SubjectCard';
import { NodeCard } from './parts/NodeCard';
import { ContentRow } from './parts/ContentRow';
import { Badge } from '@/components/Badge';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { ProgressBar } from '@/components/ProgressBar';
import { Skeleton } from '@/components/Skeleton';

/**
 * หน้าไล่ระดับ — หน้าเดียวที่รับได้ทุกชั้นของทุกโครงการ
 *
 * นี่คือจุดที่ทำให้ "flow ไม่ตายตัว" เป็นจริง
 * โครงการ 3 ชั้นเข้าหน้านี้ 2 ครั้ง โครงการ 2 ชั้นเข้า 1 ครั้ง (= levels.length - 1)
 * เพราะกล่องชั้นล่างสุดตัดตรงไปหน้าสื่อซึ่งมีลิสต์อยู่ข้างแล้ว — ดู targetFor ใน nav.js
 * ไม่มีเงื่อนไขไหนในโค้ดรู้เลขพวกนี้ สิ่งเดียวที่หน้านี้ถามคือ
 * "ชั้นถัดจากชั้นของ node นี้คืออะไร" ซึ่งตอบโดย projects.js
 *
 * กิ่ง isLeafList ยังอยู่เพื่อรองรับการลิงก์ตรงเข้ากล่องชั้นล่างสุด
 * (สตูดิโอเปิด /showcase/x/browse ได้ทุกเมื่อ) แต่การกดตามปกติจะไม่ผ่านทางนี้แล้ว
 */
export function BrowseScreen({ onNavigate }) {
  const { t, p } = useI18n();
  const { showSkeleton } = useScreenState();
  const { project, node } = useAppRoute();

  if (showSkeleton) return <BrowseSkeleton />;

  // undefined = โครงการไม่ได้ประกาศชั้นของ node นี้ไว้ (เกิดได้ถ้าถอดชั้นออกจาก levels[]
  // ทั้งที่ยังมี node ชั้นนั้นค้างอยู่) แสดงสถานะว่างแทนการพังทั้งหน้า
  const childLevel = nextLevel(project, node.level);
  const isLeafList = childLevel === 'content';
  const childDef = isLeafList ? null : levelDef(project, childLevel);
  const orphaned = !isLeafList && !childDef;
  const children = orphaned ? [] : childrenOf(node.id);
  const childLabel = isLeafList ? p(project.contentLabel) : (p(childDef?.label) ?? '');
  const childPlural = isLeafList ? p(project.contentLabel) : (p(childDef?.plural) ?? '');

  const ownDef = levelDef(project, node.level);
  const progress = progressOf(node.id);
  const resume = resumeContentOf(node.id);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-24 sm:px-6 lg:px-8">
      <Breadcrumb items={crumbsFor({ project, node, onNavigate, p, t })} />

      {/* ---------- หัวเรื่องของกล่องที่กำลังเปิดอยู่ ---------- */}
      <header className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {ownDef ? `${p(ownDef.label)} ${node.order}` : p(project.name)}
        </p>
        {/* แท็กวิชาข้างหัวเรื่อง — เป็นที่ที่สองและที่สุดท้ายที่วิชาโผล่ในแอป (อีกที่คือบนการ์ด)
            เส้นทางด้านบนขึ้นต้นด้วย "คอร์สทั้งหมด" เสมอ จึงไม่ได้บอกว่ากำลังอยู่วิชาไหน */}
        <div className="mt-1 flex flex-wrap items-center gap-2.5">
          <h1 className="ui-heading text-2xl sm:text-3xl">{p(node.title)}</h1>
          <Badge tone="primary" size="sm" icon={project.icon}>
            {p(project.short)}
          </Badge>
        </div>
        {node.subtitle && <p className="mt-2 max-w-2xl text-muted">{p(node.subtitle)}</p>}

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <ProgressBar value={progress} size="sm" showLabel className="min-w-52 flex-1" />
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <Icon name="list" size={14} />
            {t('browse.inside', { n: contentCountOf(node.id) })}
          </span>
          {resume && (
            <Button
              size="sm"
              icon="play"
              onClick={() => onNavigate?.(...targetFor(resume))}
              className="shrink-0"
            >
              {progress > 0 ? t('browse.resume') : t('browse.start')}
            </Button>
          )}
        </div>
      </header>

      {/* ---------- ลูก ---------- */}
      <section className="mt-7">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="ui-heading text-lg">{t('browse.allOf', { level: childPlural })}</h2>
          <span className="text-sm text-muted">
            {t('browse.countOf', { n: children.length, level: childPlural })}
          </span>
        </div>

        {children.length === 0 ? (
          <div className="ui-surface grid place-items-center px-6 py-16 text-center">
            <Icon name="search" size={26} className="text-muted" />
            <p className="mt-3 text-muted">{t('browse.emptyOf', { level: childPlural })}</p>
          </div>
        ) : isLeafList ? (
          // ชั้นใบไม้ — ใช้แถวเดียวกับเพลย์ลิสต์ในหน้าสื่อ
          <ul className="ui-surface space-y-0.5 p-2">
            {children.map((child) => (
              <ContentRow
                key={child.id}
                node={child}
                onSelect={(n) => onNavigate?.(...targetFor(n))}
              />
            ))}
          </ul>
        ) : childLevel === 'course' ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {children.map((child) => (
              <SubjectCard
                key={child.id}
                node={child}
                onOpen={() => onNavigate?.(...targetFor(child))}
              />
            ))}
          </div>
        ) : (
          // คอลัมน์ชุดเดียวกับกริดคอร์สในหน้า subjects โดยตั้งใจ
          // การ์ดหน่วยมีรูปปกแล้ว จึงควรกวาดตาแบบเดียวกัน ไม่ใช่สองคอลัมน์กว้างๆ
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {children.map((child) => (
              <NodeCard
                key={child.id}
                node={child}
                levelLabel={childLabel}
                onOpen={() => onNavigate?.(...targetFor(child))}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function BrowseSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-24 sm:px-6 lg:px-8">
      <Skeleton className="h-4 w-64" />
      <Skeleton className="mt-3 h-8 w-80" />
      <Skeleton className="mt-3 h-2 w-full max-w-md" />
      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="ui-surface flex items-start gap-4 p-4">
            <Skeleton className="h-12 w-12 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-2 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrowseScreen;
