/**
 * ต้นไม้เนื้อหาของทุกวิชา — เก็บเป็น array แบนใบเดียวพร้อม parentId
 *
 * ทำไมแบน ไม่ใช่ children ซ้อนกัน:
 *   1. parentId ให้ ancestorsOf() สำหรับ breadcrumb ฟรี ต้นไม้ซ้อนต้องมี back-pointer อยู่ดี
 *   2. array แยกต่อชั้นคือโมเดลความลึกตายตัวที่เราเลิกใช้ไปแล้ว —
 *      วิชา ai มีสองชั้นขณะที่วิชาอื่นมีสาม การแยก array จะบังคับให้เขียน
 *      if (project.hasTopics) ทุกจุดที่เรียกใช้ ซึ่งคือ flow ตายตัวที่แอบกลับเข้ามาทางหลังบ้าน
 *
 * ชั้นใบไม้คือ level: 'content' เสมอ ส่วนชั้นกล่องมีอะไรบ้างดูที่ projects.js
 *
 * เนื้อหาทุกบรรทัดมาจาก curriculum.js ซึ่งแปลงจากสเปรดชีตหลักสูตรจริง
 * ไฟล์นี้รับผิดชอบแค่ "ห่อให้เป็นโหนด" — id, ลำดับ, ชนิดสื่อ, สถานะ, และของประกอบหน้าตา
 */
// เขียนนามสกุลไว้ด้วยโดยตั้งใจ — Vite ไม่ต้องการก็จริง แต่ Node ล้วนต้องการ
// ทำให้ scripts/verify-ui.mjs import ไฟล์นี้ตรงๆ ได้โดยไม่ต้องผ่าน bundler
// ห้ามเติม alias @/ เข้ามาในไฟล์นี้เด็ดขาด สคริปต์ตรวจจะโหลดไม่ได้ทันที
import { quiz, lessonDetail } from './data.js';
import { projects, DEFAULT_PROJECT_ID, LEVEL_ORDER, VIDEO_ONLY_SHEETS } from './projects.js';
import { curriculum } from './curriculum.js';

const nodes = [];
const push = (n) => (nodes.push(n), n);

/** ภาพนิ่ง วนใช้ 6 ภาพ — พอให้ลิสต์ดูมีชีวิตโดยไม่ต้องมีไฟล์เป็นพัน */
const STILLS = Array.from({ length: 6 }, (_, i) => `/mock/lesson-${i + 1}.jpg`);
const thumbAt = (i) => STILLS[i % STILLS.length];

/**
 * ปกคอร์ส — หนึ่งคอร์สหนึ่งไฟล์ ผูกด้วยชื่อแผ่นงานตรงๆ
 * ไม่มีการวนใช้ซ้ำ เพราะกริดรวมใช้รูปเป็นตัวแยกคอร์สออกจากกันก่อนอ่านตัวหนังสือ
 * ไฟล์มาจาก scripts/fetch-covers.mjs ซึ่งการันตีว่าไม่มีสองใบที่เนื้อไฟล์ตรงกัน
 */
const coverOf = (sheet) => `/mock/covers/${sheet.toLowerCase()}.jpg`;

/**
 * ชุดปกของ "หน่วย" — ปกของทุกคอร์สในวิชาเดียวกัน บวกภาพนิ่งกลาง
 *
 * ใช้ปกของคอร์สพี่น้องได้เพราะอยู่วิชาเดียวกัน ภาพจึงยังเล่าเรื่องเดียวกัน
 * และทำให้วิชาที่มีหกคอร์สได้ 12 แบบ พอดีกับ 12 หน่วยโดยไม่ซ้ำเลยสักใบ
 *
 * ภาพนิ่งกลางใช้ข้ามวิชาได้โดยตั้งใจ — กดเข้าคอร์สแล้วผู้เรียนรู้อยู่แล้วว่าอยู่วิชาอะไร
 * ที่ห้ามซ้ำเด็ดขาดคือ "ปกคอร์ส" ซึ่งไปรวมกันอยู่ในกริดเดียวที่หน้าแรก
 */
const SHEETS_OF = curriculum.reduce((acc, c) => {
  (acc[c.project] ??= []).push(coverOf(c.sheet));
  return acc;
}, {});
const unitCoversOf = (project) => [...(SHEETS_OF[project.id] ?? []), ...STILLS];

