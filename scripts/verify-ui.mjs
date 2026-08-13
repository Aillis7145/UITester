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
// อ่านจากทะเบียนจริงของแอป ไม่เขียนรายชื่อซ้ำ — เพิ่มหน้าใหม่แล้วถูกตรวจเองทันที
// (src/screens/pages.js ตั้งใจไม่ import อะไรเลย จึงโหลดจาก Node ล้วนได้)
const { PAGE_IDS: PAGES, APP_NAV_IDS } = await import('../src/screens/pages.js');

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
/**
 * เทียบเฉพาะ pathname เสมอ ห้ามใช้ url().endsWith()
 * เพราะ goto เก็บ query ไว้ให้ (?lang, ?project, ?node) การเทียบทั้ง URL จึงพังทันที
 * ที่มีพารามิเตอร์ตัวใดตัวหนึ่งติดมา ซึ่งอ่านเหมือนบั๊กทั้งที่ทำงานถูก
 */
const pathOf = () => new URL(page.url()).pathname;
/**
 * รอจน element ซ่อนจริง แทนการหน่วงเวลาตายตัวแล้วเดา
 * ธีม tech มีพื้นหลังสามมิติทำให้เฟรมตก การหน่วง 350ms คงที่จึงตกบ้างไม่ตกบ้าง
 * ซึ่งอ่านเหมือนบั๊กทั้งที่แอปทำงานถูก
 */
const hidden = async (locator, ms = 3000) => {
  try {
    await locator.waitFor({ state: 'hidden', timeout: ms });
    return true;
  } catch {
    return false;
  }
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
await page.getByPlaceholder(/ค้นหา/).fill('zzzzzz');
await page.waitForTimeout(300);
check('empty state renders', await page.getByText('ไม่พบรายการที่ค้นหา').isVisible());

// ---------- สลับธีม/หน้าโดยคงอีกแกนไว้ ----------
await page.goto(`${BASE}/showcase/school/quiz`, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /นูมอร์ฟิซึม/ }).click();
await page.waitForTimeout(300);
check('theme switch keeps page', pathOf() === '/showcase/neu/quiz');
// เจาะจงแถบของสตูดิโอ เพราะ AppBar ในตัวแอปจำลองก็มีปุ่มชื่อเดียวกัน
await page
  .locator('[role="group"][aria-label="หน้าจอ"] button', { hasText: 'ผลสอบ' })
  .click();
await page.waitForTimeout(300);
check('page switch keeps theme', pathOf() === '/showcase/neu/results');

