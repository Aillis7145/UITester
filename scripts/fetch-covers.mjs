/**
 * ดึง "ปกคอร์ส" หนึ่งใบต่อหนึ่งคอร์ส จาก Openverse → public/mock/covers/
 *
 *   node scripts/fetch-covers.mjs                    ดึงครบทุกใบ
 *   node scripts/fetch-covers.mjs --only=tha_p3,hsk5 ดึงเฉพาะที่ระบุ (ใช้ไล่แก้ทีละใบ)
 *
 * รันด้วยมือตอนตั้งของ ไม่ได้เรียกตอน build — ไฟล์ที่ได้คอมมิตลง repo
 * เพื่อให้เว็บทำงานได้แบบออฟไลน์และภาพไม่หายถ้าต้นทางเปลี่ยน
 *
 * ─────────────────────────────────────────────────────────────
 * ทำไมไม่ใช้ Unsplash เหมือน scripts/fetch-images.mjs
 * ─────────────────────────────────────────────────────────────
 * ไฟล์นั้นเก็บ "รหัสรูป" ไว้ตายตัว ซึ่งพอต้องการปกไม่ซ้ำกันครบ 38 ใบ
 * ก็ต้องหารหัสมาเพิ่มอีก 38 ตัวด้วยตาเปล่า และ endpoint ค้นหาสาธารณะของ Unsplash ปิดไปแล้ว
 * Openverse ค้นด้วยคำได้ กรองตามสัญญาอนุญาตได้ และคืนข้อมูลสัญญาอนุญาตมาให้ตรวจ
 *
 * *** รับเฉพาะ cc0 · pdm · by เท่านั้น ***
 *
 * เริ่มจากรับแค่ cc0/pdm ซึ่งไม่บังคับเครดิต แต่คลังสองอันนั้นเป็นของพิพิธภัณฑ์กับหอจดหมายเหตุเสียส่วนใหญ่
 * ค้น "นักเรียนในห้องเรียน" แล้วได้แบบแปลนอาคารกับภาพเหมือนพระอัครสังฆราชมาแทน
 * เติม CC BY เข้าไปทำให้คลังกว้างขึ้นมากและได้รูปที่ตรงเรื่องจริง
 *
 * CC BY **บังคับให้ระบุผู้สร้าง** — CREDITS.md จึงเก็บชื่อผู้สร้างกับลิงก์ต้นทางไว้ครบทุกใบ
 * นั่นคือเหตุผลที่ตารางนั้นมีอยู่ ไม่ใช่ของประดับ **ห้ามลบทิ้งพร้อมกับไฟล์รูป**
 *
 * รูปพวกนี้เป็นของสำหรับตัวอย่างหน้าจอ ไม่ใช่ปกคอร์สจริงของลูกค้า
 * ตอนขึ้นระบบจริงต้องเปลี่ยนเป็นรูปของลูกค้าเองอยู่แล้ว
 *
 * ─────────────────────────────────────────────────────────────
 * กฎของปก
 * ─────────────────────────────────────────────────────────────
 * 1. **หนึ่งคอร์ส = หนึ่งไฟล์ ห้ามซ้ำแม้แต่คู่เดียว** ทั้งในวิชาเดียวกันและข้ามวิชา
 *    ในกริดรวม 38 ใบ รูปคือสิ่งแรกที่ตากวาดเจอก่อนชื่อและก่อนแท็ก
 *    ป.1 กับ ป.3 ที่ใช้รูปเดียวกันจะถูกอ่านว่าเป็นคอร์สเดียวกัน
 *    สคริปต์เทียบ md5 ของไฟล์ ไม่ใช่แค่ id เพราะคำค้นคนละคำคืนรูปเดียวกันได้
 *
 * 2. **คำค้นต้องเป็นเรื่องที่คอร์สนั้นสอนจริง** ไม่ใช่ชื่อวิชากว้างๆ
 *    คำกว้างอย่าง "english" คืนรูปคีย์บอร์ดกับหน้าจอคอมพิวเตอร์เต็มไปหมด
 *    ซึ่งเคยหลุดขึ้นเป็นปกคอร์สภาษาอังกฤษมาแล้ว
 *
 * 3. เขียนคำค้นสำรองไว้หลายตัว เพราะคลัง CC0 ไม่ได้มีทุกเรื่อง
 *    ตัวแรกคือคำที่ตรงที่สุด ตัวถัดไปคือคำที่กว้างขึ้นแต่ยังอยู่ในเรื่องเดียวกัน
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const OUT = 'public/mock/covers';
const API = 'https://api.openverse.org/v1/images/';
const UA = 'UITester/1.0 (learning-platform UI showcase)';
const MAX_BYTES = 700 * 1024;

/**
 * ชื่อไฟล์ = ชื่อแผ่นงานใน curriculum.js ตัวพิมพ์เล็ก
 * ผูก 1:1 กับคอร์สโดยไม่ต้องมีตารางแมปอีกชั้น — เพิ่มคอร์สใหม่ก็เพิ่มแถวเดียวที่นี่
 */
