import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { useThemeMeta } from '@/theme/ThemeFrame';
import { useScreenState } from './screenState';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { Checkbox } from '@/components/Checkbox';
import { IconButton } from '@/components/IconButton';
import { Icon } from '@/components/Icon';
import { cn } from '@/lib/cn';

export function LoginScreen({ onNavigate }) {
  const { t } = useI18n();
  const { decor } = useThemeMeta();
  const { forceError, forceLoading } = useScreenState();

  const [email, setEmail] = useState('nattapon.s@school.ac.th');
  const [password, setPassword] = useState('supersecret');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const loading = submitting || forceLoading;
  const error = forceError ? t('login.error') : null;

  const submit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // จำลองการรอเซิร์ฟเวอร์ เพื่อให้เห็นสถานะกำลังโหลดของแต่ละธีม
    timer.current = setTimeout(() => {
      setSubmitting(false);
      // เข้าหน้าเลือกโครงการก่อนเสมอ ไม่ข้ามไปหน้าคอร์สเลย
      // เพราะผู้เรียนอาจอยู่หลายโครงการ และแต่ละโครงการมีโครงสร้างเนื้อหาคนละแบบ
      // ล้าง ?project/?node ที่ค้างอยู่ด้วย ไม่งั้นการล็อกอินใหม่จะพาไปโครงการเดิมของรอบก่อน
      onNavigate?.('projects', { project: null, node: null });
    }, 900);
  };

  return (
    <div className="relative grid min-h-full place-items-center px-4 py-10 sm:px-6">
      {decor.LoginAside && <decor.LoginAside />}

      <div className="relative w-full max-w-105">
        <div className="ui-surface p-7 sm:p-9">
          {/* แบรนด์ */}
          <div className="mb-7 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-ui bg-primary text-on-primary">
              <Icon name="sparkle" size={22} />
            </span>
            <span className="ui-heading text-lg">{t('login.brand')}</span>
          </div>

          <h1 className="ui-heading text-3xl">{t('login.title')}</h1>
          <p className="mt-2 text-muted">{t('login.subtitle')}</p>

          <form onSubmit={submit} className="mt-7 grid gap-4">
            <Field
              type="email"
              label={t('login.email')}
              placeholder={t('login.emailPh')}
              icon="mail"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />

            <Field
              type={showPw ? 'text' : 'password'}
              label={t('login.password')}
              placeholder={t('login.passwordPh')}
              icon="lock"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error ? ' ' : undefined}
              trailing={
                <IconButton
                  icon={showPw ? 'eyeOff' : 'eye'}
                  label={showPw ? t('login.hidePassword') : t('login.showPassword')}
                  size="sm"
                  className="-mr-2"
                  onClick={() => setShowPw((v) => !v)}
                />
              }
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Checkbox label={t('login.remember')} checked={remember} onChange={setRemember} />
              <button
                type="button"
                className="ui-focusable rounded-ui text-sm font-semibold text-primary-ink underline-offset-4 hover:underline"
              >
                {t('login.forgot')}
              </button>
            </div>

            <Button type="submit" size="lg" fullWidth loading={loading} className="mt-2">
              {loading ? t('login.signingIn') : t('common.login')}
            </Button>
          </form>

          {/* ตัวคั่น */}
          <div className="my-6 flex items-center gap-3 text-sm text-muted">
            <span className="h-px flex-1 bg-border" />
            {t('login.or')}
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <SocialButton brand="google" label={t('login.google')} />
            <SocialButton brand="line" label={t('login.line')} />
          </div>

          <p className="mt-7 text-center text-sm text-muted">
            {t('login.noAccount')}{' '}
            <button
              type="button"
              className="ui-focusable rounded-ui font-semibold text-primary-ink underline-offset-4 hover:underline"
            >
              {t('login.signup')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/** ปุ่มล็อกอินโซเชียล — LINE คือช่องทางที่ใช้จริงในไทย จึงใส่แทน Facebook/Apple */
function SocialButton({ brand, label }) {
  return (
    <button
      type="button"
      className={cn(
        'ui-interactive ui-focusable ui-panel flex h-12 items-center justify-center gap-2.5 font-semibold text-text',
      )}
    >
      {brand === 'google' ? <GoogleMark /> : <LineMark />}
      {label}
    </button>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.5 5.5 0 0 1-2.4 3.6v3h3.87c2.26-2.09 3.58-5.17 3.58-8.79Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.92l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.64H1.28a12 12 0 0 0 0 10.72l3.99-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.64l3.99 3.09C6.22 6.87 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

function LineMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#06C755"
        d="M12 2C6.2 2 1.5 5.9 1.5 10.7c0 4.3 3.7 7.9 8.8 8.6.34.07.8.22.92.51.1.26.07.68.03.95l-.15.9c-.05.26-.21 1.04.91.57 1.12-.47 6.05-3.56 8.26-6.1 1.52-1.67 2.25-3.36 2.25-5.43C22.5 5.9 17.8 2 12 2Z"
      />
      <text
        x="12"
        y="13.4"
        textAnchor="middle"
        fill="#fff"
        fontSize="6.4"
        fontWeight="700"
        fontFamily="Arial, Helvetica, sans-serif"
        letterSpacing="0.2"
      >
        LINE
      </text>
    </svg>
  );
}

export default LoginScreen;
