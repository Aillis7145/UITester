/**
 * ทะเบียนคอมโพเนนต์แบบอัตโนมัติ
 *
 * เทคนิคสำคัญ 2 อย่าง:
 *   1. import.meta.glob → วางไฟล์ใหม่ในโฟลเดอร์ = ลงทะเบียนเอง ไม่ต้องดูแลรายการด้วยมือ
 *   2. query: '?raw'   → โค้ดที่แสดงคือ "ซอร์สจริงของไฟล์นั้น"
 *                        จึงไม่มีทางที่โค้ดที่คัดลอกไปจะไม่ตรงกับที่เห็นบนจอ
 */
const mods = import.meta.glob('./variants/*/*.jsx', { eager: true });
const srcs = import.meta.glob('./variants/*/*.jsx', {
  eager: true,
  query: '?raw',
  import: 'default',
});

export const VARIANTS = Object.entries(mods)
  .filter(([, mod]) => mod.meta)
  .map(([path, mod]) => ({
    ...mod.meta,
    Component: mod.default,
    css: mod.css ?? '',
    code: srcs[path] ?? '',
    path,
  }))
  .sort((a, b) => a.id.localeCompare(b.id));

export const GROUPS = [
  'buttons',
  'dropdowns',
  'inputs',
  'toggles',
  'loaders',
  'iconbuttons',
  'cards',
  'frames',
];
export const DEFAULT_GROUP = 'buttons';

export const isGroup = (g) => GROUPS.includes(g);
export const byGroup = (g) => VARIANTS.filter((v) => v.group === g);

/** CSS ของทุก variant รวมเป็นก้อนเดียว — LabPage ยิงเข้า <style> ครั้งเดียวตอน mount */
export const ALL_CSS = VARIANTS.map((v) => v.css)
  .filter(Boolean)
  .join('\n');

/**
 * token ที่ variant ทุกตัวต้องมีในโปรเจคปลายทาง
 * แสดงท้าย panel คัดลอกโค้ด เพื่อไม่ให้คนเอาโค้ดไปวางแล้วงงว่าทำไมไม่ขยับ
 */
export const REQUIRED_TOKENS = [
  '--color-primary',
  '--color-on-primary',
  '--color-accent',
  '--color-surface-2',
  '--color-text',
  '--color-muted',
  '--radius-ui',
  '--shadow-raised',
  '--shadow-pressed',
  '--dur-fast',
  '--dur-base',
  '--dur-slow',
  '--ease-smooth',
  '--ease-back',
];
