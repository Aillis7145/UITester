/**
 * ทะเบียนโครงการ — แหล่งความจริงเดียวว่าแต่ละโครงการมีเนื้อหากี่ชั้น และเรียกชั้นนั้นว่าอะไร
 *
 * levels[] ประกาศเฉพาะชั้นที่เป็น "กล่อง" ส่วนชั้นใบไม้ (content) มีเสมอและอยู่ท้ายสุด
 * จำนวนหน้าไล่ระดับ = levels.length เสมอ ไม่มีที่ไหนในโค้ดเขียนเลขนี้ไว้ตายตัว
 *
 * ป้ายชื่อชั้นเป็น { th, en } อ่านผ่าน p() ไม่ใช่ i18n key
 * เพราะ "หน่วย" ของโครงการหนึ่งกับ "บท" ของอีกโครงการคือ *เนื้อหา* ไม่ใช่เปลือก UI
 * ถ้ายัดเข้า locale การเพิ่มโครงการ 1 ตัวจะกลายเป็นการแก้ 3 ไฟล์
 *
 * plural แยกจาก label เพราะไทยต่อคำตรงๆ ได้ ('หน่วยทั้งหมด')
 * แต่อังกฤษต้องเปลี่ยนรูป ('All Units' ไม่ใช่ 'All Unit')
 * ถ้าใช้ตัวเดียวภาษาอังกฤษจะพังทุกหัวข้อที่เอาป้ายชั้นไปต่อคำ
 *
 * ไฟล์นี้ต้องไม่ import อะไรเลยสักบรรทัด
 * เพราะ scripts/verify-ui.mjs import ตรงๆ เพื่อเอา levels.length มาเป็นค่าคาดหวัง
 * การทดสอบจึงอ่านจากประกาศเดียวกับที่แอปอ่าน ผ่านโดยบังเอิญไม่ได้
 */

/** ชั้นกล่องที่ระบบรู้จัก เรียงจากบนลงล่าง — โครงการเลือกใช้บางชั้นได้ แต่ห้ามสลับลำดับ */
export const LEVEL_ORDER = ['course', 'module', 'lesson'];

export const projects = [
  {
    id: 'p1',
    icon: 'brain',
    hue: 195,
    cover: '/mock/ai.jpg',
    name: { th: 'ศูนย์การเรียนรู้ AI', en: 'AI Learning Center' },
    tagline: {
      th: 'ปูพื้นฐานปัญญาประดิษฐ์ตั้งแต่ศูนย์จนสร้างโมเดลแรกได้',
      en: 'Artificial intelligence from the ground up',
    },
    levels: [
      { level: 'course', label: { th: 'วิชา', en: 'Subject' }, plural: { th: 'วิชา', en: 'Subjects' } },
      { level: 'module', label: { th: 'หน่วย', en: 'Unit' }, plural: { th: 'หน่วย', en: 'Units' } },
      { level: 'lesson', label: { th: 'หัวข้อ', en: 'Topic' }, plural: { th: 'หัวข้อ', en: 'Topics' } },
    ],
    contentLabel: { th: 'สื่อการเรียน', en: 'Content' },
  },
  {
    id: 'p2',
    icon: 'book',
    hue: 355,
    cover: '/mock/thai.jpg',
    name: { th: 'ติวสอบวัดระดับภาษาจีน', en: 'Chinese Proficiency Prep' },
    tagline: {
      th: 'เตรียมสอบวัดระดับตั้งแต่คำศัพท์จนถึงข้อสอบเต็มชุด',
      en: 'From vocabulary drills to full mock exams',
    },
    // ไม่มีชั้น lesson — กดจากระดับเข้าบท แล้วถึงสื่อเลย
    levels: [
      { level: 'course', label: { th: 'ระดับ', en: 'Level' }, plural: { th: 'ระดับ', en: 'Levels' } },
      { level: 'module', label: { th: 'บท', en: 'Chapter' }, plural: { th: 'บท', en: 'Chapters' } },
    ],
    contentLabel: { th: 'บทเรียน', en: 'Lessons' },
  },
  {
    id: 'p3',
    icon: 'globe',
    hue: 25,
    cover: '/mock/english.jpg',
    name: { th: 'ภาษาอังกฤษเพื่อการสื่อสาร', en: 'English for Communication' },
    tagline: {
      th: 'ฝึกพูดจากสถานการณ์จริงที่ใช้ได้ทันที',
      en: 'Practise with situations you will actually meet',
    },
    // ไม่มีชั้น module — ลึกเท่า p2 แต่ข้ามคนละชั้น
    // จงใจให้ต่างกันตรงนี้ เพราะถ้าสองโครงการข้ามชั้นเดียวกัน
    // โค้ดที่เขียนว่า "ถ้ามี 2 ชั้นให้แสดง module" จะผ่านการทดสอบทั้งที่ยังตายตัวอยู่
    levels: [
      { level: 'course', label: { th: 'ระดับ', en: 'Level' }, plural: { th: 'ระดับ', en: 'Levels' } },
      { level: 'lesson', label: { th: 'ตอน', en: 'Episode' }, plural: { th: 'ตอน', en: 'Episodes' } },
    ],
    contentLabel: { th: 'สื่อการเรียน', en: 'Content' },
  },
  {
    id: 'p4',
    icon: 'users',
    hue: 145,
    cover: '/mock/math.jpg',
    name: { th: 'ห้องเรียนออนไลน์มัธยม', en: 'Secondary Online Classroom' },
    tagline: {
      th: 'เลือกชั้นปีแล้วดูวิดีโอได้เลย ไม่ต้องไล่หลายชั้น',
      en: 'Pick your year and start watching — no digging',
    },
    /**
     * ชั้นเดียวล้วน — กรณีตื้นที่สุดที่ระบบต้องรับได้
     * levels.length - 1 = 0 แปลว่าไม่ผ่านหน้าไล่ระดับเลยสักหน้า
     * กดชั้นปีปุ๊บถึงวิดีโอปั๊บ ซึ่งเป็นโครงสร้างที่แพลตฟอร์มติวจำนวนมากใช้จริง
     *
     * ถ้าโค้ดตรงไหนแอบสมมติว่า "ต้องมีชั้นกลางอย่างน้อยหนึ่งชั้น" จะพังที่โครงการนี้ก่อนเพื่อน
     */
    levels: [
      { level: 'course', label: { th: 'ชั้นปี', en: 'Year' }, plural: { th: 'ชั้นปี', en: 'Years' } },
    ],
    contentLabel: { th: 'วิดีโอบทเรียน', en: 'Lesson videos' },
  },
];

export const DEFAULT_PROJECT_ID = 'p1';
