import { ancestorsOf } from '@/mock/nodes';

/**
 * ปลายทางของ node ใดก็ได้ — ปุ่มทุกใบในแอปเรียกฟังก์ชันนี้ตัวเดียว
 *
 * นี่คือจุดเดียวในโปรเจคที่รู้ว่าอะไรพาไปหน้าไหน
 * หน้าจอจึงไม่มีทางเข้ารหัสลำดับหน้าไว้เอง และการเพิ่มชั้นใหม่ไม่ต้องแก้หน้าจอสักไฟล์
 *
 * คืนค่าเป็น [pageId, params] เพื่อส่งเข้า onNavigate ได้ตรงๆ ด้วย spread
 */
export function targetFor(node) {
  if (node.level !== 'content') return ['browse', { node: node.id }];
  return node.kind === 'quiz' ? ['quiz', { node: node.id }] : ['lesson', { node: node.id }];
}

/**
 * เส้นทางจากโครงการลงมาถึง node ปัจจุบัน
 *
 * ความลึกมาจาก ancestorsOf จึงเปลี่ยนตามโครงการเอง
 * โครงการ 3 ชั้นได้ 5 ก้อน โครงการ 2 ชั้นได้ 4 ก้อน โดยไม่มีที่ไหนเขียนเลขไว้
 * ก้อนสุดท้ายไม่มี onClick เพราะเป็นตำแหน่งปัจจุบัน — Breadcrumb จะทำให้เป็นข้อความเอง
 */
export function crumbsFor({ project, node, onNavigate, p }) {
  const crumbs = [
    {
      id: project.id,
      label: p(project.name),
      onClick: () => onNavigate?.('subjects', { project: project.id, node: null }),
    },
  ];
  for (const a of ancestorsOf(node.id)) {
    crumbs.push({ id: a.id, label: p(a.title), onClick: () => onNavigate?.('browse', { node: a.id }) });
  }
  crumbs.push({ id: node.id, label: p(node.title) });
  return crumbs;
}
