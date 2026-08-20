import { createContext, useContext, useMemo } from 'react';
import { DEFAULT_PROJECT_ID, LEVEL_ORDER } from '@/mock/projects';
import {
  getProject,
  getNode,
  rootsOf,
  defaultContentOf,
  defaultPracticeContentOf,
  ancestorsOf,
  resumeContentOf,
} from '@/mock/nodes';
import { quizFor } from '@/mock/quizzes';

/**
 * ตำแหน่งของผู้เรียนในต้นไม้เนื้อหา — อยู่ที่ node ไหน
 *
 * เก็บใน querystring (?node) ไม่ใช่ path segment
 * เพราะ path segment เลือก "คอมโพเนนต์" ส่วนตัวนี้เลือก "เนื้อหา"
 * และ goto ของ ShowcasePage รักษา querystring ไว้ให้อยู่แล้ว
 * การสลับธีมหรือสลับหน้าจึงไม่ทำให้หลุดจากตำแหน่งเดิม และ iframe โหมดเทียบก็รับค่าต่อได้
 *
 * *** ไม่มี ?project อีกแล้ว ***
 * เว็บนี้เป็นของลูกค้ารายเดียวที่อาจซื้อหลายวิชา วิชาจึงอนุมานจาก node.projectId เสมอ
 * ความขัดแย้งระหว่างสองค่า (สลับวิชาแล้ว ?node เก่าค้าง) จึงเป็นไปไม่ได้โดยโครงสร้าง
 * ไม่ต้องมีการ์ดคอยทิ้ง node อีก
 *
 * และห้ามเอา ?project กลับมาใช้เป็น state ของชิปกรองด้วย
 * เพราะ goto ส่งต่อทุกคีย์แบบไม่เลือก ค่าที่ค้างจะรอดข้ามหน้าแล้วแอบกรองในหน้าที่ไม่มีชิป
 *
 * ใช้ context ไม่ใช่ prop-drilling เพราะ ShowcasePage เรนเดอร์หน้าจอสองครั้ง
 * (ในกรอบเครื่องกับเต็มจอ) และ AppBar / Breadcrumb / PlaylistPanel อยู่ลึกลงไป 2-3 ชั้น
 */
const Ctx = createContext(null);

/**
 * ทุกหน้าต้องเรนเดอร์ได้ลำพัง — ห้าม redirect เมื่อ ?node หายหรือผิด
 * เพราะสตูดิโอลิงก์ตรงเข้า /showcase/neu/browse ได้ และสคริปต์ตรวจสอบถ่ายภาพ
 * ทุกหน้า × ทุกธีมโดยไม่ใส่ query เลยสักตัว ถ้า redirect ภาพจะเพี้ยนทั้งชุด
 */
function resolveRoute({ pageId, nodeId, setId }) {
  const node = normalise(nodeId ? getNode(nodeId) : undefined, pageId) ?? fallbackNode(pageId);
  const project = getProject(node?.projectId) ?? getProject(DEFAULT_PROJECT_ID);
  // ชุดข้อสอบเป็นของ "ตำแหน่ง + ?set" เหมือนกับ node จึงคิดที่นี่ที่เดียว
  // หน้าจอไม่ต้องรู้จัก router และไม่ต้อง import ข้อสอบเองอีก
  return { project, node: node ?? null, quiz: quizFor(node, setId) };
}

/**
 * ปรับ ?node ให้เข้ากับชั้นที่หน้านั้นรับได้ — สองทิศทาง ตรงข้ามกันพอดี
 *
 *   browse        รับได้เฉพาะ "คอร์ส"  → ของที่ลึกกว่าถูกดันขึ้นมาที่คอร์สของมัน
 *   lesson/quiz   รับได้เฉพาะ "สื่อ"   → ของที่ตื้นกว่าถูกดันลงไปที่สื่อชิ้นแรกที่ควรเรียนต่อ
 *
 * ทิศลงสำคัญไม่แพ้ทิศขึ้น และเคยพังมาแล้ว:
 * AppBar ส่งต่อ ?node ทุกคีย์แบบไม่เลือก การกด "บทเรียน" ขณะอยู่หน้า browse ของคอร์ส
 * จึงพา ?node ของ "คอร์ส" ไปหน้าวิดีโอ แล้ว LessonScreen หา "หน่วย" ของคอร์สไม่เจอ
 * (คอร์สไม่มีพ่อ) → unit.level โยน TypeError → ErrorBoundary ของ router กลืนเป็นจอเปล่า
 *
 * แก้ที่นี่จุดเดียว ไม่ใช่ไปใส่ ?. ใน LessonScreen เพราะ "สื่อที่ไม่ใช่สื่อ" ไม่ใช่สภาพที่หน้านั้นควรต้องรับมือ
 */
function normalise(node, pageId) {
  if (!node) return node;
  if (pageId === 'browse') {
    if (node.level === LEVEL_ORDER[0]) return node;
    return ancestorsOf(node.id).find((a) => a.level === LEVEL_ORDER[0]) ?? node;
  }
  if (pageId === 'lesson' || pageId === 'quiz' || pageId === 'practice') {
    // กล่องว่างจริงๆ จะได้ undefined แล้วตกไปใช้ fallbackNode ต่อ ซึ่งถูกต้องกว่าการโชว์กล่องเปล่า
    return node.level === 'content' ? node : resumeContentOf(node.id);
  }
  return node;
}

function fallbackNode(pageId) {
  if (pageId === 'browse') return rootsOf(DEFAULT_PROJECT_ID)[0];
  if (pageId === 'practice') return defaultPracticeContentOf();
  if (pageId === 'lesson' || pageId === 'quiz') return defaultContentOf(DEFAULT_PROJECT_ID);
  return null;
}

export function AppRouteProvider({ pageId, nodeId, setId, children }) {
  const value = useMemo(() => resolveRoute({ pageId, nodeId, setId }), [pageId, nodeId, setId]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppRoute() {
  const value = useContext(Ctx);
  // ค่าสำรองให้คอมโพเนนต์ที่ถูกเรนเดอร์นอก provider (เช่นในเทสต์) ไม่ระเบิด
  return value ?? resolveRoute({ pageId: 'subjects' });
}
