/**
 * แปลงไฟล์ Word ของแบบฝึกหัด/แบบทดสอบ → src/mock/quizbank.js
 *
 *   node scripts/build-quizbank.mjs        (หรือ npm run build:quizbank)
 *
 * ต้นทาง: quiz_data/*.docx — สตอรีบอร์ดจริงของ B1 บทที่ 1 (10 ไฟล์)
 * ตอนนี้ทำไว้บทเดียวเป็นตัวอย่าง บทอื่นใช้รูปแบบไฟล์เดียวกันแล้วเพิ่มแถวใน SHEETS ได้เลย
 *
 * เป็น "การแปลงล้วน" — รันซ้ำต้องได้ผลเดิมเป๊ะ ไม่มีอะไรสุ่มและไม่มีวันที่
 *
 * ─────────────────────────────────────────────────────────────
 * อ่าน .docx ด้วย Node ล้วน
 * ─────────────────────────────────────────────────────────────
 * .docx คือไฟล์ zip ที่มี word/document.xml อยู่ข้างใน บีบด้วย deflate
 * อ่าน central directory เองแล้ว inflateRawSync พอ ไม่ต้องพึ่ง unzip หรือไลบรารีใดๆ
 * เหตุผลเดียวกับ build-curriculum.mjs — สคริปต์ต้องรันได้จากเครื่องเปล่า
 *
 * ─────────────────────────────────────────────────────────────
 * เฉลยอยู่คนละที่ในสองกลุ่มไฟล์ *** ห้ามสลับวิธีกัน ***
 * ─────────────────────────────────────────────────────────────
 * ไฟล์ 4.x (แบบฝึกหัดระหว่างบท) → เฉลยเป็นข้อความ "คำตอบคือ: …" ท้ายไฟล์
 *   สีแดงในไฟล์กลุ่มนี้คลุมทั้งบล็อกเฉลย ไม่ได้ชี้ตัวเลือกที่ถูก ใช้ไม่ได้
 * ไฟล์ 5.x (แบบทดสอบท้ายบท) → ไม่มีข้อความเฉลยเลย ตัวเลือกที่ถูกทำเป็น "ตัวอักษรสีแดง"
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'quiz_data');

/* ============================================================
   1 · อ่าน .docx → ย่อหน้าพร้อมสีของตัวอักษร
   ============================================================ */

/** ดึงไฟล์เดียวออกจาก zip โดยไล่ central directory จากท้ายไฟล์ */
function unzipEntry(buf, want) {
  const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (eocd < 0) throw new Error('ไม่ใช่ไฟล์ zip');
  let off = buf.readUInt32LE(eocd + 16);
  const count = buf.readUInt16LE(eocd + 10);

  for (let i = 0; i < count; i++) {
    const nameLen = buf.readUInt16LE(off + 28);
    const extraLen = buf.readUInt16LE(off + 30);
    const cmtLen = buf.readUInt16LE(off + 32);
    const name = buf.toString('utf8', off + 46, off + 46 + nameLen);
    if (name === want) {
      const method = buf.readUInt16LE(off + 10);
      const size = buf.readUInt32LE(off + 20);
      const lho = buf.readUInt32LE(off + 42);
      const start = lho + 30 + buf.readUInt16LE(lho + 26) + buf.readUInt16LE(lho + 28);
      const raw = buf.subarray(start, start + size);
      return method === 0 ? raw : zlib.inflateRawSync(raw);
    }
    off += 46 + nameLen + extraLen + cmtLen;
  }
  throw new Error(`ไม่เจอ ${want} ในไฟล์`);
}

const unescape = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');

/**
 * หนึ่งย่อหน้า = { text, red, blue, bold }
 *
 * เก็บสีไว้เพราะเป็นข้อมูลจริงในไฟล์ ไม่ใช่การตกแต่ง —
 * แดงคือ "ตัวเลือกที่ถูก" ในไฟล์ 5.x และฟ้าคือ "สคริปต์เสียง"
 *
 * เครื่องหมายคำพูดโค้ง (“ ” ’) เก็บไว้ตามต้นฉบับ ห้ามแปลงเป็นอัญประกาศตรง
 * เพราะบางข้อสอบเรื่องเครื่องหมายวรรคตอนโดยตรง
 */
