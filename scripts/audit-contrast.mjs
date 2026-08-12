/**
 * ตรวจ contrast ของทุกธีมด้วยเบราว์เซอร์จริง
 * ต้องรัน `npm run dev` ค้างไว้ก่อน
 *
 * วัดจากธาตุจริงที่วางไว้ "ใน" [data-theme] แล้วอ่านค่าที่ engine คำนวณแล้ว
 * เพราะ token หลายตัวชี้ต่อไปยัง token อื่น (เช่น neu ตั้ง --color-surface: var(--color-bg))
 * การอ่านสตริงดิบจาก getPropertyValue จะได้ 'var(--color-bg)' ซึ่งไปแก้ผิดบริบท
 *
 * ธีม tech ใช้พื้นผิวโปร่งแสง จึงต้องผสมสีกับพื้นข้างหลังก่อน
 * ไม่งั้นจะวัดค่าที่ไม่มีอยู่จริงบนจอ
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://localhost:5173';

// อ่านรายชื่อธีมจากโฟลเดอร์ เพิ่มธีมใหม่แล้วถูกตรวจอัตโนมัติ
const THEMES = fs
  .readdirSync('src/styles/themes')
  .filter((f) => f.endsWith('.css'))
  .map((f) => f.replace(/\.css$/, ''));

// [ชื่อ, token ตัวอักษร, token พื้นหลัง, เกณฑ์]
// 4.5 = ข้อความปกติ (WCAG AA) · 3.0 = ข้อความใหญ่และองค์ประกอบ UI
const PAIRS = [
  // ---- เนื้อหาที่วางตรงบนพื้นหน้า (หัวข้อ คำทักทาย breadcrumb) ----
  ['text on bg', '--color-text', '--color-bg', 4.5],
  ['muted on bg', '--color-muted', '--color-bg', 4.5],
  ['primary-ink on bg', '--color-primary-ink', '--color-bg', 4.5],

  // ---- เนื้อหาที่อยู่ในการ์ด ซึ่งเป็นที่อยู่ของเนื้อหาส่วนใหญ่ ----
  // ต้องใช้ --ui-on-surface* ไม่ใช่ --color-text เพราะ recipes ทับค่าให้แล้ว
  ['on-surface on surface', '--ui-on-surface', '--color-surface', 4.5],
  ['on-surface-muted on surface', '--ui-on-surface-muted', '--color-surface', 4.5],
  ['on-surface on surface-2', '--ui-on-surface', '--color-surface-2', 4.5],
  ['on-surface-muted on surface-2', '--ui-on-surface-muted', '--color-surface-2', 4.5],
  ['on-surface-primary on surface', '--ui-on-surface-primary', '--color-surface', 4.5],

  // ---- ปุ่ม ----
  // --color-primary เป็น "พื้น" ของปุ่ม จึงไม่ตรวจกับพื้นหลังหน้า
  // ขอบเขตของปุ่มเป็นหน้าที่ของ --shadow-raised ซึ่งทุกธีมให้เส้นหรือเงาที่มองเห็นไว้แล้ว
  ['on-primary on primary', '--color-on-primary', '--color-primary', 4.5],

  // ---- สีสถานะ: ป้าย นาฬิกา ช่องสถิติ อยู่ในการ์ดเกือบทั้งหมด จึงตรวจกับพื้นผิว ----
  ['danger on surface', '--color-danger', '--color-surface', 3.0],
  ['success on surface', '--color-success', '--color-surface', 3.0],
  ['warn on surface', '--color-warn', '--color-surface', 3.0],
];

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`${BASE}/showcase/tech/login`, { waitUntil: 'networkidle' });

const results = await page.evaluate(
  ({ themes, pairs }) => {
    // Chromium คืนค่า computed color เป็น oklch() ตามที่เขียนไว้ ไม่ได้แปลงเป็น rgb ให้
    // จึงต้องวาดลง canvas เพื่อให้ rasterize เป็น sRGB 8-bit จริง — ค่าเดียวกับที่ตาเห็นบนจอ
    const cv = document.createElement('canvas');
    cv.width = cv.height = 1;
    const cx = cv.getContext('2d', { willReadFrequently: true });
    const parse = (s) => {
      cx.clearRect(0, 0, 1, 1);
      cx.fillStyle = s;
      cx.fillRect(0, 0, 1, 1);
      const d = cx.getImageData(0, 0, 1, 1).data;
      const a = d[3] / 255;
      // canvas เก็บค่าแบบ premultiplied — หารกลับเพื่อให้ได้สีต้นฉบับ
      return { rgb: a === 0 ? [0, 0, 0] : [d[0] / a, d[1] / a, d[2] / a], a };
    };
    // ผสมสีโปร่งแสงลงบนพื้นทึบ — ได้สีที่ปรากฏบนจอจริง
    const over = (fg, bg) => fg.rgb.map((c, i) => c * fg.a + bg[i] * (1 - fg.a));
    const lum = ([r, g, b]) => {
      const f = (c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };

    const out = [];
    for (const theme of themes) {
      const host = document.createElement('div');
      host.setAttribute('data-theme', theme);
      host.style.cssText = 'position:fixed;left:-9999px;top:0;';
      document.body.appendChild(host);

      // ธาตุจริงหนึ่งตัวต่อหนึ่ง token — engine แก้ var() ให้ในบริบทของธีมนี้
      const read = (token) => {
        const el = document.createElement('span');
        el.style.color = `var(${token})`;
        host.appendChild(el);
        const v = parse(getComputedStyle(el).color);
        el.remove();
        return v;
      };

      const page = read('--color-bg').rgb; // พื้นล่างสุดของธีม (ทึบเสมอ)

      for (const [label, fgTok, bgTok, min] of pairs) {
        const bg = over(read(bgTok), page);
        const fg = over(read(fgTok), bg);
        const [hi, lo] = [lum(fg), lum(bg)].sort((x, y) => y - x);
        out.push({ theme, label, min, ratio: +((hi + 0.05) / (lo + 0.05)).toFixed(2) });
      }
      host.remove();
    }
    return out;
  },
  { themes: THEMES, pairs: PAIRS },
);

await browser.close();

let failed = 0;
for (const theme of THEMES) {
  console.log(`\n[${theme}]`);
  for (const r of results.filter((x) => x.theme === theme)) {
    const ok = r.ratio >= r.min;
    if (!ok) failed++;
    console.log(
      `  ${ok ? 'PASS' : 'FAIL'}  ${r.label.padEnd(23)} ${String(r.ratio).padStart(6)} : 1  (ต้อง ≥ ${r.min})`,
    );
  }
}

console.log(`\n${failed === 0 ? 'ผ่านทั้งหมด' : `ไม่ผ่าน ${failed} คู่`}`);
process.exit(failed === 0 ? 0 : 1);
