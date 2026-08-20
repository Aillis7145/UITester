/**
 * ร่องรอยของผู้เรียนคนนี้ — ประวัติการเรียน และใบประกาศที่สอบผ่านแล้ว
 *
 * ทั้งสองชุดคิดจากต้นไม้เนื้อหาจริง ไม่ใช่ลิสต์ที่เขียน id ตายไว้
 * เพราะ id อย่าง `eng-c3-u1-t2-v2` เลื่อนทันทีที่ลำดับคอร์สในหลักสูตรขยับ
 * ลิสต์ที่เขียนมือจึงกลายเป็น id ผีเงียบๆ แล้วหน้าประวัติจะมีแถวที่กดแล้วไม่ไปไหน
 *
 * เขียนนามสกุลไฟล์ไว้ด้วยและห้ามใช้ alias @/ เหตุผลเดียวกับ nodes.js —
 * scripts/verify-ui.mjs import ไฟล์นี้ตรงๆ จาก Node ล้วนเพื่อเอาค่าคาดหวังมาใช้
 *
 * ─────────────────────────────────────────────────────────────
 * เวลาอ้างอิงเป็นค่าคงที่ ไม่ใช่ Date.now()
 * ─────────────────────────────────────────────────────────────
 * ถ้าอ่านนาฬิกาจริง ภาพถ่ายหน้าจอของ verify จะเปลี่ยนทุกวันโดยไม่มีใครแก้อะไร
 * แล้วคำถามว่า "ที่ต่างไปเพราะโค้ดที่เพิ่งแก้ หรือเพราะวันเปลี่ยน" จะตอบไม่ได้เลย
 *
 * เก็บเป็น "ห่างจากวันอ้างอิงกี่วัน" ไม่ใช่วันที่เต็ม ป้ายจึงยังอ่านว่า
 * วันนี้ / เมื่อวาน / 3 วันก่อน เหมือนของสด ทั้งที่ค่าคงที่
 *
 * และคิดวันด้วย Date.UTC ล้วน ไม่ใช่ new Date('...') —
 * เครื่องที่ตั้งโซนเวลาต่างกันต้องได้วันเดียวกัน ไม่งั้น verify บนเครื่อง UTC
 * จะเห็นวันเลื่อนไปหนึ่งวันจากที่เห็นบนเครื่องไทย
 */
import { projects } from './projects.js';
import { COURSE_EXAM_TOTAL } from './courseExam.js';
import { quizBank } from './quizbank.js';
import { quizFor, bankKeyOf, UNIT_SET } from './quizzes.js';
import { scoreQuiz } from './data.js';
import { rootsOf, childrenOf, getNode, progressOf, unitOf } from './nodes.js';

/** วันอ้างอิง — "วันนี้" ของข้อมูลจำลองชุดนี้ แก้บรรทัดเดียวได้ทั้งระบบ */
export const TODAY_UTC = Date.UTC(2026, 7, 20);

/** วันที่ของ "ห่างมา n วัน" — คืน Date ที่ต้องอ่านด้วย timeZone:'UTC' เท่านั้น */
export const dayAt = (offset) => new Date(TODAY_UTC - offset * 86_400_000);

/** แฮชสั้นๆ จากสตริง — ใช้แทนการสุ่ม ค่าเดิมทุกครั้งที่รัน */
function hashOf(s) {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 1_000_003;
  return h;
}

/** ใบไม้ทั้งหมดใต้กล่องนี้ เรียงตามลำดับที่ผู้เรียนไล่ดู */
function leavesOf(nodeId, out = []) {
  const kids = childrenOf(nodeId);
  if (!kids.length) {
    const n = getNode(nodeId);
    if (n?.level === 'content') out.push(n);
    return out;
  }
  for (const kid of kids) leavesOf(kid.id, out);
  return out;
}

const allCourses = projects.flatMap((p) => rootsOf(p.id));

/* ============================================================
   1 · ประวัติการเรียน
   ============================================================ */

/**
 * ประวัติเป็น "ครั้งที่นั่งเรียน" ไม่ใช่รายการเดี่ยวๆ ที่กระจายเท่ากัน
 *
 * คนเรียนจริงนั่งทีเดียวจบสามสี่คลิปติดกันในคอร์สเดียว แล้วหายไปครึ่งวันค่อยกลับมา
 * ถ้าปล่อยให้ทุกแถวห่างกันเท่าๆ กันและสลับวิชาไปมา หน้าจะอ่านเหมือนล็อกของเครื่อง
 * ไม่ใช่ประวัติของคน — และการจัดกลุ่มตามวันจะไม่มีอะไรให้จัดเลย
 *
 * แต่ละแถวในตารางนี้คือหนึ่งครั้งที่นั่งเรียน เรียงจากใหม่ไปเก่า
 */
