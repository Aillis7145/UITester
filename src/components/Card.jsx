import { cn } from '@/lib/cn';

/**
 * พื้นผิวการ์ด
 * `interactive` เปิดพฤติกรรม hover/press ของธีม (เด้ง / เรืองแสง / เงาลึกขึ้น)
 * `as` ให้เปลี่ยนเป็น <button>/<a> ได้เมื่อการ์ดทั้งใบคลิกได้
 */
export function Card({
  as: Tag = 'div',
  interactive = false,
  padded = true,
  className,
  children,
  ...rest
}) {
  return (
    <Tag
      className={cn(
        'ui-surface',
        padded && 'p-5 sm:p-6',
        interactive && 'ui-interactive ui-focusable cursor-pointer text-left',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Card;
