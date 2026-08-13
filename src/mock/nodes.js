/**
 * ต้นไม้เนื้อหาของทุกโครงการ — เก็บเป็น array แบนใบเดียวพร้อม parentId
 *
 * ทำไมแบน ไม่ใช่ children ซ้อนกัน:
 *   1. ข้อมูลเดิมแบนอยู่แล้ว (sections[].subjectId, lessons[].sectionId)
 *      การย้ายมาจึงเป็นแค่เปลี่ยนชื่อกับเปลี่ยนพ่อ ไม่ใช่พิมพ์ใหม่ทั้งไฟล์
 *   2. parentId ให้ ancestorsOf() สำหรับ breadcrumb ฟรี ต้นไม้ซ้อนต้องมี back-pointer อยู่ดี
 *   3. array แยกต่อชั้นคือโมเดลความลึกตายตัวที่เรากำลังจะเลิกใช้ —
 *      p2 ไม่มีชั้น lesson และ p3 ไม่มีชั้น module การแยก array จะบังคับให้เขียน
 *      if (project.hasModules) ทุกจุดที่เรียกใช้ ซึ่งคือ flow ตายตัวที่แอบกลับเข้ามาทางหลังบ้าน
 *
 * ชั้นใบไม้คือ level: 'content' เสมอ ส่วนชั้นกล่องมีอะไรบ้างดูที่ projects.js
 */
// เขียนนามสกุลไว้ด้วยโดยตั้งใจ — Vite ไม่ต้องการก็จริง แต่ Node ล้วนต้องการ
// ทำให้สคริปต์ตรวจสอบ import ไฟล์นี้ตรงๆ ได้โดยไม่ต้องผ่าน bundler
import { subjects, sections, lessons, quiz, currentLessonId } from './data.js';
import { projects, DEFAULT_PROJECT_ID } from './projects.js';

const nodes = [];
const push = (n) => (nodes.push(n), n);

/** ภาพนิ่ง วนใช้ 6 ภาพเหมือนของเดิม — พอให้ลิสต์ดูมีชีวิตโดยไม่ต้องมีไฟล์เป็นร้อย */
const thumbAt = (i) => `/mock/lesson-${(i % 6) + 1}.jpg`;
/** รูปปกวนจากที่มีอยู่จริงใน public/mock — ไม่ต้องหาไฟล์ใหม่ */
const COVERS = [
  '/mock/ai.jpg', '/mock/python.jpg', '/mock/webdev.jpg', '/mock/prompt.jpg',
  '/mock/math.jpg', '/mock/physics.jpg', '/mock/chemistry.jpg', '/mock/biology.jpg',
  '/mock/thai.jpg', '/mock/english.jpg', '/mock/history.jpg', '/mock/geography.jpg',
];

/* ============================================================
   ชิ้นสื่อ (ใบไม้)
   ============================================================ */

/**
 * ชนิดสื่อวนตามลำดับในกล่อง ไม่ได้สุ่ม
 * เพราะอยากให้ทุกกล่องมีสื่อคละชนิดแน่นอน จะได้เห็นว่าแต่ละธีมรับมือไอคอน/ป้ายยังไง
 * และผลลัพธ์ต้องเหมือนเดิมทุกครั้งที่โหลด ไม่งั้นภาพถ่ายเทียบธีมจะไม่ตรงกัน
 */
const KIND_CYCLE = ['video', 'video', 'doc', 'video', 'audio', 'video', 'activity'];

const content = (projectId, parentId, order, title, kind, i, state) => {
  const node = {
    id: `${parentId}-c${order}`,
    projectId,
    parentId,
    level: 'content',
    order,
    title,
    kind,
    thumb: thumbAt(i),
    watched: state === 'watched',
    locked: state === 'locked',
  };
  if (kind === 'video' || kind === 'audio') node.durationSec = 420 + ((i * 137) % 620);
  if (kind === 'doc') node.pages = 4 + (i % 9);
  if (kind === 'activity') node.estMin = 10 + ((i * 5) % 25);
  return push(node);
};