const SESSIONS = [
  { items: 4, dayOffset: 0, startMin: 19 * 60 + 12 },
  { items: 3, dayOffset: 0, startMin: 12 * 60 + 40 },
  { items: 5, dayOffset: 1, startMin: 21 * 60 + 5 },
  { items: 3, dayOffset: 2, startMin: 8 * 60 + 15 },
  { items: 4, dayOffset: 2, startMin: 20 * 60 + 30 },
  { items: 6, dayOffset: 3, startMin: 13 * 60 + 55 },
  { items: 3, dayOffset: 5, startMin: 22 * 60 + 10 },
  { items: 4, dayOffset: 6, startMin: 9 * 60 + 40 },
];

/**
 * คอร์สที่ผู้เรียนแตะแล้วจริง เรียงตามความคืบหน้ามากไปน้อย
 * ประวัติจึงอ้างถึงเฉพาะสิ่งที่ "ดูแล้ว" ตรงกับแถบความคืบหน้าบนการ์ดคอร์สเสมอ
 */
const touchedCourses = allCourses
  .filter((c) => progressOf(c.id) > 0)
  .sort((a, b) => progressOf(b.id) - progressOf(a.id));

export const history = (() => {
  const rows = [];
  // ตัวชี้ว่าคอร์สนี้หยิบไปถึงชิ้นไหนแล้ว — ครั้งที่นั่งเรียนก่อนหน้าย่อมเป็นของที่เก่ากว่า
  const cursor = new Map();

  SESSIONS.forEach((session, si) => {
    const course = touchedCourses[si % touchedCourses.length];
    if (!course) return;

    const watched = leavesOf(course.id).filter((n) => n.watched);
    const taken = cursor.get(course.id) ?? 0;
    // หยิบจากท้ายรายการที่ดูแล้ว เพราะชิ้นท้ายสุดคือชิ้นที่เพิ่งดูไป
    const end = watched.length - taken;
    const picked = watched.slice(Math.max(0, end - session.items), end);
    if (!picked.length) return;
    cursor.set(course.id, taken + picked.length);

    let minute = session.startMin;
    const made = picked.map((node) => {
      const row = {
        id: `h-${si}-${node.id}`,
        nodeId: node.id,
        action: 'watch',
        dayOffset: session.dayOffset,
        minuteOfDay: minute,
        secondsSpent: node.durationSec ?? 360,
      };
      // เว้นสองนาทีระหว่างคลิป — คนกดคลิปถัดไปทันทีที่จบพอดีเป๊ะไม่มีจริง
      minute += Math.round((node.durationSec ?? 360) / 60) + 2;
      return row;
    });

    // ทุกครั้งที่นั่งเรียนครั้งที่สาม ปิดท้ายด้วยการลองทำแบบทดสอบท้ายบท
    // เป็นรายละเอียดจำลองล้วน มีไว้ให้หน้าประวัติมีมากกว่าคลิปอย่างเดียวให้ดู
    if (si % 3 === 0) {
      const last = picked[picked.length - 1];
      made.push({
        id: `h-${si}-quiz`,
        nodeId: last.id,
        action: 'quiz',
        dayOffset: session.dayOffset,
        minuteOfDay: minute + 3,
        secondsSpent: 420 + (hashOf(last.id) % 600),
      });
    }

    rows.push(...made);
  });

  // ใหม่ก่อนเก่า — วันน้อยกว่าคือใกล้กว่า ในวันเดียวกันคือเวลามากกว่า
  return rows.sort((a, b) => a.dayOffset - b.dayOffset || b.minuteOfDay - a.minuteOfDay);
})();

/** จัดกลุ่มตามวัน เรียงใหม่ไปเก่า — หน้าจอไม่ต้องรู้วิธีจัดกลุ่มเอง */
export function historyByDay(rows = history) {
  const days = new Map();
  for (const row of rows) {
    if (!days.has(row.dayOffset)) days.set(row.dayOffset, []);
    days.get(row.dayOffset).push(row);
  }
  return [...days.entries()].map(([dayOffset, items]) => ({ dayOffset, items }));
}

/* ============================================================
   2 · ใบประกาศนียบัตร
   ============================================================ */