const TARGETS = [
  // ---- ภาษาอังกฤษ ประถม : ตัวอักษร → อ่าน → คำศัพท์ → ห้องเรียน → นิทาน → เขียน ----
  ['eng_p1', 'alphabet letter blocks', 'wooden letters'],
  ['eng_p2', 'girl reading book', 'boy reading book library'],
  ['eng_p3', 'dictionary page words', 'open book text close up'],
  ['eng_p4', 'students in classroom', 'teacher blackboard students'],
  ['eng_p5', 'fairy tale book illustration', 'vintage childrens book illustration'],
  ['eng_p6', 'pencil writing on notebook', 'handwriting practice paper'],

  // ---- คณิตศาสตร์ : นับ → บวกลบ → คูณ → เรขาคณิต → เศษส่วน → พีชคณิต ----
  ['mat_p1', 'abacus', 'counting frame beads'],
  ['mat_p2', 'colourful number magnets', 'math worksheet numbers'],
  ['mat_p3', 'multiplication table', 'arithmetic chalkboard numbers'],
  ['mat_p4', 'origami paper shapes', 'colourful shape sorter toy'],
  ['mat_p5', 'fraction circles math', 'bar chart statistics graph'],
  ['mat_p6', 'mathematical equations blackboard', 'algebra formula chalk'],

  // ---- วิทยาศาสตร์ : พืช → สัตว์ → เครื่องมือ → หิน → อวกาศ → พลังงาน ----
  ['sci_p1', 'seedling sprout soil', 'young plant growing'],
  ['sci_p2', 'butterfly macro wings', 'insect close up'],
  ['sci_p3', 'microscope laboratory', 'science laboratory glassware'],
  ['sci_p4', 'mineral crystal specimen', 'rock geology specimen'],
  ['sci_p5', 'planet saturn rings', 'milky way stars night sky'],
  ['sci_p6', 'lightning storm', 'electricity spark'],

  // ---- สังคมศึกษา : ชุมชน → ตลาด → แผนที่ → โบราณคดี → ภูมิศาสตร์ → เศรษฐศาสตร์ ----
  ['soc_p1', 'traditional village houses', 'neighbourhood street houses'],
  ['soc_p2', 'floating market vendor', 'street market stall'],
  ['soc_p3', 'antique world map', 'old cartography map'],
  ['soc_p4', 'ancient stone ruins', 'archaeological site temple'],
  ['soc_p5', 'terrestrial globe sphere', 'atlas globe desk'],
  ['soc_p6', 'thai baht coins', 'coin collection pile'],

  // ---- ภาษาไทย : ตัวอักษร → เอกสารโบราณ → จิตรกรรม → นาฏศิลป์ → วรรณคดี → วัฒนธรรม ----
  ['tha_p1', 'thai inscription stone', 'thai letters signboard', 'thai writing'],
  ['tha_p2', 'palm leaf manuscript', 'ancient manuscript scroll'],
  ['tha_p3', 'thai temple mural', 'thai wat painting'],
  ['tha_p4', 'khon mask thailand', 'thai dancer traditional'],
  ['tha_p5', 'thai script book page', 'thai newspaper text'],
  ['tha_p6', 'thai buddha statue', 'thai temple architecture'],

  // ---- ภาษาอังกฤษ CEFR : คำศัพท์ → ไวยากรณ์ → สนทนา → ที่ทำงาน ----
  ['eng_a1', 'letter tiles words', 'word cards spelling'],
  ['eng_a2', 'open textbook study notes', 'notebook pen study english'],
  ['eng_b1', 'two women talking', 'people conversation coffee shop'],
  ['eng_b2', 'business meeting discussion', 'office conference table people'],

  // ---- ภาษาจีน HSK ----
  ['hsk4', 'chinese calligraphy brush', 'chinese ink writing'],
  ['hsk5', 'chinese characters sign', 'chinese shop signage'],
  ['hsk6', 'chinese text page book', 'mandarin characters page'],

  // ---- AI ----
  ['ai', 'robot arm industrial', 'robot toy machine'],
];

