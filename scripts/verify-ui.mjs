/**
 * ตรวจการทำงานจริงผ่านเบราว์เซอร์
 *
 * ต้องรัน `npm run dev` ค้างไว้อีกหน้าต่างก่อน แล้วค่อย `npm run verify`
 * ภาพหน้าจอจะถูกเขียนลง .screenshots/ (อยู่ใน .gitignore แล้ว)
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

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
// ตรวจเฉพาะรูปที่อยู่ในระยะที่เบราว์เซอร์ควรโหลดแล้วจริงๆ
// กริดรวมมี 38 ใบและทุกใบเป็น loading="lazy" รูปที่ยังอยู่ไกลนอกจอจึงยังไม่โหลด "โดยถูกต้อง"
// ถ้าเทียบทุกรูปทั้งหน้า เช็คนี้จะแดงทั้งที่แอปทำงานถูก
const imgs = await page.evaluate(() =>
  [...document.querySelectorAll('[data-theme] img')]
    .filter((i) => i.getBoundingClientRect().top < window.innerHeight * 1.5)
    .map((i) => ({ src: i.getAttribute('src'), ok: i.complete && i.naturalWidth > 0 })),
);
check(
  `course covers load (${imgs.filter((i) => i.ok).length}/${imgs.length} in range)`,
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

// ---------- โครงสร้างข้อมูลต้องตรงกับหลักสูตรจริง ----------
// ตรวจในระดับข้อมูลก่อนเปิดเบราว์เซอร์ — ถูกและเร็ว และชี้ต้นเหตุได้ตรงกว่าการไล่คลิก
const { projects, purchasedProjects, LEVEL_ORDER } = await import('../src/mock/projects.js');
const { curriculum } = await import('../src/mock/curriculum.js');
const nodesApi = await import('../src/mock/nodes.js');
const { rootsOf, childrenOf, contentCountOf, getNode, unitLevelOf, continueLearning, resumeContentOf } = nodesApi;

// ทุกวิชาต้องมีชั้นหน่วยจริง ไม่งั้น flow 2 คลิกเป็นไปไม่ได้
check(
  'every subject declares at least course + unit',
  projects.every((pr) => pr.levels.length >= 2 && pr.levels[0].level === LEVEL_ORDER[0]),
);
check('every subject has a short tag label', projects.every((pr) => pr.short?.th && pr.short?.en));

// ถ้า fixture ไม่แยกแยะ การทดสอบข้างล่างพิสูจน์อะไรไม่ได้เลย จึงต้องกันไว้ก่อน
//
// *** ห้ามเปลี่ยนเป็น "คำเรียกหน่วยต้องไม่ซ้ำกันทุกวิชา" ***
// ห้าวิชาประถมใช้คำว่า "ภาคเรียน" เหมือนกันโดยตั้งใจ เพราะหลักสูตรจริงเป็นแบบนั้น
// เช็คแบบนั้นจะแดงทันทีทั้งที่ข้อมูลถูก
const unitLabels = new Set(projects.map((pr) => pr.levels[1].label.en));
check(`subjects use at least 3 different unit words (${[...unitLabels].join(', ')})`, unitLabels.size >= 3);
check(
  'fixture has both a subject with a sub-unit level and one without',
  projects.some((pr) => pr.levels.length > 2) && projects.some((pr) => pr.levels.length === 2),
);

// จำนวนโหนดต้องตรงกับที่ curriculum.js ประกาศ — จับกรณีสร้างโหนดตกหล่นหรือซ้ำ
const expected = curriculum.reduce(
  (acc, c) => {
    acc.courses++;
    for (const u of c.units) {
      acc.units++;
      if (u.topics) for (const t of u.topics) (acc.topics++, (acc.items += t.items.length));
      else acc.items += u.items.length;
    }
    return acc;
  },
  { courses: 0, units: 0, topics: 0, items: 0 },
);
const built = projects.flatMap((pr) => rootsOf(pr.id));
check(
  `${built.length} course nodes = ${expected.courses} in curriculum.js`,
  built.length === expected.courses,
);
check(
  `${built.reduce((a, c) => a + contentCountOf(c.id), 0)} content nodes = ${expected.items} in curriculum.js`,
  built.reduce((a, c) => a + contentCountOf(c.id), 0) === expected.items,
);
check(
  'every course has at least one unit and one openable item',
  built.every((c) => childrenOf(c.id).length > 0 && contentCountOf(c.id) > 0),
);
check(
  'continue-learning rows all point at a course that exists',
  continueLearning.length > 0 && continueLearning.every((r) => getNode(r.courseId)),
);

// ---------- ชื่อสื่อต้องไม่ใช่เลขลอยๆ ----------
// ตัวตัดข้อย่อยของแผ่นอังกฤษเคยตัดกลางเลขสามชั้น: "3.6.1 Beautiful English"
// กลายเป็น "3." กับ "6.1 Beautiful English" คนละชิ้น แล้วเพลย์ลิสต์มีแถวชื่อ "3." คั่นอยู่
// เช็คที่ข้อมูลเพราะเห็นได้ทุกใบ ไม่ต้องรอให้ไปโผล่ในหน้าที่บังเอิญเปิดดู
const allTitles = [];
for (const c of curriculum) {
  for (const u of c.units) {
    for (const t of u.topics ?? []) allTitles.push(...t.items, t.name);
    allTitles.push(...(u.items ?? []));
  }
}
const stubs = allTitles.filter((t) => /^\d+(\.\d+)*\.?\s*$/.test(t));
check(
  `no content title is a bare number (${stubs.length} found${stubs.length ? ': ' + [...new Set(stubs)].slice(0, 5).join(', ') : ''})`,
  stubs.length === 0,
);

// ---------- ชุดแบบฝึกหัดต้องไม่ปนอยู่ในเพลย์ลิสต์ ----------
// ข้อ 4.x คือแบบฝึกหัดระหว่างบท ข้อ 5.x คือแบบฝึกหัดท้ายบท ทั้งคู่เป็นข้อสอบ ไม่ใช่สื่อให้ดู
// ย้ายไปอยู่หลังปุ่ม "ทำแบบฝึกหัด" แล้ว จึงต้องไม่เหลือในต้นไม้เนื้อหาอีก
const practiceSheets = curriculum.filter((c) => c.practice?.length);
const leaked = practiceSheets.flatMap((c) =>
  c.units.flatMap((u) => (u.topics ?? []).filter((t) => /^\s*[45]\./.test(t.name)).map((t) => t.name)),
);
check(
  `practice sections stay out of the playlist (${leaked.length} leaked)`,
  practiceSheets.length > 0 && leaked.length === 0,
);
check(
  `courses that declare practice list all five skills (${practiceSheets.length} courses)`,
  practiceSheets.every((c) =>
    ['grammar', 'reading', 'listening', 'writing', 'speaking'].every((k) => c.practice.includes(k)),
  ),
);
// ต้องมีทั้งคอร์สที่มีและไม่มีแบบฝึกหัด ไม่งั้นเช็คปุ่มข้างล่างพิสูจน์อะไรไม่ได้
check(
  'fixture has courses both with and without practice sets',
  built.some((c) => c.practice?.length) && built.some((c) => !c.practice?.length),
);

// ---------- คอร์สที่ประกาศว่าเป็นวิดีโอล้วน ต้องเป็นวิดีโอล้วนจริง ----------
// ชื่อหัวข้อของ B1/B2 อ่านเหมือนเอกสารเยอะมาก ("คำศัพท์ (Vocabulary Focus)", "บทนำ")
// ถ้าตัวเดาชนิดสื่อกลับมาทำงานกับคอร์สกลุ่มนี้เมื่อไร เพลย์ลิสต์จะสลับไอคอนทั้งหน้าอีก
const { VIDEO_ONLY_SHEETS } = await import('../src/mock/projects.js');

const leavesUnder = (id) => {
  const out = [];
  const walk = (nid) => {
    const kids = childrenOf(nid);
    if (!kids.length) {
      const n = getNode(nid);
      if (n?.level === 'content') out.push(n);
      return;
    }
    kids.forEach((k) => walk(k.id));
  };
  walk(id);
  return out;
};
const coursesBySheet = (sheets) =>
  projects.flatMap((pr) => rootsOf(pr.id)).filter((c) => sheets.includes(c.sheet));

const videoOnlyCourses = coursesBySheet(VIDEO_ONLY_SHEETS);
check(
  `every declared video-only sheet has a course (${VIDEO_ONLY_SHEETS.join(', ')})`,
  videoOnlyCourses.length === VIDEO_ONLY_SHEETS.length,
);
const videoOnlyLeaves = videoOnlyCourses.flatMap((c) => leavesUnder(c.id));
check(
  `video-only courses carry no other media kind (${videoOnlyLeaves.length} items)`,
  videoOnlyLeaves.length > 500 && videoOnlyLeaves.every((n) => n.kind === 'video'),
);
// ตัวเดาชนิดสื่อต้องยังทำงานกับคอร์สที่เหลือ ไม่งั้นเช็คข้างบนผ่านเพราะทั้งระบบเป็นวิดีโอหมด
const otherLeaves = projects
  .flatMap((pr) => rootsOf(pr.id))
  .filter((c) => !VIDEO_ONLY_SHEETS.includes(c.sheet))
  .flatMap((c) => leavesUnder(c.id));
check(
  `other courses still mix media kinds (${[...new Set(otherLeaves.map((n) => n.kind))].sort().join(', ')})`,
  new Set(otherLeaves.map((n) => n.kind)).size >= 3,
);

// ---------- เอกสารต้องไม่หายไป แค่ย้ายไปอยู่รายการดาวน์โหลดของหน่วย ----------
const videoOnlyUnits = videoOnlyCourses.flatMap((c) => childrenOf(c.id));
check(
  `every unit of a video-only course offers files to download (${videoOnlyUnits.length} units)`,
  videoOnlyUnits.length > 0 && videoOnlyUnits.every((u) => u.resources?.length > 0),
);
check(
  'unit files are named in both languages and have a size',
  videoOnlyUnits.every((u) => u.resources.every((r) => r.name?.th && r.name?.en && r.sizeKb > 0 && r.type)),
);
// ไฟล์ต้องสะท้อนเนื้อหาของหน่วยนั้น ไม่ใช่ลิสต์ตายตัวที่ก๊อปแปะเท่ากันทุกหน่วย
check(
  'a unit only lists a vocabulary file when it actually teaches vocabulary',
  videoOnlyUnits.every((u) => {
    const hay = childrenOf(u.id)
      .flatMap((g) => [g.title.th, ...childrenOf(g.id).map((n) => n.title.th)])
      .join('\n');
    const listed = u.resources.some((r) => r.name.en === 'Unit vocabulary list');
    return listed === /คำศัพท์|Vocabulary|Word Wise/i.test(hay);
  }),
);
// ไอดีซ้ำจะทำให้ React ใช้ key ชนกันแล้วรายการกะพริบผิดใบตอนสลับหน่วย
check(
  'file ids are unique across the whole site',
  new Set(videoOnlyUnits.flatMap((u) => u.resources.map((r) => r.id))).size ===
    videoOnlyUnits.reduce((n, u) => n + u.resources.length, 0),
);
// คอร์สที่ไม่ได้ประกาศไว้ต้องไม่มี resources ติดมา ไม่งั้นแปลว่าเงื่อนไขรั่ว
check(
  'units of other courses carry no unit files',
  projects
    .flatMap((pr) => rootsOf(pr.id))
    .filter((c) => !VIDEO_ONLY_SHEETS.includes(c.sheet))
    .flatMap((c) => childrenOf(c.id))
    .every((u) => !u.resources),
);

// ---------- ชุดข้อสอบจริงของ B1 บทที่ 1 ----------
// แปลงมาจากไฟล์ Word 10 ไฟล์ ตัวเลขจึงต้องตรงกับที่ไฟล์ประกาศไว้เอง ไม่ใช่ตรงกับที่เราจำได้
const { quizBank } = await import('../src/mock/quizbank.js');
const { quizFor, practiceSetsOf } = await import('../src/mock/quizzes.js');
const { quiz: demoQuiz } = await import('../src/mock/data.js');

const bank = quizBank['ENG_B1#1'];
check('B1 unit 1 has a real quiz bank', Boolean(bank));

const EXPECT = { grammar: 6, reading: 5, listening: 5, writing: 2, speaking: 2 };
check(
  `practice sets: ${Object.entries(EXPECT).map(([k, n]) => `${k} ${bank.practice[k]?.questions.length}/${n}`).join(' · ')}`,
  Object.entries(EXPECT).every(([k, n]) => bank.practice[k]?.questions.length === n),
);
check(`unit quiz has 20 items (${bank.unitQuiz.questions.length})`, bank.unitQuiz.questions.length === 20);
check(
  `unit quiz covers all five skills (${[...new Set(bank.unitQuiz.questions.map((q) => q.skill))].join(', ')})`,
  new Set(bank.unitQuiz.questions.map((q) => q.skill)).size === 5,
);

const allQuestions = [...Object.values(bank.practice).flatMap((s2) => s2.questions), ...bank.unitQuiz.questions];
check(
  'every multiple-choice item has exactly one answer that exists in its choices',
  allQuestions
    .filter((q) => q.type === 'single')
    .every((q) => q.answerIds?.length === 1 && q.choices.some((c) => c.id === q.answerIds[0]) && q.choices.length === 4),
);
check(
  'every written/spoken item carries its guidelines and sample answer',
  allQuestions
    .filter((q) => q.type === 'typing' || q.type === 'speaking')
    .every((q) => q.guidelines?.length > 0 && q.sample?.th),
);
check(
  'every listening item carries the audio script',
  allQuestions.filter((q) => q.skill === 'listening').every((q) => typeof q.audioScript === 'string' && q.audioScript.length > 200),
);
check(
  'every reading item carries its passage',
  allQuestions.filter((q) => q.skill === 'reading' && q.type === 'single').every((q) => q.passage?.th?.length > 200),
);
// บทความต้องเป็นบทความ ไม่ใช่ทั้งไฟล์ — ตัวหาขอบเขตเคยกวาดเฉลยมาด้วยทั้งก้อน
check(
  'passages stop before the answer key',
  allQuestions.filter((q) => q.passage).every((q) => !/คำตอบคือ|Answers:/.test(q.passage.th)),
);

// ---------- ชุดจริงต้องไม่รั่วออกนอก B1 บทที่ 1 ----------
const b1First = resumeContentOf(childrenOf(rootsOf('eng')[2].id)[0].id);
const otherFirst = resumeContentOf(childrenOf(rootsOf('mat-p')[0].id)[0].id);
check('unit quiz resolves from ?set=unit', quizFor(b1First, 'unit') === bank.unitQuiz);
check('practice set resolves from ?set=practice-grammar', quizFor(b1First, 'practice-grammar') === bank.practice.grammar);
check('courses without a bank still get the demo quiz', quizFor(otherFirst, 'unit') === demoQuiz);
check('practice sets are only offered where a bank exists', Boolean(practiceSetsOf(b1First)) && !practiceSetsOf(otherFirst));

// ---------- ปกต้องไม่ซ้ำ "แม้แต่คู่เดียว" ในทั้งระบบ ----------
// รูปคือสิ่งแรกที่ตากวาดเจอบนการ์ด ก่อนชื่อและก่อนแท็ก
// ป.1 กับ ป.3 ที่ใช้รูปเดียวกันจะถูกอ่านว่าเป็นคอร์สเดียวกัน
// เทียบที่โหนดคอร์สจริง ไม่ใช่ที่ตารางประกาศ เพราะสิ่งที่ผู้เรียนเห็นคือโหนด
const covers = built.map((c) => c.cover);
const dupCovers = covers.filter((c, i) => covers.indexOf(c) !== i);
check(
  `every course has its own cover (${new Set(covers).size}/${covers.length})${dupCovers.length ? ' — ซ้ำ: ' + [...new Set(dupCovers)].join(', ') : ''}`,
  new Set(covers).size === covers.length,
);
check(
  'every cover file exists on disk',
  covers.every((c) => fs.existsSync('public' + c)),
);
// เทียบเนื้อไฟล์ด้วย เพราะคนละชื่อไฟล์ที่เป็นรูปเดียวกันเป๊ะก็ยังอ่านว่าเป็นคอร์สเดียวกันอยู่ดี
const bySum = new Map();
const sameImage = [];
for (const c of covers) {
  const sum = createHash('md5').update(fs.readFileSync('public' + c)).digest('hex');
  if (bySum.has(sum)) sameImage.push(`${c} = ${bySum.get(sum)}`);
  else bySum.set(sum, c);
}
check(
  `no two covers are the same image${sameImage.length ? ' — ' + sameImage.join(', ') : ''}`,
  sameImage.length === 0,
);

// ---------- ทุกวิชาถึงวิดีโอใน 2 คลิกเท่ากันหมด ----------
// นี่คือข้อพิสูจน์ของโจทย์หลัก: ค่าคาดหวังอ่านจาก projects.js ซึ่งเป็นไฟล์เดียวกับที่แอปอ่าน
// วิชาที่ประกาศ 2 ชั้นกับ 3 ชั้นต้องได้จำนวนคลิกเท่ากัน เพราะชั้นที่ 3 ไม่มีหน้าของตัวเอง
const chipRow = () => page.locator('[data-theme] div.overflow-x-auto').first();
const cards = () => page.locator('[data-theme] article[role="button"]');

for (const project of purchasedProjects) {
  await page.goto(`${BASE}/showcase/tech/subjects?lang=en`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  const chip = chipRow().locator('button', { hasText: new RegExp(`^${project.short.en}$`) });
  await chip.first().click();
  await page.waitForTimeout(400);

  const shown = await cards().count();
  check(`${project.id}: chip shows ${rootsOf(project.id).length} courses`, shown === rootsOf(project.id).length);

  // ทุกใบต้องติดแท็กวิชา ไม่งั้นกริดรวมอ่านไม่ออกว่าใบไหนมาจากสินค้าตัวไหน
  const tagged = await cards().locator(`text="${project.short.en}"`).count();
  check(`${project.id}: every card carries its subject tag (${tagged}/${shown})`, tagged === shown);

  // คลิกที่ 1 — คอร์ส → หน้าไล่ระดับ
  await cards().first().click();
  await page.waitForTimeout(500);
  check(`${project.id}: click 1 opens /browse`, pathOf() === '/showcase/tech/browse');

  // หน้านั้นต้องใช้ "คำเรียกหน่วยของวิชานี้เอง" ไม่ใช่คำกลางที่ใช้ร่วมกันทุกวิชา
  const unitWord = project.levels[1].plural.en.toUpperCase();
  const browseText = (await page.locator('[data-theme]').first().innerText()).toUpperCase();
  check(`${project.id}: browse names its own unit level (${unitWord})`, browseText.includes(unitWord));

  // การ์ดหน่วยต้องมีรูปปกเหมือนการ์ดคอร์ส ไม่ใช่กล่องเปล่า
  const unitCovers = await page.evaluate(() =>
    [...document.querySelectorAll('[data-theme] article[role="button"] img')]
      .filter((i) => i.getBoundingClientRect().top < window.innerHeight * 1.5)
      .map((i) => i.complete && i.naturalWidth > 0),
  );
  check(
    `${project.id}: unit cards show a loaded cover (${unitCovers.filter(Boolean).length}/${unitCovers.length})`,
    unitCovers.length > 0 && unitCovers.every(Boolean),
  );

  // คลิกที่ 2 — หน่วย → หน้าวิดีโอทันที ไม่ว่าวิชานี้จะประกาศไว้กี่ชั้น
  await cards().first().click();
  await page.waitForTimeout(600);
  check(`${project.id}: click 2 lands on /lesson`, pathOf() === '/showcase/tech/lesson');

  // เพลย์ลิสต์ต้องเป็นของ "หน่วยที่เลือก" เท่านั้น
  // เดิมใช้พี่น้องของกล่องแม่ ซึ่งลากหัวข้อของทุกหน่วยพี่น้องเข้ามาด้วยทั้งชุด
  const node = getNode(new URL(page.url()).searchParams.get('node'));
  const unitLevel = unitLevelOf(project);
  let unit = node;
  while (unit && unit.level !== unitLevel) unit = getNode(unit.parentId);
  let inUnit = 0;
  const walk = (id) => childrenOf(id).forEach((k) => (k.level === 'content' ? inUnit++ : walk(k.id)));
  if (unit) walk(unit.id);
  // นับ "แถวสื่อ" ตรงๆ ไม่ไล่เทียบข้อความ เพราะแผงมีหัวกลุ่ม ชื่อหน่วย และปุ่มท้ายแผงปนอยู่ด้วย
  const listed = await page.locator('[data-theme] aside ul li').count();
  check(
    `${project.id}: playlist lists exactly the unit's ${inUnit} items (${listed})`,
    Boolean(unit) && inUnit > 0 && listed === inUnit,
  );
}

// ---------- กริดรวมต้องรวมจริง ----------
await page.goto(`${BASE}/showcase/tech/subjects?lang=en`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const allCards = await cards().count();
check(`merged grid shows every purchased course (${allCards}/${built.length})`, allCards === built.length);

const cardTags = await page.evaluate(() =>
  [...document.querySelectorAll('[data-theme] article[role="button"]')].map((a) => a.innerText),
);
const shortNames = purchasedProjects.map((pr) => pr.short.en);
check(
  'every card in the merged grid carries a subject tag',
  cardTags.every((txt) => shortNames.some((n) => txt.includes(n))),
);
check(
  `all ${purchasedProjects.length} subjects appear in the grid`,
  shortNames.every((n) => cardTags.some((txt) => txt.includes(n))),
);
// จับปัญหา updatedAt กระจุก — ถ้าวิชาเดียวยึดสองแถวแรก กริดจะดูเหมือนไม่ได้รวมอะไรเลย
const firstEight = cardTags.slice(0, 8);
const subjectsUpTop = new Set(shortNames.filter((n) => firstEight.some((txt) => txt.includes(n))));
check(
  `first 8 cards mix subjects (${[...subjectsUpTop].join(', ')})`,
  subjectsUpTop.size >= 2,
);

// ---------- หน้าเลือกโครงการต้องหายไปจริง ไม่ใช่แค่ซ่อนลิงก์ ----------
await page.goto(`${BASE}/showcase/tech/projects`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
check('/projects no longer resolves', pathOf() !== '/showcase/tech/projects');

// AppBar ต้องไม่เหลือปุ่มสลับวิชา — เหลือไว้จะพาย้อนกลับไปโมเดลหลายโครงการเงียบๆ
await page.goto(`${BASE}/showcase/tech/subjects?lang=en`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
const barText = await page.locator('[data-theme] header').first().innerText();
check(
  'app bar has no subject switcher',
  !projects.some((pr) => barText.includes(pr.name.en)),
);

// ---------- ?node ที่ลึกกว่าคอร์สบนหน้า browse ต้องถูกดันขึ้นมาที่คอร์ส ----------
// ลิงก์ที่แชร์ไว้ก่อนยุบ flow ชี้ไปที่หน่วยหรือชั้นใต้หน่วย ซึ่งไม่มีหน้าของตัวเองแล้ว
const deepCourse = rootsOf('mat-p')[0];
const deepUnit = childrenOf(deepCourse.id)[0];
await page.goto(`${BASE}/showcase/tech/browse?node=${deepUnit.id}&lang=en`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
const pushedUp = await page.locator('[data-theme] h1').first().innerText();
check(
  `deep ?node on /browse is pushed up to its course (${pushedUp})`,
  pathOf() === '/showcase/tech/browse' && pushedUp.includes(deepCourse.title.en),
);

// ---------- ทุกแถบความคืบหน้าต้องอ่านออกทั้งด้วยตาและด้วย screen reader ----------
for (const pageId of ['subjects', 'browse', 'lesson']) {
  await page.goto(`${BASE}/showcase/tech/${pageId}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const bars = await page.evaluate(() => {
    const named = (el) => {
      if (el.getAttribute('aria-label')) return true;
      const id = el.getAttribute('aria-labelledby');
      return Boolean(id && document.getElementById(id)?.innerText.trim());
    };
    return [...document.querySelectorAll('[data-theme] [role="progressbar"]')].map((el) => ({
      named: named(el),
      // ข้อความที่ "ตาเห็น" คือของในกล่องแม่ ตัวแถบเองไม่มีตัวหนังสือ
      text: (el.parentElement?.innerText ?? '').trim(),
    }));
  });
  check(`${pageId}: has progress bars (${bars.length})`, bars.length > 0);
  check(`${pageId}: every progress bar has an accessible name`, bars.every((b) => b.named));
  check(
    `${pageId}: every progress bar shows "ความคืบหน้า" and a % figure`,
    bars.every((b) => b.text.includes('ความคืบหน้า') && /\d+%/.test(b.text)),
  );
}

// ---------- หน้าวิดีโอของ B1 ต้องไม่มีเอกสารแทรกในเพลย์ลิสต์ ----------
await page.goto(`${BASE}/showcase/tech/lesson?node=${b1First.id}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
// เพลย์ลิสต์ปิด showKind ไว้ ป้ายชนิดจึงไม่โผล่เป็นตัวหนังสือให้ตรวจตรงๆ
// แต่ "หน่วยวัด" ท้ายแถวฟ้องแทน: คลิปบอกความยาว mm:ss ส่วนเอกสารบอกจำนวนหน้า
const b1Rows = await page.locator('[data-theme] aside ul li').allInnerTexts();
check(
  `B1 playlist shows ${b1Rows.length} items, every one of them timed like a clip`,
  b1Rows.length === 14 && b1Rows.every((row) => /\d+:\d\d/.test(row)),
);
check(
  'no row in the B1 playlist is measured in pages or attempts',
  !b1Rows.some((row) => /\d+ หน้า|ราว \d+ นาที|ทำได้ไม่จำกัดครั้ง/.test(row)),
);

// หัวข้อที่ชื่ออ่านเหมือนเอกสารต้องกดแล้วได้ "เครื่องเล่นวิดีโอ" ไม่ใช่การ์ดเอกสารที่กดโหลดไม่ได้
await page.goto(`${BASE}/showcase/tech/lesson?node=eng-c3-u1-t2-v2`, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
const vocabPage = await page.locator('[data-theme]').first().innerText();
check(
  'a topic titled "คำศัพท์" still opens as a video',
  vocabPage.includes('คำศัพท์ (Vocabulary Focus)') && !vocabPage.includes('ยังไม่ใช่ตัวเปิดไฟล์จริง'),
);

// เอกสารยังต้องหาเจอ — ไม่ได้แค่ถูกลบทิ้ง
const docsTab = page.getByRole('tab', { name: /เอกสาร/ });
check('the document tab says how many files the unit has', /เอกสาร · 5/.test(await docsTab.innerText()));
await docsTab.click();
await page.waitForTimeout(400);
const docPanel = await page.locator('[role="tabpanel"]').first().innerText();
check(
  'unit documents are downloadable below the video',
  ['เอกสารประกอบบทเรียน', 'คำศัพท์ประจำบท', 'สคริปต์บทสนทนา'].every((n) => docPanel.includes(n)),
);
// ไฟล์กลางของบทเรียนตัวอย่างเป็นของคอร์ส AI — โผล่ในคอร์สภาษาอังกฤษเมื่อไรแปลว่าส่ง prop ไม่ถึง
check('the generic sample files do not leak into an English course', !/ipynb|\.csv/.test(docPanel));

// ---------- ชุดข้อสอบจริงต้องทำได้จริงในเบราว์เซอร์ ----------
const quizUrl = (set) => `${BASE}/showcase/tech/quiz?node=${b1First.id}&set=${set}`;

await page.goto(quizUrl('practice-grammar'), { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
check(
  `grammar practice opens its own set (${await page.locator('[data-theme] h1').first().innerText()})`,
  (await page.locator('[data-theme] h1').first().innerText()).includes('ไวยากรณ์'),
);
check(
  `grammar practice shows 6 items in the navigator`,
  (await page.locator('[data-theme] nav ol li').count()) === 6,
);

// ข้อการฟังต้องมีปุ่มฟัง และ *ห้าม* มีบทพูดเป็นตัวหนังสือ ไม่งั้นกลายเป็นข้อสอบการอ่าน
await page.goto(quizUrl('practice-listening'), { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
const listenBtn = page.locator('[data-theme] button[aria-label="กดเพื่อฟัง"]');
check('listening item offers a play button', (await listenBtn.count()) === 1);
const listeningText = await page.locator('[data-theme]').first().innerText();
check(
  'listening item never prints the transcript',
  !listeningText.includes('Welcome to "New Faces on Campus"'),
);

// ข้อการอ่านต้องมีบทความ และไฮไลต์ช่องว่างของข้อนั้น
await page.goto(quizUrl('practice-reading'), { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
const readingText = await page.locator('[data-theme]').first().innerText();
check(
  'reading item shows its passage',
  readingText.includes('A New Start in a New City') && readingText.includes('Carlos'),
);
check('reading item never prints the answer key', !readingText.includes('คำตอบคือ'));

// ข้อการเขียนต้องพิมพ์ได้จริง และผังข้อสอบต้องเปลี่ยนเป็น "ตอบแล้ว"
await page.goto(quizUrl('practice-writing'), { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
const box = page.locator('[data-theme] textarea');
check('writing item offers a text box', (await box.count()) === 1);
await box.fill('On weekdays I usually read the news before work.');
await page.waitForTimeout(300);
check(
  'typing marks the item answered in the navigator',
  await page.locator('[data-theme] nav ol li button').first().getAttribute('aria-label').then((l) => l.includes('ตอบแล้ว')),
);
// ตัวอย่างคำตอบเป็นเฉลย ห้ามโผล่ตอนกำลังทำข้อสอบ
check(
  'the sample answer stays hidden while answering',
  !(await page.locator('[data-theme]').first().innerText()).includes('check my emails first thing'),
);

// ---------- ข้อสอบท้ายบท: 20 ข้อ ส่งได้ และคะแนนแยกข้อที่รอตรวจ ----------
await page.goto(quizUrl('unit'), { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
check(`unit quiz shows 20 items`, (await page.locator('[data-theme] nav ol li').count()) === 20);

await page.goto(`${BASE}/showcase/tech/results?node=${b1First.id}&set=unit`, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
const resultText = await page.locator('[data-theme]').first().innerText();
check('results score only the 16 auto-graded items', /\b0 \/ 16\b/.test(resultText));
check('results say how many items await a teacher', /อีก 4 ข้อจาก 20 ข้อ/.test(resultText));
check('results list all 20 items for review', /ข้อ 20 จาก 20/.test(resultText));

// ---------- ปุ่มทำแบบฝึกหัด → หน้าเลือกชุด → หน้าข้อสอบ ----------
// ปุ่มมีเฉพาะคอร์สที่หลักสูตรมีชุดแบบฝึกหัดจริง ไม่ใช่ทุกคอร์ส
const withPractice = built.find((c) => c.practice?.length);
const withoutPractice = built.find((c) => !c.practice?.length);
const firstVideoOf = (course) => resumeContentOf(childrenOf(course.id)[0].id);

await page.goto(`${BASE}/showcase/tech/lesson?node=${firstVideoOf(withPractice).id}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
const practiceBtn = page.locator('[data-theme] aside button', { hasText: 'ทำแบบฝึกหัด' });
check(`${withPractice.id}: lesson page offers the practice button`, (await practiceBtn.count()) === 1);

// เพลย์ลิสต์ต้องไม่มีแถวชื่อเลขลอยๆ และไม่มีข้อ 4./5. หลงเหลือ
const playlistRows = await page.locator('[data-theme] aside ul li').allInnerTexts();
check(
  `${withPractice.id}: playlist has no stub rows or practice items`,
  playlistRows.length > 0 &&
    !playlistRows.some((r) => /^\s*\d+\.\s*$/.test(r.split('\n')[0]) || /^\s*[45]\./.test(r)),
);

await practiceBtn.click();
await page.waitForTimeout(700);
check('practice button opens /practice', pathOf() === '/showcase/tech/practice');

const skillNames = ['Grammar Practice', 'Reading Practice', 'Listening Practice', 'Writing Practice', 'Speaking Practice'];
const skillBtns = await Promise.all(
  skillNames.map((n) => page.locator('[data-theme] button', { hasText: n }).count()),
);
check(
  `practice page lists all five skills (${skillBtns.filter(Boolean).length}/5)`,
  skillBtns.every((n) => n >= 1),
);

await page.locator('[data-theme] button', { hasText: 'Speaking Practice' }).first().click();
await page.waitForTimeout(700);
check('picking a practice set opens /quiz', pathOf() === '/showcase/tech/quiz');

// คอร์สที่หลักสูตรไม่มีแบบฝึกหัดต้องไม่มีปุ่ม — ไม่งั้นปุ่มพาไปหน้าที่ว่างเปล่า
await page.goto(`${BASE}/showcase/tech/lesson?node=${firstVideoOf(withoutPractice).id}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
check(
  `${withoutPractice.id}: no practice button when the course has no practice sets`,
  (await page.locator('[data-theme] aside button', { hasText: 'ทำแบบฝึกหัด' }).count()) === 0,
);

// ---------- เส้นทางต้องอยู่เหนือวิดีโอ ----------
// ตำแหน่งเดียวกับทุกหน้าอื่นในแอป ผู้เรียนจึงหาทางกลับได้จากที่เดิมเสมอ
const crumbAbove = await page.evaluate(() => {
  const nav = document.querySelector('[data-theme] nav[aria-label]');
  const stage = document.querySelector('[data-theme] main, [data-theme] .ui-surface');
  const video = [...document.querySelectorAll('[data-theme] [role="slider"], [data-theme] img')].find(
    (el) => el.closest('.ui-surface'),
  );
  if (!nav || !video) return null;
  return nav.getBoundingClientRect().top < video.getBoundingClientRect().top;
});
check('breadcrumb sits above the video stage', crumbAbove === true);

// ---------- ปุ่ม CC ต้องเลือกภาษาคำบรรยายได้จริง ----------
// เป็นเมนู ไม่ใช่สวิตช์เปิด/ปิด — และข้อความคำบรรยายต้องเปลี่ยนตามแทร็กที่เลือก
// ไม่ใช่ตามภาษาหน้าเว็บ ซึ่งเป็นความผิดที่เกิดง่ายมากถ้าเผลอใช้ p()
await page.goto(`${BASE}/showcase/tech/lesson`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const ccButton = page.locator('[data-theme] button[aria-label="คำบรรยาย"]');
const ccMenu = page.locator('[data-theme] ul[data-open="true"] li button');
const capBox = page.locator('[data-theme] .absolute.inset-x-0.bottom-4 span').first();

const capBefore = await capBox.innerText();
await ccButton.click();
await page.waitForTimeout(350);
const ccItems = await ccMenu.allInnerTexts();
check(
  `captions menu offers 4 tracks (${ccItems.join(' / ')})`,
  ccItems.length === 4 && ['ไม่แสดง', 'ภาษาอังกฤษ', 'ภาษาจีน', 'ภาษาไทย'].every((n, i) => ccItems[i] === n),
);

await ccMenu.filter({ hasText: 'ภาษาจีน' }).click();
await page.waitForTimeout(350);
const capZh = await capBox.innerText();
check(`picking a caption track changes the caption text (${capZh.slice(0, 18)})`, capZh !== capBefore && capZh.length > 0);

await ccButton.click();
await page.waitForTimeout(300);
await ccMenu.filter({ hasText: 'ไม่แสดง' }).click();
await page.waitForTimeout(350);
check('picking "ไม่แสดง" hides the caption box', (await capBox.count()) === 0);

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

// ---------- ขอบ/เงาต้องไม่โดนกล่องที่เลื่อนได้ตัด ----------
for (const theme of THEMES) {
  await page.goto(`${BASE}/showcase/${theme}/lesson`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  const room = await page.evaluate(() => {
    // เจาะจง aside เพราะเช็คนี้วัดที่ว่างของ "แถวที่กำลังเล่นในเพลย์ลิสต์"
    // ปุ่มอื่นในหน้าที่บังเอิญมี aria-current จะทำให้วัดกล่องผิดใบโดยไม่มีอะไรฟ้อง
    const item = document.querySelector('aside ul button[aria-current="true"]');
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

// เวทีอยู่ "ฝั่งขวา" ของการ์ดในจอกว้าง มุมที่ติดขอบการ์ด (ขวาบน/ขวาล่าง) จึงต้องมนตามการ์ด
// ส่วนมุมที่หันเข้าด้านใน (ซ้ายบน/ซ้ายล่าง) ต้องเหลี่ยม ไม่งั้นจะเห็นรอยบากกลางการ์ด
// ความมนต้องเป็นของสตูดิโอ ไม่ใช่ของธีมที่กำลังพรีวิว (สองค่านี้ไม่เท่ากัน)
const corner = await page.evaluate(() => {
  const art = document.querySelector('article[id^="variant-"]');
  const frame = art.querySelector('.lab-card-body > [data-theme]');
  const c = getComputedStyle(art);
  const f = getComputedStyle(frame);
  return {
    card: c.borderTopRightRadius,
    outerTop: f.borderTopRightRadius,
    outerBottom: f.borderBottomRightRadius,
    innerTop: f.borderTopLeftRadius,
    innerBottom: f.borderBottomLeftRadius,
    // การ์ดต้องเรียงเป็นคอลัมน์เดียว — หนึ่งใบต่อหนึ่งแถว
    perRow: new Set(
      [...document.querySelectorAll('article[id^="variant-"]')].map((a) =>
        Math.round(a.getBoundingClientRect().top),
      ),
    ).size,
    total: document.querySelectorAll('article[id^="variant-"]').length,
  };
});
check(
  `lab: stage outer corners match the card (${corner.outerTop}/${corner.outerBottom} = ${corner.card})`,
  corner.outerTop === corner.card && corner.outerBottom === corner.card,
);
check(
  `lab: stage inner corners are square (${corner.innerTop}/${corner.innerBottom})`,
  corner.innerTop === '0px' && corner.innerBottom === '0px',
);
check(
  `lab: one card per row (${corner.total} cards on ${corner.perRow} rows)`,
  corner.perRow === corner.total,
);

// กางแผงโค้ดแล้วการ์ดต้องกว้างเท่าเดิม
// grid item มี min-width: auto โดยปริยาย โค้ดบรรทัดยาว (white-space: pre) จึงดันการ์ดกว้างเกินคอลัมน์
// ลากเวทีกว้างตามจนล้นออกนอกจอ — เจอตอนจัดเลย์เอาต์เป็นหนึ่งการ์ดต่อแถว
const widthBefore = await page.evaluate(() =>
  Math.round(document.querySelector('article[id^="variant-"]').getBoundingClientRect().width),
);
await page.getByRole('button', { name: /ดูโค้ด/ }).first().click();
await page.waitForTimeout(500);
const afterCode = await page.evaluate(() => ({
  width: Math.round(document.querySelector('article[id^="variant-"]').getBoundingClientRect().width),
  scrollbar: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
}));
check(
  `lab: opening the code panel does not widen the card (${widthBefore} → ${afterCode.width})`,
  widthBefore === afterCode.width,
);
check('lab: code panel adds no page scrollbar', !afterCode.scrollbar);

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