/* ============================================================
   โครงการที่ 1 — แปลงจากข้อมูลเดิมใน data.js
   ============================================================ */

/**
 * ชั้น "หัวข้อ" เป็นชั้นใหม่ที่แทรกเข้ามา ไม่เคยมีในข้อมูลเดิม
 * แบ่งด้วยมือแทนการหั่นอัตโนมัติ เพราะการหั่นทีละ 3 จะได้ชื่อกลุ่มว่า "หัวข้อ 1"
 * ซึ่งดูปลอมทันทีที่เห็น ตารางนี้คือของใหม่ทั้งหมดที่ต้องพิมพ์
 */
const P1_TOPICS = [
  ['sec1', { th: 'AI คืออะไร', en: 'What AI is' }, ['l1', 'l2', 'l3']],
  ['sec1', { th: 'ขอบเขตและจริยธรรม', en: 'Scope and ethics' }, ['l4', 'l5']],
  ['sec2', { th: 'ข้อมูลและการเรียนรู้', en: 'Data and learning' }, ['l6', 'l7', 'l8']],
  ['sec2', { th: 'ฝึกและวัดผลโมเดล', en: 'Training and evaluation' }, ['l9', 'l10', 'l11', 'l12']],
  ['sec2', { th: 'เลือกและปรับโมเดล', en: 'Choosing and tuning' }, ['l13', 'l14']],
  ['sec3', { th: 'โครงสร้างนิวรอน', en: 'Neuron structure' }, ['l15', 'l16', 'l17']],
  ['sec3', { th: 'ฝึกเครือข่ายจริง', en: 'Training a real network' }, ['l18', 'l19', 'l20']],
  ['sec3', { th: 'สถาปัตยกรรมสมัยใหม่', en: 'Modern architectures' }, ['l21', 'l22', 'l23', 'l24']],
];

/** หน่วยกับหัวข้อของอีก 11 วิชาที่ข้อมูลเดิมไม่มีลูก — เขียนสั้นๆ พอให้กดเข้าไปแล้วไม่ตัน */
const P1_FILLER = {
  s2: [['เตรียมข้อมูลด้วย pandas', 'Wrangling with pandas'], ['สรุปและนำเสนอผล', 'Summarising results']],
  s3: [['เขียนพรอมต์ให้ตรงเป้า', 'Prompting with intent'], ['ตรวจและปรับผลลัพธ์', 'Reviewing the output']],
  s4: [['องค์ประกอบของหน้าเว็บ', 'Anatomy of a page'], ['ทำให้ใช้งานได้จริง', 'Shipping a real site']],
  s5: [['อสมการและกราฟ', 'Inequalities and graphs'], ['ตรีโกณมิติเบื้องต้น', 'Intro trigonometry']],
  s6: [['คลื่นและเสียง', 'Waves and sound'], ['แสงเชิงเรขาคณิต', 'Geometric optics']],
  s7: [['เซลล์และการแบ่งเซลล์', 'Cells and division'], ['พันธุกรรมเบื้องต้น', 'Intro to genetics']],
  s8: [['อ่านวรรณคดีให้เข้าใจ', 'Reading the classics'], ['กลวิธีทางวรรณศิลป์', 'Literary technique']],
  s9: [['บทสนทนาที่เจอบ่อย', 'Conversations you will meet'], ['ออกเสียงและจังหวะ', 'Pronunciation and rhythm']],
  s10: [['สุโขทัยถึงอยุธยา', 'Sukhothai to Ayutthaya'], ['รัตนโกสินทร์', 'The Rattanakosin era']],
  s11: [['อัตราการเกิดปฏิกิริยา', 'Reaction rates'], ['สมดุลเคมี', 'Chemical equilibrium']],
  s12: [['แผนที่และภูมิอากาศ', 'Maps and climate'], ['การใช้ทรัพยากร', 'Resource use']],
};

