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
export const PAGE_IDS = ['login', 'projects', 'subjects', 'browse', 'lesson', 'quiz', 'results'];

/**
 * เมนูใน "ตัวแอป" — เลือกจากมุมของผู้เรียน ไม่ใช่ส่วนเติมเต็มของเซตทางเทคนิค
 *
 * ไม่ใส่ projects กับ browse เพราะทั้งคู่ต้องมี ?project / ?node ถึงจะมีความหมาย
 * ปุ่มเมนูที่กดแล้วต้องเดาเองว่าจะพาไปไหนไม่ใช่เมนู
 */
export const APP_NAV_IDS = ['subjects', 'lesson', 'quiz', 'results'];

/** หน้าที่ไม่มีแถบเมนูของแอป — ประตูทางเข้าทั้งคู่ ผู้ใช้ยังไม่ได้อยู่ในคอร์สไหน */
export const CHROMELESS_PAGES = ['login', 'projects'];

/** ไอคอนของแต่ละหน้าใน nav ของสตูดิโอ */
export const PAGE_ICONS = {
  login: 'lock',
  projects: 'layers',
  subjects: 'grid',
  browse: 'list',
  lesson: 'play',
  quiz: 'flag',
  results: 'trophy',
};