fs.mkdirSync(OUT, { recursive: true });

/**
 * ค้นแบบผ่อนตัวกรองเป็นขั้น — เอาแนวนอนก่อน แล้วค่อยยอมรับสัดส่วนอื่น
 *
 * aspect_ratio=wide บวก license=cc0,pdm บวกคำค้นเจาะจง ทำให้หลายคำไม่เหลือผลลัพธ์เลย
 * ทั้งที่ผ่อนแค่สัดส่วนก็ได้รูปที่ใช้ได้ (การ์ดครอบด้วย object-cover อยู่แล้ว)
 *
 * ตัวกรองสัญญาอนุญาต **ห้ามผ่อน** เพราะเป็นเงื่อนไขว่าใช้ได้โดยไม่ต้องให้เครดิต
 */
async function search(q) {
  const out = [];
  const seen = new Set();
  for (const extra of ['&aspect_ratio=wide', '']) {
    const url = `${API}?q=${encodeURIComponent(q)}&license=cc0,pdm,by&page_size=16&mature=false${extra}`;
    try {
      const res = await fetch(url, { headers: { 'user-agent': UA } });
      if (!res.ok) continue;
      for (const hit of (await res.json()).results ?? []) {
        if (seen.has(hit.id)) continue;
        seen.add(hit.id);
        out.push(hit);
      }
    } catch {
      /* ลองชั้นถัดไป */
    }
  }
  return out;
}

