/**
 * ดึงภาพนิ่งของบทเรียนจาก Unsplash มาเก็บไว้ใน public/mock/
 *
 * รันครั้งเดียวตอนตั้งโปรเจค ไม่ได้เรียกตอน build
 * เก็บไฟล์ลง repo เลยเพื่อให้เว็บทำงานได้แบบออฟไลน์ และภาพไม่หายถ้าต้นทางเปลี่ยน
 *
 *   node scripts/fetch-images.mjs
 *
 * *** ไฟล์นี้เหลือแค่ภาพนิ่ง 6 ใบแล้ว ***
 * ปกคอร์สย้ายไปอยู่ scripts/fetch-covers.mjs ซึ่งค้นตามคำได้
 * เพราะต้องการปกไม่ซ้ำกันครบ 38 ใบ ซึ่งการเก็บรหัสรูปไว้ตายตัวแบบนี้ทำไม่ไหว
 *
 * ภาพจาก Unsplash ใช้ได้ฟรีทั้งงานส่วนตัวและงานพาณิชย์ ไม่บังคับให้เครดิต
 * แต่บันทึกที่มาไว้ใน public/mock/CREDITS.md เพื่อให้ตามกลับได้
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const OUT = 'public/mock';
const W = 900;
const Q = 72;

// ผู้สมัครหลายตัวต่อหนึ่งช่อง — ถ้าตัวแรกโหลดไม่ได้จะไล่ไปตัวถัดไป
const TARGETS = [
  // ภาพนิ่งของบทเรียน ใช้เป็นโปสเตอร์วิดีโอและรูปย่อในเพลย์ลิสต์
  { name: 'lesson-1', ids: ['1516321318423-f06f85e504b3', '1551288049-bebda4e38f71', '1460925895917-afdab827c52f'] },
  { name: 'lesson-2', ids: ['1555949963-ff9fe0c870eb', '1550751827-4bd374c3f58b', '1461749280684-dccba630e2f6'] },
  { name: 'lesson-3', ids: ['1518770660439-4636190af475', '1531746790731-6c087fecd65a', '1526374965328-7f61d4dc18c5'] },
  { name: 'lesson-4', ids: ['1573164713988-8665fc963095', '1581092918056-0c4c3acd3789', '1581092160562-40aa08e78837'] },
  { name: 'lesson-5', ids: ['1524178232363-1fb2b075b655', '1509062522246-3755977927d7', '1434030216411-0b793f4b4173'] },
  { name: 'lesson-6', ids: ['1517245386807-bb43f82c33c4', '1522202176988-66273c2fd55f', '1543269865-cbf427effbad'] },
];

fs.mkdirSync(OUT, { recursive: true });

const url = (id) => `https://images.unsplash.com/photo-${id}?w=${W}&q=${Q}&fm=jpg&fit=crop&auto=format`;

const credits = [];
let failed = 0;

for (const target of TARGETS) {
  let done = false;
  for (const id of target.ids) {
    try {
      const res = await fetch(url(id));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      // ไฟล์เล็กผิดปกติมักเป็นหน้า error ที่ Unsplash ส่งกลับมาแทนรูป
      if (buf.length < 8000) throw new Error(`เล็กเกินไป (${buf.length} bytes)`);

      fs.writeFileSync(path.join(OUT, `${target.name}.jpg`), buf);
      credits.push(`| ${target.name}.jpg | https://unsplash.com/photos/${id} |`);
      console.log(`OK   ${target.name}.jpg  ${(buf.length / 1024).toFixed(0)} KB  (${id})`);
      done = true;
      break;
    } catch (err) {
      console.log(`skip ${target.name} <- ${id}: ${err.message}`);
    }
  }
  if (!done) {
    failed++;
    console.log(`FAIL ${target.name} — ไม่มีผู้สมัครตัวไหนโหลดได้`);
  }
}

fs.writeFileSync(
  path.join(OUT, 'CREDITS.md'),
  `# ที่มาของภาพ\n\nภาพทั้งหมดมาจาก [Unsplash](https://unsplash.com) ซึ่งใช้ได้ฟรีทั้งงานส่วนตัวและงานพาณิชย์\nดึงมาด้วย \`node scripts/fetch-images.mjs\`\n\n| ไฟล์ | ต้นทาง |\n|---|---|\n${credits.join('\n')}\n`,
);

/**
 * รูปที่ซ้ำกันเป๊ะทำให้การ์ดคนละวิชาหน้าตาเหมือนกัน
 * ซึ่งบนกริดรวม 38 ใบ รูปคือสิ่งแรกที่คนใช้แยกสินค้าออกจากกันด้วยตา
 *
 * ต้องเทียบที่ "ไฟล์" ไม่ใช่ที่ id — เจอมาแล้วว่า id คนละตัวรีไดเรกต์ไปรูปเดียวกันได้
 * (prompt-2 ได้ไฟล์เดียวกับ prompt เป๊ะทั้งที่ id ต่างกัน)
 */
const seen = new Map();
let dupes = 0;
for (const f of fs.readdirSync(OUT).filter((n) => n.endsWith('.jpg')).sort()) {
  const sum = createHash('md5').update(fs.readFileSync(path.join(OUT, f))).digest('hex');
  if (seen.has(sum)) {
    dupes++;
    console.log(`ซ้ำ  ${f} เหมือนกับ ${seen.get(sum)} เป๊ะ — เลือก id ใหม่ให้ตัวใดตัวหนึ่ง`);
  } else seen.set(sum, f);
}

console.log(`\n${failed === 0 ? 'ครบทุกภาพ' : `ขาด ${failed} ภาพ`} · ${credits.length} ไฟล์ใน ${OUT}/${dupes ? ` · ซ้ำ ${dupes} คู่` : ' · ไม่มีรูปซ้ำ'}`);
process.exit(failed === 0 && dupes === 0 ? 0 : 1);
