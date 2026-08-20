import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { useThemeMeta } from '@/theme/ThemeFrame';
import { useScreenState } from './screenState';
import { certificates, dayAt } from '@/mock/records';
import { getNode, getProject, contentCountOf } from '@/mock/nodes';
import { user } from '@/mock/data';
import { formatDate } from '@/lib/datetime';
import { CERT_W, CERT_H, certificateTokens, drawCertificate, downloadCertificate } from '@/lib/certificate';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Skeleton } from '@/components/Skeleton';

/**
 * ใบประกาศนียบัตรของคอร์สที่สอบผ่านแล้ว
 *
 * หน้านี้แสดงเฉพาะใบที่ได้จริง ไม่แสดงคอร์สที่ยังสอบไม่ผ่านเป็นช่องล็อก
 * เพราะรายการที่ยาวด้วยของที่ยังไม่ได้ทำให้ของที่ได้มาแล้วดูจางลง
 * ส่วน "ยังเหลืออีกกี่คอร์ส" มีที่อยู่แล้วบนการ์ดคอร์สในหน้าแรก
 *
 * ตัวอย่างบนหน้าจอเป็น canvas ตัวจริงที่ย่อลงมา ไม่ใช่ HTML ที่ทำเลียนแบบ
 * สิ่งที่เห็นกับไฟล์ที่โหลดจึงเป็นภาพเดียวกันเสมอโดยไม่ต้องมีใครคอยไล่ให้ตรงกัน
 */
export function CertificatesScreen() {
  const { t, p, lang } = useI18n();
  const { showSkeleton } = useScreenState();

  if (showSkeleton) return <CertificatesSkeleton />;

  // ว่างได้จริงในชีวิตจริง — ผู้เรียนที่เพิ่งสมัครยังไม่ผ่านคอร์สไหนเลย
  const items = certificates;

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 pb-24 sm:px-6 lg:px-8">
      <header>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="ui-heading text-2xl sm:text-3xl">{t('cert.title')}</h1>
          {items.length > 0 && (
            <Badge tone="primary" size="sm" icon="award">
              {t('cert.count', { n: items.length })}
            </Badge>
          )}
        </div>
        <p className="mt-2 max-w-2xl text-muted">{t('cert.lead')}</p>
      </header>

      {items.length === 0 ? (
        <div className="ui-surface mt-7 grid place-items-center px-6 py-16 text-center">
          <Icon name="award" size={28} className="text-muted" />
          <p className="mt-3 text-muted">{t('cert.none')}</p>
        </div>
      ) : (
        <ul className="mt-7 grid gap-5">
          {items.map((cert) => (
            <li key={cert.id}>
              <CertificateCard cert={cert} lang={lang} t={t} p={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CertificateCard({ cert, lang, t, p }) {
  const theme = useThemeMeta();
  const canvasRef = useRef(null);
  const hostRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const course = getNode(cert.courseId);
  const project = getProject(course.projectId);
  const passedOn = formatDate(dayAt(cert.dayOffset), lang);

  /**
   * ข้อความทุกบรรทัดแปลที่นี่ แล้วส่งเป็นข้อมูลล้วนเข้าตัววาด
   * lib/certificate.js จึงไม่ต้องรู้จัก i18n และเทสต์ตัววาดได้โดยไม่ต้องมี provider
   */
  const spec = {
    title: t('cert.docTitle'),
    subtitle: t('cert.docSubtitle'),
    forLabel: t('cert.docFor'),
    name: p(user.name),
    bodyLabel: t('cert.docBody'),
    course: p(course.title),
    meta: [
      { label: t('cert.score'), value: `${cert.score}/${cert.total}` },
      { label: t('cert.passedOn'), value: passedOn },
      { label: t('cert.lessons'), value: t('cert.lessonCount', { n: contentCountOf(course.id) }) },
    ],
    footLeft: `${t('cert.credentialId')}: ${cert.credentialId}`,
    footRight: t('cert.issuedBy', { brand: t('login.brand') }),
  };

  // วาดใหม่เมื่อธีมเปลี่ยน (object ของ provider เปลี่ยน identity) หรือเมื่อภาษาเปลี่ยน
  // และรอฟอนต์โหลดก่อน ไม่งั้นรอบแรกจะวาดด้วยฟอนต์สำรองแล้วค้างอยู่อย่างนั้น
  useEffect(() => {
    let alive = true;
    const draw = () => {
      if (!alive || !canvasRef.current || !hostRef.current) return;
      drawCertificate(canvasRef.current, spec, certificateTokens(hostRef.current), CERT_W / 2);
    };
    draw();
    document.fonts?.ready.then(draw);
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, lang, cert.id]);

  const onDownload = useCallback(async () => {
    if (!hostRef.current) return;
    setBusy(true);
    await downloadCertificate(spec, certificateTokens(hostRef.current), `${cert.credentialId}.png`);
    setBusy(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cert.credentialId, lang, theme]);

  return (
    <article ref={hostRef} className="ui-surface grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      {/* ---------- ข้อมูล ---------- */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="primary" size="sm" icon={project.icon}>
            {p(project.short)}
          </Badge>
          <Badge tone="success" size="sm" icon="check">
            {t('cert.passed')}
          </Badge>
        </div>

        <h2 className="ui-heading mt-2.5 text-xl">{p(course.title)}</h2>
        <p className="mt-1 text-sm text-muted">{p(course.subtitle)}</p>

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3.5">
          <Fact icon="calendar" label={t('cert.passedOn')} value={passedOn} />
          <Fact
            icon="trophy"
            label={t('cert.score')}
            value={`${cert.score}/${cert.total} · ${Math.round(cert.percent * 100)}%`}
          />
          <Fact icon="play" label={t('cert.lessons')} value={t('cert.lessonCount', { n: contentCountOf(course.id) })} />
          <Fact icon="file" label={t('cert.credentialId')} value={cert.credentialId} mono />
        </dl>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <Button icon="download" onClick={onDownload} disabled={busy}>
            {busy ? t('cert.preparing') : t('cert.download')}
          </Button>
        </div>
        <p className="mt-2.5 text-xs text-muted">{t('cert.downloadNote')}</p>
      </div>

      {/* ---------- ตัวอย่างใบจริง ---------- */}
      <div className="min-w-0">
        <canvas
          ref={canvasRef}
          // อัตราส่วนล็อกไว้กับขนาดจริงของใบ กล่องจึงไม่กระตุกตอน canvas วาดเสร็จ
          style={{ aspectRatio: `${CERT_W} / ${CERT_H}` }}
          className="w-full rounded-ui border border-border"
          role="img"
          aria-label={t('cert.previewAlt', { course: p(course.title) })}
        />
      </div>
    </article>
  );
}

function Fact({ icon, label, value, mono }) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-xs text-muted">
        <Icon name={icon} size={14} className="shrink-0" />
        <span className="truncate">{label}</span>
      </dt>
      <dd className={`mt-0.5 truncate text-sm font-semibold ${mono ? 'font-mono' : ''}`}>{value}</dd>
    </div>
  );
}

function CertificatesSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 pb-24 sm:px-6 lg:px-8">
      <Skeleton className="h-8 w-2/5" />
      <Skeleton className="mt-3 h-3 w-3/5" />
      <div className="mt-7 grid gap-5">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="ui-surface grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <div className="space-y-3">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-9 w-40" />
            </div>
            <Skeleton className="w-full" style={{ aspectRatio: `${CERT_W} / ${CERT_H}` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CertificatesScreen;
