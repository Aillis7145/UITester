/**
 * ตรวจการทำงานจริงผ่านเบราว์เซอร์
 *
 * ต้องรัน `npm run dev` ค้างไว้อีกหน้าต่างก่อน แล้วค่อย `npm run verify`
 * ภาพหน้าจอจะถูกเขียนลง .screenshots/ (อยู่ใน .gitignore แล้ว)
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://localhost:5173';
const OUT = '.screenshots';
fs.mkdirSync(OUT, { recursive: true });

// อ่านรายชื่อธีมจากโฟลเดอร์ เพิ่มธีมใหม่แล้วถูกตรวจครบทุกหน้าอัตโนมัติ
const THEMES = fs
  .readdirSync('src/styles/themes')
  .filter((f) => f.endsWith('.css'))
  .map((f) => f.replace(/\.css$/, ''));
const PAGES = ['login', 'subjects', 'lesson', 'quiz', 'results'];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
const page = await ctx.newPage();

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(`[console] ${m.text()}`));
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));

let failed = 0;
const shot = (n) => page.screenshot({ path: path.join(OUT, `${n}.png`) });
const check = (label, ok) => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
};

// ---------- ทุกธีม × ทุกหน้า ----------
for (const theme of THEMES) {
  for (const pageId of PAGES) {
    const before = errors.length;
    await page.goto(`${BASE}/showcase/${theme}/${pageId}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    check(`${theme}/${pageId} renders clean`, errors.length === before);
    await shot(`${theme}-${pageId}`);
  }
}

// ---------- ภาพประกอบต้องโหลดได้จริงทุกรูป ----------
await page.goto(`${BASE}/showcase/tech/subjects`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const imgs = await page.evaluate(() =>
  [...document.querySelectorAll('[data-theme] img')].map((i) => ({
    src: i.getAttribute('src'),
    ok: i.complete && i.naturalWidth > 0,
  })),
);
check(
  `course covers load (${imgs.filter((i) => i.ok).length}/${imgs.length})`,
  imgs.length >= 8 && imgs.every((i) => i.ok),
);

// ---------- ดรอปดาวน์ + empty state ----------
await page.goto(`${BASE}/showcase/school/subjects`, { waitUntil: 'networkidle' });
await page.getByRole('combobox').click();
await page.waitForTimeout(400);
check('dropdown opens', await page.getByRole('listbox').isVisible());
await page.getByRole('option', { name: /ยอดนิยม/ }).click();
check('dropdown selection applied', (await page.getByRole('combobox').innerText()).includes('ยอดนิยม'));
await page.getByPlaceholder(/ค้นหาวิชา/).fill('zzzzzz');
await page.waitForTimeout(300);
check('empty state renders', await page.getByText('ไม่พบวิชาที่ค้นหา').isVisible());

// ---------- สลับธีม/หน้าโดยคงอีกแกนไว้ ----------
await page.goto(`${BASE}/showcase/school/quiz`, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /นูมอร์ฟิซึม/ }).click();
await page.waitForTimeout(300);
check('theme switch keeps page', page.url().endsWith('/showcase/neu/quiz'));
// เจาะจงแถบของสตูดิโอ เพราะ AppBar ในตัวแอปจำลองก็มีปุ่มชื่อเดียวกัน
await page
  .locator('[role="group"][aria-label="หน้าจอ"] button', { hasText: 'ผลสอบ' })
  .click();
await page.waitForTimeout(300);
check('page switch keeps theme', page.url().endsWith('/showcase/neu/results'));

// ---------- AppBar ของตัวแอปจำลอง ----------
// ต้อง scope ใต้ [data-theme] เพราะ TopBar ของสตูดิโอก็เป็น <header><nav> เหมือนกัน
await page.goto(`${BASE}/showcase/tech/subjects`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const appNav = page.locator('[data-theme] header nav');
check('app bar shows 4 nav items', (await appNav.locator('button').count()) === 4);
await appNav.locator('button', { hasText: 'แบบทดสอบ' }).click();
await page.waitForTimeout(400);
check('app bar navigates', page.url().endsWith('/showcase/tech/quiz'));
await page.goto(`${BASE}/showcase/tech/login`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
check('app bar hidden on login', (await page.locator('[data-theme] header nav').count()) === 0);

// ---------- ขอบ/เงาต้องไม่โดนกล่องที่เลื่อนได้ตัด ----------
for (const theme of THEMES) {
  await page.goto(`${BASE}/showcase/${theme}/lesson`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  const room = await page.evaluate(() => {
    const item = document.querySelector('ul button[aria-current="true"]');
    if (!item) return null;
    const clip = item.closest('ul');
    const a = item.getBoundingClientRect();
    const b = clip.getBoundingClientRect();
    return Math.min(a.left - b.left, b.right - a.right);
  });
  check(`${theme}: playlist glow has room (${room && Math.round(room)}px ≥ 6)`, room !== null && room >= 6);
}

await page.goto(`${BASE}/showcase/school/subjects`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const chipRoom = await page.evaluate(() => {
  const chip = [...document.querySelectorAll('button[aria-pressed]')].find((b) =>
    b.parentElement?.className.includes('overflow-x-auto'),
  );
  if (!chip) return null;
  const a = chip.getBoundingClientRect();
  const b = chip.parentElement.getBoundingClientRect();
  return Math.min(a.top - b.top, b.bottom - a.bottom);
});
check(`chip row has room above/below (${chipRoom && Math.round(chipRoom)}px ≥ 10)`, chipRoom !== null && chipRoom >= 10);

// ---------- modal + Escape ----------
await page.goto(`${BASE}/showcase/tech/quiz`, { waitUntil: 'networkidle' });
await page.locator('nav[aria-label="ผังข้อสอบ"] button', { hasText: '10' }).first().click();
await page.waitForTimeout(250);
await page.getByRole('button', { name: /ส่งคำตอบ/ }).first().click();
await page.waitForTimeout(500);
check('submit modal opens', await page.getByRole('dialog').isVisible());
const closeBox = await page.getByRole('dialog').getByRole('button', { name: 'ปิด' }).boundingBox();
const panelBox = await page.getByRole('dialog').boundingBox();
check('modal close button sits top-right', closeBox.x > panelBox.x + panelBox.width / 2);
await shot('modal');
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
check('Escape closes modal', (await page.getByRole('dialog').count()) === 0);

// ---------- แถวล่างสุดต้องมีที่ว่างพอให้เงา hover ไม่โดนกรอบตัด ----------
// เงา hover ของธีมโรงเรียนแผ่ลงไปราว 42px จึงต้องมีช่องว่างมากกว่านั้น
await page.goto(`${BASE}/showcase/school/subjects`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const gap = await page.evaluate(() => {
  const s = document.querySelector('div.overflow-y-auto');
  s.scrollTop = s.scrollHeight;
  const f = s.getBoundingClientRect();
  const cards = [...document.querySelectorAll('article[role="button"]')];
  return f.bottom - cards[cards.length - 1].getBoundingClientRect().bottom;
});
check(`bottom row clears hover shadow (${Math.round(gap)}px ≥ 48)`, gap >= 48);

// ---------- เพลย์ลิสต์ต้องไม่ล้นกรอบ ----------
await page.goto(`${BASE}/showcase/tech/lesson`, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
check(
  'playlist footer CTA visible in frame',
  await page.getByRole('button', { name: /ทำแบบทดสอบท้ายบท/ }).isVisible(),
);

// ---------- โหมดเต็มจอ ----------
// ใช้ ?lang=en เพราะ selector ภาษาไทยพังง่ายเมื่อรันผ่าน shell ที่ encoding ไม่ตรง
await page.goto(`${BASE}/showcase/tech/lesson?lang=en`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
await page.getByRole('button', { name: 'View this screen full window' }).click();
await page.waitForTimeout(700);
const collapse = page.getByRole('button', { name: 'Collapse' });
check('fullscreen opens', await collapse.isVisible());
const fsBox = await page.locator('[data-theme] > .relative.z-10').last().boundingBox();
check('fullscreen fills the window', fsBox && fsBox.width >= 1590 && fsBox.height >= 990);
await page.keyboard.press('Escape');
await page.waitForTimeout(400);
check('Escape exits fullscreen', (await collapse.count()) === 0);
await page.getByRole('button', { name: 'View this screen full window' }).click();
await page.waitForTimeout(400);
await page.getByRole('button', { name: 'Collapse' }).click();
await page.waitForTimeout(400);
check('collapse button exits fullscreen', (await collapse.count()) === 0);

// ---------- Lab ----------
await page.goto(`${BASE}/lab/buttons`, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /ดูโค้ด/ }).first().click();
await page.waitForTimeout(300);
const code = await page.locator('pre.code-block').first().innerText();
check('code panel shows real file source', code.includes('export const meta') && code.includes('/* CSS */'));
await page.getByRole('button', { name: '×4' }).click();
await page.waitForTimeout(250);
const scale = await page.evaluate(() =>
  getComputedStyle(document.querySelector('[style*="--dur-scale"]')).getPropertyValue('--dur-scale').trim(),
);
check('slow-mo sets --dur-scale', scale === '4');

