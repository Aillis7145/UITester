/**
 * ทะเบียนหน้าจอ — เก็บแยกจาก index.js เพราะไฟล์นี้ต้อง "ไม่ import อะไรเลย"
 *
 * scripts/verify-ui.mjs import ไฟล์นี้ตรงๆ เพื่อเอารายชื่อหน้าไปวนทดสอบ
 * ถ้าปล่อยให้อยู่ใน index.js ซึ่ง import คอมโพเนนต์ React สคริปต์จะโหลดไม่ได้
 * แล้วจะต้องมีรายชื่อหน้าเขียนมือซ้ำอีกชุด ซึ่งลืมอัปเดตแน่นอน
 *
 * ลำดับในนี้คือลำดับที่ผู้เรียนเดินผ่านจริง ใช้เป็นลำดับปุ่มในสตูดิโอด้วย
 * ใส่ id ได้เฉพาะหน้าที่มีคอมโพเนนต์จริงแล้วเท่านั้น ไม่งั้นสตูดิโอจะมีปุ่มที่กดแล้วเด้งกลับ
 */
export const PAGE_IDS = [
  'login',
  'subjects',
  'progress',
  'history',
  'browse',
  'lesson',
  'practice',
  'exams',
  'examstart',
  'quiz',
  'results',
  'certificates',
];

/**
 * เมนูใน "ตัวแอป" — เลือกจากมุมของผู้เรียน ไม่ใช่ส่วนเติมเต็มของเซตทางเทคนิค
 *
 * ไม่ใส่ browse กับ practice เพราะทั้งคู่ต้องมี ?node ถึงจะมีความหมาย
 * ปุ่มเมนูที่กดแล้วต้องเดาเองว่าจะพาไปไหนไม่ใช่เมนู
 *
 * history กับ certificates เข้าเงื่อนไขนี้ — ทั้งคู่เป็นของ "ผู้เรียนคนนี้" ทั้งบัญชี
 * ไม่ผูกกับตำแหน่งในต้นไม้ จึงเปิดจากที่ไหนก็ได้ความหมายเดียวกันเสมอ
 */
/**
 * *** แท็บ "แบบทดสอบ" ชี้ไป exams ไม่ใช่ quiz ***
 * กดแท็บแล้วเข้าห้องสอบทันทีคือการเริ่มสอบโดยที่ผู้เข้าสอบยังไม่รู้ด้วยซ้ำว่าสอบวิชาอะไร
 * ทางเดินคือ เลือกวิชา → เตรียมพร้อม (ตรวจเสียง) → ข้อสอบ
 * ส่วน quiz กับ examstart ยังอยู่ใน PAGE_IDS เพื่อให้สตูดิโอเปิดดูตรงๆ ได้
 */
export const APP_NAV_IDS = [
  'subjects',
  'progress',
  'history',
  'lesson',
  'exams',
  'results',
  'certificates',
];

/** หน้าที่ไม่มีแถบบนเลย — ยังไม่ได้เข้าระบบ จึงยังไม่มีอะไรให้ไป */
export const CHROMELESS_PAGES = ['login'];

/** ไอคอนของแต่ละหน้าใน nav ของสตูดิโอ */
export const PAGE_ICONS = {
  login: 'lock',
  subjects: 'grid',
  browse: 'list',
  lesson: 'play',
  practice: 'list',
  exams: 'clipboard',
  examstart: 'headphones',
  quiz: 'flag',
  results: 'trophy',
  certificates: 'award',
  history: 'clock',
  progress: 'chart',
};