function paragraphsOf(file) {
  const xml = unzipEntry(fs.readFileSync(file), 'word/document.xml').toString('utf8');
  return xml
    .split(/<\/w:p>/)
    .map((chunk) => {
      const text = unescape(
        chunk
          .replace(/<w:tab\/>/g, '\t')
          .replace(/<w:br[^>]*\/>/g, ' ')
          .replace(/<[^>]+>/g, ''),
      )
        .replace(/[ \t ]+/g, ' ')
        .trim();
      return {
        text,
        red: /<w:color w:val="FF0000"/i.test(chunk),
        blue: /<w:color w:val="00B0F0"/i.test(chunk),
        bold: /<w:b\/>|<w:b [^>]*\/>/.test(chunk),
      };
    })
    .filter((p) => p.text);
}

/* ============================================================
   2 · ตัวช่วยหาขอบเขต
   ============================================================ */

const DIVIDER = /^\.{10,}$/;
const EXPLAIN_HEAD = /^คำอธิบายคำตอบที่ถูกต้อง/;
const COUNT_LINE = /จำนวน\s*(\d+)\s*ข้อ/;

/** จำนวนข้อที่ไฟล์ประกาศไว้เอง — ใช้เป็นตัวตรวจว่าแยกได้ครบ */
function declaredCount(paras) {
  for (const p of paras) {
    const m = COUNT_LINE.exec(p.text);
    if (m) return Number(m[1]);
  }
  throw new Error('ไม่เจอบรรทัด "จำนวน N ข้อ"');
}

