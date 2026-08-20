/**
 * ทะเบียนวิชา — แหล่งความจริงเดียวว่าแต่ละวิชามีเนื้อหากี่ชั้น และเรียกชั้นนั้นว่าอะไร
 *
 * levels[] ประกาศเฉพาะชั้นที่เป็น "กล่อง" ส่วนชั้นใบไม้ (content) มีเสมอและอยู่ท้ายสุด
 *
 * levels[1] คือ "หน่วย" — กล่องเดียวที่มีหน้ารายการเป็นของตัวเอง
 * กดคอร์ส → เห็นหน่วย → กดหน่วย → ถึงวิดีโอเลย ทุกวิชาจึงเป็น 2 คลิกเท่ากันหมด
 * levels[2] ยังมีอยู่ในข้อมูล แต่โผล่แค่เป็นหัวกลุ่มในเพลย์ลิสต์ ไม่มีหน้าของตัวเอง
 *
 * ป้ายชื่อชั้นเป็น { th, en } อ่านผ่าน p() ไม่ใช่ i18n key
 * เพราะ "ภาคเรียน" ของวิชาหนึ่งกับ "บท" ของอีกวิชาคือ *เนื้อหา* ไม่ใช่เปลือก UI
 * ถ้ายัดเข้า locale การเพิ่มวิชา 1 ตัวจะกลายเป็นการแก้ 3 ไฟล์
 *
 * plural แยกจาก label เพราะไทยต่อคำตรงๆ ได้ ('หน่วยทั้งหมด')
 * แต่อังกฤษต้องเปลี่ยนรูป ('All Units' ไม่ใช่ 'All Unit')
 *
 * ไฟล์นี้ต้องไม่ import อะไรเลยสักบรรทัด
 * เพราะ scripts/verify-ui.mjs import ตรงๆ เพื่อเอาค่าคาดหวังมาใช้
 * การทดสอบจึงอ่านจากประกาศเดียวกับที่แอปอ่าน ผ่านโดยบังเอิญไม่ได้
 */

/** ชั้นกล่องที่ระบบรู้จัก เรียงจากบนลงล่าง — วิชาเลือกใช้บางชั้นได้ แต่ห้ามสลับลำดับ */
export const LEVEL_ORDER = ['course', 'module', 'lesson'];

/**
 * คอร์สที่ "ทุกหัวข้อเป็นวิดีโอ" — ผูกด้วยชื่อแผ่นงาน
 *
 * สองคอร์สนี้ผลิตทุกหัวข้อในหลักสูตรออกมาเป็นคลิป รวมหัวข้อที่ชื่ออ่านเหมือนเอกสาร
 * อย่าง "คำศัพท์ (Vocabulary Focus)" หรือ "บทนำ (Introductory Statement)"
 * ปล่อยให้ตัวเดาชนิดสื่ออ่านจากชื่อ เพลย์ลิสต์จะสลับไอคอนคลิป/เอกสาร/เสียงทั้งหน้า
 * ทั้งที่ของจริงกดแล้วได้วิดีโอทุกอัน — B1 หน่วยเดียวเดิมเดาผิด 158 จาก 423 ชิ้น
 *
 * เอกสารไม่ได้หายไป ย้ายไปอยู่รายการดาวน์โหลดใต้วิดีโอที่เดียว (unitResourcesOf ใน nodes.js)
 *
 * ผูกด้วยชื่อแผ่นงานเพราะเป็นสิ่งเดียวที่ไม่ขยับ — ไอดีคอร์สเลื่อนทันทีที่ลำดับในชีตเปลี่ยน
 * คอร์สอื่นที่ผลิตครบเป็นคลิปแล้ว เติมชื่อแผ่นเข้าอาร์เรย์นี้บรรทัดเดียวจบ
 */
export const VIDEO_ONLY_SHEETS = ['ENG_B1', 'ENG_B2'];

/** บันไดสามชั้นของวิชาประถม — ทั้งห้าวิชาใช้ชุดเดียวกันเพราะหลักสูตรจริงเป็นแบบนี้จริง */
const primaryLevels = () => [
  { level: 'course', label: { th: 'ชั้นปี', en: 'Grade' }, plural: { th: 'ชั้นปี', en: 'Grades' } },
  { level: 'module', label: { th: 'ภาคเรียน', en: 'Semester' }, plural: { th: 'ภาคเรียน', en: 'Semesters' } },
  { level: 'lesson', label: { th: 'หน่วย', en: 'Unit' }, plural: { th: 'หน่วย', en: 'Units' } },
];

