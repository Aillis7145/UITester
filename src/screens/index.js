import { PAGE_IDS, PAGE_ICONS } from './pages';
import { LoginScreen } from './LoginScreen';
import { SubjectsScreen } from './SubjectsScreen';
import { BrowseScreen } from './BrowseScreen';
import { LessonScreen } from './LessonScreen';
import { PracticeScreen } from './PracticeScreen';
import { ExamsScreen } from './ExamsScreen';
import { ExamStartScreen } from './ExamStartScreen';
import { QuizScreen } from './QuizScreen';
import { ResultsScreen } from './ResultsScreen';
import { CertificatesScreen } from './CertificatesScreen';
import { HistoryScreen } from './HistoryScreen';
import { ProgressScreen } from './ProgressScreen';

/**
 * ทะเบียนหน้าจอ — resolve จาก map ไม่ใช่ switch
 * ShowcasePage กับ EmbedPage จึงใช้เส้นทางโค้ดเดียวกันทั้งคู่ (SCREENS[pageId])
 */
export const SCREENS = {
  login: LoginScreen,
  subjects: SubjectsScreen,
  browse: BrowseScreen,
  lesson: LessonScreen,
  practice: PracticeScreen,
  exams: ExamsScreen,
  examstart: ExamStartScreen,
  quiz: QuizScreen,
  results: ResultsScreen,
  certificates: CertificatesScreen,
  history: HistoryScreen,
  progress: ProgressScreen,
};

export const isPageId = (id) => Object.hasOwn(SCREENS, id);

// รายชื่อหน้ากับไอคอนอยู่ใน pages.js เพราะไฟล์นั้นไม่ import อะไรเลย
// สคริปต์ตรวจสอบ (.mjs) จึงโหลดได้ตรงๆ ไม่ต้องมีรายชื่อเขียนมือซ้ำอีกชุด
export { PAGE_IDS, APP_NAV_IDS, CHROMELESS_PAGES, PAGE_ICONS } from './pages';

if (import.meta.env.DEV) {
  // ทะเบียนสองฝั่งต้องตรงกันเป๊ะ ไม่งั้นสตูดิโอมีปุ่มที่กดแล้วเด้งกลับ
  // หรือหน้าที่มีจริงแต่ไม่มีใครลิงก์ไปถึง
  const declared = new Set(PAGE_IDS);
  const built = new Set(Object.keys(SCREENS));
  const miss = [
    ...[...built].filter((id) => !declared.has(id)).map((id) => `${id}: มีคอมโพเนนต์แต่ไม่ได้ประกาศใน pages.js`),
    ...[...declared].filter((id) => !built.has(id)).map((id) => `${id}: ประกาศไว้แต่ไม่มีคอมโพเนนต์`),
    ...[...declared].filter((id) => !PAGE_ICONS[id]).map((id) => `${id}: ไม่มีไอคอน`),
  ];
  if (miss.length) console.warn('[screens] ทะเบียนหน้าไม่ตรงกัน:\n' + miss.join('\n'));
}