/**
 * curriculum.js เก็บชื่อจากชีตเป็นสตริงเดี่ยว เพราะต้นทางมีภาษาเดียว
 * ห่อเป็น { th, en } ตรงนี้ที่เดียว — p() จึงอ่านได้เหมือนเนื้อหาสองภาษาอื่นๆ
 * ค่า en เท่ากับ th โดยตั้งใจ ไม่ใช่ของที่ลืมแปล (ดูหัวไฟล์ scripts/build-curriculum.mjs)
 */
const bi = (s) => ({ th: s, en: s });

const pad = (n) => String(n).padStart(2, '0');

/* ============================================================
   ชนิดสื่อ — อ่านจากชื่อเรื่องจริง ไม่ใช่วนตามลำดับ
   ------------------------------------------------------------
   ของเดิมวนชนิดตามลำดับในกล่อง ซึ่งพอมาเจอข้อมูลจริงจะได้ผลที่อ่านแล้วรู้ทันทีว่าพัง
   เช่น "เฉลย Grammar Practice" กลายเป็นไฟล์เสียง

   หลักสูตรจริงบอกชนิดมาในชื่ออยู่แล้ว จึงอ่านจากชื่อ แล้ว fallback เป็นวิดีโอ
   ลำดับการเช็คสำคัญ — "เฉลยแบบฝึกหัด" ต้องเป็นเอกสาร ไม่ใช่ข้อสอบ

   ยกเว้นคอร์สใน VIDEO_ONLY_SHEETS ที่ประกาศไว้แล้วว่าผลิตครบทุกหัวข้อเป็นคลิป
   ตรงนั้นชื่อหัวข้อไม่ได้บอกชนิดสื่อ การเดาจากชื่อจึงผิดเสมอ ไม่ใช่ผิดบางที
   ============================================================ */
function kindOf(title, sheet) {
  if (VIDEO_ONLY_SHEETS.includes(sheet)) return 'video';
  if (/^\s*(\d+(\.\d+)*\s*)?เฉลย|คำศัพท์|Vocabulary|ใบงาน|บทนำ|Introductory/i.test(title)) return 'doc';
  if (/แบบฝึกหัด|แบบทดสอบ|Unit Quiz|Practice/i.test(title)) return 'quiz';
  if (/ฟัง|Listening|ออกเสียง|การพูด|Speaking|Repeat after Me|Conversation|สนทนา/i.test(title)) return 'audio';
  if (/กิจกรรม|เวิร์กช็อป|Workshop|มินิโปรเจกต์|โปรเจกต์/i.test(title)) return 'activity';
  return 'video';
}

/* ============================================================
   สร้างโหนดจากหลักสูตรจริง
   ============================================================ */

/**
 * ความคืบหน้าเริ่มต้นต่อคอร์ส — คิดเป็นสัดส่วน ไม่ใช่จำนวนชิ้นตายตัว
 * เพราะคอร์สจริงมีตั้งแต่ 26 ถึง 963 ชิ้น เลขตายตัวจะแปลว่า 100% กับ 3% พร้อมกัน
 *
 * ค่าแรกคือ 0.4 เสมอ — คอร์สแรกของทุกวิชาจึงมีความคืบหน้าให้เห็น
 * ที่เหลือคละกันเพื่อให้กริดรวมมีทั้งการ์ดที่เพิ่งเริ่ม เกือบจบ และยังไม่แตะ
 */
const WATCH_SHARE = [0.4, 0.15, 0, 0.62, 0.08, 0];

/** ระดับความยากอ่านจากชื่อแผ่น ไม่ต้องเก็บซ้ำใน curriculum.js */
function difficultyOf(sheet) {
  const primary = /^[A-Z]{3}_P(\d)$/.exec(sheet);
  if (primary) return { th: `ป.${primary[1]}`, en: `Grade ${primary[1]}` };
  const cefr = /^ENG_(A1|A2|B1|B2)$/.exec(sheet);
  if (cefr) return { th: cefr[1], en: cefr[1] };
  const hsk = /^HSK(\d)$/.exec(sheet);
  if (hsk) return { th: `HSK ${hsk[1]}`, en: `HSK ${hsk[1]}` };
  return { th: 'เริ่มต้น', en: 'Beginner' };
}

const getProjectDef = (id) => projects.find((p) => p.id === id);

