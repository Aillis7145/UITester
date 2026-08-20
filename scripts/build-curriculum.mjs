/**
 * แปลงหลักสูตรจริงจากสเปรดชีต → src/mock/curriculum.js
 *
 *   node scripts/build-curriculum.mjs        (หรือ npm run build:curriculum)
 *
 * ต้นทาง: data/curriculum-source.md — ผลอ่านดิบจาก Google Sheets
 *   1viBBiH-Cl18MklfLPmzSs47FSMjkxAe5sb_HbYx140A
 *
 * สคริปต์นี้เป็น "การแปลงล้วน" — รันซ้ำต้องได้ผลเดิมเป๊ะ ไม่มีอะไรสุ่มและไม่มีวันที่
 * ถ้าเนื้อหาผิด (เช่นคำสะกดผิดในชื่อหน่วย) ให้แก้ที่สเปรดชีตแล้ว export ใหม่
 * ห้ามมาแก้ทีหลังในเอาต์พุต ไม่งั้นไฟล์ที่คอมมิตจะไม่ตรงกับต้นทางอีกต่อไป
 *
 * ─────────────────────────────────────────────────────────────
 * ข้อจำกัดของ export ที่ต้องรู้
 * ─────────────────────────────────────────────────────────────
 * export ตัด "ชื่อแผ่นงาน" ทิ้งทั้งหมด — ทั้งไฟล์ไม่มีบรรทัดนอกตารางแม้แต่บรรทัดเดียว
 * และไม่มีคำว่า CEFR / A1 / A2 / B1 / B2 / HSK อยู่ที่ไหนเลย
 * การจับคู่ "ตารางที่ N → แผ่นงานอะไร" จึงต้องพิสูจน์จากตัวข้อมูล ดูตาราง SHEETS ข้างล่าง
 *
 * ─────────────────────────────────────────────────────────────
 * เรื่องภาษา
 * ─────────────────────────────────────────────────────────────
 * ชีตมีภาษาเดียว (ไทย ยกเว้นแผ่นอังกฤษที่เป็นอังกฤษอยู่แล้ว) ชื่อที่ได้จากชีตจึงเก็บเป็น
 * "สตริงเดี่ยว" ไม่ใช่ { th, en } แล้วให้ nodes.js ห่อเป็นสองภาษาตอนสร้างโหนด
 * ประหยัดไฟล์ไปครึ่งหนึ่งและซื่อตรงกว่าการก๊อป th ไปใส่ en ให้ดูเหมือนแปลแล้ว
 *
 * *** อย่ามาไล่ "แปลให้ครบ" — ต้นทางไม่มีคำแปลให้แปล ***
 * มีแค่ course กับ blurb ที่เขียนเองในไฟล์นี้เท่านั้นที่เป็น { th, en } จริง
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BACKSLASH = String.fromCharCode(92);

/* ============================================================
   1 · อ่านและตัดเป็นตาราง
   ============================================================ */

const raw = readFileSync(resolve(ROOT, 'data/curriculum-source.md'), 'utf8');
const lines = raw.split('\n');

/**
 * เซลล์หนึ่งช่อง — ล้างสามอย่าง
 *   1. backslash ที่ markdown escape มาให้ (ป้าย [merged] ถูก escape มาเป็น \[merged\])
 *   2. ป้าย [merged] ที่ export ใส่แทนเซลล์ที่ถูกผสาน
 *   3. ช่องว่างซ้อน — ต้นทางมีเว้นวรรครัวๆ กลางประโยคเยอะมาก
 *
 * ต้องล้าง backslash ก่อน [merged] เสมอ ไม่งั้นจะไม่แมตช์
 * เพราะ \[merged\] ไม่มีสตริง "[merged]" อยู่ในตัว (มี backslash คั่นก่อนวงเล็บปิด)
 */
const cellsOf = (line) =>
  line
    .split('|')
    .slice(1, -1)
    .map((s) => s.split(BACKSLASH).join('').split('[merged]').join('').replace(/\s+/g, ' ').trim());

// ตารางเริ่มถัดจากบรรทัดคั่นหัวตาราง (| :-: | :-: |)
const seps = [];
lines.forEach((l, i) => {
  if (/^\|\s*:-:/.test(l.trim())) seps.push(i);
});
const tables = seps.map((s, k) => ({ start: s + 1, end: (seps[k + 1] ?? lines.length) - 1 }));