/**
 * *** ไม่มี covers[] ที่ระดับวิชาแล้ว ***
 *
 * ปกเป็นของ "คอร์ส" ไม่ใช่ของวิชา — หนึ่งคอร์สหนึ่งไฟล์ ผูกด้วยชื่อแผ่นงาน
 * (`/mock/covers/<sheet>.jpg` ดู scripts/fetch-covers.mjs)
 *
 * เดิมให้วิชาถือชุดรูปแล้วให้คอร์สวนใช้ ซึ่งแปลว่าวิชาที่มีหกคอร์สแต่มีสองรูป
 * จะได้ ป.1 ป.3 ป.5 หน้าตาเหมือนกันเป๊ะ — ซึ่งเป็นสิ่งที่กริดรวมใช้แยกคอร์สออกจากกันพอดี
 *
 * ---
 * short = ป้ายวิชาที่ติดบนการ์ดและในชิปกรอง
 *
 * ต้องสั้นกว่า name เสมอ เพราะแท็กมุมภาพกับชิปมีที่จำกัด
 * ถ้าใช้ name ตรงๆ 'ภาษาอังกฤษเพื่อการทำงานและการสื่อสาร' จะตกบรรทัดทั้งสองที่
 */
export const projects = [
  {
    id: 'eng-p',
    icon: 'globe',
    hue: 210,
    short: { th: 'อังกฤษ', en: 'English' },
    name: { th: 'ภาษาอังกฤษ ประถมศึกษา', en: 'English · Primary' },
    tagline: { th: 'หลักสูตรอังกฤษ ป.1–ป.6 ครบทุกภาคเรียน', en: 'Primary English, Grade 1–6, every semester' },
    instructor: { th: 'ครูศิริพร ทองอยู่', en: 'Siriporn Thongyu' },
    tag: { th: 'หลักสูตรแกนกลาง', en: 'Core curriculum' },
    levels: primaryLevels(),
    contentLabel: { th: 'คาบเรียน', en: 'Periods' },
  },
  {
    id: 'mat-p',
    icon: 'calculator',
    hue: 265,
    short: { th: 'คณิต', en: 'Maths' },
    name: { th: 'คณิตศาสตร์ ประถมศึกษา', en: 'Mathematics · Primary' },
    tagline: { th: 'คณิต ป.1–ป.6 ไล่จากจำนวนนับถึงสมการ', en: 'Primary maths from counting to equations' },
    instructor: { th: 'ครูอนุชา พงษ์ไพบูลย์', en: 'Anucha Pongpaiboon' },
    tag: { th: 'หลักสูตรแกนกลาง', en: 'Core curriculum' },
    levels: primaryLevels(),
    contentLabel: { th: 'คาบเรียน', en: 'Periods' },
  },
  {
    id: 'sci-p',
    icon: 'flask',
    hue: 160,
    short: { th: 'วิทย์', en: 'Science' },
    name: { th: 'วิทยาศาสตร์ ประถมศึกษา', en: 'Science · Primary' },
    tagline: { th: 'วิทยาศาสตร์ ป.1–ป.6 ตั้งแต่สิ่งมีชีวิตถึงวงจรไฟฟ้า', en: 'Primary science from living things to circuits' },
    instructor: { th: 'ครูเบญจวรรณ ศรีมงคล', en: 'Benjawan Srimongkol' },
    tag: { th: 'หลักสูตรแกนกลาง', en: 'Core curriculum' },
    levels: primaryLevels(),
    contentLabel: { th: 'คาบเรียน', en: 'Periods' },
  },
  {
    id: 'soc-p',
    icon: 'users',
    hue: 35,
    short: { th: 'สังคม', en: 'Social' },
    name: { th: 'สังคมศึกษา ประถมศึกษา', en: 'Social Studies · Primary' },
    tagline: { th: 'สังคมศึกษา ป.1–ป.6 หน้าที่พลเมืองถึงเศรษฐศาสตร์', en: 'Primary social studies, civics through economics' },
    instructor: { th: 'ครูวิชัย บุญมาก', en: 'Wichai Boonmak' },
    tag: { th: 'หลักสูตรแกนกลาง', en: 'Core curriculum' },
    levels: primaryLevels(),
    contentLabel: { th: 'คาบเรียน', en: 'Periods' },
  },
  {
    id: 'tha-p',
    icon: 'book',
    hue: 350,
    short: { th: 'ไทย', en: 'Thai' },
    name: { th: 'ภาษาไทย ประถมศึกษา', en: 'Thai Language · Primary' },
    tagline: { th: 'ภาษาไทย ป.1–ป.6 หลักภาษา วรรณคดี และการเขียน', en: 'Primary Thai: grammar, literature and writing' },
    instructor: { th: 'ครูพิมพ์ชนก อินทรสาร', en: 'Pimchanok Intharasan' },
    tag: { th: 'หลักสูตรแกนกลาง', en: 'Core curriculum' },
    levels: primaryLevels(),
    contentLabel: { th: 'คาบเรียน', en: 'Periods' },
  },
  {
    id: 'eng',
    icon: 'bookmark',
    hue: 200,
    short: { th: 'ภาษาอังกฤษ CEFR', en: 'English CEFR' },
    name: { th: 'ภาษาอังกฤษเพื่อการทำงาน', en: 'English for Work' },
    tagline: { th: 'ไล่ระดับ A1 ถึง B2 ทั้งไวยากรณ์และการสื่อสารจริง', en: 'A1 to B2 — grammar and real communication' },
    instructor: { th: 'Emma Clarke', en: 'Emma Clarke' },
    tag: { th: 'CEFR', en: 'CEFR' },
    // บทของ B1/B2 เป็น "บทที่ N" ส่วน A1/A2 เป็นชื่อหัวข้อไวยากรณ์ — ใช้คำกลางว่า "บท"
    levels: [
      { level: 'course', label: { th: 'ระดับ', en: 'Level' }, plural: { th: 'ระดับ', en: 'Levels' } },
      { level: 'module', label: { th: 'บท', en: 'Chapter' }, plural: { th: 'บท', en: 'Chapters' } },
      { level: 'lesson', label: { th: 'หัวข้อ', en: 'Topic' }, plural: { th: 'หัวข้อ', en: 'Topics' } },
    ],
    contentLabel: { th: 'สื่อการเรียน', en: 'Content' },
  },
  {
    id: 'zh',
    icon: 'trophy',
    hue: 15,
    short: { th: 'จีน', en: 'Chinese' },
    name: { th: 'ภาษาจีน HSK', en: 'Chinese · HSK' },
    tagline: { th: 'เตรียมสอบ HSK ระดับ 4 ถึง 6 จากบทสนทนาจริง', en: 'HSK 4 to 6 prep built on real dialogue' },
    instructor: { th: 'อ. เหมยหลิน แซ่ตั้ง', en: 'Meilin Tang' },
    tag: { th: 'HSK', en: 'HSK' },
    levels: [
      { level: 'course', label: { th: 'ระดับ', en: 'Level' }, plural: { th: 'ระดับ', en: 'Levels' } },
      { level: 'module', label: { th: 'หมวด', en: 'Theme' }, plural: { th: 'หมวด', en: 'Themes' } },
      { level: 'lesson', label: { th: 'บทเรียน', en: 'Lesson' }, plural: { th: 'บทเรียน', en: 'Lessons' } },
    ],
    contentLabel: { th: 'สื่อการเรียน', en: 'Content' },
  },
  {
    id: 'ai',
    icon: 'brain',
    hue: 280,
    short: { th: 'AI', en: 'AI' },
    name: { th: 'รู้จักโลกของ AI', en: 'The World of AI' },
    tagline: { th: 'ปูพื้นฐาน AI ตั้งแต่ศูนย์จนสั่งงานเป็นและทำโปรเจกต์ได้', en: 'AI from zero to prompting and shipping a project' },
    instructor: { th: 'ดร. ธนกฤต วัฒนชัย', en: 'Dr Thanakrit Wattanachai' },
    tag: { th: 'พื้นฐาน', en: 'Foundation' },
    /**
     * มีแค่สองชั้น — หน่วยมีสื่อเป็นลูกโดยตรง ไม่มีชั้นหัวข้อคั่น
     *
     * จงใจเก็บวิชาที่ตื้นกว่าเพื่อนไว้หนึ่งวิชา
     * ถ้าโค้ดตรงไหนแอบสมมติว่า "ทุกวิชาต้องมีชั้นที่สาม" จะพังที่นี่ก่อนเพื่อน
     * และเพลย์ลิสต์ของวิชานี้คือเคสเดียวที่ต้องเรนเดอร์ลิสต์เดียวโดยไม่มีหัวกลุ่ม
     */
    levels: [
      { level: 'course', label: { th: 'คอร์ส', en: 'Course' }, plural: { th: 'คอร์ส', en: 'Courses' } },
      { level: 'module', label: { th: 'หน่วย', en: 'Unit' }, plural: { th: 'หน่วย', en: 'Units' } },
    ],
    contentLabel: { th: 'สื่อการเรียน', en: 'Content' },
  },
];

/**
 * วิชาที่เว็บนี้ขาย — หนึ่งดีพลอย = หนึ่งลูกค้า
 *
 * ลูกค้าที่ซื้อวิชาเดียวเหลือไอดีเดียวในอาร์เรย์นี้ ไม่ต้องลบข้อมูลวิชาอื่นทิ้ง
 * แยกทะเบียนออกจาก projects เพราะถ้าใช้ projects เป็นทะเบียนตรงๆ
 * การจำลอง "ซื้อ 2 วิชา" จะกลายเป็นการลบ fixture ที่ใช้พิสูจน์ว่าการรวมทำงานข้ามรูปร่างที่ต่างกัน
 */
export const PURCHASED_PROJECT_IDS = ['eng-p', 'mat-p', 'sci-p', 'soc-p', 'tha-p', 'eng', 'zh', 'ai'];

export const purchasedProjects = projects.filter((p) => PURCHASED_PROJECT_IDS.includes(p.id));

export const DEFAULT_PROJECT_ID = 'eng-p';