/**
 * ชื่อสื่อของส่วนที่ใช้ตัวเติม — ประกอบจากชื่อกล่องแม่ จึงอ่านรู้เรื่องโดยไม่ต้องพิมพ์เป็นร้อยบรรทัด
 *
 * มีสองชุดเพื่อให้กล่องพี่น้องไม่ได้ชื่อสื่อซ้ำกันเป๊ะ
 * ชุดแรกเป็นแนวทำความเข้าใจ ชุดที่สองเป็นแนวลงมือทำ ซึ่งเป็นลำดับที่คอร์สจริงใช้กันอยู่แล้ว
 */
const CONTENT_SETS = [
  [
    (th, en) => ({ th: `แนะนำ${th}`, en: `Intro to ${en.toLowerCase()}` }),
    (th, en) => ({ th: `แนวคิดหลักของ${th}`, en: `Key ideas of ${en.toLowerCase()}` }),
    (th, en) => ({ th: `ตัวอย่างจากงานจริง: ${th}`, en: `${en} in the real world` }),
    (th, en) => ({ th: `สรุป${th}`, en: `${en} recap` }),
  ],
  [
    (th, en) => ({ th: `เตรียมตัวก่อนฝึก${th}`, en: `Before you practise ${en.toLowerCase()}` }),
    (th, en) => ({ th: `ทำตามทีละขั้น: ${th}`, en: `Step by step: ${en}` }),
    (th, en) => ({ th: `โจทย์ฝึกด้วยตัวเอง: ${th}`, en: `Practice set: ${en}` }),
    (th, en) => ({ th: `ตรวจงานและสรุป${th}`, en: `Review and wrap up ${en.toLowerCase()}` }),
  ],
];

/** base = ชื่อที่เอาไปประกอบเป็นชื่อสื่อ ส่งเข้ามาแทนการอ่านจากชื่อกล่องเอง
    ไม่งั้นจะได้ชื่อซ้อนคำนำหน้าสองชั้น เช่น "แนะนำทำความเข้าใจ..." */
const fillContent = (projectId, parentId, base, setIndex, seed, state) => {
  CONTENT_SETS[setIndex % CONTENT_SETS.length].forEach((make, k) => {
    const title = make(base.th, base.en);
    content(projectId, parentId, k + 1, title, KIND_CYCLE[(seed + k) % KIND_CYCLE.length], seed + k, state);
  });
};

