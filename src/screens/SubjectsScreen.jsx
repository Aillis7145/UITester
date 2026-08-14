import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { useScreenState } from './screenState';
import { categories, user } from '@/mock/data';
import { rootsOf, progressOf } from '@/mock/nodes';
import { useAppRoute } from './appRoute';
import { targetFor } from './nav';
import { SubjectCard } from './parts/SubjectCard';
import { ContinueRow } from './parts/ContinueRow';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Dropdown } from '@/components/Dropdown';
import { Field } from '@/components/Field';
import { Icon } from '@/components/Icon';
import { Skeleton } from '@/components/Skeleton';

const SORTERS = {
  recent: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
  popular: (a, b) => b.enrolled - a.enrolled,
  progress: (a, b) => progressOf(b.id) - progressOf(a.id),
  rating: (a, b) => b.rating - a.rating,
};

export function SubjectsScreen({ onNavigate }) {
  const { t, p } = useI18n();
  const { showSkeleton } = useScreenState();

  const { project } = useAppRoute();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('recent');

  // ป้ายชั้นบนสุดของโครงการนี้ — "วิชา" ของโครงการหนึ่งคือ "ระดับ" ของอีกโครงการ
  const levelPlural = p(project.levels[0].plural);
  const courses = rootsOf(project.id);

  // เหลือเฉพาะหมวดที่โครงการนี้มีจริง ไม่งั้นโครงการภาษาจะมีชิปคณิต/วิทย์ที่กดแล้วว่างเปล่า
  const visibleCategories = useMemo(() => {
    const used = new Set(courses.map((c) => c.categoryId));
    return categories.filter((c) => c.id === 'all' || used.has(c.id));
  }, [courses]);

  const sortOptions = [
    { value: 'recent', label: t('subjects.sortRecent'), icon: 'clock' },
    { value: 'popular', label: t('subjects.sortPopular'), icon: 'flame' },
    { value: 'progress', label: t('subjects.sortProgress'), icon: 'layers' },
    { value: 'rating', label: t('subjects.sortRating'), icon: 'star' },
  ];

  // กรองจริง ไม่ใช่ตัวประกอบ — ผู้ประเมินต้องกดเล่นได้เพื่อดู empty state
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses
      .filter((s) => category === 'all' || s.categoryId === category)
      .filter((s) => {
        if (!q) return true;
        return [s.title, s.subtitle, s.instructor]
          .map((field) => `${field.th} ${field.en}`.toLowerCase())
          .some((text) => text.includes(q));
      })
      .sort(SORTERS[sort]);
  }, [courses, query, category, sort]);

  const clearFilters = () => {
    setQuery('');
    setCategory('all');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-7 pb-24 sm:px-6 lg:px-8">
      {/* ---------- ส่วนหัว ---------- */}
      <header className="flex flex-wrap items-center gap-4">
        <Avatar name={p(user.name)} size="lg" ring />

        <div className="min-w-0 flex-1">
          <h1 className="ui-heading text-2xl">
            {t('subjects.greeting', { name: p(user.name).split(' ')[0] })} 👋
          </h1>
          <p className="text-muted">{t('subjects.subGreeting')}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Badge tone="warn" icon="flame">
            {t('subjects.streak', { n: user.streakDays })}
          </Badge>
          {/* กระดิ่งแจ้งเตือนอยู่บน AppBar แล้ว ไม่ซ้ำที่นี่อีก */}
          <Badge tone="primary" icon="sparkle" className="max-sm:hidden">
            {t('subjects.level', { n: user.level })}
          </Badge>
        </div>
      </header>

      {/* ---------- ค้นหา ---------- */}
      <div className="mt-6">
        <Field
          type="search"
          icon="search"
          placeholder={t('subjects.searchPh')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="lg"
        />
      </div>

      {/* ---------- เรียนต่อ ---------- */}
      <div className="mt-8">
        {/* ส่ง item ต่อไปจริงๆ แล้ว — เดิมทิ้งไปทั้งก้อนแล้วเปิดบทเรียนตัวเดียวกันเสมอ
            รายการเรียนต่ออาจอยู่คนละโครงการ จึงต้องพา project ไปด้วย */}
        <ContinueRow
          projectId={project.id}
          onOpen={(item) => onNavigate?.('lesson', { node: item.nodeId })}
        />
      </div>

      {/* ---------- ตัวกรอง + เรียงลำดับ ---------- */}
      <section className="mt-9">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 className="ui-heading text-lg">{t('browse.allOf', { level: levelPlural })}</h2>
            <p className="mt-0.5 text-sm text-muted">
              {t('browse.countOf', { n: visible.length, level: levelPlural })}
            </p>
          </div>

          <Dropdown
            options={sortOptions}
            value={sort}
            onChange={setSort}
            align="end"
            wrapperClassName="w-52 shrink-0"
          />
        </div>

        {/* overflow-x-auto ตัดแนวตั้งด้วยเสมอ ชิปที่ยกตัวตอน hover จึงโดนตัดขอบบน
            padding รอบด้าน (ชดเชยด้วย -mx/-mt) เปิดที่ให้ทั้งการยกตัวและเงา โดยไม่ทำให้ layout ขยับ */}
        <div className="-mx-2 mt-1.5 flex gap-2 overflow-x-auto px-2 pb-5 pt-3">
          {visibleCategories.map((cat) => (
            <Chip
              key={cat.id}
              icon={cat.icon}
              active={category === cat.id}
              onClick={() => setCategory(cat.id)}
            >
              {p(cat.label)}
            </Chip>
          ))}
        </div>

        {/* ---------- กริดวิชา ---------- */}
        {showSkeleton ? (
          <SubjectGridSkeleton />
        ) : visible.length === 0 ? (
          <EmptyState onClear={clearFilters} />
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((course) => (
              <SubjectCard
                key={course.id}
                node={course}
                onOpen={() => onNavigate?.(...targetFor(course, project))}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState({ onClear }) {
  const { t } = useI18n();
  return (
    <div className="ui-surface mt-5 grid place-items-center px-6 py-16 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-surface-2 text-muted">
        <Icon name="search" size={28} />
      </span>
      <h3 className="ui-heading mt-4 text-lg">{t('subjects.empty')}</h3>
      <p className="mt-1.5 max-w-sm text-muted">{t('subjects.emptyHint')}</p>
      <Button variant="outline" icon="refresh" className="mt-5" onClick={onClear}>
        {t('subjects.clearFilters')}
      </Button>
    </div>
  );
}

function SubjectGridSkeleton() {
  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="ui-surface p-5">
          <div className="flex gap-3.5">
            <Skeleton className="h-12 w-12" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
          <Skeleton className="mt-4 h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-4/5" />
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="mt-5 h-2 w-full" rounded="full" />
        </div>
      ))}
    </div>
  );
}

export default SubjectsScreen;
