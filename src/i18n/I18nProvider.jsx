import { createContext, useContext, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import th from './locales/th';
import en from './locales/en';

const DICTS = { th, en };
export const LANGS = Object.keys(DICTS);
const Ctx = createContext(null);

/**
 * i18n แบบเบาที่สุดที่ยังใช้งานจริงได้ — ไม่มี library
 * ภาษาอ่านจาก ?lang ก่อน แล้วค่อย localStorage
 * ให้ URL ชนะเพราะ iframe ในโหมดเทียบข้างต้องรับภาษาต่อจากหน้าแม่
 */
export function I18nProvider({ children }) {
  const [sp, setSp] = useSearchParams();
  const [stored, setStored] = useLocalStorage('uitester:lang', 'th');

  const urlLang = sp.get('lang');
  const lang = DICTS[urlLang] ? urlLang : DICTS[stored] ? stored : 'th';

  const value = useMemo(() => {
    const dict = DICTS[lang];

    /** ข้อความของเปลือก UI — คีย์ซ้อนชั้น + {placeholder} */
    const t = (key, vars) => {
      const raw = key.split('.').reduce((o, k) => o?.[k], dict);
      if (typeof raw !== 'string') {
        if (import.meta.env.DEV) console.warn('[i18n] missing key:', key, `(${lang})`);
        return key;
      }
      return vars ? raw.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? '')) : raw;
    };

    /** เนื้อหาจำลอง — object รูป { th, en } ที่ฝังอยู่ใน mock/data.js */
    const p = (obj) => (typeof obj === 'string' ? obj : (obj?.[lang] ?? obj?.th ?? ''));

    const setLang = (next) => {
      if (!DICTS[next]) return;
      setStored(next);
      // อัปเดต URL ด้วยถ้ามี ?lang อยู่แล้ว เพื่อให้ลิงก์ที่แชร์ไปยังตรง
      if (sp.get('lang')) {
        const nextSp = new URLSearchParams(sp);
        nextSp.set('lang', next);
        setSp(nextSp, { replace: true });
      }
    };

    return { lang, setLang, t, p, dict };
  }, [lang, sp, setSp, setStored]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}

/**
 * ตรวจว่า key ของสองภาษาตรงกันหมด — รันเฉพาะตอน dev
 * ป้องกันการ drift ที่มักเกิดเวลาเพิ่มข้อความใหม่แล้วลืมอีกภาษา
 */
export function checkLocaleParity() {
  const walk = (obj, prefix = '', out = []) => {
    for (const [k, v] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === 'object') walk(v, path, out);
      else out.push(path);
    }
    return out;
  };
  const thKeys = new Set(walk(th));
  const enKeys = new Set(walk(en));
  const missingEn = [...thKeys].filter((k) => !enKeys.has(k));
  const missingTh = [...enKeys].filter((k) => !thKeys.has(k));
  if (missingEn.length) console.warn('[i18n] ขาดใน en:', missingEn);
  if (missingTh.length) console.warn('[i18n] ขาดใน th:', missingTh);
  if (!missingEn.length && !missingTh.length) {
    console.info(`[i18n] key ตรงกันทั้งสองภาษา (${thKeys.size} คีย์)`);
  }
}