/**
 * แถวของตารางหนึ่ง + ตำแหน่งแถวว่าง
 *
 * เซลล์คอลัมน์ "หน่วย" ถูกผสานในต้นฉบับ แถวถัดมาจึงว่าง — เติมค่าเดิมลงมา (forward fill)
 * แถวหัวตารางโผล่ซ้ำได้ในตารางเดียว จึงข้ามทุกครั้งที่เจอ ไม่ใช่แค่แถวแรก
 */
function rowsOf(tableNo) {
  const t = tables[tableNo - 1];
  if (!t) throw new Error(`ไม่มีตารางที่ ${tableNo} (มีทั้งหมด ${tables.length})`);
  const rows = [];
  const blanks = [];
  let lastUnit = '';
  for (let i = t.start; i <= t.end; i++) {
    const cs = cellsOf(lines[i] ?? '');
    if (!cs.length) continue;
    const unitCell = cs[0] ?? '';
    const title = cs[1] ?? '';
    if (/^(หน่วย|ชื่อบทเรียน)$/.test(unitCell) && title === 'ชื่อเรื่อง') continue;
    if (!unitCell && !title) {
      if (rows.length) blanks.push(rows.length);
      continue;
    }
    const unit = unitCell || lastUnit;
    lastUnit = unit;
    rows.push({ unit, title });
  }
  // แถวว่างท้ายตารางไม่ใช่รอยต่ออะไร ตัดทิ้ง เหลือเฉพาะที่คั่นกลางจริงๆ
  return { rows, breaks: blanks.filter((b) => b > 0 && b < rows.length) };
}

/** จัดแถวเป็นกลุ่มตามคอลัมน์หน่วย โดยรักษาลำดับเดิม (ไม่ใช้ Map เพราะชื่อหน่วยซ้ำข้ามที่ได้) */
function groupByUnit(rows) {
  const out = [];
  let cur = null;
  for (const r of rows) {
    if (!cur || cur.name !== r.unit) {
      cur = { name: r.unit, rows: [] };
      out.push(cur);
    }
    cur.rows.push(r.title);
  }
  return out;
}

/* ============================================================
   2 · ตารางไหนคือแผ่นงานอะไร
   ------------------------------------------------------------
   ตารางที่ 1 เป็นตารางสรุป (ชั้นปี | วิชา | จำนวนคาบ | ต้องเพิ่ม Q&A รวม 1,407 คาบ)
   เอาจำนวนคาบไปเทียบกับตารางที่ 2–31 แล้วตรงกันเรียงตัวต่อตัว
   ลำดับที่พิสูจน์ได้คือ "วิชาเป็นหลัก ชั้นปีเป็นรอง":
     ตาราง 2–7   ENG ป.1–ป.6 = 30/41/36/46/45/44 คาบ
     ตาราง 8–13  MAT = 69/64/51/45/63/57
     ตาราง 14–19 SCI = 45/37/55/36/54/57
     ตาราง 20–25 SOC = 28/59/54/26/33/30
     ตาราง 26–31 THA = 55/47/34/44/54/53   (ตรงเป๊ะทั้ง 6 ใบ)

   ตาราง 32–35 เป็นภาษาอังกฤษผู้ใหญ่ ระดับตามที่ผู้ใช้กำหนด (ชีตไม่ได้ระบุไว้เอง)
   ตาราง 36 คือ AI · ตาราง 37–39 คือภาษาจีน HSK 4/5/6 ตามลำดับ
   ============================================================ */

/**
 * วิชาประถมห้าตัว — ชื่อวิชาต่อท้ายไว้เพราะต้องเอาไปนำหน้าชื่อคอร์ส
 *
 * คอร์สทุกวิชามาอยู่ในกริดเดียวกัน ชื่อที่เขียนว่า "ประถมศึกษาปีที่ 1" เฉยๆ
 * จึงซ้ำกันห้าใบในหน้าเดียวโดยแยกไม่ออกว่าใบไหนวิชาอะไร
 * แท็กมุมภาพช่วยได้ก็จริง แต่ชื่อการ์ดคือสิ่งที่ตาอ่านก่อนและเป็นสิ่งที่ค้นหาเจอ
 */
const PRIMARY = [
  ['eng-p', 'ENG', { th: 'ภาษาอังกฤษ', en: 'English' }],
  ['mat-p', 'MAT', { th: 'คณิตศาสตร์', en: 'Mathematics' }],
  ['sci-p', 'SCI', { th: 'วิทยาศาสตร์', en: 'Science' }],
  ['soc-p', 'SOC', { th: 'สังคมศึกษา', en: 'Social Studies' }],
  ['tha-p', 'THA', { th: 'ภาษาไทย', en: 'Thai' }],
];

