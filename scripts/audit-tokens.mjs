import fs from 'node:fs';

const names = (file) => [
  ...new Set([...fs.readFileSync(file, 'utf8').matchAll(/^\s+(--[a-z0-9-]+):/gm)].map((m) => m[1])),
];

const contract = names('src/styles/tokens.css');

// อ่านรายชื่อธีมจากโฟลเดอร์ ไม่ประกาศไว้ตายตัว
// เพิ่มไฟล์ธีมใหม่แล้วสคริปต์นี้ตรวจให้เองทันที ไม่มีทางลืมอัปเดต
const themes = fs
  .readdirSync('src/styles/themes')
  .filter((f) => f.endsWith('.css'))
  .map((f) => f.replace(/\.css$/, ''));

// token ที่ "ต้อง" ตอบทุกธีม เพราะไม่มีค่ากลางที่ใช้ได้จริง
const MUST = [
  '--color-bg',
  '--color-surface',
  '--color-surface-2',
  '--color-border',
  '--color-text',
  '--color-muted',
  '--color-primary',
  '--color-on-primary',
  '--color-accent',
  '--radius-ui',
  '--radius-card',
  '--font-sans',
  '--shadow-raised',
  '--shadow-pressed',
  '--shadow-glow',
  // ต้องตอบทุกธีมเพราะเขียนเป็น var() อ้างกลับไม่ได้ (จะกลายเป็นการอ้างวน)
  // ธีมที่พื้นกับการ์ดโทนเดียวกันก็ใส่ค่าเดียวกันซ้ำ
  '--ui-on-surface',
  '--ui-on-surface-muted',
  '--ui-on-surface-primary',
];

let fail = 0;
console.log(`สัญญา token ทั้งหมด: ${contract.length} ตัว\n`);

for (const t of themes) {
  const has = names(`src/styles/themes/${t}.css`);
  const missingMust = MUST.filter((n) => !has.includes(n));
  const notOverridden = contract.filter((n) => !has.includes(n));
  const unknown = has.filter((n) => !contract.includes(n));

  console.log(`[${t}] ตอบ ${has.length}/${contract.length}`);
  if (missingMust.length) {
    fail++;
    console.log(`  ✗ ขาด token บังคับ: ${missingMust.join(', ')}`);
  } else {
    console.log('  ✓ ตอบ token บังคับครบทุกตัว');
  }
  if (unknown.length) {
    fail++;
    console.log(`  ✗ มี token ที่ไม่อยู่ในสัญญา: ${unknown.join(', ')}`);
  }
  console.log(`  · ใช้ค่ากลาง: ${notOverridden.join(', ') || '(ไม่มี)'}\n`);
}

/* ------------------------------------------------------------
   ทุกธีมต้องมีความมนและแบบกรอบที่ไม่ซ้ำกัน
   ถ้าซ้ำ ผู้ประเมินจะแยกสองธีมออกจากกันด้วยตายาก ซึ่งทำลายจุดประสงค์ของเว็บนี้
   ------------------------------------------------------------ */
const valueOf = (file, token) => {
  const m = fs.readFileSync(file, 'utf8').match(new RegExp(`${token}:\\s*([^;]+);`));
  return m ? m[1].trim() : null;
};

console.log('ความมนของแต่ละธีม (ต้องไม่ซ้ำกัน)');
const radii = new Map();
for (const t of themes) {
  const key = `${valueOf(`src/styles/themes/${t}.css`, '--radius-ui')} / ${valueOf(`src/styles/themes/${t}.css`, '--radius-card')}`;
  console.log(`  ${t.padEnd(10)} ${key}`);
  if (radii.has(key)) {
    fail++;
    console.log(`  ✗ ซ้ำกับธีม ${radii.get(key)}`);
  }
  radii.set(key, t);
}
console.log(radii.size === themes.length ? '  ✓ ไม่ซ้ำกันสักคู่\n' : '');

console.log(fail === 0 ? 'ผลรวม: ผ่าน' : `ผลรวม: ไม่ผ่าน (${fail} ข้อ)`);
process.exit(fail === 0 ? 0 : 1);