/* ============================================================
   เอกสารประกอบของหน่วย — มีเฉพาะคอร์สใน VIDEO_ONLY_SHEETS
   ------------------------------------------------------------
   คอร์สกลุ่มนี้ไม่มีเอกสารแทรกอยู่ในเพลย์ลิสต์แล้ว เอกสารจึงต้องมีที่อยู่จริงที่เดียว
   ไม่งั้นคำศัพท์ประจำบทกับสคริปต์บทสนทนาที่หลักสูตรระบุไว้จะหายไปทั้งชุด
   โดยไม่มีอะไรมาแทน ซึ่งแย่กว่าปล่อยให้แทรกอยู่ในเพลย์ลิสต์เสียอีก

   รายการคิดจากชื่อหัวข้อ *ในหน่วยนั้นจริงๆ* ไม่ใช่ลิสต์ตายตัวสามบรรทัดแบบ lessonDetail
   หน่วยที่ไม่มีบทสนทนาจึงไม่มีไฟล์สคริปต์ให้โหลด —
   รายการดาวน์โหลดที่โกหกว่ามีไฟล์แย่กว่ารายการที่สั้นกว่าความจริง
   ============================================================ */
const UNIT_FILES = [
  { match: undefined, name: { th: 'เอกสารประกอบบทเรียน', en: 'Lesson handout' } },
  { match: /คำศัพท์|Vocabulary|Word Wise/i, name: { th: 'คำศัพท์ประจำบท', en: 'Unit vocabulary list' } },
  { match: /Conversation|บทสนทนา|สนทนา/i, name: { th: 'สคริปต์บทสนทนา', en: 'Conversation scripts' } },
  { match: /Grammar|ไวยากรณ์/i, name: { th: 'สรุปไวยากรณ์ของบท', en: 'Grammar summary' } },
];

/**
 * titles = ชื่อหัวข้อ *และ* ชื่อกลุ่มในหน่วยนั้น
 * ต้องเอาชื่อกลุ่มมาด้วย เพราะกลุ่มชื่อ "2. Conversation" มีลูกชื่อ "2.1 First Day at Work"
 * ดูแต่ชื่อลูกจะสรุปว่าหน่วยนี้ไม่มีบทสนทนา ทั้งที่ทั้งกลุ่มเป็นบทสนทนา
 */
function unitResourcesOf(unitId, titles, practice) {
  const hay = titles.join('\n');
  const picked = UNIT_FILES.filter((f) => !f.match || f.match.test(hay)).map((f) => f.name);
  if (practice?.length) picked.push({ th: 'ใบงานแบบฝึกหัดท้ายบท', en: 'End-of-unit worksheet' });

  // ขนาดไฟล์คิดจากไอดีหน่วย ไม่ใช่สุ่ม — ภาพถ่ายหน้าจอรอบสองต้องได้ตัวเลขเดิมเป๊ะ
  let h = 0;
  for (const ch of unitId) h = (h * 31 + ch.charCodeAt(0)) % 100000;
  return picked.map((name, i) => ({
    id: `${unitId}-r${i + 1}`,
    type: 'pdf',
    name,
    sizeKb: 240 + ((h + i * 617) % 1800),
  }));
}

/**
 * หนึ่งคอร์สพร้อมลูกทั้งกิ่ง
 *
 * ทำสองรอบโดยตั้งใจ: รอบแรกสร้างโหนดและจำลำดับสื่อไว้ รอบสองค่อยตั้งสถานะ
 * เพราะสถานะคิดจาก "สัดส่วนของทั้งคอร์ส" ซึ่งยังไม่รู้จนกว่าจะสร้างครบ
 */