const SHEETS = [
  ...PRIMARY.flatMap(([project, code, subject], s) =>
    Array.from({ length: 6 }, (_, g) => ({
      table: 2 + s * 6 + g,
      sheet: `${code}_P${g + 1}`,
      project,
      shape: 'primary',
      course: { th: `${subject.th} ป.${g + 1}`, en: `${subject.en} · Grade ${g + 1}` },
      blurb: {
        th: `หลักสูตร${subject.th}ชั้น ป.${g + 1} ครบทั้งสองภาคเรียน`,
        en: `The full Grade ${g + 1} ${subject.en} syllabus across two semesters`,
      },
    })),
  ),

  // ระดับของสี่แผ่นนี้ผู้ใช้เป็นคนกำหนด — ในชีตไม่มีคำว่า A1/A2/B1/B2 อยู่เลย
  // #35/#34 เป็นบัญชีหัวข้อไวยากรณ์ ส่วน #33/#32 เป็นคอร์สตามธีมที่มีไวยากรณ์ประจำบท
  {
    table: 35, sheet: 'ENG_A1', project: 'eng', shape: 'grammar',
    course: { th: 'A1 · ไวยากรณ์พื้นฐาน', en: 'A1 · Grammar foundations' },
    blurb: { th: 'คำนาม คำสรรพนาม และรูปประโยคที่ต้องแม่นก่อนไปต่อ', en: 'Nouns, pronouns and the sentence shapes everything else rests on' },
  },
  {
    table: 34, sheet: 'ENG_A2', project: 'eng', shape: 'grammar',
    course: { th: 'A2 · ไวยากรณ์ที่ใช้บ่อย', en: 'A2 · Everyday grammar' },
    blurb: { th: 'Modals, phrasal verbs และการเทียบขั้นที่เจอทุกวัน', en: 'Modals, phrasal verbs and comparisons you meet daily' },
  },
  {
    table: 33, sheet: 'ENG_B1', project: 'eng', shape: 'outline',
    course: { th: 'B1 · สนทนาในชีวิตประจำวัน', en: 'B1 · Everyday conversation' },
    blurb: { th: 'เล่าเรื่องของตัวเองและเริ่มบทสนทนาได้เอง', en: 'Tell your own story and start the conversation yourself' },
  },
  {
    table: 32, sheet: 'ENG_B2', project: 'eng', shape: 'outline',
    course: { th: 'B2 · สื่อสารในที่ทำงาน', en: 'B2 · Communicating at work' },
    blurb: { th: 'ประชุม สัมภาษณ์ และแสดงความเห็นเรื่องที่ซับซ้อนขึ้น', en: 'Meetings, interviews and holding a more complex opinion' },
  },

  {
    table: 37, sheet: 'HSK4', project: 'zh', shape: 'chinese',
    course: { th: 'HSK ระดับ 4', en: 'HSK Level 4' },
    blurb: { th: 'สนทนาเรื่องสุขภาพ การทำงาน และการเดินทาง', en: 'Health, work and travel conversations' },
  },
  {
    table: 38, sheet: 'HSK5', project: 'zh', shape: 'chinese',
    course: { th: 'HSK ระดับ 5', en: 'HSK Level 5' },
    blurb: { th: 'เล่าประสบการณ์และจัดการเรื่องในชีวิตประจำวัน', en: 'Recount experiences and handle daily affairs' },
  },
  {
    table: 39, sheet: 'HSK6', project: 'zh', shape: 'chinese',
    course: { th: 'HSK ระดับ 6', en: 'HSK Level 6' },
    blurb: { th: 'วิเคราะห์ข่าว ประเด็นสังคม และวัฒนธรรม', en: 'Analyse news, social issues and culture' },
  },

  // แผ่น AI ให้มาแค่หน่วยกับชื่อเรื่อง ไม่มีชื่อคอร์ส
  // ชื่อคอร์สนี้จึงเป็นป้ายเดียวในระบบที่ไม่ได้มาจากข้อมูลจริง
  {
    table: 36, sheet: 'AI', project: 'ai', shape: 'flat',
    course: { th: 'AI สำหรับผู้เริ่มต้น', en: 'AI for beginners' },
    blurb: { th: 'ตั้งแต่ AI คืออะไร จนสั่งงานและทำมินิโปรเจกต์ได้', en: 'From what AI is to prompting it and shipping a mini project' },
  },
];

