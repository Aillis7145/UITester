import { ancestorsOf, resumeContentOf, unitLevelOf } from '@/mock/nodes';
import { LEVEL_ORDER } from '@/mock/projects';

/**
 * ปลายทางของ node ใดก็ได้ — ปุ่มทุกใบในแอปเรียกฟังก์ชันนี้ตัวเดียว
 *
 * นี่คือจุดเดียวในโปรเจคที่รู้ว่าอะไรพาไปหน้าไหน
 * หน้าจอจึงไม่มีทางเข้ารหัสลำดับหน้าไว้เอง
 *
 * กฎเดียว: **คอร์สคือกล่องเดียวที่มีหน้ารายการเป็นของตัวเอง**
 * กล่องอื่นทั้งหมด (หน่วย และชั้นใต้หน่วย) ตัดตรงไปหน้าสื่อ
 * เพราะหน้าสื่อมีเพลย์ลิสต์ของทั้งหน่วยอยู่ข้างแล้ว หน้ารายการคั่นอีกชั้นคือการกดซ้ำเปล่าๆ
 * ผลคือทุกวิชาถึงวิดีโอใน 2 คลิกเท่ากันหมด ไม่ว่าจะประกาศไว้กี่ชั้น
 *
 * ไม่รับ project เป็นพารามิเตอร์อีกแล้ว — ปลายทางขึ้นกับชั้นของ node ล้วนๆ
 * การรับไว้จะอ่านเหมือนว่าวิชาเปลี่ยนปลายทางได้ ซึ่งไม่จริงแล้ว
 *
 * คืนค่าเป็น [pageId, params] เพื่อส่งเข้า onNavigate ได้ตรงๆ ด้วย spread
 */
export function targetFor(node) {
  if (node.level === 'content') {
    return node.kind === 'quiz' ? ['quiz', { node: node.id }] : ['lesson', { node: node.id }];
  }
  if (node.level === LEVEL_ORDER[0]) return ['browse', { node: node.id }];

  const first = resumeContentOf(node.id);
  // กล่องที่ว่างจริงๆ ยังต้องกดเข้าไปได้ ไม่งั้นจะกลายเป็นการ์ดที่กดแล้วไม่มีอะไรเกิดขึ้น
  return first ? targetFor(first) : ['browse', { node: node.id }];
}

/**
 * เส้นทางจากรากลงมาถึง node ปัจจุบัน — 4 ก้อนเท่ากันทุกวิชา
 *
 *   คอร์สทั้งหมด › คอร์ส › หน่วย › สื่อ
 *
 * ตัดชั้นใต้หน่วยออกโดยตั้งใจ เพราะชั้นนั้นไม่มีหน้าของตัวเองแล้ว
 * ถ้าปล่อยไว้ กดแล้วจะเด้งไปวิดีโอ *อีกชิ้น* ซึ่งอ่านเหมือนบั๊ก
 * และวิชาสามชั้นจะได้ 5 ก้อนขณะที่วิชาสองชั้นได้ 4 โดยไม่มีเหตุผลที่ผู้เรียนมองเห็น
 * (ที่ 375px ก้อนที่ห้าดันหัวเรื่องตกไปอีกบรรทัดด้วย)
 *
 * ก้อนแรกเป็น "คอร์สทั้งหมด" เสมอ ไม่ใช่ชื่อวิชา —
 * ในเว็บที่รวมหลายวิชาไว้ในกริดเดียว การตั้งชื่อรากตามวิชาใดวิชาหนึ่งคือการโกหก
 * ส่วนวิชาสื่อผ่าน Badge ข้าง <h1> ของแต่ละหน้าแทน
 *
 * ก้อนสุดท้ายไม่มี onClick เพราะเป็นตำแหน่งปัจจุบัน — Breadcrumb จะทำให้เป็นข้อความเอง
 */
export function crumbsFor({ project, node, onNavigate, p, t }) {
  const unitLevel = unitLevelOf(project);
  const crumbs = [
    {
      id: 'all-courses',
      label: t('subjects.allCourses'),
      onClick: () => onNavigate?.('subjects', { node: null }),
    },
  ];
  for (const a of ancestorsOf(node.id)) {
    if (a.level !== LEVEL_ORDER[0] && a.level !== unitLevel) continue;
    crumbs.push({
      id: a.id,
      label: p(a.title),
      onClick: () => onNavigate?.(...targetFor(a)),
    });
  }
  crumbs.push({ id: node.id, label: p(node.title) });
  return crumbs;
}