function buildCourse(entry, courseIndex, totalInProject, projectIndex) {
  const project = getProjectDef(entry.project);
  const id = `${entry.project}-c${courseIndex + 1}`;
  const [unitLevel, topicLevel] = [project.levels[1]?.level, project.levels[2]?.level];
  const unitCovers = unitCoversOf(project);

  const courseNode = push({
    id,
    projectId: entry.project,
    parentId: null,
    level: 'course',
    order: courseIndex + 1,
    sheet: entry.sheet,
    icon: project.icon,
    hue: project.hue,
    cover: coverOf(entry.sheet),
    title: entry.course,
    subtitle: entry.blurb,
    instructor: project.instructor,
    difficulty: difficultyOf(entry.sheet),
    rating: 4.2 + ((courseIndex * 3 + projectIndex) % 8) / 10,
    enrolled: 180 + courseIndex * 137 + projectIndex * 53,
    // เหลื่อมเดือนข้ามวิชาโดยตั้งใจ — ถ้าปล่อยให้แต่ละวิชาไล่เดือนของตัวเอง
    // กริดที่เรียง "ล่าสุดก่อน" จะขึ้นวิชาเดียวเรียงกันสองแถวแรก แล้วดูเหมือนไม่ได้รวม
    updatedAt: `2026-${pad(((courseIndex * 2 + projectIndex) % 12) + 1)}-${pad(((courseIndex * 3 + projectIndex * 5) % 28) + 1)}`,
    tags: [project.tag, difficultyOf(entry.sheet)],
    // ชุดทักษะที่แบบฝึกหัดของคอร์สนี้วัด — มีเฉพาะคอร์สที่หลักสูตรมีข้อ 4.x/5.x จริง
    // คอร์สอื่นได้ undefined แล้วปุ่ม "ทำแบบฝึกหัด" ก็ไม่โผล่ ไม่ต้องมีธงเปิด/ปิดแยก
    ...(entry.practice ? { practice: entry.practice } : {}),
  });

  // สื่อทุกชิ้นของคอร์สเรียงตามลำดับที่ผู้เรียนจะไล่ดู + รู้ว่าอยู่หน่วยที่เท่าไร
  const stream = [];
  let seed = courseIndex * 7 + projectIndex * 3;

  const addContent = (parentId, order, title, unitIndex) => {
    const kind = kindOf(title, entry.sheet);
    const node = push({
      id: `${parentId}-v${order}`,
      projectId: entry.project,
      parentId,
      level: 'content',
      order,
      title: bi(title),
      kind,
      thumb: thumbAt(seed),
      watched: false,
      locked: false,
    });
    if (kind === 'video' || kind === 'audio') node.durationSec = 420 + ((seed * 137) % 620);
    if (kind === 'doc') node.pages = 4 + (seed % 9);
    if (kind === 'activity') node.estMin = 10 + ((seed * 5) % 25);
    if (kind === 'quiz') node.quizId = quiz.id; // ข้อสอบมีชุดเดียวทั้งระบบ ทุกชิ้นจึงชี้ชุดเดียวกัน
    seed++;
    stream.push({ node, unitIndex });
    return node;
  };

  entry.units.forEach((unit, ui) => {
    const unitId = `${id}-u${ui + 1}`;
    push({
      id: unitId,
      projectId: entry.project,
      parentId: id,
      level: unitLevel,
      order: ui + 1,
      title: bi(unit.name),
      // หน่วยมีปกของตัวเอง เพราะหน้าไล่ระดับแสดงเป็นการ์ดรูปเหมือนหน้าคอร์ส
      // เลื่อนด้วย courseIndex ด้วย ไม่ใช่แค่ ui — ไม่งั้นทุกคอร์สในวิชาเดียวกัน
      // จะได้ปกหน่วยเรียงเหมือนกันเป๊ะ แล้ว ป.1 กับ ป.2 ดูเป็นหน้าเดียวกัน
      cover: unitCovers[(courseIndex + ui) % unitCovers.length],
      // เอกสารแขวนที่ "หน่วย" ไม่ใช่ที่สื่อแต่ละชิ้น เพราะเป็นของประจำบท
      // ไล่ดูคลิปไหนในบทก็เห็นรายการเดียวกัน ไม่ต้องย้อนกลับไปหาชิ้นที่แนบไฟล์ไว้
      ...(VIDEO_ONLY_SHEETS.includes(entry.sheet)
        ? {
            resources: unitResourcesOf(
              unitId,
              unit.topics ? unit.topics.flatMap((t) => [t.name, ...t.items]) : unit.items,
              entry.practice,
            ),
          }
        : {}),
    });

    if (unit.topics) {
      unit.topics.forEach((topic, ti) => {
        const topicId = `${unitId}-t${ti + 1}`;
        push({ id: topicId, projectId: entry.project, parentId: unitId, level: topicLevel, order: ti + 1, title: bi(topic.name) });
        topic.items.forEach((title, vi) => addContent(topicId, vi + 1, title, ui));
      });
    } else {
      // วิชาสองชั้น (ai) — สื่อแขวนใต้หน่วยโดยตรง ไม่มีกล่องคั่น
      unit.items.forEach((title, vi) => addContent(unitId, vi + 1, title, ui));
    }
  });

  /* ---------- รอบสอง: สถานะ ---------- */
  // ล็อกเฉพาะหน่วยสุดท้ายของสองคอร์สท้ายวิชา คิดจากจำนวนคอร์สจริงไม่ใช่เลขตายตัว
  //
  // ห้ามล็อกทั้งคอร์สเด็ดขาด ต่อให้ดูสมจริงกว่าก็ตาม
  // เพราะคอร์สที่ทุกชิ้นล็อกจะกดเข้าไปแล้วตัน เปิดอะไรไม่ได้เลยสักชิ้น
  // ทุกคอร์สในระบบนี้มีหน่วยอย่างน้อยสองหน่วย การล็อกหน่วยท้ายจึงเหลือทางเดินเสมอ
  const lockLastUnit = courseIndex >= totalInProject - 2 && entry.units.length > 1;
  const lastUnitIndex = entry.units.length - 1;
  const watchCount = Math.round(stream.length * WATCH_SHARE[courseIndex % WATCH_SHARE.length]);

  let watchedSec = 0;
  let totalSec = 0;
  stream.forEach(({ node, unitIndex }, k) => {
    node.locked = lockLastUnit && unitIndex === lastUnitIndex;
    node.watched = !node.locked && k < watchCount;
    totalSec += node.durationSec ?? (node.estMin ?? 6) * 60;
    if (node.watched) watchedSec += node.durationSec ?? 0;
  });

  courseNode.durationMin = Math.round(totalSec / 60);
  courseNode.watchedMin = Math.round(watchedSec / 60);
  return courseNode;
}