/** ช่วงที่เป็นตัวคำถามจริง — ตัดหัวไฟล์ คำสั่ง บทความ/สคริปต์ และบล็อกเฉลยออก */
function questionRegion(paras) {
  const end = paras.findIndex((p) => EXPLAIN_HEAD.test(p.text));
  const body = paras.slice(0, end < 0 ? paras.length : end);

  let start = 0;
  body.forEach((p, i) => {
    if (COUNT_LINE.test(p.text)) start = Math.max(start, i + 1);
    if (/^\(?คำสั่ง[::]/.test(p.text)) start = Math.max(start, i + 1);
    if (DIVIDER.test(p.text)) start = Math.max(start, i + 1);
    if (/^Answers?:/i.test(p.text)) start = Math.max(start, i); // แถวตัวเลือกของข้อเติมคำ
  });
  const audio = audioBounds(body);
  if (audio) start = Math.max(start, audio.to); // ข้ามบทพูดทั้งก้อน
  return body.slice(start);
}

/**
 * สคริปต์เสียง — ย่อหน้าที่อยู่ "หลังป้าย (Script for audio…) จนถึงคำถามข้อแรก"
 *
 * ห้ามใช้สีเป็นตัวชี้ — ไฟล์ 5.1 ทำตัวสคริปต์เป็นสีฟ้า แต่ไฟล์ 4.3 ทำ *ป้ายกำกับ* เป็นสีฟ้า
 * ส่วนตัวสคริปต์เป็นสีเทาเข้ม ใช้สีแล้วจะได้ป้ายกำกับมาแทนเนื้อสคริปต์
 */
function audioBounds(paras) {
  const mark = paras.findIndex((p) => /Script for audio/i.test(p.text));
  if (mark < 0) return null;
  let end = mark + 1;
  while (end < paras.length && !isStem(paras[end].text)) end++;
  return { from: mark + 1, to: end };
}

function audioScriptOf(paras) {
  const at = audioBounds(paras);
  if (!at) return undefined;
  return (
    paras
      .slice(at.from, at.to)
      .map((p) => p.text)
      // ป้ายกำกับในวงเล็บล้วนไม่ใช่บทพูด
      .filter((t) => !/^\(.*\)$/.test(t))
      .join(' ')
      .trim() || undefined
  );
}

/**
 * บทความสำหรับข้อการอ่าน — ตั้งแต่หัวข้อตัวหนา จนถึงเส้นคั่น / "Answers:" / คำถามข้อแรก
 *
 * ห้ามใช้ "ระหว่างเส้นคั่นจุดสองเส้น" เป็นกฎ — เส้นคั่นเส้นแรกในไฟล์ 4.2
 * ถูกพิมพ์ต่อท้ายบรรทัดคำสั่งภาษาไทยในย่อหน้าเดียวกัน ไม่ได้เป็นย่อหน้าของตัวเอง
 * กฎนั้นจึงเจอเส้นเดียวแล้วกวาดทั้งไฟล์มาเป็นบทความ รวมทั้งเฉลยด้วย
 */
function passageOf(paras) {
  const head = paras.findIndex(
    (p, i) => p.bold && /^[A-Z]/.test(p.text) && p.text.length < 60 && !/[::]$/.test(p.text) && i > 2,
  );
  if (head < 0) return undefined;

  const out = [];
  for (let i = head; i < paras.length; i++) {
    const t = paras[i].text;
    if (DIVIDER.test(t) || /^Answers?:/i.test(t) || EXPLAIN_HEAD.test(t)) break;
    // ห้ามใช้ isStem ตรงนี้ — บทความของข้อเติมคำมีช่องว่าง (1) ______ อยู่ในตัวมันเอง
    // จะถูกมองเป็นคำถามแล้วบทความขาดตั้งแต่ย่อหน้าแรก ใช้แค่ประโยคคำถามที่จบด้วย ? ก็พอ
    if (i > head && /\?$/.test(t)) break;
    out.push(t);
  }
  return out.length > 1 ? out.join('\n') : undefined;
}

/** เฉลยแบบข้อความของไฟล์ 4.x — "คำตอบคือ: X" (บางย่อหน้าต่อด้วย "คำอธิบาย:" ติดกันเลย) */
function textAnswers(paras) {
  const out = [];
  for (const p of paras) {
    const m = /คำตอบคือ\s*[::]\s*([\s\S]*)/.exec(p.text);
    if (!m) continue;
    out.push(m[1].split(/คำอธิบาย\s*[::]/)[0].trim());
  }
  return out;
}

/** คำอธิบายไทยของแต่ละข้อ — อยู่ต่อจาก "คำอธิบาย:" ในย่อหน้าเดียวกันหรือย่อหน้าถัดไป */
/**
 * คำอธิบายไทยของแต่ละข้อ
 *
 * ในไฟล์ต้นฉบับคำอธิบายไม่ได้จบในย่อหน้าเดียว — มันไหลต่อไปเรื่อยๆ
 * จนกว่าจะเจอหัวข้อถัดไป (เลขข้อใหม่ หรือ "คำตอบคือ" ของข้อถัดไป)
 * เก็บให้ครบ เพราะนี่คือเนื้อหาที่ผู้เรียนอ่านหลังส่งคำตอบ ไม่ใช่ของประดับ
 */
function explanations(paras) {
  const out = [];
  paras.forEach((p, i) => {
    const m = /คำอธิบาย\s*[::]\s*([\s\S]*)/.exec(p.text);
    if (!m) return;
    const parts = [m[1].trim()];
    for (let j = i + 1; j < paras.length; j++) {
      const t = paras[j].text;
      if (/คำตอบคือ|คำอธิบาย\s*[::]/.test(t) || /^\d+\s*[.．]/.test(t)) break;
      parts.push(t);
    }
    out.push(parts.join(' ').trim());
  });
  return out;
}

/* ============================================================
   3 · กฎแยกคำถามต่อรูปทรงไฟล์
   ============================================================ */

/**
 * ย่อหน้าที่เป็น "โจทย์" ไม่ใช่ "ตัวเลือก"
 *
 * โจทย์ในไฟล์ชุดนี้มีอย่างน้อยหนึ่งอย่างเสมอ: มีช่องว่าง ___ · จบด้วย ? · จบด้วย :
 * ส่วนตัวเลือกเป็นวลีสั้นที่ไม่มีสามอย่างนี้เลยสักข้อ (ตรวจครบทั้ง 6 ไฟล์ปรนัยแล้ว)
 *
 * โจทย์ที่ยาวหลายบรรทัด (บทสนทนาสองคน) จะเป็นย่อหน้าติดกันหลายย่อหน้า
 * ทุกย่อหน้าเข้าเงื่อนไขนี้หมด จึงถูกรวมเป็นโจทย์เดียวโดยอัตโนมัติ
 */
const isStem = (t) => /_{3,}/.test(t) || /[?:]$/.test(t);

/** ปรนัยแบบมาตรฐาน: โจทย์ 1..n ย่อหน้า ตามด้วยตัวเลือก 4 ย่อหน้า */
function splitMcq(region) {
  const groups = [];
  let cur = null;
  for (const p of region) {
    if (isStem(p.text)) {
      if (!cur || cur.options.length) groups.push((cur = { stem: [], options: [] }));
      cur.stem.push(p);
    } else {
      if (!cur) continue; // ข้อความก่อนโจทย์แรก
      cur.options.push(p);
    }
  }
  return groups;
}

/** ข้อเติมคำในบทความ: ตัวเลือกอยู่ในย่อหน้าเดียว "A. x B. y C. z D. w" */
function splitCloze(region) {
  return region
    .filter((p) => /^A\.\s/.test(p.text) && /\bD\.\s/.test(p.text))
    .map((p) => ({
      options: p.text
        .split(/(?=\b[A-D]\.\s)/)
        .map((s) => s.replace(/^[A-D]\.\s*/, '').trim())
        .filter(Boolean),
    }));
}

/** ข้อเขียน/ข้อพูด: หนึ่งข้อ = หนึ่งบล็อกที่ขึ้นต้นด้วย Instructions: */
function splitOpen(paras) {
  const end = paras.findIndex((p) => EXPLAIN_HEAD.test(p.text));
  // บางไฟล์ต่อคำสั่งของข้อถัดไปท้ายย่อหน้า Prompt ของข้อก่อนหน้าเลย (เจอใน 5.4)
  // ตัดตรงคำว่า Instructions: ที่ไม่ได้อยู่ต้นย่อหน้าก่อน ไม่งั้นจะแยกได้ข้อเดียว
  const body = paras
    .slice(0, end < 0 ? paras.length : end)
    .flatMap((p) =>
      p.text
        .split(/(?=Instructions:)/)
        .map((t) => t.trim())
        .filter(Boolean)
        .map((text) => ({ ...p, text })),
    );
  const heads = body.map((p, i) => (/^Instructions:/i.test(p.text) ? i : -1)).filter((i) => i >= 0);

  return heads.map((from, k) => {
    const block = body.slice(from, heads[k + 1] ?? body.length);
    const gi = block.findIndex((p) => /^Guideline/i.test(p.text));
    const pi = block.findIndex((p) => /^Prompt/i.test(p.text));

    // ชื่อหัวข้อ = บรรทัดถัดจากคำสั่งภาษาไทย ก่อนถึงบล็อกแนวทาง
    const title = block.slice(1, gi < 0 ? block.length : gi).find((p) => !/^\(คำสั่ง/.test(p.text));

    return {
      instruction: block[0].text.replace(/^Instructions:\s*/i, ''),
      title: title?.text ?? block[0].text,
      guidelines: gi < 0 ? [] : block.slice(gi + 1, pi < 0 ? block.length : pi).map((p) => p.text),
      // ประโยคเริ่มต้นอยู่ในย่อหน้าเดียวกับ "Prompt (…):" หรือย่อหน้าถัดไป
      starter:
        pi < 0
          ? undefined
          : (/[::]\s*(.+)$/.exec(block[pi].text)?.[1] ?? block[pi + 1]?.text ?? '')
              .replace(/^Begin your paragraph with:\s*/i, '')
              .replace(/^Start with\s*/i, '')
              .trim() || undefined,
    };
  });
}

/** ตัวอย่างคำตอบ — ต้องขึ้นต้นด้วย "ตัวอย่างคำตอบ:" เท่านั้น
    ห้ามจับ "คำอธิบายตัวอย่างคำตอบ" ซึ่งเป็นคำอธิบายว่าทำไมถึงตอบแบบนั้น */
function samplesOf(paras) {
  const out = [];
  paras.forEach((p, i) => {
    if (!/ตัวอย่างคำตอบ/.test(p.text)) return;
    // "คำอธิบายตัวอย่างคำตอบ" คือคำอธิบายว่าทำไมถึงตอบแบบนั้น ไม่ใช่ตัวคำตอบ
    if (/^คำอธิบายตัวอย่างคำตอบ/.test(p.text)) return;
    // สองรูปแบบที่เจอจริงในไฟล์:
    //   4.x → "ตัวอย่างคำตอบ: <คำตอบ>"              คำตอบอยู่ในย่อหน้าเดียวกัน
    //   5.x → "Possible Answer [ตัวอย่างคำตอบ]:"    คำตอบอยู่ย่อหน้าถัดไป
    const inline = p.text.split(/ตัวอย่างคำตอบ\)?\s*[::]\s*/)[1]?.trim();
    out.push(inline || paras[i + 1]?.text?.trim() || '');
  });
  return out.filter(Boolean);
}

/* ============================================================
   4 · ประกอบเป็นชุดข้อสอบ
   ============================================================ */

const CHOICE_IDS = ['a', 'b', 'c', 'd', 'e', 'f'];
const bi = (s) => ({ th: s, en: s });
/** เทียบข้อความแบบไม่สนอัญประกาศโค้ง/ตรง และช่องว่างซ้อน */
const norm = (s) => s.replace(/[“”„]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase();

/**
 * ข้อปรนัยหนึ่งข้อ
 * answerIds มีตัวเดียวเสมอในชุดนี้ (ต้นฉบับไม่มีข้อที่ตอบได้หลายตัวเลือก)
 */
function mcqQuestion({ id, skill, prompt, options, correctText, correctRed, explanation, extra }) {
  const choices = options.map((text, i) => ({ id: CHOICE_IDS[i], text: bi(text) }));

  let answer = correctRed;
  if (answer == null && correctText != null) {
    answer = options.findIndex((o) => norm(o) === norm(correctText));
    // เฉลยบางข้อเขียนย่อกว่าตัวเลือกจริง เช่น "meets" กับตัวเลือก "Meets"
    if (answer < 0) answer = options.findIndex((o) => norm(o).startsWith(norm(correctText)));
  }
  if (answer == null || answer < 0) throw new Error(`หาเฉลยของข้อ ${id} ไม่เจอ (เฉลย: ${correctText})`);

  return {
    id,
    type: 'single',
    skill,
    prompt: bi(prompt),
    choices,
    answerIds: [CHOICE_IDS[answer]],
    ...(explanation ? { explanation: { th: explanation, en: explanation } } : {}),
    ...extra,
  };
}

/** ข้อเขียน/ข้อพูด — ไม่มี answerIds จึงไม่เข้าการคิดคะแนน */
const openQuestion = ({ id, skill, type, block, sample }) => ({
  id,
  type,
  skill,
  prompt: bi(block.title),
  instruction: bi(block.instruction),
  guidelines: block.guidelines.map(bi),
  ...(block.starter ? { starter: bi(block.starter) } : {}),
  ...(sample ? { sample: bi(sample) } : {}),
});

/* ---------- ตัวสร้างต่อรูปทรง ---------- */

function buildMcq(paras, { skill, idPrefix, useRed }) {
  const expect = declaredCount(paras);
  const groups = splitMcq(questionRegion(paras));
  const answers = useRed ? null : textAnswers(paras);
  const notes = useRed ? [] : explanations(paras);
  const script = audioScriptOf(paras);
  const passage = skill === 'reading' ? passageOf(paras) : undefined;

  if (groups.length !== expect) throw new Error(`แยกได้ ${groups.length} ข้อ แต่ไฟล์บอกว่า ${expect} ข้อ`);

  return groups.map((g, i) => {
    if (g.options.length !== 4) throw new Error(`ข้อ ${i + 1} มีตัวเลือก ${g.options.length} ตัว ไม่ใช่ 4`);
    const red = g.options.findIndex((o) => o.red);
    return mcqQuestion({
      id: `${idPrefix}-${i + 1}`,
      skill,
      prompt: g.stem.map((p) => p.text).join('\n'),
      options: g.options.map((o) => o.text),
      correctRed: useRed ? (red < 0 ? undefined : red) : undefined,
      correctText: useRed ? undefined : answers[i],
      explanation: notes[i],
      extra: {
        ...(script ? { audioScript: script } : {}),
        ...(passage ? { passage: bi(passage) } : {}),
      },
    });
  });
}

function buildCloze(paras, { idPrefix }) {
  const expect = declaredCount(paras);
  const rows = splitCloze(questionRegion(paras));
  const answers = textAnswers(paras);
  const notes = explanations(paras);
  const passage = passageOf(paras);

  if (rows.length !== expect) throw new Error(`แยกได้ ${rows.length} ช่อง แต่ไฟล์บอกว่า ${expect} ข้อ`);
  if (!passage) throw new Error('ไม่เจอบทความของข้อเติมคำ');

  return rows.map((r, i) => {
    // โจทย์ = ประโยคในบทความที่มีช่องว่างหมายเลขนั้น อ่านแล้วรู้ทันทีว่ากำลังเติมตรงไหน
    const sentence =
      passage
        .split(/(?<=[.!?])\s+/)
        .find((s) => s.includes(`(${i + 1})`)) ?? `(${i + 1})`;
    return mcqQuestion({
      id: `${idPrefix}-${i + 1}`,
      skill: 'reading',
      prompt: sentence.trim(),
      options: r.options,
      correctText: answers[i],
      explanation: notes[i],
      extra: { passage: bi(passage), blank: i + 1 },
    });
  });
}

function buildOpen(paras, { skill, type, idPrefix }) {
  const expect = declaredCount(paras);
  const blocks = splitOpen(paras);
  const samples = samplesOf(paras);
  if (blocks.length !== expect) throw new Error(`แยกได้ ${blocks.length} ข้อ แต่ไฟล์บอกว่า ${expect} ข้อ`);
  return blocks.map((b, i) => openQuestion({ id: `${idPrefix}-${i + 1}`, skill, type, block: b, sample: samples[i] }));
}

/* ============================================================
   5 · ทะเบียนไฟล์
   ------------------------------------------------------------
   บทอื่นใช้รูปแบบไฟล์เดียวกัน เพิ่มก้อนใหม่ที่นี่ก้อนเดียวก็ใช้ได้
   key ผูกกับ "ชื่อแผ่นงาน + ลำดับหน่วย" ไม่ใช่ id ของโหนด
   เพราะ id เปลี่ยนได้เมื่อลำดับคอร์สขยับ แต่ชื่อแผ่นงานเป็นของถาวร
   ============================================================ */
const SHEETS = [
  {
    key: 'ENG_B1#1',
    title: { th: 'B1 บทที่ 1', en: 'B1 Unit 1' },
    practice: [
      { skill: 'grammar', file: 'B1_U1_Tp.4.1_Grammar Practice_edit.docx', build: buildMcq },
      { skill: 'reading', file: 'B1_U1_Tp.4.2_Reading Practice_edit.docx', build: buildCloze },
      { skill: 'listening', file: 'B1_U1_Tp.4.3_Listening Practice_edit.docx', build: buildMcq },
      { skill: 'writing', file: 'B1_U1_Tp.4.4_Writing Practice_edit.docx', build: buildOpen, type: 'typing' },
      { skill: 'speaking', file: 'B1_U1_Tp.4.5_Speaking Practice_edit.docx', build: buildOpen, type: 'speaking' },
    ],
    // เรียงตามลำดับที่ต้นฉบับตั้งไว้ (5.1 → 5.5) ไม่ใช่เรียงตามใจเรา
    unit: [
      { skill: 'listening', file: 'B1_U1_Tp.5.1_Listening Unit Quiz.docx', build: buildMcq, red: true },
      { skill: 'reading', file: 'B1_U1_Tp.5.2_Reading Unit Quiz.docx', build: buildMcq, red: true },
      { skill: 'speaking', file: 'B1_U1_Tp.5.3_Speaking Unit Quiz.docx', build: buildOpen, type: 'speaking' },
      { skill: 'writing', file: 'B1_U1_Tp.5.4_Writing Unit Quiz.docx', build: buildOpen, type: 'typing' },
      { skill: 'grammar', file: 'B1_U1_Tp.5.5_Grammar Unit Quiz.docx', build: buildMcq, red: true },
    ],
  },
];

const SKILL_LABEL = {
  grammar: { th: 'ไวยากรณ์', en: 'Grammar' },
  reading: { th: 'การอ่าน', en: 'Reading' },
  listening: { th: 'การฟัง', en: 'Listening' },
  writing: { th: 'การเขียน', en: 'Writing' },
  speaking: { th: 'การพูด', en: 'Speaking' },
};

const SKILL_TITLE = {
  grammar: { th: 'แบบฝึกหัดไวยากรณ์', en: 'Grammar Practice' },
  reading: { th: 'แบบฝึกหัดการอ่าน', en: 'Reading Practice' },
  listening: { th: 'แบบฝึกหัดการฟัง', en: 'Listening Practice' },
  writing: { th: 'แบบฝึกหัดการเขียน', en: 'Writing Practice' },
  speaking: { th: 'แบบฝึกหัดการพูด', en: 'Speaking Practice' },
};

/** เวลาทำ — ปรนัยข้อละ 1 นาที ข้อเขียน/พูดข้อละ 5 นาที คิดจากจำนวนข้อจริง */
const timeFor = (questions) =>
  questions.reduce((sec, q) => sec + (q.type === 'single' ? 60 : 300), 0);

/* ============================================================
   6 · สร้าง
   ============================================================ */

const quizBank = {};
const report = [];

for (const sheet of SHEETS) {
  const practice = {};
  for (const set of sheet.practice) {
    let questions;
    try {
      questions = set.build(paragraphsOf(path.join(SRC, set.file)), {
        skill: set.skill,
        type: set.type,
        idPrefix: `${sheet.key.toLowerCase().replace(/[^a-z0-9]/g, '')}-p${set.skill[0]}`,
        useRed: false,
      });
    } catch (err) {
      console.error(`FAIL ${set.file}\n      ${err.message}`);
      process.exit(1);
    }
    practice[set.skill] = {
      id: `${sheet.key}-practice-${set.skill}`,
      skill: set.skill,
      title: SKILL_TITLE[set.skill],
      timeLimitSec: timeFor(questions),
      passMark: 0.6,
      topics: [{ id: set.skill, label: SKILL_LABEL[set.skill] }],
      questions,
    };
    report.push([`${sheet.key} practice/${set.skill}`, questions.length]);
  }

  const unitQuestions = [];
  for (const set of sheet.unit) {
    const before = unitQuestions.length;
    try {
      unitQuestions.push(
        ...set.build(paragraphsOf(path.join(SRC, set.file)), {
          skill: set.skill,
          type: set.type,
          idPrefix: `${sheet.key.toLowerCase().replace(/[^a-z0-9]/g, '')}-u${set.skill[0]}`,
          useRed: Boolean(set.red),
        }),
      );
    } catch (err) {
      console.error(`FAIL ${set.file}\n      ${err.message}`);
      process.exit(1);
    }
    report.push([`${sheet.key} unit/${set.skill}`, unitQuestions.length - before]);
  }

  quizBank[sheet.key] = {
    title: sheet.title,
    practice,
    unitQuiz: {
      id: `${sheet.key}-unit`,
      title: { th: 'แบบทดสอบท้ายบท', en: 'Unit quiz' },
      timeLimitSec: timeFor(unitQuestions),
      passMark: 0.6,
      topics: Object.keys(SKILL_LABEL).map((id) => ({ id, label: SKILL_LABEL[id] })),
      questions: unitQuestions,
    },
  };
}

/* ---------- ตรวจก่อนเขียน ---------- */
const problems = [];
for (const [key, bank] of Object.entries(quizBank)) {
  const all = [...Object.values(bank.practice).flatMap((s) => s.questions), ...bank.unitQuiz.questions];
  const ids = new Set();
  for (const q of all) {
    if (ids.has(q.id)) problems.push(`${key}: id ซ้ำ ${q.id}`);
    ids.add(q.id);
    if (q.type === 'single') {
      if (q.answerIds?.length !== 1) problems.push(`${q.id}: ต้องมีเฉลยหนึ่งข้อ`);
      else if (!q.choices.some((c) => c.id === q.answerIds[0])) problems.push(`${q.id}: เฉลยไม่มีในตัวเลือก`);
      if (q.choices.length !== 4) problems.push(`${q.id}: ตัวเลือกไม่ครบ 4`);
    } else {
      if (!q.sample) problems.push(`${q.id}: ไม่มีตัวอย่างคำตอบ`);
      if (!q.guidelines?.length) problems.push(`${q.id}: ไม่มีแนวทาง`);
    }
    if (q.skill === 'listening' && !q.audioScript) problems.push(`${q.id}: ข้อการฟังไม่มีสคริปต์เสียง`);
    if (q.skill === 'reading' && q.type === 'single' && !q.passage) problems.push(`${q.id}: ข้อการอ่านไม่มีบทความ`);
  }
}
if (problems.length) {
  console.error('ชุดข้อสอบมีปัญหา:\n' + problems.join('\n'));
  process.exit(1);
}

const total = Object.values(quizBank).reduce(
  (n, b) => n + Object.values(b.practice).reduce((m, s) => m + s.questions.length, 0) + b.unitQuiz.questions.length,
  0,
);

const header = `/**
 * ชุดแบบฝึกหัดและแบบทดสอบจริง — สร้างโดย scripts/build-quizbank.mjs
 *
 * *** ห้ามแก้ไฟล์นี้ด้วยมือ *** แก้ที่ไฟล์ Word ใน quiz_data/ แล้วรัน npm run build:quizbank
 *
 * key = "ชื่อแผ่นงาน#ลำดับหน่วย" ไม่ใช่ id ของโหนด
 * เพราะ id เปลี่ยนได้เมื่อลำดับคอร์สขยับ แต่ชื่อแผ่นงานกับลำดับบทเป็นของถาวร
 *
 * ตอนนี้มีบทเดียว (B1 บทที่ 1) เป็นตัวอย่าง — บทอื่นใช้รูปแบบไฟล์ Word เดียวกันได้เลย
 *
 * รวม ${total} ข้อ
 */
export const quizBank = `;

fs.writeFileSync(path.join(ROOT, 'src/mock/quizbank.js'), header + JSON.stringify(quizBank, null, 1) + ';\n', 'utf8');

for (const [label, n] of report) console.log(`  ${label.padEnd(30)} ${n} ข้อ`);
console.log(`\nรวม ${total} ข้อ · เขียนลง src/mock/quizbank.js แล้ว`);