function buildP1() {
  // 12 วิชาเดิม → ชั้น course · level เดิมคือ "ความยาก" จึงเปลี่ยนชื่อเป็น difficulty
  // ไม่งั้นชนกับ level ที่บอกว่าอยู่ชั้นไหนแล้วทับกันเงียบๆ
  // ทิ้ง lessonCount กับ progress เพราะสองตัวนี้กลายเป็น rollup ที่คิดจากต้นไม้จริง
  subjects.forEach((s, i) => {
    // ทิ้ง lessonCount กับ progress ทิ้งไปโดยตั้งใจ ทั้งคู่กลายเป็น rollup ที่คิดจากต้นไม้จริง
    const { level, lessonCount: _n, progress: _p, ...rest } = s;
    push({ ...rest, projectId: 'p1', parentId: null, level: 'course', order: i + 1, difficulty: level });
  });

  // 3 บทเดิม → ชั้น module (คำนำหน้า "บทที่ N ·" ถูกตัดออกจาก data.js แล้ว
  // เพราะ UI ประกอบ "{ป้ายชั้น} {order} · {title}" จากประกาศของโครงการเอง)
  sections.forEach((sec, i) =>
    push({ id: sec.id, projectId: 'p1', parentId: sec.subjectId, level: 'module', order: i + 1, title: sec.title }),
  );

  // ชั้นหัวข้อที่แทรกใหม่ + ย้าย 24 บทเรียนเดิมมาเป็นสื่อใต้หัวข้อ
  const perModule = {};
  P1_TOPICS.forEach(([moduleId, title, lessonIds], ti) => {
    const id = `t${ti + 1}`;
    perModule[moduleId] = (perModule[moduleId] ?? 0) + 1;
    push({ id, projectId: 'p1', parentId: moduleId, level: 'lesson', order: perModule[moduleId], title });

    lessonIds.forEach((lid, k) => {
      const l = lessons.find((x) => x.id === lid);
      push({
        id: lid, // คงไอดีเดิมไว้ ลิงก์เก่าและ currentLessonId จึงยังใช้ได้
        projectId: 'p1',
        parentId: id,
        level: 'content',
        order: k + 1, // นับใหม่ในหัวข้อ ไม่ใช่เลขวิ่ง 1..24 ทั้งวิชา
        title: l.title,
        kind: 'video',
        durationSec: l.durationSec,
        thumb: l.thumb,
        watched: l.watched,
        locked: l.locked,
      });
    });
  });

  // สื่อคละชนิดแทรกในหัวข้อจริง ให้โครงการเริ่มต้นเห็นครบทุก kind ตั้งแต่หน้าแรก
  content('p1', 't1', 4, { th: 'ใบสรุปคำศัพท์ AI', en: 'AI glossary handout' }, 'doc', 2, 'watched');
  content('p1', 't4', 5, { th: 'พอดแคสต์: ML ในงานจริง', en: 'Podcast: ML in the wild' }, 'audio', 5, 'idle');
  content('p1', 't7', 4, { th: 'เวิร์กช็อป: เทรนโมเดลของคุณเอง', en: 'Workshop: train your own' }, 'activity', 3, 'idle');
  push({
    id: 'q-p1',
    projectId: 'p1',
    parentId: 't5',
    level: 'content',
    order: 3,
    title: quiz.title,
    kind: 'quiz',
    quizId: quiz.id,
    thumb: thumbAt(4),
    watched: false,
    locked: false,
  });

  // อีก 11 วิชาที่ข้อมูลเดิมไม่มีลูก — ถ้าไม่เติมจะกดเข้าไปแล้วเจอหน้าว่าง
  Object.entries(P1_FILLER).forEach(([courseId, mods], ci) => {
    mods.forEach(([mth, men], mi) => {
      const mid = `${courseId}-m${mi + 1}`;
      push({ id: mid, projectId: 'p1', parentId: courseId, level: 'module', order: mi + 1, title: { th: mth, en: men } });
      // ตั้งชื่อหัวข้อตาม "บทบาท" ของมัน ไม่ใช่ชื่อหน่วยต่อเลข
      // "องค์ประกอบของหน้าเว็บ 1/2" อ่านแล้วรู้ทันทีว่าเป็นข้อมูลปลอม
      const ROLES = [
        [`ทำความเข้าใจ${mth}`, `Understanding ${men.toLowerCase()}`],
        [`ฝึกปฏิบัติ: ${mth}`, `Hands-on: ${men}`],
      ];
      ROLES.forEach(([tth, ten], k) => {
        const tid = `${mid}-t${k + 1}`;
        push({
          id: tid,
          projectId: 'p1',
          parentId: mid,
          level: 'lesson',
          order: k + 1,
          title: { th: tth, en: ten },
        });
        fillContent('p1', tid, { th: mth, en: men }, k, ci * 3 + mi * 2 + k, mi === 0 && k === 0 ? 'watched' : 'idle');
      });
    });
  });
}

/* ============================================================
   โครงการที่ 2 และ 3 — เขียนมือ ใช้ factory ย่อแบบเดียวกับ L() เดิม
   ============================================================ */

/**
 * สร้างคอร์สหนึ่งใบพร้อมลูกทั้งกิ่ง
 * childLevel มาจาก projects.js ไม่ได้ hardcode — p2 ใช้ 'module' ส่วน p3 ใช้ 'lesson'
 */