// นับลำดับคอร์สภายในวิชา แยกจากลำดับใน curriculum.js เพราะ id ต้องเริ่มที่ 1 ทุกวิชา
const perProjectTotal = {};
for (const entry of curriculum) perProjectTotal[entry.project] = (perProjectTotal[entry.project] ?? 0) + 1;

const perProjectSeen = {};
for (const entry of curriculum) {
  const ci = perProjectSeen[entry.project] ?? 0;
  perProjectSeen[entry.project] = ci + 1;
  buildCourse(entry, ci, perProjectTotal[entry.project], projects.findIndex((p) => p.id === entry.project));
}

/* ============================================================
   รายละเอียดบทเรียนต่อคอร์ส
   ------------------------------------------------------------
   lessonDetail ใน data.js เป็น object เดี่ยวที่ไม่มี foreign key
   ถ้าปล่อยให้ทุกสื่อใช้ตัวเดียวกัน วิดีโอคณิต ป.1 จะขึ้นว่า
   "ฝึกโมเดล Machine Learning ตัวแรกด้วย scikit-learn" ซึ่งอ่านแล้วรู้ทันทีว่าพัง

   จึงสร้างคำอธิบายกับวัตถุประสงค์จากชื่อคอร์สเอง ส่วนเอกสาร/ถาม-ตอบ/บันทึกย่อ
   ยังใช้ของกลางร่วมกัน เพราะเป็นโครงหน้าตาที่ต้องมีให้ประเมิน ไม่ใช่เนื้อหาที่ต้องตรงวิชา
   ============================================================ */
for (const course of nodes) {
  if (course.level !== 'course') continue;
  const { th, en } = course.title;
  course.detail = {
    ...lessonDetail,
    description: {
      th: `บทเรียนชุดนี้อยู่ในคอร์ส "${th}" ${course.subtitle?.th ?? ''} เนื้อหาเรียงตามหลักสูตรจริงจากต้นจนจบ ดูจบแล้วทำแบบทดสอบท้ายบทได้ทันที`,
      en: `Part of "${en}". ${course.subtitle?.en ?? ''} It follows the real syllabus from start to finish, and ends with a quiz.`,
    },
    objectives: [
      { th: `เข้าใจแนวคิดหลักของ${th}`, en: `Grasp the core ideas behind ${en.toLowerCase()}` },
      { th: 'ทำตามตัวอย่างในคลิปได้ด้วยตัวเอง', en: 'Follow along with the worked examples' },
      { th: 'แยกแยะข้อผิดพลาดที่พบบ่อยได้', en: 'Spot the mistakes people usually make' },
      { th: 'นำไปใช้กับโจทย์ที่ยังไม่เคยเห็นได้', en: 'Apply it to problems you have not seen before' },
    ],
  };
}

/* ============================================================
   ดัชนี — สร้างครั้งเดียวตอนโหลด
   ห้ามเดินต้นไม้ตอน render เพราะ contentCountOf ถูกเรียกใบละครั้ง
   คูณจำนวนการ์ด คูณทุกตัวอักษรที่พิมพ์ในช่องค้นหา
   ============================================================ */

