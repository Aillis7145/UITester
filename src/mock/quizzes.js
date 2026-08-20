import { quiz } from './data.js';
import { quizBank } from './quizbank.js';
import { courseOf, unitOf } from './nodes.js';

/**
 * เลือกชุดข้อสอบที่ควรแสดง จากตำแหน่งของผู้เรียน + `?set=` ใน URL
 *
 * ─────────────────────────────────────────────────────────────
 * ทำไมต้องมีไฟล์นี้
 * ─────────────────────────────────────────────────────────────
 * เดิม QuizScreen กับ ResultsScreen `import { quiz }` ตรงๆ ทั้งเว็บจึงมีข้อสอบชุดเดียว
 * พอมีชุดจริงของ B1 บทที่ 1 เข้ามา 6 ชุด (ฝึก 5 + ท้ายบท 1) ต้องมีจุดเดียวที่ตอบว่า "ได้ชุดไหน"
 *
 * ─────────────────────────────────────────────────────────────
 * คีย์ผูกกับชื่อแผ่นงาน ไม่ใช่ id ของโหนด
 * ─────────────────────────────────────────────────────────────
 * id อย่าง `eng-c3-u1` เปลี่ยนได้ทันทีที่ลำดับคอร์สในหลักสูตรขยับ
 * แต่ "ENG_B1 บทที่ 1" เป็นของถาวร คีย์จึงเป็น `<sheet>#<ลำดับหน่วย>`
 *
 * ─────────────────────────────────────────────────────────────
 * ไม่มีชุดจริง = ได้ชุดเดิม ไม่ใช่หน้าว่าง
 * ─────────────────────────────────────────────────────────────
 * ตอนนี้ทำไว้บทเดียวเป็นตัวอย่าง อีก 37 คอร์สจึงต้องได้ชุดเดิมเป๊ะ
 * มีเช็คใน scripts/verify-ui.mjs คุมไว้ว่าการเปลี่ยนแปลงไม่รั่วออกนอก B1 บทที่ 1
 */
export function bankKeyOf(node) {
  if (!node) return undefined;
  const unit = unitOf(node.id);
  const course = courseOf(node.id);
  return unit && course?.sheet ? `${course.sheet}#${unit.order}` : undefined;
}

/** ชุดฝึกทั้งหมดของหน่วยนี้ — `undefined` ถ้าบทนี้ยังไม่มีชุดจริง */
export const practiceSetsOf = (node) => quizBank[bankKeyOf(node)]?.practice;

const PREFIX = 'practice-';

/** ค่าที่ใส่ใน `?set=` สำหรับชุดฝึกหนึ่งชุด */
export const practiceSetId = (skill) => `${PREFIX}${skill}`;

export function quizFor(node, setId) {
  const bank = quizBank[bankKeyOf(node)];
  if (!bank) return quiz;
  if (setId?.startsWith(PREFIX)) return bank.practice[setId.slice(PREFIX.length)] ?? bank.unitQuiz;
  return bank.unitQuiz;
}