function buildCourse(projectId, childLevel, i, course, groups) {
  const id = `${projectId}-c${i + 1}`;
  push({
    id,
    projectId,
    parentId: null,
    level: 'course',
    order: i + 1,
    cover: COVERS[(i * 5 + 3) % COVERS.length],
    categoryId: course.categoryId,
    icon: course.icon,
    hue: course.hue,
    title: course.title,
    subtitle: course.subtitle,
    instructor: course.instructor,
    difficulty: course.difficulty,
    durationMin: 120 + i * 35,
    rating: 4.3 + ((i * 3) % 7) / 10,
    enrolled: 240 + i * 137,
    updatedAt: `2026-0${(i % 8) + 1}-1${i % 9}`,
    tags: course.tags,
  });

  groups.forEach(([gth, gen], gi) => {
    const gid = `${id}-g${gi + 1}`;
    push({ id: gid, projectId, parentId: id, level: childLevel, order: gi + 1, title: { th: gth, en: gen } });
    // คอร์สแรกเรียนไปแล้วบางส่วน กลุ่มท้ายของคอร์สท้ายยังล็อก — ให้แถบความคืบหน้าดูมีชีวิต
    //
    // ห้ามล็อกทั้งคอร์ส ต่อให้ดูสมจริงกว่าก็ตาม
    // เพราะคอร์สที่ทุกชิ้นล็อกจะกดเข้าไปแล้วตัน ไล่ต่อไม่ได้เลยแม้แต่ชิ้นเดียว
    // (เจอตอนทดสอบเดินจริง คอร์สที่อัปเดตล่าสุดของโครงการที่ 2 ล็อกหมดทั้งใบ)
    const state = i === 0 && gi === 0 ? 'watched' : i >= 6 && gi === groups.length - 1 ? 'locked' : 'idle';
    fillContent(projectId, gid, { th: gth, en: gen }, gi, i * 4 + gi, state);
  });
  return id;
}

const P2_COURSES = [
  { th: 'ระดับ 1 · ปูพื้นฐาน', en: 'Level 1 · Foundations', sub: ['พินอินและคำทักทาย', 'Pinyin and greetings'] },
  { th: 'ระดับ 2 · คำศัพท์ในชีวิตประจำวัน', en: 'Level 2 · Everyday words', sub: ['ซื้อของ เดินทาง กินข้าว', 'Shopping, travel, food'] },
  { th: 'ระดับ 3 · ประโยคที่ใช้บ่อย', en: 'Level 3 · Common sentences', sub: ['เล่าเรื่องและถามทาง', 'Telling and asking'] },
  { th: 'ระดับ 4 · อ่านจับใจความ', en: 'Level 4 · Reading', sub: ['บทความสั้นและป้ายประกาศ', 'Short texts and signs'] },
  { th: 'ระดับ 5 · เขียนเรียงความ', en: 'Level 5 · Writing', sub: ['ลำดับความคิดให้ชัด', 'Structuring your ideas'] },
  { th: 'ระดับ 6 · ภาษาเชิงวิชาการ', en: 'Level 6 · Academic', sub: ['ศัพท์เฉพาะและสำนวน', 'Terms and idioms'] },
  { th: 'ตะลุยข้อสอบเก่า', en: 'Past paper drills', sub: ['จับเวลาเสมือนจริง', 'Timed mock runs'] },
  { th: 'เทคนิคก่อนสอบ', en: 'Exam-day tactics', sub: ['บริหารเวลาและความจำ', 'Time and memory'] },
];

const P2_GROUPS = [
  ['คำศัพท์ประจำบท', 'Chapter vocabulary'],
  ['ไวยากรณ์และรูปประโยค', 'Grammar patterns'],
  ['ฝึกฟังและออกเสียง', 'Listening and tones'],
];