async function grab(u) {
  const res = await fetch(u, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  // ไฟล์เล็กผิดปกติมักเป็นหน้า error ที่ต้นทางส่งกลับมาแทนรูป
  if (buf.length < 8000) throw new Error(`เล็กเกินไป (${buf.length} bytes)`);
  return buf;
}

// --only=a,b → ดึงเฉพาะที่ระบุ ใช้ไล่แก้ทีละใบโดยไม่ต้องโหลดใหม่ทั้ง 38
const only = (process.argv.find((a) => a.startsWith('--only=')) ?? '').slice(7).split(',').filter(Boolean);

const credits = [];
const usedSums = new Map();
let failed = 0;

// ไฟล์ที่มีอยู่แล้วนับเป็น "ใช้ไปแล้ว" ด้วย
// ไม่งั้นโหมด --only จะดึงรูปที่ซ้ำกับใบที่ไม่ได้แตะรอบนี้มาโดยไม่รู้ตัว
for (const f of fs.readdirSync(OUT).filter((n) => n.endsWith('.jpg'))) {
  const keep = f.replace(/\.jpg$/, '');
  if (only.includes(keep)) continue;
  usedSums.set(createHash('md5').update(fs.readFileSync(path.join(OUT, f))).digest('hex'), keep);
}

for (const [name, ...queries] of TARGETS) {
  if (only.length && !only.includes(name)) continue;

  let results = [];
  for (const q of queries) {
    results = results.concat(await search(q));
    if (results.length >= 16) break;
  }

  let done = false;
  for (const hit of results) {
    try {
      let buf = await grab(hit.url);
      // ต้นฉบับบางใบเป็นไฟล์หลายเมกะไบต์ — ใช้ตัวย่อของ Openverse แทน
      if (buf.length > MAX_BYTES && hit.thumbnail) buf = await grab(hit.thumbnail);
      if (buf.length > MAX_BYTES) throw new Error(`ใหญ่เกินไป (${Math.round(buf.length / 1024)} KB)`);

      const sum = createHash('md5').update(buf).digest('hex');
      if (usedSums.has(sum)) throw new Error(`ได้ไฟล์เดียวกับ ${usedSums.get(sum)}`);

      fs.writeFileSync(path.join(OUT, `${name}.jpg`), buf);
      usedSums.set(sum, name);
      credits.push({
        name,
        query: queries[0],
        license: `${(hit.license ?? '').toUpperCase()} ${hit.license_version ?? ''}`.trim(),
        source: hit.foreign_landing_url ?? hit.url,
        title: (hit.title ?? '').slice(0, 60) || 'ไม่มีชื่อ',
        creator: hit.creator || 'ไม่ระบุ',
      });
      console.log(`OK   ${name}.jpg  ${(buf.length / 1024).toFixed(0)} KB  ${hit.license}  "${(hit.title ?? '').slice(0, 42)}"`);
      done = true;
      break;
    } catch (err) {
      console.log(`skip ${name} <- ${hit.id}: ${err.message}`);
    }
  }
  if (!done) {
    failed++;
    console.log(`FAIL ${name} — ไม่มีผลลัพธ์ตัวไหนใช้ได้ (คำค้น "${queries.join('" / "')}")`);
  }
}

/* ---------- CREDITS ---------- */
// โหมด --only แก้เฉพาะแถวของตัวเอง แถวอื่นคงไว้ ไม่งั้นตารางจะเหลือแค่ใบที่เพิ่งดึง
const CRED = path.join(OUT, 'CREDITS.md');
const rows = new Map();
if (fs.existsSync(CRED)) {
  for (const line of fs.readFileSync(CRED, 'utf8').split(/\r?\n/)) {
    const m = /^\| ([a-z0-9_]+)\.jpg \|/.exec(line);
    if (m) rows.set(m[1], line);
  }
}
for (const c of credits) {
  rows.set(c.name, `| ${c.name}.jpg | ${c.query} | ${c.creator} | ${c.license} | [${c.title}](${c.source}) |`);
}
const ordered = TARGETS.map(([n]) => rows.get(n)).filter(Boolean);

fs.writeFileSync(
  CRED,
  `# ที่มาของปกคอร์ส\n\n` +
    `ทุกใบเป็น CC0 · สาธารณสมบัติ (PDM) หรือ CC BY\n` +
    `**ใบที่เป็น CC BY บังคับให้ระบุผู้สร้าง** ตารางนี้จึงเป็นการให้เครดิตตามเงื่อนไข ไม่ใช่ของประดับ\n` +
    `ห้ามลบทิ้งพร้อมกับไฟล์รูป และถ้าเอารูปไปใช้ที่อื่นต้องพาตารางนี้ไปด้วย\n\n` +
    `รูปพวกนี้เป็นของสำหรับตัวอย่างหน้าจอ ไม่ใช่ปกคอร์สจริง — ขึ้นระบบจริงต้องเปลี่ยนเป็นรูปของลูกค้าเอง\n\n` +
    `ดึงด้วย \`node scripts/fetch-covers.mjs\` ผ่าน [Openverse](https://openverse.org)\n\n` +
    `| ไฟล์ | คำค้น | ผู้สร้าง | สัญญาอนุญาต | ต้นทาง |\n|---|---|---|---|---|\n${ordered.join('\n')}\n`,
);

const onDisk = fs.readdirSync(OUT).filter((n) => n.endsWith('.jpg')).length;
console.log(
  `\n${failed === 0 ? 'ครบทุกปกที่ขอ' : `ขาด ${failed} ปก`} · มีในโฟลเดอร์ ${onDisk}/${TARGETS.length} ไฟล์ · ไม่มีไฟล์ซ้ำ`,
);
process.exit(failed === 0 ? 0 : 1);
