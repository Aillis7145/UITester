import { cn } from '@/lib/cn';

const SIZES = { xs: 'h-7 w-7 text-xs', sm: 'h-9 w-9 text-sm', md: 'h-11 w-11', lg: 'h-14 w-14 text-lg' };

/** ตัวอักษรแรกของชื่อ — ใช้ Intl.Segmenter เพื่อไม่ตัดสระ/วรรณยุกต์ไทยขาด */
function initial(name = '') {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  try {
    const seg = new Intl.Segmenter('th', { granularity: 'grapheme' });
    return [...seg.segment(trimmed)][0]?.segment ?? trimmed[0];
  } catch {
    return trimmed[0];
  }
}

export function Avatar({ src, name = '', size = 'md', ring = false, className }) {
  return (
    <span
      className={cn(
        // พื้นวงเป็นเฉดของสีตัวหนังสือเอง ไม่ใช่ surface-2
        // เพราะ Avatar ปรากฏทั้งบนพื้นหน้าและในการ์ด ซึ่งในธีมพื้นเข้ม-การ์ดขาว
        // surface-2 จะกลายเป็นวงสว่างบนพื้นมืด แล้วตัวอักษรย่อหายไปเลย
        'relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-current/12 font-semibold text-text',
        SIZES[size],
        ring && 'ring-2 ring-primary ring-offset-2 ring-offset-bg',
        className,
      )}
      title={name || undefined}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <span aria-hidden="true">{initial(name)}</span>
      )}
    </span>
  );
}

export default Avatar;