// ทุกกลุ่มต้องมี variant จริง — กันไม่ให้เหลือกลุ่มว่างค้างไว้ในเมนู
// ต้องตรงกับ GROUPS ใน src/lab/registry.js — ถ้าเพิ่มกลุ่มใหม่ อย่าลืมเติมตรงนี้
for (const group of [
  'buttons',
  'dropdowns',
  'inputs',
  'toggles',
  'loaders',
  'iconbuttons',
  'cards',
  'frames',
]) {
  await page.goto(`${BASE}/lab/${group}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(350);
  // เจาะจง id ของ VariantCard เพราะ variant บางตัว (เช่นการ์ด) เรนเดอร์ <article> ของตัวเองซ้อนอยู่ข้างใน
  const n = await page.locator('article[id^="variant-"]').count();
  check(`lab/${group} has variants (${n})`, n > 0);
}

// ---------- ช่องกรอกและช่องติ๊กต้องมองเห็นได้ทุกธีม ----------
// เคยพลาดมาแล้วสองรอบ: ธีมที่ตั้ง --color-border เป็น transparent (neu)
// หรือ --ui-border-width เป็น 0 (edura) ทำให้ขอบหายไปทั้งหมดจนไม่รู้ว่ากดได้
for (const theme of THEMES) {
  await page.goto(`${BASE}/showcase/${theme}/login`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.locator('[data-theme] label:has(input[type="checkbox"])').first().click();
  await page.waitForTimeout(300);

  const m = await page.evaluate(() => {
    const px = (s) => {
      const c = document.createElement('canvas');
      c.width = c.height = 1;
      const cx = c.getContext('2d', { willReadFrequently: true });
      cx.fillStyle = s;
      cx.fillRect(0, 0, 1, 1);
      const d = cx.getImageData(0, 0, 1, 1).data;
      return { rgb: [d[0], d[1], d[2]], a: d[3] / 255 };
    };
    const over = (fg, bg) => fg.rgb.map((c, i) => c * fg.a + bg[i] * (1 - fg.a));
    const lum = ([r, g, b]) => {
      const f = (c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const ratio = (a, b) => {
      const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
      return (hi + 0.05) / (lo + 0.05);
    };

    const box = document.querySelector('[data-theme] label:has(input[type="checkbox"]) span[aria-hidden]');
    const cardBg = px(getComputedStyle(box.closest('.ui-surface')).backgroundColor).rgb;
    const bs = getComputedStyle(box);

    const input = document.querySelector('[data-theme] input[type="email"]');
    const shell = input.closest('.ui-inset');
    const fieldBg = over(px(getComputedStyle(shell).backgroundColor), cardBg);

    return {
      // ขอบช่องติ๊กตอนยังไม่กด เทียบกับพื้นการ์ด
      checkboxEdge: ratio(over(px(bs.borderTopColor), cardBg), cardBg),
      // ตัวหนังสือในช่องกรอก เทียบกับพื้นช่องกรอก
      fieldText: ratio(over(px(getComputedStyle(input).color), fieldBg), fieldBg),
      // ตัวช่องกรอกเอง เทียบกับสิ่งที่อยู่ข้างหลัง (ต้องเห็นว่ามีช่องอยู่)
      fieldEdge: Math.max(
        ratio(fieldBg, cardBg),
        ratio(over(px(bs.borderTopColor), cardBg), cardBg),
      ),
    };
  });

  check(`${theme}: unchecked checkbox has a visible edge (${m.checkboxEdge.toFixed(2)}:1 ≥ 1.4)`, m.checkboxEdge >= 1.4);
  check(`${theme}: field text readable (${m.fieldText.toFixed(2)}:1 ≥ 4.5)`, m.fieldText >= 4.5);
}

// ---------- สเปกธีม: ฟอนต์ ความมน กรอบ ----------
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
check(
  `home shows a frame link per theme (${THEMES.length})`,
  (await page.locator('a[href^="/lab/frames/"]').count()) === THEMES.length,
);
// กรอบที่ธีมประกาศไว้ต้องมีอยู่จริงในคลัง ไม่ใช่ลิงก์ตาย
const frameHrefs = await page.locator('a[href^="/lab/frames/"]').evaluateAll((els) =>
  els.map((e) => e.getAttribute('href')),
);
let frameOk = true;
for (const href of frameHrefs) {
  await page.goto(BASE + href, { waitUntil: 'networkidle' });
  await page.waitForTimeout(350);
  const id = href.split('/').pop();
  if ((await page.locator(`#variant-${id}`).count()) === 0) frameOk = false;
}
check('every theme frame exists in the lab', frameOk);

// ---------- เทียบข้างกัน ----------
await page.goto(`${BASE}/compare/login`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
check(
  `compare renders one iframe per theme (${THEMES.length})`,
  (await page.locator('iframe').count()) === THEMES.length,
);
await shot('compare');

// ---------- ธีมที่ไม่มี 3D ต้องไม่โหลด three.js ----------
const reqs = [];
page.on('request', (r) => reqs.push(r.url()));
await page.goto(`${BASE}/showcase/school/login`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
check('school theme loads no three.js', !reqs.some((u) => /three/i.test(u)));

// ---------- สลับไปกลับ 10 รอบ กัน WebGL context รั่ว ----------
const before = errors.length;
for (let i = 0; i < 10; i++) {
  await page.goto(`${BASE}/showcase/tech/login`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(240);
  await page.goto(`${BASE}/showcase/neu/login`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(140);
}
check('10x theme thrash: no new errors', errors.length === before);

// ---------- ภาษาอังกฤษ ----------
await page.goto(`${BASE}/showcase/school/login?lang=en`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
check('?lang=en switches copy', await page.getByText('Welcome back').isVisible());
check('html lang follows', (await page.evaluate(() => document.documentElement.lang)) === 'en');

await browser.close();

if (errors.length) {
  console.log('\n--- PAGE ERRORS ---');
  for (const e of [...new Set(errors)]) console.log(e);
}
console.log(`\n${failed === 0 ? 'ผ่านทั้งหมด' : `ไม่ผ่าน ${failed} ข้อ`} · ภาพอยู่ที่ ${OUT}/`);
process.exit(failed === 0 && errors.length === 0 ? 0 : 1);