const BY_ID = new Map(nodes.map((n) => [n.id, n]));
const KIDS = new Map();
for (const n of nodes) {
  const key = n.parentId ?? `root:${n.projectId}`;
  if (!KIDS.has(key)) KIDS.set(key, []);
  KIDS.get(key).push(n);
}
for (const list of KIDS.values()) list.sort((a, b) => a.order - b.order);

/**
 * { total, watched, unlocked } ของทุกกล่อง คิดจากใบไม้ขึ้นมา ครั้งเดียว
 *
 * unlocked อยู่ในก้อนเดียวกันโดยตั้งใจ — ตัวตรวจตอน dev เคยถามคำถามนี้ด้วยการ
 * สแกนทุกโหนดแล้วไล่ ancestorsOf ต่อ "ทุกราก" ซึ่งกับหลักสูตรจริง (38 ราก × 5.4 พันโหนด)
 * กลายเป็นงานเกือบล้านครั้งทุกครั้งที่โหลดหน้า ตอบจาก rollup ที่วิ่งอยู่แล้วได้ฟรี
 */
const ROLLUP = new Map();
function rollup(node) {
  if (ROLLUP.has(node.id)) return ROLLUP.get(node.id);
  let r;
  if (node.level === 'content') {
    r = { total: 1, watched: node.watched ? 1 : 0, unlocked: node.locked ? 0 : 1 };
  } else {
    r = { total: 0, watched: 0, unlocked: 0 };
    for (const kid of KIDS.get(node.id) ?? []) {
      const k = rollup(kid);
      r.total += k.total;
      r.watched += k.watched;
      r.unlocked += k.unlocked;
    }
  }
  ROLLUP.set(node.id, r);
  return r;
}
nodes.forEach(rollup);

/* ============================================================
   ตัวช่วย
   ============================================================ */

export const getProject = (id) => projects.find((p) => p.id === id);
export const getNode = (id) => BY_ID.get(id);
export const rootsOf = (projectId) => KIDS.get(`root:${projectId}`) ?? [];
export const childrenOf = (nodeId) => KIDS.get(nodeId) ?? [];
export const siblingsOf = (nodeId) => childrenOf(getNode(nodeId)?.parentId);

/**
 * ราก → พ่อ (ไม่รวมตัวเอง) — ใช้ทำ breadcrumb
 *
 * seen กันไว้เผื่อข้อมูลมีวงจรใน parentId ซึ่งไม่มีอะไรตรวจให้เลย
 * ถ้าไม่กัน ลูปนี้จะวนไม่รู้จบและแท็บค้างทั้งแท็บ ซึ่งดีบั๊กยากกว่า error หลายเท่า
 */
export function ancestorsOf(nodeId) {
  const out = [];
  const seen = new Set([nodeId]);
  let cur = getNode(nodeId);
  while (cur?.parentId && !seen.has(cur.parentId)) {
    seen.add(cur.parentId);
    cur = getNode(cur.parentId);
    if (cur) out.unshift(cur);
  }
  return out;
}

/**
 * ชั้นถัดไปตามที่วิชาประกาศไว้ — 'content' เมื่อหมดชั้นกล่องแล้ว
 *
 * การ์ด i < 0 สำคัญกว่าที่เห็น: findIndex คืน -1 เมื่อชั้นนั้นไม่ได้ถูกประกาศไว้
 * แล้ว levels[-1 + 1] คือ levels[0] ซึ่งคือ 'course' — ไม่ใช่ "ไม่เจอ"
 * แต่เป็น "เจอ แล้วตอบว่าลูกของมันคือคอร์ส" ซึ่งเป็นคำตอบที่แย่ที่สุดที่จะตอบได้
 * เพราะ BrowseScreen จะเรนเดอร์ SubjectCard ทับกล่องชั้นกลาง
 * แล้ว node.rating.toFixed() พังเป็นจอขาวห่างจากต้นเหตุไปสามไฟล์
 */
export function nextLevel(project, level) {
  const i = project.levels.findIndex((l) => l.level === level);
  if (i < 0) return undefined;
  return project.levels[i + 1]?.level ?? 'content';
}
export const levelDef = (project, level) => project.levels.find((l) => l.level === level);