/**
 * หนึ่งใบต่อหนึ่ง "คอร์ส" ออกให้เมื่อสอบปลายคอร์สผ่าน
 *
 * คะแนนในใบเป็นของสมมติ แต่ *คะแนนเต็ม* ไม่ใช่ — อ่านจากข้อสอบปลายคอร์สจริง (COURSE_EXAM_TOTAL)
 * ใบที่เขียนว่าเต็ม 40 ขณะที่ข้อสอบมี 50 ข้อ คือสองตัวเลขที่จะค่อยๆ เพี้ยนจากกันโดยไม่มีใครเห็น
 *
 * *** เงื่อนไขการได้ใบ: เรียนครบทุกบท ***
 * เดิมใช้ "คอร์สที่คืบหน้ามากที่สุดของวิชา และเกินครึ่ง" ซึ่งออกใบให้คอร์สที่เรียนไป 62% ได้
 * ทั้งที่ยังเหลืออีกสามในแปด อ่านแล้วขัดกับคำว่า "วุฒิบัตร" ตรงๆ
 *
 * ตอนนี้ต้อง progressOf === 1 เท่านั้น ซึ่งแปลว่าทุกบทในคอร์สจบ
 * และเพราะคะแนนท้ายบทมีให้เฉพาะบทที่จบ (ดูหมวด 3) "เรียนครบ" จึงพ่วง "ทำแบบทดสอบท้ายบทครบ" มาด้วยเสมอ
 * มีเช็คใน verify-ui.mjs ยืนยันความสัมพันธ์นี้ทั้งสองทาง
 */
const EXAM_TOTAL = COURSE_EXAM_TOTAL;

export const certificates = allCourses
  .filter((course) => progressOf(course.id) === 1)
  .map((course) => {
    const h = hashOf(course.id);
    // ราว 78–95% ของคะแนนเต็ม — ผ่านทุกใบ แต่ไม่เต็มสักใบ
    const score = Math.round(EXAM_TOTAL * 0.78) + (h % 9);
    return {
      id: `cert-${course.id}`,
      courseId: course.id,
      score,
      total: EXAM_TOTAL,
      percent: score / EXAM_TOTAL,
      dayOffset: 4 + (h % 40),
      // เลขอ้างอิงที่ใช้ตรวจสอบใบจริง — ผูกกับชื่อแผ่นงานซึ่งไม่ขยับตามลำดับคอร์ส
      credentialId: `UIT-${course.sheet}-${h.toString(36).toUpperCase().padStart(4, '0').slice(-4)}`,
    };
  })
  .sort((a, b) => a.dayOffset - b.dayOffset);

export const certificateOf = (courseId) => certificates.find((c) => c.courseId === courseId);

/* ============================================================
   3 · คะแนนแบบทดสอบท้ายบท — "ทุกรอบ" ไม่ใช่รอบล่าสุดรอบเดียว
   ============================================================ */

/**
 * แบบทดสอบท้ายบททำซ้ำได้ไม่จำกัด และคนทำซ้ำเพราะอยากได้คะแนนดีขึ้น
 * เก็บแค่รอบล่าสุดจึงทิ้งสิ่งที่ผู้เรียนอยากเห็นที่สุดไป — ว่าตัวเองดีขึ้นแค่ไหน
 * หนึ่งแถวในนี้ = หนึ่งรอบ แบบเดียวกับ history ที่หนึ่งแถว = หนึ่งครั้งที่เปิดดู
 *
 * ─────────────────────────────────────────────────────────────
 * ตัวหารมาจากข้อสอบจริง ไม่ใช่เลขที่พิมพ์ไว้
 * ─────────────────────────────────────────────────────────────
 * scoreQuiz(def).total นับเฉพาะข้อที่ตรวจอัตโนมัติได้ (ข้อเขียน/ข้อพูดไม่เข้าตัวหาร)
 * ได้ 16 สำหรับ ENG_B1 บทที่ 1 (20 ข้อ ตรวจได้ 16) และ 10 สำหรับบทอื่นที่ยังใช้ชุดตัวอย่าง
 * วันที่ quizbank.js โตขึ้น ตัวหารขยับตามเองโดยไม่ต้องแก้บรรทัดไหนในไฟล์นี้
 *
 * ─────────────────────────────────────────────────────────────
 * ตัวตั้งมีสองทาง เพราะตอนนี้มีชุดข้อสอบจริงอยู่บทเดียว
 * ─────────────────────────────────────────────────────────────
 * บทที่มีชุดจริง  → สร้างใบคำตอบจากคำถามจริงแล้วให้ scoreQuiz ตรวจ ตรวจย้อนกลับได้
 * บทอื่น        → คิดจากแฮชของไอดีบท เป็นข้อมูลจำลองล้วน
 * แถวติดธง real ไว้ หน้าจอจึงบอกได้ตรงๆ ว่าตัวไหนของจริง แทนที่จะกลบให้ดูเหมือนกันหมด
 */