/* ============================================================
   3 · กฎแตกโครงสร้างต่อรูปทรงแผ่น
   ------------------------------------------------------------
   ทุกกฎคืน units[] โดยหน่วยมี topics[] (สามชั้น) หรือ items[] (สองชั้น) อย่างใดอย่างหนึ่ง
   ============================================================ */

/** หัวข้อที่ไม่มีลูก = หัวข้อที่มีสื่อชิ้นเดียวชื่อเดียวกับตัวมันเอง
    ดีกว่าทิ้ง (เนื้อหาหาย) และดีกว่าปล่อยกล่องเปล่า (กดเข้าไปแล้วตัน) */
const sealTopic = (t) => ({ name: t.name, items: t.items.length ? t.items : [t.name] });

/**
 * ประถม — คอร์ส = ชั้นปี · หน่วย = ภาคเรียน · หัวข้อ = คอลัมน์หน่วย · สื่อ = ชื่อเรื่อง
 *
 * จุดแบ่งภาคเรียนคือ "แถวว่างกลางตาราง" ที่คนทำชีตใส่ไว้เอง
 * ตรวจแล้วว่าทั้ง 30 แผ่นมีจุดนี้แผ่นละหนึ่งจุดพอดี และตกตรงรอยต่อหน่วยครบ 100%
 * ดีกว่าหั่นครึ่งตามจำนวนคาบ เพราะไม่มีหน่วยไหนถูกผ่ากลางให้เรียนคาบต่อคาบข้ามภาค
 *
 * assert สองข้อนี้สำคัญ — ถ้าชีตเปลี่ยนจนผิดกฎ ต้อง throw ไม่ใช่แบ่งผิดเงียบๆ
 */
function shapePrimary({ rows, breaks }, sheet) {
  if (breaks.length !== 1) throw new Error(`${sheet}: ต้องมีแถวว่างคั่นกลางหนึ่งจุด แต่พบ ${breaks.length}`);
  const cut = breaks[0];
  if (rows[cut - 1].unit === rows[cut].unit) throw new Error(`${sheet}: แถวว่างตกกลางหน่วย "${rows[cut].unit}"`);
  return [rows.slice(0, cut), rows.slice(cut)].map((half, i) => ({
    name: `ภาคเรียนที่ ${i + 1}`,
    topics: groupByUnit(half).map((g) => sealTopic({ name: g.name, items: g.rows })),
  }));
}

/**
 * ไวยากรณ์อังกฤษ (#34/#35) — หน่วย = หัวข้อไวยากรณ์ · หัวข้อ = แถวที่ขึ้นต้น "N."
 * แถวที่เหลือ ("N.M ..." หรือ "- ...") เป็นสื่อใต้หัวข้อที่ประกาศไว้ล่าสุด
 */
function shapeGrammar({ rows }) {
  return groupByUnit(rows).map((g) => {
    const topics = [];
    for (const title of g.rows) {
      if (/^\d+\.\s/.test(title)) topics.push({ name: title, items: [] });
      else {
        if (!topics.length) topics.push({ name: g.name, items: [] });
        topics[topics.length - 1].items.push(title);
      }
    }
    return { name: g.name, topics: topics.map(sealTopic) };
  });
}

/**
 * ทักษะที่แบบฝึกหัดของแผ่นอังกฤษผู้ใหญ่วัด — เก็บไว้ให้ปุ่ม "ทำแบบฝึกหัด" ใช้
 * เรียงตามลำดับที่ปรากฏในชีต (4.1 Grammar → 4.3 Reading → 4.5 Listening → 4.7 Writing → 4.9 Speaking)
 */
const PRACTICE_SKILLS = [
  ['grammar', /Grammar/i],
  ['reading', /Reading|ทักษะการอ่าน/i],
  ['listening', /Listening|ทักษะการฟัง/i],
  ['writing', /Writing|ทักษะการเขียน/i],
  ['speaking', /Speaking|ทักษะการพูด/i],
];

/** หัวข้อที่เป็นชุดแบบฝึกหัด — ข้อ 4.x (ระหว่างบท) และ 5.x (ท้ายบท) */
const isPracticeTopic = (name) => /^\s*[45]\./.test(name);