const P3_COURSES = [
  { th: 'B1 · สนทนาในชีวิตประจำวัน', en: 'B1 · Everyday conversation', sub: ['เริ่มบทสนทนาได้เอง', 'Start a conversation'] },
  { th: 'B1 · เล่าเรื่องและประสบการณ์', en: 'B1 · Telling stories', sub: ['เล่าอดีตให้ลื่นไหล', 'Talk about the past'] },
  { th: 'B1+ · ภาษาในที่ทำงาน', en: 'B1+ · At work', sub: ['อีเมลและการประชุม', 'Email and meetings'] },
  { th: 'B2 · แสดงความคิดเห็น', en: 'B2 · Giving opinions', sub: ['เห็นด้วยและโต้แย้ง', 'Agree and disagree'] },
  { th: 'B2 · การนำเสนอ', en: 'B2 · Presenting', sub: ['เล่าให้คนฟังตาม', 'Hold the room'] },
  { th: 'B2 · อ่านข่าวและบทความ', en: 'B2 · Reading the news', sub: ['จับประเด็นได้เร็ว', 'Find the point fast'] },
  { th: 'B2+ · เจรจาต่อรอง', en: 'B2+ · Negotiating', sub: ['พูดให้ได้ผลลัพธ์', 'Talk to a result'] },
  { th: 'ฝึกสำเนียงและจังหวะ', en: 'Accent and rhythm', sub: ['ฟังรู้เรื่อง พูดคนเข้าใจ', 'Be understood'] },
];

const P3_GROUPS = [
  ['บทสนทนาตัวอย่าง', 'Model dialogue'],
  ['วลีที่ใช้ได้ทันที', 'Phrases to steal'],
  ['ฝึกพูดตามสถานการณ์', 'Role-play drills'],
];

const shape = (c, categoryId, icon, hue, instructor, difficulty, tags) => ({
  categoryId,
  icon,
  hue,
  title: { th: c.th, en: c.en },
  subtitle: { th: c.sub[0], en: c.sub[1] },
  instructor,
  difficulty,
  tags,
});

function buildP2() {
  const teacher = { th: 'อ. เหมยหลิน แซ่ตั้ง', en: 'Meilin Tang' };
  P2_COURSES.forEach((c, i) =>
    buildCourse(
      'p2',
      'module',
      i,
      shape(c, 'english', 'book', 355, teacher, { th: i < 3 ? 'เริ่มต้น' : 'ปานกลาง', en: i < 3 ? 'Beginner' : 'Intermediate' }, [
        { th: 'HSK', en: 'HSK' },
        { th: 'คำศัพท์', en: 'Vocabulary' },
      ]),
      P2_GROUPS,
    ),
  );
}

function buildP3() {
  const teacher = { th: 'Emma Clarke', en: 'Emma Clarke' };
  P3_COURSES.forEach((c, i) =>
    buildCourse(
      'p3',
      'lesson',
      i,
      shape(c, 'english', 'globe', 25, teacher, { th: i < 3 ? 'ปานกลาง' : 'ขั้นสูง', en: i < 3 ? 'Intermediate' : 'Advanced' }, [
        { th: 'CEFR', en: 'CEFR' },
        { th: 'การพูด', en: 'Speaking' },
      ]),
      P3_GROUPS,
    ),
  );
}

buildP1();
buildP2();
buildP3();

export { nodes };

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

