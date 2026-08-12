import { Link } from 'react-router';
import { useI18n } from '@/i18n/I18nProvider';
import { Icon } from '@/components/Icon';

export function NotFoundPage() {
  const { t } = useI18n();
  return (
    <div className="grid flex-1 place-items-center px-4 py-20 text-center">
      <div>
        <span className="grid h-16 w-16 place-items-center rounded-full bg-surface-2 text-muted">
          <Icon name="search" size={28} />
        </span>
        <h1 className="ui-heading mt-5 text-2xl">{t('studio.notFound')}</h1>
        <Link
          to="/"
          className="ui-interactive ui-focusable mt-6 inline-flex h-11 items-center gap-2 rounded-ui bg-primary px-5 font-semibold text-on-primary shadow-raised"
        >
          <Icon name="arrowLeft" size={17} />
          {t('studio.backHome')}
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
