import { createContext, useContext, useMemo } from 'react';
import { DEFAULT_PROJECT_ID } from '@/mock/projects';
import { getProject, getNode, rootsOf, defaultContentOf } from '@/mock/nodes';

/**
 * ตำแหน่งของผู้เรียนในต้นไม้เนื้อหา — โครงการไหน และอยู่ที่ node ไหน
 *
 * เก็บใน querystring (?project / ?node) ไม่ใช่ path segment
 * เพราะ path segment เลือก "คอมโพเนนต์" ส่วนสองตัวนี้เลือก "เนื้อหา"
 * และ goto ของ ShowcasePage รักษา querystring ไว้ให้อยู่แล้ว
 * การสลับธีมหรือสลับหน้าจึงไม่ทำให้หลุดจากตำแหน่งเดิม และ iframe โหมดเทียบก็รับค่าต่อได้
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
export function resolveRoute({ pageId, projectId, nodeId }) {
  const project = getProject(projectId) ?? getProject(DEFAULT_PROJECT_ID);
  const raw = nodeId ? getNode(nodeId) : undefined;
  // node ข้ามโครงการถือว่าใช้ไม่ได้ — เกิดขึ้นจริงเวลาสลับโครงการแล้ว ?node เก่ายังค้างอยู่
  const node = raw?.projectId === project.id ? raw : undefined;
  return { project, node: node ?? fallbackNode(project, pageId) };
}

function fallbackNode(project, pageId) {
  if (pageId === 'browse') return rootsOf(project.id)[0];
  if (pageId === 'lesson' || pageId === 'quiz') return defaultContentOf(project.id);
  return null;
}

export function AppRouteProvider({ pageId, projectId, nodeId, children }) {
  const value = useMemo(
    () => resolveRoute({ pageId, projectId, nodeId }),
    [pageId, projectId, nodeId],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppRoute() {
  const value = useContext(Ctx);
  // ค่าสำรองให้คอมโพเนนต์ที่ถูกเรนเดอร์นอก provider (เช่นในเทสต์) ไม่ระเบิด
  return value ?? resolveRoute({ pageId: 'subjects' });
}