/**
 * ทำซ้ำได้ถึงห้ารอบ — การ์ดบนหน้าความคืบหน้าโชว์แค่สามรอบล่าสุด ที่เหลืออยู่ใน popup
 * ถ้าเพดานเป็นสามเท่ากับที่การ์ดโชว์ได้ popup ก็ไม่มีอะไรให้เปิดดู
 */
const MAX_ROUNDS = 5;

/** บทที่เรียนจบแล้วเท่านั้นถึงจะมีคะแนนท้ายบท — คนทำแบบทดสอบหลังเรียนจบ ไม่ใช่ระหว่างทาง */
const finishedUnits = allCourses.flatMap((course) =>
  childrenOf(course.id)
    .filter((unit) => progressOf(unit.id) === 1)
    .map((unit) => ({ unit, course })),
);

/**
 * ใบคำตอบของบทที่มีชุดข้อสอบจริง — ตอบถูดทุกข้อ ยกเว้นที่แฮชสั่งให้ผิด
 * รอบหลังผิดน้อยลง (ตัวหาร k โตขึ้น) คะแนนจึงดีขึ้นเองโดยไม่ต้องบวกคะแนนตรงๆ
 */
function realAnswerSheet(questions, unitId, round) {
  const k = 3 + round * 2; // รอบ 1 ผิด ~1 ใน 5, รอบ 3 ผิด ~1 ใน 9
  const sheet = {};
  for (const q of questions) {
    if (!q.answerIds?.length) continue;
    const wrong = hashOf(`${unitId}#${round}#${q.id}`) % k === 0;
    const other = q.choices.find((c) => c.id !== q.answerIds[0]);
    sheet[q.id] = wrong && other ? [other.id] : [q.answerIds[0]];
  }
  return sheet;
}

export const unitAttempts = (() => {
  const rows = [];

  for (const { unit, course } of finishedUnits) {
    const def = quizFor(unit, UNIT_SET);
    const total = scoreQuiz(def).total;
    if (!total) continue;

    const real = Boolean(quizBank[bankKeyOf(unit)]);
    const rounds = 1 + (hashOf(unit.id) % MAX_ROUNDS);
    // คอร์สที่ออกใบประกาศไปแล้วต้องไม่มีบทที่ยังสอบตกค้างอยู่ในรอบล่าสุด
    // ไม่งั้นหน้าใบประกาศกับหน้าความคืบหน้าจะเถียงกันเองต่อหน้าผู้ประเมิน
    const floor = certificateOf(course.id) ? def.passMark + 0.05 : 0;

    // รอบแรกอยู่ไกลสุด แล้วไล่เข้าหาวันนี้ — คนทำซ้ำหลังจากรอบก่อน ไม่ใช่ก่อนหน้า
    let day = 6 + (hashOf(unit.id + '#d') % 50);

    for (let round = 1; round <= rounds; round++) {
      let score;
      if (real) {
        score = scoreQuiz(def, realAnswerSheet(def.questions, unit.id, round)).score;
      } else {
        const base = 0.42 + (hashOf(unit.id) % 46) / 100;
        const gain = ((round - 1) * (8 + (hashOf(`${unit.id}#${round}`) % 11))) / 100;
        score = Math.round(total * Math.min(1, base + gain));
      }
      // ยกพื้นเฉพาะรอบสุดท้ายของคอร์สที่มีใบประกาศ รอบก่อนหน้ายังตกได้ตามจริง
      if (round === rounds && floor) score = Math.max(score, Math.ceil(total * floor));

      rows.push({
        id: `qa-${unit.id}-${round}`,
        unitId: unit.id,
        courseId: course.id,
        projectId: unit.projectId,
        round,
        score,
        total,
        percent: score / total,
        passed: score / total >= def.passMark,
        real,
        dayOffset: day,
      });
      day = Math.max(0, day - (2 + (hashOf(`${unit.id}#gap#${round}`) % 8)));
    }
  }

  return rows.sort((a, b) => a.dayOffset - b.dayOffset || a.unitId.localeCompare(b.unitId));
})();