/** { total, watched } ของทุกกล่อง คิดจากใบไม้ขึ้นมา ครั้งเดียว */
const ROLLUP = new Map();
function rollup(node) {
  if (ROLLUP.has(node.id)) return ROLLUP.get(node.id);
  let r;
  if (node.level === 'content') {
    r = { total: 1, watched: node.watched ? 1 : 0 };
  } else {
    r = { total: 0, watched: 0 };
    for (const kid of KIDS.get(node.id) ?? []) {
      const k = rollup(kid);
      r.total += k.total;
      r.watched += k.watched;
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
export const isProjectId = (id) => projects.some((p) => p.id === id);
export const getNode = (id) => BY_ID.get(id);
export const rootsOf = (projectId) => KIDS.get(`root:${projectId}`) ?? [];
export const childrenOf = (nodeId) => KIDS.get(nodeId) ?? [];
export const siblingsOf = (nodeId) => childrenOf(getNode(nodeId)?.parentId);

/** ราก → พ่อ (ไม่รวมตัวเอง) — ใช้ทำ breadcrumb */
export function ancestorsOf(nodeId) {
  const out = [];
  let cur = getNode(nodeId);
  while (cur?.parentId) {
    cur = getNode(cur.parentId);
    if (cur) out.unshift(cur);
  }
  return out;
}

/** ชั้นถัดไปตามที่โครงการประกาศไว้ — 'content' เมื่อหมดชั้นกล่องแล้ว */
export function nextLevel(project, level) {
  const i = project.levels.findIndex((l) => l.level === level);
  return project.levels[i + 1]?.level ?? 'content';
}
export const rootLevel = (project) => project.levels[0].level;
export const levelDef = (project, level) => project.levels.find((l) => l.level === level);

export const contentCountOf = (nodeId) => ROLLUP.get(nodeId)?.total ?? 0;
export const watchedCountOf = (nodeId) => ROLLUP.get(nodeId)?.watched ?? 0;
export const progressOf = (nodeId) => {
  const r = ROLLUP.get(nodeId);
  return r?.total ? r.watched / r.total : 0;
};

/** ใบไม้ซ้ายสุดใต้กล่องนี้ */
export function firstContentOf(nodeId) {
  const n = getNode(nodeId);
  if (!n) return undefined;
  if (n.level === 'content') return n;
  for (const kid of childrenOf(n.id)) {
    const found = firstContentOf(kid.id);
    if (found) return found;
  }
  return undefined;
}

/** ใบไม้แรกที่ยังไม่ได้ดูและไม่ล็อก มิฉะนั้นคืนตัวแรก — ใช้กับปุ่ม "เรียนต่อ" */
export function resumeContentOf(nodeId) {
  const walk = (id) => {
    const n = getNode(id);
    if (!n) return undefined;
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

/** สื่อที่ควรเปิดเมื่อไม่มี ?node= ติดมา — ทุกหน้าต้องเรนเดอร์ได้ลำพัง */
export const defaultContentOf = (projectId) =>
  (projectId === DEFAULT_PROJECT_ID ? getNode(currentLessonId) : undefined) ??
  resumeContentOf(rootsOf(projectId)[0]?.id);

/* ============================================================
   ตรวจความสอดคล้องตอน dev — แนวเดียวกับ checkLocaleParity
   ============================================================ */
if (import.meta.env?.DEV) {
  const problems = [];
  for (const n of nodes) {
    if (n.parentId && !BY_ID.has(n.parentId)) problems.push(`${n.id}: ไม่มีพ่อ ${n.parentId}`);
    const project = getProject(n.projectId);
    if (!project) problems.push(`${n.id}: ไม่มีโครงการ ${n.projectId}`);
    else if (n.level !== 'content' && !project.levels.some((l) => l.level === n.level))
      problems.push(`${n.id}: โครงการ ${n.projectId} ไม่ได้ประกาศชั้น ${n.level}`);
  }
  for (const project of projects) {
    const roots = rootsOf(project.id);
    if (!roots.length) problems.push(`${project.id}: ไม่มีคอร์สเลย`);
    for (const root of roots) {
      if (!firstContentOf(root.id)) problems.push(`${root.id}: กดเข้าไปแล้วตัน ไม่มีสื่อสักชิ้น`);
      // ล็อกทั้งคอร์สไม่ได้ ไม่งั้นผู้เรียนกดเข้าไปแล้วเปิดอะไรไม่ได้เลยสักชิ้น
      const openable = nodes.some(
        (n) => n.level === 'content' && !n.locked && ancestorsOf(n.id).some((a) => a.id === root.id),
      );
      if (!openable) problems.push(`${root.id}: สื่อทุกชิ้นถูกล็อก เปิดอะไรไม่ได้เลย`);
    }
  }
  if (problems.length) console.warn('[nodes] โครงสร้างเนื้อหามีปัญหา:\n' + problems.join('\n'));
}