/**
 * อังกฤษผู้ใหญ่ (#32/#33) — หน่วย = "บทที่ N ..." · หัวข้อ = หนึ่งแถว · สื่อ = ข้อย่อยในแถวนั้น
 *
 * หนึ่งเซลล์บรรจุโครงร่างทั้งหัวข้อไว้ยาวเป็นย่อหน้า เช่น
 *   "2. Conversation 2.1 Talking about your workday 2.2 คำศัพท์ ... 2.5 Lecture-based Key Takeaway"
 * ตัดที่ตำแหน่งก่อนเลขสองชั้น ก้อนแรกคือชื่อหัวข้อ ที่เหลือคือสื่อทีละชิ้น
 *
 * ─────────────────────────────────────────────────────────────
 * (?<![\d.]) สำคัญมาก — ห้ามตัดกลางเลขสามชั้น
 * ─────────────────────────────────────────────────────────────
 * "3.6.1 Beautiful English" เข้าเงื่อนไข \d+\.\d+ ได้สองที่: ที่ "3.6" และที่ "6.1"
 * ไม่มี lookbehind มันจะตัดเป็น "3." กับ "6.1 Beautiful English" คนละชิ้น
 * แล้วเพลย์ลิสต์ขึ้นรายการชื่อ "3." ลอยๆ คั่นอยู่ระหว่างข้อย่อยจริงทุกครั้งที่มีเลขสามชั้น
 * lookbehind ปิดตำแหน่งที่มีตัวเลขหรือจุดนำหน้า เหลือแต่จุดเริ่มข้อจริงๆ
 *
 * ─────────────────────────────────────────────────────────────
 * ข้อ 4.x กับ 5.x ไม่เข้าเพลย์ลิสต์
 * ─────────────────────────────────────────────────────────────
 * สองชุดนี้คือ "แบบฝึกหัดระหว่างบท" กับ "แบบฝึกหัดท้ายบท" ซึ่งเป็นข้อสอบ ไม่ใช่สื่อให้ดู
 * ปนอยู่ในเพลย์ลิสต์แล้วผู้เรียนต้องไถผ่านรายการ "เฉลย…" สิบกว่าแถวกว่าจะถึงบทต่อไป
 * ย้ายไปอยู่หลังปุ่ม "ทำแบบฝึกหัด" แทน — ดู practice ที่คืนออกไปพร้อมกัน
 */
function shapeOutline({ rows }) {
  const skills = new Set();
  const units = groupByUnit(rows).map((g) => ({
    name: g.name,
    topics: g.rows
      .map((title) => {
        const parts = title
          .split(/(?<![\d.])(?=\d+\.\d+(?:\.\d+)?\s*\S)/)
          .map((s) => s.trim())
          .filter(Boolean);
        return { name: parts[0] ?? title, items: parts.slice(1) };
      })
      .filter((t) => {
        if (!isPracticeTopic(t.name)) return true;
        // เก็บว่าแบบฝึกหัดชุดนี้วัดทักษะอะไรบ้าง ก่อนจะทิ้งตัวหัวข้อไป
        const text = [t.name, ...t.items].join(' ');
        for (const [key, re] of PRACTICE_SKILLS) if (re.test(text)) skills.add(key);
        return false;
      })
      .map(sealTopic),
  }));
  return { units, practice: PRACTICE_SKILLS.map(([k]) => k).filter((k) => skills.has(k)) };
}

/**
 * จีน (#37–39) — หน่วย = ธีม (คอลัมน์ชื่อบทเรียน) · หัวข้อ = "บทที่ N ..." · สื่อ = ข้อย่อย "N.M ..."
 * รูปทรงเดียวกับไวยากรณ์ ต่างแค่ตัวจับหัวข้อ
 */
function shapeChinese({ rows }) {
  return groupByUnit(rows).map((g) => {
    const topics = [];
    for (const title of g.rows) {
      if (/^บทที่\s*\d/.test(title)) topics.push({ name: title, items: [] });
      else {
        if (!topics.length) topics.push({ name: g.name, items: [] });
        topics[topics.length - 1].items.push(title);
      }
    }
    return { name: g.name, topics: topics.map(sealTopic) };
  });
}

/** AI (#36) — สองชั้น หน่วยมีสื่อเป็นลูกโดยตรง ไม่มีชั้นหัวข้อคั่น */
function shapeFlat({ rows }) {
  return groupByUnit(rows).map((g) => ({ name: g.name, items: g.rows }));
}

