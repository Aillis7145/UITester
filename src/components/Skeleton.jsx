import { cn } from '@/lib/cn';

/**
 * โครงร่างระหว่างโหลด
 * ใช้ currentColor + opacity แทนสีตายตัว จึงอ่านออกทั้งบนธีมสว่างและธีมมืด
 */
export function Skeleton({ className, rounded = 'ui', ...rest }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden bg-current opacity-10',
        rounded === 'full' ? 'rounded-full' : rounded === 'card' ? 'rounded-card' : 'rounded-ui',
        className,
      )}
      {...rest}
    >
      <style>{`@keyframes skeleton-sweep { to { translate: 200% 0 } }`}</style>
      <span
        className="absolute inset-y-0 left-0 w-1/2"
        style={{
          background: 'linear-gradient(90deg, transparent, rgb(255 255 255 / .35), transparent)',
          translate: '-100% 0',
          animation: 'skeleton-sweep 1.4s var(--ease-smooth) infinite',
        }}
      />
    </div>
  );
}

export default Skeleton;
