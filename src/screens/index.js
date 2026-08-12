import { LoginScreen } from './LoginScreen';
import { SubjectsScreen } from './SubjectsScreen';
import { LessonScreen } from './LessonScreen';
import { QuizScreen } from './QuizScreen';
import { ResultsScreen } from './ResultsScreen';

/**
 * ทะเบียนหน้าจอ — resolve จาก map ไม่ใช่ switch
 * ShowcasePage กับ EmbedPage จึงใช้เส้นทางโค้ดเดียวกันทั้งคู่ (SCREENS[pageId])
 */
export const SCREENS = {
  login: LoginScreen,
  subjects: SubjectsScreen,
  lesson: LessonScreen,
  quiz: QuizScreen,
  results: ResultsScreen,
};

export const PAGE_IDS = Object.keys(SCREENS);
export const DEFAULT_PAGE = 'login';

export const isPageId = (id) => Object.hasOwn(SCREENS, id);

/** ไอคอนของแต่ละหน้าใน nav ของสตูดิโอ */
export const PAGE_ICONS = {
  login: 'lock',
  subjects: 'grid',
  lesson: 'play',
  quiz: 'flag',
  results: 'trophy',
};
