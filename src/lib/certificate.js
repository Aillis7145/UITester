/**
 * วาดใบประกาศนียบัตรลงบน canvas — ใช้ทั้งตัวอย่างบนหน้าจอและไฟล์ที่ดาวน์โหลด
 *
 * ─────────────────────────────────────────────────────────────
 * ทำไมต้องเป็นฟังก์ชันเดียวกันทั้งสองที่
 * ─────────────────────────────────────────────────────────────
 * ถ้าตัวอย่างเป็น HTML แล้วไฟล์ที่โหลดวาดด้วย canvas อีกชุด สองอย่างจะเพี้ยนจากกันทันที
 * ที่ใครสักคนแก้ระยะห่างข้างเดียว แล้วไม่มีอะไรฟ้องเลยจนกว่าจะมีคนเปิดไฟล์ที่โหลดไปดู
 * ที่เห็นบนหน้าจอจึงเป็น canvas ตัวจริง ย่อขนาดลงมาเท่านั้น
 *
 * ─────────────────────────────────────────────────────────────
 * สีมาจาก token ของธีมที่กำลังใช้อยู่ ไม่ใช่ค่าตายตัว
 * ─────────────────────────────────────────────────────────────
 * อ่านด้วย getComputedStyle จาก element จริงในกรอบธีม ใบประกาศจึงเปลี่ยนสีตามธีม
 * โดยที่ไฟล์นี้ไม่รู้จักชื่อธีมสักตัว — ไม่มี if ธีมไหนเลยทั้งไฟล์
 *
 * token ของบางธีมเป็นสีโปร่งแสง (เช่น --color-surface ของธีม tech เป็นกระจก)
 * พื้นใบจึงใช้ --color-bg ซึ่งทึบทุกธีม ไม่งั้น PNG ที่ได้จะโปร่งใสแล้วเปิดที่อื่นเป็นลายตาราง
 */

/** ขนาดจริงของใบ — 10:7 แนวนอน ใกล้เคียง A4 แนวนอน */
export const CERT_W = 1600;
export const CERT_H = 1120;

/** ความกว้างของไฟล์ที่ดาวน์โหลด — 2 เท่าของแบบ พอสำหรับพิมพ์และไม่หนักเกิน */
const DOWNLOAD_W = CERT_W * 2;

const FALLBACK = {
  bg: '#ffffff',
  text: '#1a1a1a',
  muted: '#6b7280',
  primary: '#2563eb',
  ink: '#1d4ed8',
  border: '#d4d4d8',
  font: 'ui-sans-serif, system-ui, sans-serif',
};

/**
 * อ่าน token จาก element ที่อยู่ในกรอบธีมจริง
 *
 * ต้องส่ง element เข้ามา ไม่ใช่อ่านจาก document.documentElement
 * เพราะธีมวาง data-theme ไว้บน div ครอบ ไม่ได้วางบน <html>
 * และในโหมดเทียบมีหลายธีมอยู่บนหน้าเดียวกัน การอ่านจากรากจะได้ธีมผิดใบ
 */
export function certificateTokens(el) {
  if (!el) return { ...FALLBACK };
  const cs = getComputedStyle(el);
  const read = (name, fallback) => cs.getPropertyValue(name).trim() || fallback;
  return {
    bg: read('--color-bg', FALLBACK.bg),
    text: read('--color-text', FALLBACK.text),
    muted: read('--color-muted', FALLBACK.muted),
    primary: read('--color-primary', FALLBACK.primary),
    ink: read('--color-primary-ink', FALLBACK.primary),
    border: read('--color-border', FALLBACK.border),
    font: read('--font-display', FALLBACK.font),
  };
}

/**
 * ตั้งสีแบบไม่เงียบเมื่อพัง
 *
 * canvas เมิน fillStyle ที่ parse ไม่ได้แบบไม่บอกอะไรเลย ค่าที่ตั้งไว้ก่อนหน้าจะค้างอยู่
 * ใบประกาศที่ตัวหนังสือสีเดียวกับพื้นทั้งใบจึงเป็นอาการที่หาต้นเหตุยากมาก
 * ตรงนี้ตรวจว่าค่าติดจริงไหม ถ้าไม่ติดถอยไปใช้สีสำรองซึ่งอ่านออกแน่นอน
 */