/**
 * ดัชนีต่อบท — สร้างครั้งเดียวตอนโหลด
 * หน้าความคืบหน้าถามทีละบท 218 ครั้งต่อการเรนเดอร์หนึ่งรอบ
 * ถ้าเป็น unitAttempts.filter() จะกลายเป็นการไล่ 142 แถวคูณ 218 ทุกครั้งที่เรียงใหม่
 */
const BY_UNIT = new Map();
for (const row of unitAttempts) {
  if (!BY_UNIT.has(row.unitId)) BY_UNIT.set(row.unitId, []);
  BY_UNIT.get(row.unitId).push(row);
}
for (const list of BY_UNIT.values()) list.sort((a, b) => a.round - b.round);

/** ทุกรอบของบทนี้ เรียงเก่า → ใหม่ · `[]` ถ้ายังไม่เคยทำ */
export const attemptsOf = (unitId) => BY_UNIT.get(unitId) ?? [];

/** รอบล่าสุด = สถานะปัจจุบันของผู้เรียนกับบทนี้ */
export const latestAttemptOf = (unitId) => {
  const list = BY_UNIT.get(unitId);
  return list?.[list.length - 1];
};

/**
 * คะแนนท้ายบทเฉลี่ยของคอร์ส — คิดจาก "รอบล่าสุด" ของแต่ละบท ไม่ใช่ทุกรอบ
 * เฉลี่ยทุกรอบจะลากคะแนนปัจจุบันลงด้วยรอบแรกที่ผู้เรียนแก้ไปแล้ว
 * `undefined` เมื่อยังไม่มีบทไหนในคอร์สนี้ทำแบบทดสอบเลย — ต่างจาก 0 ซึ่งแปลว่าทำแล้วได้ศูนย์
 */
export function courseQuizAvgOf(courseId) {
  const latest = childrenOf(courseId)
    .map((unit) => latestAttemptOf(unit.id))
    .filter(Boolean);
  if (!latest.length) return undefined;
  return latest.reduce((sum, a) => sum + a.percent, 0) / latest.length;
}

/* ============================================================
   ตรวจความสอดคล้องตอน dev — แนวเดียวกับ nodes.js
   ============================================================ */
if (import.meta.env?.DEV) {
  const problems = [];
  for (const row of history) {
    const node = getNode(row.nodeId);
    if (!node) problems.push(`${row.id}: ชี้ไปสื่อที่ไม่มีจริง (${row.nodeId})`);
    else if (!unitOf(row.nodeId)) problems.push(`${row.id}: หาหน่วยของสื่อไม่เจอ`);
  }
  if (new Set(history.map((r) => r.id)).size !== history.length) problems.push('ประวัติมี id ซ้ำ');
  for (const cert of certificates) {
    if (!getNode(cert.courseId)) problems.push(`${cert.id}: ชี้ไปคอร์สที่ไม่มีจริง`);
    if (cert.score > cert.total) problems.push(`${cert.id}: คะแนนเกินเต็ม`);
  }

  if (new Set(unitAttempts.map((a) => a.id)).size !== unitAttempts.length)
    problems.push('คะแนนท้ายบทมี id ซ้ำ');
  if (BY_UNIT.size !== finishedUnits.length)
    problems.push(`บทที่จบมี ${finishedUnits.length} บท แต่มีคะแนน ${BY_UNIT.size} บท`);
  for (const [unitId, list] of BY_UNIT) {
    if (progressOf(unitId) !== 1) problems.push(`${unitId}: มีคะแนนท้ายบททั้งที่ยังเรียนไม่จบ`);
    list.forEach((a, i) => {
      if (a.round !== i + 1) problems.push(`${a.id}: ลำดับรอบไม่ต่อเนื่อง`);
      if (a.score > a.total || a.score < 0) problems.push(`${a.id}: คะแนนเกินเต็มหรือติดลบ`);
      // รอบหลังต้องทำ "หลัง" รอบก่อน — dayOffset นับถอยหลังจากวันนี้ จึงต้องลดลง
      if (i > 0 && a.dayOffset > list[i - 1].dayOffset) problems.push(`${a.id}: รอบนี้ทำก่อนรอบที่แล้ว`);
    });
  }
  for (const cert of certificates) {
    for (const unit of childrenOf(cert.courseId)) {
      const last = latestAttemptOf(unit.id);
      if (last && !last.passed) problems.push(`${cert.id}: คอร์สออกใบประกาศแล้วแต่ ${unit.id} ยังสอบตกอยู่`);
    }
  }

  if (problems.length) console.warn('[records] ร่องรอยการเรียนมีปัญหา:\n' + problems.join('\n'));
}