/**
 * ชั้น "หน่วย" ของวิชา — กล่องที่กดแล้วถึงวิดีโอเลย เป็น levels[1] เสมอ
 *
 * ไม่ใช่ "ชั้นล่างสุด" เพราะวิชาส่วนใหญ่มีชั้นหัวข้ออยู่ใต้หน่วย
 * ถ้านิยามว่าเป็นชั้นล่างสุด หน้าไล่ระดับจะกลายเป็นรายการหัวข้อเรียงแบนหลายร้อยใบ
 * แล้วเพลย์ลิสต์ไม่เหลืออะไรให้จัดกลุ่มเลย
 */
export const unitLevelOf = (project) => project.levels[1]?.level;

/** หน่วยที่โหนดนี้สังกัด — ตัวโหนดเองถ้ามันคือหน่วย */
export function unitOf(nodeId) {
  const node = getNode(nodeId);
  if (!node) return undefined;
  const level = unitLevelOf(getProject(node.projectId));
  if (!level) return undefined;
  if (node.level === level) return node;
  return ancestorsOf(nodeId).find((a) => a.level === level);
}

export const contentCountOf = (nodeId) => ROLLUP.get(nodeId)?.total ?? 0;
export const progressOf = (nodeId) => {
  const r = ROLLUP.get(nodeId);
  return r?.total ? r.watched / r.total : 0;
};

/** ใบไม้ซ้ายสุดใต้กล่องนี้ · seen กันวงจรเหมือน ancestorsOf */
export function firstContentOf(nodeId, seen = new Set()) {
  const n = getNode(nodeId);
  if (!n || seen.has(n.id)) return undefined;
  seen.add(n.id);
  if (n.level === 'content') return n;
  for (const kid of childrenOf(n.id)) {
    const found = firstContentOf(kid.id, seen);
    if (found) return found;
  }
  return undefined;
}

/** ใบไม้แรกที่ยังไม่ได้ดูและไม่ล็อก มิฉะนั้นคืนตัวแรก — ใช้กับปุ่ม "เรียนต่อ" */
export function resumeContentOf(nodeId) {
  const seen = new Set();
  const walk = (id) => {
    const n = getNode(id);
    if (!n || seen.has(n.id)) return undefined;
    seen.add(n.id);
    if (n.level === 'content') return !n.watched && !n.locked ? n : undefined;
    for (const kid of childrenOf(n.id)) {
      const found = walk(kid.id);
      if (found) return found;
    }
    return undefined;
  };
  return walk(nodeId) ?? firstContentOf(nodeId);
}

/** คอร์สที่ node นี้สังกัด — ใช้ดึง hue กับผู้สอนซึ่งเก็บไว้ชั้นบนสุดเท่านั้น */
export const courseOf = (nodeId) => ancestorsOf(nodeId)[0] ?? getNode(nodeId);

/**
 * สื่อที่ควรเปิดเมื่อไม่มี ?node= ติดมา — ทุกหน้าต้องเรนเดอร์ได้ลำพัง
 * คิดจากต้นไม้จริง ไม่ใช่ id ที่เขียนตายไว้ ซึ่งจะกลายเป็น id ผีทันทีที่หลักสูตรเปลี่ยน
 */
export const defaultContentOf = (projectId) => resumeContentOf(rootsOf(projectId)[0]?.id);

/**
 * สื่อชิ้นแรกของคอร์สที่มีแบบฝึกหัด — ให้หน้า practice เรนเดอร์ได้ลำพังโดยไม่มี ?node
 *
 * ถ้าปล่อยให้ตกไปใช้คอร์สเริ่มต้นเหมือนหน้าอื่น หน้านั้นในสตูดิโอจะขึ้นสถานะว่างทุกธีม
 * เพราะคอร์สเริ่มต้นเป็นวิชาประถมซึ่งหลักสูตรไม่มีชุดแบบฝึกหัด
 */
export const defaultPracticeContentOf = () => {
  const course = projects.flatMap((p) => rootsOf(p.id)).find((c) => c.practice?.length);
  return course && resumeContentOf(course.id);
};

/** สื่อที่ผู้เรียนกำลังค้างอยู่ — เดิมเขียน id ตายไว้ใน data.js แล้วพังทุกครั้งที่ข้อมูลขยับ */
export const currentLessonId = defaultContentOf(DEFAULT_PROJECT_ID)?.id;