const SHAPERS = {
  primary: shapePrimary,
  grammar: shapeGrammar,
  outline: shapeOutline,
  chinese: shapeChinese,
  flat: shapeFlat,
};

/* ============================================================
   4 · สร้าง แล้วตรวจก่อนเขียน
   ============================================================ */

// กฎแตกโครงสร้างคืน units[] เฉยๆ ยกเว้น outline ที่คืน { units, practice }
// เพราะแผ่นอังกฤษผู้ใหญ่เป็นชุดเดียวที่มีข้อสอบปนมาในตาราง แล้วเราแยกออกไปไว้หลังปุ่มแทน
const curriculum = SHEETS.map((s) => {
  const shaped = SHAPERS[s.shape](rowsOf(s.table), s.sheet);
  const { units, practice } = Array.isArray(shaped) ? { units: shaped } : shaped;
  return {
    sheet: s.sheet,
    project: s.project,
    course: s.course,
    blurb: s.blurb,
    ...(practice?.length ? { practice } : {}),
    units,
  };
});

const stats = { courses: curriculum.length, units: 0, topics: 0, items: 0 };
for (const c of curriculum) {
  for (const u of c.units) {
    stats.units++;
    if (u.topics) for (const t of u.topics) (stats.topics++, (stats.items += t.items.length));
    else stats.items += u.items.length;
  }
}

// กันเอาต์พุตพังเงียบ — ทุกกล่องต้องมีลูก ไม่งั้นผู้เรียนกดเข้าไปแล้วเจอหน้าว่าง
const problems = [];
for (const c of curriculum) {
  if (!c.units.length) problems.push(`${c.sheet}: ไม่มีหน่วยเลย`);
  for (const u of c.units) {
    if (u.topics && !u.topics.length) problems.push(`${c.sheet} / ${u.name}: ไม่มีหัวข้อเลย`);
    if (u.items && !u.items.length) problems.push(`${c.sheet} / ${u.name}: ไม่มีสื่อเลย`);
    for (const t of u.topics ?? []) {
      if (!t.items.length) problems.push(`${c.sheet} / ${u.name} / ${t.name}: ไม่มีสื่อเลย`);
    }
  }
}
if (problems.length) {
  console.error('แปลงแล้วได้กล่องเปล่า:\n' + problems.join('\n'));
  process.exit(1);
}

const header = `/**
 * หลักสูตรจริง — สร้างโดย scripts/build-curriculum.mjs
 *
 * *** ห้ามแก้ไฟล์นี้ด้วยมือ ***  แก้ที่สเปรดชีตต้นทางแล้วรัน npm run build:curriculum
 * ที่มา: data/curriculum-source.md (Google Sheets 1viBBiH-Cl18MklfLPmzSs47FSMjkxAe5sb_HbYx140A)
 *
 * ชื่อที่มาจากชีตเป็น "สตริงเดี่ยว" เพราะต้นทางมีภาษาเดียว — nodes.js ห่อเป็น { th, en } เอง
 * ส่วน course / blurb เป็น { th, en } จริง เพราะเขียนเองใน generator
 *
 * หน่วยมี topics[] (สามชั้น) หรือ items[] (สองชั้น) อย่างใดอย่างหนึ่ง
 * ต้องตรงกับจำนวนชั้นที่วิชานั้นประกาศไว้ใน projects.js — nodes.js มีตัวตรวจให้ตอน dev
 *
 * ${stats.courses} คอร์ส · ${stats.units} หน่วย · ${stats.topics} หัวข้อ · ${stats.items} สื่อ
 */
export const curriculum = `;

writeFileSync(resolve(ROOT, 'src/mock/curriculum.js'), header + JSON.stringify(curriculum, null, 1) + ';\n', 'utf8');

console.log(`${stats.courses} คอร์ส · ${stats.units} หน่วย · ${stats.topics} หัวข้อ · ${stats.items} สื่อ`);
for (const c of curriculum) {
  const t = c.units.reduce((a, u) => a + (u.topics?.length ?? 0), 0);
  const i = c.units.reduce((a, u) => a + (u.items?.length ?? u.topics.reduce((b, x) => b + x.items.length, 0)), 0);
  console.log(
    `  ${c.sheet.padEnd(8)} ${c.project.padEnd(6)} หน่วย ${String(c.units.length).padStart(3)} · หัวข้อ ${String(t).padStart(4)} · สื่อ ${String(i).padStart(4)}`,
  );
}
