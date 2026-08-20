/**
 * แปลงเวลาของข้อมูลจำลองให้เป็นข้อความ — ใช้ร่วมกันระหว่างหน้าประวัติกับหน้าใบประกาศ
 *
 * *** timeZone: 'UTC' ทุกจุด ห้ามลืม ***
 * วันในข้อมูลสร้างจาก Date.UTC (ดู mock/records.js) ถ้าอ่านด้วยโซนเวลาของเครื่อง
 * เครื่องที่อยู่ฝั่งลบของ UTC จะเห็นวันเลื่อนไปหนึ่งวัน แล้ว "วันนี้" กับวันที่ในป้ายจะไม่ตรงกัน
 * ซึ่งเป็นบั๊กที่เห็นเฉพาะบนเครื่องบางเครื่องเท่านั้น — หาต้นเหตุยากที่สุดแบบหนึ่ง
 *
 * ไทยใช้ปฏิทินพุทธเป็นค่าตั้งต้นของ th-TH อยู่แล้ว จึงได้ พ.ศ. โดยไม่ต้องบวกเอง
 */
const localeOf = (lang) => (lang === 'th' ? 'th-TH' : 'en-GB');

/** 20 ส.ค. 2569 · 20 Aug 2026 */
export const formatDate = (date, lang) =>
  new Intl.DateTimeFormat(localeOf(lang), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);

/**
 * 20 ส.ค. — ไม่มีปี สำหรับที่แคบอย่างเซลล์ในตารางความคืบหน้า
 *
 * ปีเต็ม ("2569") กินความกว้างเกือบครึ่งเซลล์โดยไม่เพิ่มข้อมูล
 * เพราะทุกอย่างในข้อมูลชุดนี้อยู่ปีเดียวกันหมด — ปีจึงไปอยู่ใน aria-label แทน
 */
export const formatShortDate = (date, lang) =>
  new Intl.DateTimeFormat(localeOf(lang), { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(date);

/** วันจันทร์ 20 ส.ค. — ใช้เป็นหัวกลุ่มของวันที่ไกลกว่า "เมื่อวาน" */
export const formatWeekday = (date, lang) =>
  new Intl.DateTimeFormat(localeOf(lang), {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(date);

/** นาทีที่เท่าไรของวัน → 09:40 */
export const formatTimeOfDay = (minuteOfDay) =>
  `${String(Math.floor(minuteOfDay / 60)).padStart(2, '0')}:${String(minuteOfDay % 60).padStart(2, '0')}`;