/**
 * แถว "เรียนต่อ" — คิดจากต้นไม้จริง จึงข้ามวิชาได้เองและไม่มีวันชี้ไป id ผี
 *
 * ยกเว้นรายการสุดท้ายที่ชี้ไป node ที่ไม่มีจริง "โดยตั้งใจ" — ห้ามแก้ให้ถูก
 * มีไว้ทดสอบ fallback สองชั้นคนละแบบ:
 *   ไม่มีคอร์ส → ทิ้งทั้งแถว
 *   ไม่มีสื่อ  → ยังเรนเดอร์ได้ด้วยรูปปกและคำโปรยของคอร์ส
 */
export const continueLearning = (() => {
  const picks = ['eng-p', 'mat-p', 'eng', 'zh'];
  const rows = picks
    .map((projectId, i) => {
      const course = rootsOf(projectId)[0];
      const node = course && resumeContentOf(course.id);
      if (!course || !node) return undefined;
      return { projectId, courseId: course.id, nodeId: node.id, leftSec: 120 + i * 97 };
    })
    .filter(Boolean);
  const orphanHost = rootsOf('sci-p')[0];
  if (orphanHost) rows.push({ projectId: 'sci-p', courseId: orphanHost.id, nodeId: 'ไม่มีจริง-โดยตั้งใจ', leftSec: 126 });
  return rows;
})();

/* ============================================================
   ตรวจความสอดคล้องตอน dev — แนวเดียวกับ checkLocaleParity
   ============================================================ */
if (import.meta.env?.DEV) {
  const problems = [];
  const seenIds = new Set();
  for (const n of nodes) {
    if (seenIds.has(n.id)) problems.push(`${n.id}: id ซ้ำ`);
    seenIds.add(n.id);
    if (n.parentId && !BY_ID.has(n.parentId)) problems.push(`${n.id}: ไม่มีพ่อ ${n.parentId}`);
    const project = getProject(n.projectId);
    if (!project) problems.push(`${n.id}: ไม่มีวิชา ${n.projectId}`);
    else if (n.level !== 'content' && !project.levels.some((l) => l.level === n.level))
      problems.push(`${n.id}: วิชา ${n.projectId} ไม่ได้ประกาศชั้น ${n.level}`);
  }
  for (const project of projects) {
    // levels[] ต้องเป็นลำดับย่อยของ LEVEL_ORDER — เลือกข้ามชั้นได้ แต่ห้ามสลับลำดับ
    let prev = -1;
    for (const l of project.levels) {
      const at = LEVEL_ORDER.indexOf(l.level);
      if (at < 0) problems.push(`${project.id}: ไม่รู้จักชั้น ${l.level}`);
      else if (at <= prev) problems.push(`${project.id}: ชั้น ${l.level} สลับลำดับผิดจาก LEVEL_ORDER`);
      else prev = at;
    }
    if (project.levels[0]?.level !== LEVEL_ORDER[0]) problems.push(`${project.id}: ชั้นแรกต้องเป็น ${LEVEL_ORDER[0]}`);
    // flow ยุบเหลือ 2 คลิกได้ก็ต่อเมื่อทุกวิชามีชั้นหน่วยจริง
    if (project.levels.length < 2) problems.push(`${project.id}: ต้องมีอย่างน้อยสองชั้น (คอร์ส + หน่วย)`);
    if (!project.short?.th || !project.short?.en) problems.push(`${project.id}: ไม่มี short สำหรับติดแท็กบนการ์ด`);

    const roots = rootsOf(project.id);
    if (!roots.length) problems.push(`${project.id}: ไม่มีคอร์สเลย`);
    for (const root of roots) {
      const unitLevel = unitLevelOf(project);
      if (!childrenOf(root.id).some((k) => k.level === unitLevel)) problems.push(`${root.id}: ไม่มีหน่วยสักใบ`);
      const r = ROLLUP.get(root.id);
      if (!r?.total) problems.push(`${root.id}: กดเข้าไปแล้วตัน ไม่มีสื่อสักชิ้น`);
      // ล็อกทั้งคอร์สไม่ได้ ไม่งั้นผู้เรียนกดเข้าไปแล้วเปิดอะไรไม่ได้เลยสักชิ้น
      else if (!r.unlocked) problems.push(`${root.id}: สื่อทุกชิ้นถูกล็อก เปิดอะไรไม่ได้เลย`);
    }
  }
  if (problems.length) console.warn('[nodes] โครงสร้างเนื้อหามีปัญหา:\n' + problems.join('\n'));
}