// ---------- AppBar ของตัวแอปจำลอง ----------
// ต้อง scope ใต้ [data-theme] เพราะ TopBar ของสตูดิโอก็เป็น <header><nav> เหมือนกัน
await page.goto(`${BASE}/showcase/tech/subjects`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const appNav = page.locator('[data-theme] header nav');
check(
  `app bar shows ${APP_NAV_IDS.length} nav items`,
  (await appNav.locator('button').count()) === APP_NAV_IDS.length,
);
await appNav.locator('button', { hasText: 'แบบทดสอบ' }).click();
await page.waitForTimeout(400);
check('app bar navigates', pathOf() === '/showcase/tech/quiz');
await page.goto(`${BASE}/showcase/tech/login`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
check('app bar hidden on login', (await page.locator('[data-theme] header nav').count()) === 0);

// ---------- เมนูแจ้งเตือนและโปรไฟล์บน AppBar ต้องกดได้ทุกธีม ----------
for (const theme of THEMES) {
  await page.goto(`${BASE}/showcase/${theme}/subjects?lang=en`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // เลือกด้วยชื่อที่เข้าถึงได้ ไม่ใช่ตำแหน่ง
  // เพราะ AppBar มีปุ่มเมนูสามตัวแล้ว (โครงการ / แจ้งเตือน / โปรไฟล์)
  // การใช้ .first()/.last() จะเลื่อนทันทีที่เพิ่มปุ่มใหม่ แล้วทดสอบผิดตัวโดยไม่มีอะไรฟ้อง
  const header = page.locator('[data-theme] header');
  const bell = header.getByRole('button', { name: /^Notifications/ });
  const avatar = header.getByRole('button', { name: 'Account menu' });

  await bell.click();
  await page.waitForTimeout(400);
  const notif = page.getByRole('menu', { name: 'Notifications' });
  check(`${theme}: notification menu opens`, await notif.isVisible());

  // ---------- แผงลอยต้องทึบและอ่านออก ----------
  // เคยพลาดมาแล้ว: tech ตั้ง --ui-card-bg โปร่ง 95% แล้วฝากความอ่านออกไว้กับ backdrop-filter
  // พอ .ui-menu ไปอยู่ใน .ui-panel ของ AppBar ซึ่งเป็น backdrop root อยู่ก่อนแล้ว
  // เบลอชั้นในเลยไม่มีอะไรให้ดูด กลายเป็นแผงใสทับเนื้อหาหน้าเว็บจนอ่านไม่ออก
  const opaque = await page.evaluate(() => {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 1;
    const cx = cv.getContext('2d', { willReadFrequently: true });
    // ต้อง rasterize เพราะ Chromium คืนค่าสีที่คำนวณแล้วเป็น oklch() ซึ่งอ่านตรงๆ ไม่ได้
    const px = (s) => {
      cx.clearRect(0, 0, 1, 1);
      cx.fillStyle = s.trim();
      cx.fillRect(0, 0, 1, 1);
      const d = cx.getImageData(0, 0, 1, 1).data;
      const a = d[3] / 255;
      return { rgb: a === 0 ? [0, 0, 0] : [d[0] / a, d[1] / a, d[2] / a], a };
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
    // ΔL* ของ CIE ตรงกับ "ตาเห็นต่างแค่ไหน" มากกว่าอัตราส่วน contrast เมื่อสองสีใกล้กันมาก
    const lstar = (c) => 116 * Math.cbrt(lum(c)) - 16;

    const menu = document.querySelector('[data-theme] [role="menu"]');
    const cs = getComputedStyle(menu);
    const bg = px(cs.backgroundColor);
    const row = menu.querySelector('button[role="menuitem"]');
    const rs = getComputedStyle(row);

    return {
      alpha: bg.a,
      backdrop: cs.backdropFilter,
      text: ratio(over(px(rs.color), bg.rgb), bg.rgb),
      hover: Math.abs(
        lstar(over(px(rs.getPropertyValue('--color-surface-2')), bg.rgb)) - lstar(bg.rgb),
      ),
    };
  });
  check(`${theme}: menu surface is opaque (alpha ${opaque.alpha.toFixed(2)} = 1)`, opaque.alpha === 1);
  check(`${theme}: menu never leans on backdrop blur (${opaque.backdrop})`, opaque.backdrop === 'none');
  check(`${theme}: menu text readable (${opaque.text.toFixed(2)}:1 ≥ 4.5)`, opaque.text >= 4.5);
  check(`${theme}: menu row hover visible (ΔL* ${opaque.hover.toFixed(1)} ≥ 2.5)`, opaque.hover >= 2.5);

  // กด "อ่านทั้งหมด" แล้วตัวเลขบนกระดิ่งต้องหายไปจริง
  const before = await bell.innerText();
  await page.getByRole('button', { name: 'Mark all read' }).click();
  await page.waitForTimeout(300);
  check(`${theme}: mark-all-read clears the badge`, (await bell.innerText()) !== before);

  await page.keyboard.press('Escape');
  check(`${theme}: Escape closes notification menu`, await hidden(notif));

  await avatar.click();
  await page.waitForTimeout(400);
  const prof = page.getByRole('menu', { name: 'Account menu' });
  check(`${theme}: profile menu opens`, await prof.isVisible());
  await page.mouse.click(400, 700);
  check(`${theme}: outside click closes profile menu`, await hidden(prof));
}

// ---------- จำนวนหน้าไล่ระดับต้องมาจากข้อมูล ไม่ใช่ค่าตายตัว ----------
// นี่คือข้อพิสูจน์ของโจทย์หลักทั้งหมด: ค่าคาดหวังอ่านจาก projects.js ซึ่งเป็นไฟล์เดียวกับที่แอปอ่าน
// ถ้าใครไป hardcode ลำดับหน้าไว้ในหน้าจอ โครงการที่ลึกไม่เท่ากันจะสะดุดทันที
const { projects } = await import('../src/mock/projects.js');

// ถ้าทุกโครงการลึกเท่ากัน การทดสอบข้างล่างพิสูจน์อะไรไม่ได้เลย จึงต้องกันไว้ก่อน
check(
  'demo projects really differ in depth',
  new Set(projects.map((pr) => pr.levels.length)).size > 1,
);

for (const project of projects) {
  await page.goto(`${BASE}/showcase/tech/projects?lang=en`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page
    .locator('[data-theme] article[role="button"]', { hasText: project.name.en })
    .first()
    .click();
  await page.waitForTimeout(500);
  check(`${project.id}: opens its top-level list`, pathOf() === '/showcase/tech/subjects');

  let steps = 0;
  for (let guard = 0; guard < 10 && !pathOf().endsWith('/lesson'); guard++) {
    // การ์ดกล่องเป็น article[role="button"] ส่วนแถวสื่ออยู่ในลิสต์ใต้ section
    // ต้องเจาะจง section เพราะเมนูสลับโครงการบน AppBar ก็เป็น ul li button เหมือนกัน
    const card = page.locator('[data-theme] article[role="button"]').first();
    const row = page.locator('[data-theme] section ul li button:not([disabled])').first();
    await ((await card.count()) ? card : row).click();
    await page.waitForTimeout(500);
    if (pathOf().endsWith('/browse')) steps++;
  }
  check(
    `${project.id}: ${steps} drill-down pages = levels.length (${project.levels.length})`,
    steps === project.levels.length && pathOf().endsWith('/lesson'),
  );

  // ป้ายชั้นต้องเป็นคำของโครงการนี้จริง ไม่ใช่คำกลางที่ใช้ร่วมกันทุกโครงการ
  // ถอยกลับหนึ่งครั้งจะได้กล่องชั้นล่างสุด ซึ่งโชว์ชื่อชั้นของตัวเองเป็นหัวเรื่องย่อย
  await page.goBack();
  await page.waitForTimeout(500);
  // เทียบแบบไม่สนตัวพิมพ์ เพราะหัวเรื่องย่อยตั้ง text-transform: uppercase ไว้
  // และ innerText คืนข้อความ "ที่เรนเดอร์จริง" จึงได้ TOPIC ไม่ใช่ Topic
  const deepest = project.levels.at(-1).label.en.toUpperCase();
  const text = (await page.locator('[data-theme]').first().innerText()).toUpperCase();
  check(`${project.id}: shows its own level label (${deepest})`, text.includes(deepest));
}

// ---------- ทุกหน้าต้องเรนเดอร์ได้ลำพังโดยไม่มี query ----------
// สตูดิโอลิงก์ตรงเข้าหน้าไหนก็ได้ และ ?node ที่ผิดต้องไม่ทำให้ redirect
for (const theme of THEMES) {
  const before = errors.length;
  await page.goto(`${BASE}/showcase/${theme}/browse`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const kids = await page.locator('[data-theme] section article, [data-theme] section ul li').count();
  check(`${theme}: /browse renders standalone (${kids} children, no query)`, kids > 0 && errors.length === before);
}
await page.goto(`${BASE}/showcase/tech/browse?node=nope`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
check('bad ?node falls back instead of redirecting', pathOf() === '/showcase/tech/browse');

// ---------- เพลย์ลิสต์ต้องเป็นของโครงการนั้นจริง ----------
// เดิม PlaylistPanel import lessons/sections ระดับโมดูลแล้ววนทั้งก้อนโดยไม่กรอง
// พอมีหลายโครงการ หน้าสื่อของโครงการอื่นจะโชว์บทเรียน AI ทั้งชุด
// เป็นบั๊กที่ตาไม่จับถ้าไม่ได้เปิดสองโครงการเทียบกัน
for (const project of projects.filter((pr) => pr.id !== 'p1')) {
  await page.goto(`${BASE}/showcase/tech/projects?lang=en`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  await page
    .locator('[data-theme] article[role="button"]', { hasText: project.name.en })
    .first()
    .click();
  await page.waitForTimeout(400);
  for (let guard = 0; guard < 10 && !pathOf().endsWith('/lesson'); guard++) {
    const card = page.locator('[data-theme] article[role="button"]').first();
    const row = page.locator('[data-theme] section ul li button:not([disabled])').first();
    await ((await card.count()) ? card : row).click();
    await page.waitForTimeout(400);
  }
  const aside = await page.locator('[data-theme] aside').innerText();
  check(
    `${project.id}: playlist has no content from another project`,
    !/scikit-learn|Backpropagation|Gradient descent/i.test(aside),
  );
}

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
  await page.getByRole('button', { name: /ทำแบบทดสอบ/ }).isVisible(),
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

// ---------- Lab: แผงที่กางออกต้องไม่โดนการ์ดตัด และต้องอยู่บนสุด ----------
// การ์ดเคยตั้ง overflow-hidden ไว้กันมุมเหลี่ยมของเวที ผลข้างเคียงคือดรอปดาวน์โดนตัดหมด
// และเพราะ ThemeFrame ตั้ง isolate การ์ดที่มาทีหลังใน DOM จะวาดทับแผงของการ์ดก่อนหน้า
await page.goto(`${BASE}/lab/dropdowns`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const ddCards = page.locator('article[id^="variant-"]');
for (let i = 0; i < (await ddCards.count()); i++) {
  const card = ddCards.nth(i);
  const id = await card.getAttribute('id');
  // จัดการ์ดไว้กลางจอก่อน ไม่งั้น Playwright เลื่อนปุ่มมาชิดขอบล่าง
  // แล้วแผงที่กางลงมาจะตกนอกวิวพอร์ต ทำให้ elementFromPoint คืน null (บวกลบไม่เกี่ยวกับบั๊ก)
  await card.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(150);
  await card.locator('.preview-stage button').first().click();
  await page.waitForTimeout(450);

  const r = await card.evaluate((art) => {
    const panel = art.querySelector('.preview-stage [data-open="true"]');
    if (!panel) return null;
    const b = panel.getBoundingClientRect();
    // ยิงจุดที่ "ล่างสุดของแผง" เพราะนั่นคือจุดแรกที่โดนตัดหรือโดนการ์ดถัดไปทับ
    const y = Math.min(b.bottom - 6, window.innerHeight - 2);
    const hit = document.elementFromPoint(b.left + b.width / 2, y);
    return {
      overflow: getComputedStyle(art).overflow,
      // ล้นพ้นขอบล่างของการ์ดจริงไหม ถ้าไม่ล้น การทดสอบทับซ้อนก็ไม่มีความหมาย
      spill: Math.round(b.bottom - art.getBoundingClientRect().bottom),
      onTop: Boolean(hit && panel.contains(hit)),
    };
  });
  if (!r) continue;

  check(`lab/${id}: card never clips (overflow ${r.overflow})`, r.overflow === 'visible');
  check(`lab/${id}: open panel is hit-testable on top`, r.onTop);

  // ต้องปิดให้สนิทก่อนไปใบถัดไป ไม่งั้นแผงที่ยังกางอยู่จะบังปุ่มของใบข้างๆ (ซึ่งตอนนี้ทำได้แล้ว)
  // Escape สำหรับตัวที่ดักคีย์เอง (คอมมานด์พาเลตต์) · blur สำหรับตัวที่ปิดด้วย onBlur
  await page.keyboard.press('Escape');
  await page.evaluate(() => document.activeElement?.blur());
  await page.waitForTimeout(350);
}
// ---------- แผงที่กว้างกว่าการ์ดต้องเห็นครบ "ทั้งสองข้าง" ทุกความกว้างจอ ----------
// เคยพลาดสองชั้น: (1) ตั้ง overflow-x: clip คู่กับ overflow-y: visible แล้ว Chromium
// ไม่สนใจ overflow-clip-margin เลย  (2) ขึ้น 3 คอลัมน์เร็วเกินไปจนการ์ดแคบกว่าแผง
// แผงจึงยื่นพ้นขอบจอ ตัวจอเองเลยกลายเป็นตัวตัด ซึ่งแก้ที่ CSS ของกริดไม่ได้
for (const w of [1920, 1536, 1440, 1280, 1024, 768, 640]) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(`${BASE}/lab/dropdowns`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const mega = page.locator('#variant-dd-mega-panel');
  await mega.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await mega.locator('.preview-stage button').first().click();
  await page.waitForTimeout(550);
  const wide = await page.evaluate(() => {
    const el = document.querySelector('.v-mega');
    const b = el.getBoundingClientRect();
    const at = (x, y) => {
      const h = document.elementFromPoint(x, y);
      return Boolean(h && el.contains(h));
    };
    return {
      left: at(b.left + 3, b.top + b.height / 2),
      right: at(b.right - 3, b.top + b.height / 2),
      scrollbar: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    };
  });
  check(`lab@${w}: wide panel shows both edges`, wide.left && wide.right);
  check(`lab@${w}: wide panel adds no page scrollbar`, !wide.scrollbar);
  await page.keyboard.press('Escape');
  await page.evaluate(() => document.activeElement?.blur());
}
await page.setViewportSize({ width: 1600, height: 1000 });

// มุมบนของเวทีต้องมนตามการ์ด และต้องเป็น "ความมนของสตูดิโอ" ไม่ใช่ของธีมที่กำลังพรีวิว
const corner = await page.evaluate(() => {
  const art = document.querySelector('article[id^="variant-"]');
  const frame = art.querySelector(':scope > [data-theme]');
  return {
    card: getComputedStyle(art).borderTopLeftRadius,
    top: getComputedStyle(frame).borderTopLeftRadius,
    bottom: getComputedStyle(frame).borderBottomLeftRadius,
  };
});
check(`lab: stage top corner matches the card (${corner.top} = ${corner.card})`, corner.top === corner.card);
check(`lab: stage bottom corner is square (${corner.bottom})`, corner.bottom === '0px');

// ฉากคลุมของคอมมานด์พาเลตต์ต้องเท่ากับเวที — เดิมอ้างกับตัวห่อขนาดปุ่ม 240×44 แล้วแผงหลุดออกทั้งใบ
await page.locator('#variant-dd-command-palette .preview-stage button').first().click();
await page.waitForTimeout(450);
const scrim = await page.evaluate(() => {
  const stage = document.querySelector('#variant-dd-command-palette .preview-stage');
  const o = stage.querySelector('.v-cmd-overlay').getBoundingClientRect();
  const s = stage.getBoundingClientRect();
  const panel = stage.querySelector('.v-cmd-panel').getBoundingClientRect();
  return {
    dw: Math.abs(o.width - s.width),
    dh: Math.abs(o.height - s.height),
    room: Math.round(o.bottom - panel.bottom),
  };
});
check(`lab: palette scrim covers the stage (off by ${scrim.dw}×${scrim.dh}px ≤ 1)`, scrim.dw <= 1 && scrim.dh <= 1);
check(`lab: palette panel fits inside the scrim (${scrim.room}px ≥ 0)`, scrim.room >= 0);
await page.keyboard.press('Escape');
await page.waitForTimeout(350);

// ---------- Lab: ปุ่มลอยกางเมนูต้องขอที่ว่างผ่าน meta.stage ไม่ใช่แฮ็ก margin ----------
for (const size of ['sm', 'md', 'lg']) {
  await page.goto(`${BASE}/lab/iconbuttons`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: size.toUpperCase(), exact: true }).click();
  await page.waitForTimeout(250);
  check(
    `lab/${size}: FAB speed dial no longer uses a margin hack`,
    (await page.evaluate(
      () => getComputedStyle(document.querySelector('#variant-ib-fab-speed-dial .v-fab-wrap')).marginTop,
    )) === '0px',
  );
  // เจาะจงในเวที เพราะปุ่ม "ดูโค้ด" ของการ์ดก็มี aria-expanded เหมือนกัน
  await page.locator('#variant-ib-fab-speed-dial .preview-stage button[aria-expanded]').click();
  await page.waitForTimeout(700);
  const fab = await page.evaluate(() => {
    const stage = document.querySelector('#variant-ib-fab-speed-dial .preview-stage');
    const items = [...stage.querySelectorAll('.v-fab-item')];
    return Math.round(
      Math.min(...items.map((i) => i.getBoundingClientRect().top)) - stage.getBoundingClientRect().top,
    );
  });
  check(`lab/${size}: FAB items stay inside their stage (${fab}px ≥ 0)`, fab >= 0);
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
