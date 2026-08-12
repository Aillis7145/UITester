import clsx from 'clsx';

/** รวม className แบบข้าม falsy — ไม่ต้องใช้ tailwind-merge เพราะ variant ในโปรเจคนี้ไม่ทับกันเอง */
export const cn = (...args) => clsx(args);

export default cn;
