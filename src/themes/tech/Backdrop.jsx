import { lazy, Suspense } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useOnScreen } from '@/hooks/useOnScreen';
import BackdropFallback from './BackdropFallback';

// chunk แยกของ three.js — เปิดธีมอื่นจะไม่โหลดไฟล์นี้เลย
const Backdrop3D = lazy(() => import('./Backdrop3D'));

let webglOk = null;
function supportsWebGL() {
  if (webglOk !== null) return webglOk;
  try {
    const c = document.createElement('canvas');
    webglOk = Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    webglOk = false;
  }
  return webglOk;
}

/** ด่านกรองก่อนโหลด three.js — ผ่านครบทุกเงื่อนไขเท่านั้นถึงจะโหลด */
export default function TechBackdrop({ live = true }) {
  const reduced = usePrefersReducedMotion();
  const [ref, onScreen] = useOnScreen();
  const use3D = live && !reduced && onScreen && supportsWebGL();

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <BackdropFallback />
      {use3D && (
        <Suspense fallback={null}>
          <Backdrop3D />
        </Suspense>
      )}
      {/* ชั้นหมอกทับบนสุด — ดันพื้นหลังให้ถอยไปอยู่ข้างหลังเนื้อหา
          จำเป็นเพราะอนุภาคใช้ additive blending ซึ่งจะสว่างขึ้นเรื่อยๆ ตรงที่จุดซ้อนกัน
          ถ้าไม่มีชั้นนี้ ตรงที่อนุภาคหนาแน่นจะแย่งสายตาไปจากตัวหนังสือ */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, color-mix(in oklch, var(--color-bg) 62%, transparent), color-mix(in oklch, var(--color-bg) 78%, transparent))',
        }}
      />
    </div>
  );
}