function paint(ctx, prop, value, fallback) {
  ctx[prop] = '#000000';
  ctx[prop] = value;
  if (ctx[prop] === '#000000' && !/^#0{3,8}$|black/i.test(value)) ctx[prop] = fallback;
}

const setFill = (ctx, v, f) => paint(ctx, 'fillStyle', v, f);
const setStroke = (ctx, v, f) => paint(ctx, 'strokeStyle', v, f);

/** ย่อขนาดตัวอักษรลงจนกว่าจะพอดีความกว้าง — ชื่อคอร์สภาษาอังกฤษยาวกว่าไทยเกือบเท่าตัว */
function fitFont(ctx, text, weight, size, family, maxWidth) {
  let px = size;
  do {
    ctx.font = `${weight} ${px}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) return;
    px -= 2;
  } while (px > size * 0.5);
}

/**
 * data = { title, subtitle, forLabel, name, bodyLabel, course, meta:[{label,value}], footLeft, footRight }
 * ข้อความทุกบรรทัดแปลมาแล้วจากหน้าจอ ไฟล์นี้ไม่รู้จัก i18n
 */
export function drawCertificate(canvas, data, tokens, width = CERT_W) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const s = width / CERT_W;
  canvas.width = Math.round(CERT_W * s);
  canvas.height = Math.round(CERT_H * s);
  ctx.setTransform(s, 0, 0, s, 0, 0);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  const mid = CERT_W / 2;
  const font = tokens.font;

  /* ---------- พื้นและกรอบ ---------- */
  setFill(ctx, tokens.bg, FALLBACK.bg);
  ctx.fillRect(0, 0, CERT_W, CERT_H);

  setStroke(ctx, tokens.primary, FALLBACK.primary);
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(38, 38, CERT_W - 76, CERT_H - 76, 18);
  ctx.stroke();

  setStroke(ctx, tokens.border, FALLBACK.border);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(60, 60, CERT_W - 120, CERT_H - 120, 10);
  ctx.stroke();

  // ขีดมุมสี่มุม — ทำให้ใบดูเป็นเอกสารทางการโดยไม่ต้องมีลายพื้นหลัง
  setStroke(ctx, tokens.primary, FALLBACK.primary);
  ctx.lineWidth = 5;
  const corner = 54;
  for (const [x, y, dx, dy] of [
    [60, 60, 1, 1],
    [CERT_W - 60, 60, -1, 1],
    [60, CERT_H - 60, 1, -1],
    [CERT_W - 60, CERT_H - 60, -1, -1],
  ]) {
    ctx.beginPath();
    ctx.moveTo(x + dx * corner, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + dy * corner);
    ctx.stroke();
  }

  /* ---------- หัวใบ ---------- */
  setFill(ctx, tokens.ink, FALLBACK.primary);
  ctx.font = `700 68px ${font}`;
  ctx.fillText(data.title, mid, 220);

  setFill(ctx, tokens.muted, FALLBACK.muted);
  ctx.font = `500 24px ${font}`;
  ctx.fillText(data.subtitle, mid, 264);

  setStroke(ctx, tokens.primary, FALLBACK.primary);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(mid - 90, 300);
  ctx.lineTo(mid + 90, 300);
  ctx.stroke();

  /* ---------- ชื่อผู้เรียน ---------- */
  setFill(ctx, tokens.muted, FALLBACK.muted);
  ctx.font = `400 28px ${font}`;
  ctx.fillText(data.forLabel, mid, 380);

  setFill(ctx, tokens.text, FALLBACK.text);
  fitFont(ctx, data.name, 700, 80, font, CERT_W - 400);
  ctx.fillText(data.name, mid, 480);

  setStroke(ctx, tokens.border, FALLBACK.border);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(mid - 300, 512);
  ctx.lineTo(mid + 300, 512);
  ctx.stroke();

  /* ---------- คอร์ส ---------- */
  setFill(ctx, tokens.muted, FALLBACK.muted);
  ctx.font = `400 28px ${font}`;
  ctx.fillText(data.bodyLabel, mid, 580);

  setFill(ctx, tokens.ink, FALLBACK.primary);
  fitFont(ctx, data.course, 600, 46, font, CERT_W - 320);
  ctx.fillText(data.course, mid, 646);

  /* ---------- แถวข้อมูล ---------- */
  const cells = data.meta;
  const gap = 380;
  const startX = mid - ((cells.length - 1) * gap) / 2;
  cells.forEach((cell, i) => {
    const x = startX + i * gap;
    setFill(ctx, tokens.muted, FALLBACK.muted);
    ctx.font = `500 22px ${font}`;
    ctx.fillText(cell.label, x, 790);
    setFill(ctx, tokens.text, FALLBACK.text);
    ctx.font = `700 34px ${font}`;
    ctx.fillText(cell.value, x, 838);
  });

  /* ---------- ท้ายใบ ---------- */
  setStroke(ctx, tokens.border, FALLBACK.border);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(mid - 200, 968);
  ctx.lineTo(mid + 200, 968);
  ctx.stroke();

  setFill(ctx, tokens.muted, FALLBACK.muted);
  ctx.font = `400 24px ${font}`;
  ctx.fillText(data.footRight, mid, 1004);

  ctx.textAlign = 'left';
  ctx.font = `400 20px ${font}`;
  ctx.fillText(data.footLeft, 120, 1030);
  ctx.textAlign = 'center';
}

/**
 * เขียนไฟล์ PNG ออกมาแล้วสั่งดาวน์โหลด
 *
 * วาดใหม่บน canvas นอกจอที่ความละเอียดเต็ม ไม่ได้ย่อ-ขยายจากตัวอย่างบนหน้าจอ
 * เพราะการขยายภาพย่อขึ้นมาจะได้ตัวหนังสือฟุ้งซึ่งเป็นสิ่งแรกที่คนเห็นบนใบประกาศ
 */
export function downloadCertificate(data, tokens, filename) {
  const canvas = document.createElement('canvas');
  drawCertificate(canvas, data, tokens, DOWNLOAD_W);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve(false);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.append(a);
      a.click();
      a.remove();
      // ปล่อย URL ทันทีไม่ได้ เบราว์เซอร์บางตัวยังอ่านไม่เสร็จตอน click คืนค่า
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      resolve(true);
    }, 'image/png');
  });
}
