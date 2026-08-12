import { useId, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { lessonDetail, formatDuration } from '@/mock/data';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Tabs } from '@/components/Tabs';

const RESOURCE_ICON = { pdf: 'file', code: 'code', data: 'layers' };

export function LessonTabs() {
  const { t } = useI18n();
  const [tab, setTab] = useState('overview');
  const panelId = useId();

  const items = [
    { id: 'overview', label: t('lesson.overview'), icon: 'list' },
    { id: 'docs', label: t('lesson.docs'), icon: 'file' },
    { id: 'qa', label: t('lesson.qa'), icon: 'users' },
    { id: 'notes', label: t('lesson.notes'), icon: 'bookmark' },
  ];

  return (
    <section className="ui-surface overflow-hidden p-0">
      <Tabs items={items} value={tab} onChange={setTab} panelId={panelId} className="px-2 pt-1" />

      <div id={panelId} role="tabpanel" className="p-5 sm:p-6">
        {tab === 'overview' && <Overview />}
        {tab === 'docs' && <Resources />}
        {tab === 'qa' && <QA />}
        {tab === 'notes' && <Notes />}
      </div>
    </section>
  );
}

function Overview() {
  const { t, p } = useI18n();
  return (
    <div>
      <p className="leading-relaxed text-muted">{p(lessonDetail.description)}</p>

      <h3 className="ui-heading mt-6 text-base">{t('lesson.objectives')}</h3>
      <ul className="mt-3 grid gap-2.5">
        {lessonDetail.objectives.map((obj) => (
          <li key={p(obj)} className="flex items-start gap-2.5">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/20 text-success">
              <Icon name="check" size={13} strokeWidth={3} />
            </span>
            <span className="text-sm">{p(obj)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Resources() {
  const { p } = useI18n();
  return (
    <ul className="grid gap-2.5">
      {lessonDetail.resources.map((res) => (
        <li key={res.id}>
          <button
            type="button"
            className="ui-panel ui-interactive ui-focusable flex w-full items-center gap-3.5 p-3.5 text-left"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-ui bg-surface-2 text-primary-ink">
              <Icon name={RESOURCE_ICON[res.type] ?? 'file'} size={19} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{p(res.name)}</span>
              <span className="text-sm text-muted">
                {res.type.toUpperCase()} · {(res.sizeKb / 1024).toFixed(1)} MB
              </span>
            </span>
            <Icon name="download" size={19} className="shrink-0 text-muted" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function QA() {
  const { t, p } = useI18n();
  return (
    <div>
      <Button variant="outline" icon="plus" size="sm">
        {t('lesson.askQuestion')}
      </Button>

      <ul className="mt-5 grid gap-4">
        {lessonDetail.qa.map((item) => (
          <li key={item.id} className="flex gap-3">
            <Avatar name={p(item.author)} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="font-semibold">{p(item.author)}</span>
                <span className="text-xs text-muted">{p(item.askedAt)}</span>
              </div>
              <p className="mt-1 text-sm text-muted">{p(item.question)}</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="heart" size={13} />
                  {item.likes}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="users" size={13} />
                  {t('lesson.replies', { n: item.replies })}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Notes() {
  const { t, p } = useI18n();
  const [draft, setDraft] = useState('');

  return (
    <div>
      <label className="ui-inset block p-3.5">
        <span className="sr-only">{t('lesson.addNote')}</span>
        <textarea
          rows={3}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('lesson.notePh')}
          className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </label>
      <div className="mt-2.5 flex justify-end">
        <Button size="sm" icon="bookmark" disabled={!draft.trim()}>
          {t('lesson.saveNote')}
        </Button>
      </div>

      <ul className="mt-5 grid gap-3">
        {lessonDetail.notes.map((note) => (
          <li key={note.id} className="ui-panel flex gap-3 p-3.5">
            <Badge tone="primary" size="sm" className="h-fit shrink-0 font-mono">
              {formatDuration(note.atSec)}
            </Badge>
            <p className="min-w-0 flex-1 text-sm text-muted">{p(note.text)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LessonTabs;
