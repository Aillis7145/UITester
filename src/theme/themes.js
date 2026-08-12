import TechBackdrop from '@/themes/tech/Backdrop';
import SchoolBackdrop from '@/themes/school/Backdrop';
import NeuBackdrop from '@/themes/neu/Backdrop';
import EduraBackdrop from '@/themes/edura/Backdrop';
import SkooldioBackdrop from '@/themes/skooldio/Backdrop';

import * as techDecor from '@/themes/tech/decor';
import * as schoolDecor from '@/themes/school/decor';
import * as neuDecor from '@/themes/neu/decor';
import * as eduraDecor from '@/themes/edura/decor';
import * as skooldioDecor from '@/themes/skooldio/decor';

/**
 * ทะเบียนธีม — แหล่งความจริงเดียวว่ามีธีมอะไรบ้าง
 *
 * decor คือ slot ทางเลือก หน้าจอเรียกใช้แบบ `decor.LoginAside && <decor.LoginAside />`
 * ธีมไหนไม่มี slot นั้นก็แค่ไม่ export ออกมา ไม่ต้องแก้หน้าจอ
 *
 * spec คือข้อมูลที่เอาไว้ "อ่าน" ไม่ใช่เอาไปใช้เรนเดอร์สไตล์
 * ค่าจริงอยู่ในไฟล์ CSS ของธีมเสมอ ตรงนี้เป็นแค่คำอธิบายให้คนเลือกธีมได้ง่ายขึ้น
 * ถ้าแก้ค่าใน CSS แล้ว อย่าลืมแก้ตรงนี้ให้ตรงกัน — audit:tokens ตรวจ radius ให้
 */
export const THEMES = {
  tech: {
    id: 'tech',
    name: { th: 'เทค / เอไอ', en: 'Tech / AI' },
    tagline: { th: 'ดาร์กนีออน', en: 'Dark Neon' },
    blurb: {
      th: 'กระจกฝ้า เส้นเรืองแสง พื้นหลังอนุภาค 3 มิติ เหมาะกับคอร์ส IT และ AI',
      en: 'Glassmorphism, neon glow, 3D particle field — built for IT and AI courses',
    },
    swatch: ['#151d33', '#22d3ee', '#c084fc'],
    Backdrop: TechBackdrop,
    decor: techDecor,
    has3D: true,
    spec: {
      fontDisplay: 'Anuphan',
      fontSans: 'Anuphan',
      fontNote: { th: 'ไม่มีหัว เรขาคณิต', en: 'Loopless, geometric' },
      radius: '0.5 / 0.875rem',
      frameId: 'frm-glow-hairline',
      frame: { th: 'เส้นผมเรืองแสง', en: 'Glowing hairline' },
    },
  },
  school: {
    id: 'school',
    name: { th: 'โรงเรียน', en: 'School' },
    tagline: { th: 'สดใส เป็นมิตร', en: 'Friendly Bright' },
    blurb: {
      th: 'สีสว่าง มุมโค้งมน ปุ่มแบบสติกเกอร์ที่เด้งได้ เหมาะกับวิชาพื้นฐาน',
      en: 'Bright pastels, round corners, bouncy sticker buttons — for school subjects',
    },
    swatch: ['#fdf6ec', '#cf4a33', '#5cc9c2'],
    Backdrop: SchoolBackdrop,
    decor: schoolDecor,
    has3D: false,
    spec: {
      fontDisplay: 'Kodchasan',
      fontSans: 'Sarabun',
      fontNote: { th: 'มีหัว อ่านง่าย', en: 'Looped, highly readable' },
      radius: '1.25 / 2rem',
      frameId: 'frm-hard-offset',
      frame: { th: 'เงาแข็งแบบสติกเกอร์', en: 'Hard offset shadow' },
    },
  },
  neu: {
    id: 'neu',
    name: { th: 'นูมอร์ฟิซึม', en: 'Neumorphism' },
    tagline: { th: 'นุ่ม มีสีสัน', en: 'Soft & Colorful' },
    blurb: {
      th: 'พื้นผิวนูนกดด้วยเงาคู่ ไม่มีเส้นขอบเลย บนพื้นขาวที่มีม่วงอ่อนแซม',
      en: 'Dual-light soft UI with zero borders, on white with soft violet accents',
    },
    swatch: ['#f1edf9', '#6b4fd4', '#a855c9'],
    Backdrop: NeuBackdrop,
    decor: neuDecor,
    has3D: false,
    spec: {
      fontDisplay: 'Prompt',
      fontSans: 'Prompt',
      fontNote: { th: 'ไม่มีหัว มนกลม', en: 'Loopless, rounded' },
      radius: '1.5 / 2.5rem',
      frameId: 'frm-soft-emboss',
      frame: { th: 'เงานูนคู่ ไม่มีขอบ', en: 'Dual-light emboss' },
    },
  },
  edura: {
    id: 'edura',
    name: { th: 'เอดูรา', en: 'Edura' },
    tagline: { th: 'กรมท่าตัดขาว', en: 'Navy & White' },
    blurb: {
      th: 'พื้นกรมท่าเข้มตัดกับการ์ดขาวล้วน เน้นด้วยอำพัน มุมเกือบเหลี่ยม ไม่มีเส้นขอบเลย',
      en: 'Deep navy page against pure white cards, amber accents, near-square corners, zero borders',
    },
    swatch: ['#1e3350', '#ffffff', '#f5b02e'],
    Backdrop: EduraBackdrop,
    decor: eduraDecor,
    has3D: false,
    spec: {
      fontDisplay: 'IBM Plex Sans Thai',
      fontSans: 'IBM Plex Sans Thai',
      fontNote: { th: 'มีหัว เป็นทางการ', en: 'Looped, corporate' },
      radius: '0.25 / 0.375rem',
      frameId: 'frm-no-border',
      frame: { th: 'ไม่มีขอบ ใช้สีตัดกัน', en: 'Borderless contrast' },
    },
  },
  skooldio: {
    id: 'skooldio',
    name: { th: 'สกูลดิโอ', en: 'Skooldio' },
    tagline: { th: 'ฟ้า ขาว เขียว', en: 'Blue, White & Green' },
    blurb: {
      th: 'ขาวล้วน ตัวหนังสือหนักมือ เส้นขอบคมแทนเงา เน้นฟ้าเป็นหลักเขียวเป็นรอง',
      en: 'Pure white, heavy type, crisp borders instead of shadows, blue lead with green support',
    },
    swatch: ['#ffffff', '#1d63d8', '#28a06a'],
    Backdrop: SkooldioBackdrop,
    decor: skooldioDecor,
    has3D: false,
    spec: {
      fontDisplay: 'IBM Plex Sans Thai Looped',
      fontSans: 'IBM Plex Sans Thai',
      fontNote: { th: 'มีหัว หัวข้อเป็นแบบห่วง', en: 'Looped, looped-style headings' },
      radius: '0.75 / 1.125rem',
      frameId: 'frm-crisp-line',
      frame: { th: 'เส้นคมชัด', en: 'Crisp line' },
    },
  },
};

export const THEME_IDS = Object.keys(THEMES);
export const DEFAULT_THEME = 'tech';

export const isThemeId = (id) => Object.hasOwn(THEMES, id);
