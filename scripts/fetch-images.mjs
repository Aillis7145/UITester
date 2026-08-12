/**
 * ดึงภาพประกอบจริงจาก Unsplash มาเก็บไว้ใน public/mock/
 *
 * รันครั้งเดียวตอนตั้งโปรเจค ไม่ได้เรียกตอน build
 * เก็บไฟล์ลง repo เลยเพื่อให้เว็บทำงานได้แบบออฟไลน์ และภาพไม่หายถ้าต้นทางเปลี่ยน
 *
 *   node scripts/fetch-images.mjs
 *
 * ภาพจาก Unsplash ใช้ได้ฟรีทั้งงานส่วนตัวและงานพาณิชย์ ไม่บังคับให้เครดิต
 * แต่บันทึกที่มาไว้ใน public/mock/CREDITS.md เพื่อให้ตามกลับได้
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'public/mock';
const W = 900;
const Q = 72;

// ผู้สมัครหลายตัวต่อหนึ่งช่อง — ถ้าตัวแรกโหลดไม่ได้จะไล่ไปตัวถัดไป
const TARGETS = [
  { name: 'ai', ids: ['1485827404703-89b55fcc595e', '1518770660439-4636190af475', '1531746790731-6c087fecd65a'] },
  { name: 'python', ids: ['1526379095098-d400fd0bf935', '1461749280684-dccba630e2f6', '1555949963-ff9fe0c870eb'] },
  { name: 'prompt', ids: ['1676277791608-ac54525aa94d', '1620712943543-bcc4688e7485', '1498050108023-c5249f4df085'] },
  { name: 'webdev', ids: ['1498050108023-c5249f4df085', '1547658719-da2b51169166', '1461749280684-dccba630e2f6'] },
  { name: 'math', ids: ['1509228468518-180dd4864904', '1635070041078-e363dbe005cb', '1596495578065-6e0763fa1178'] },
  { name: 'physics', ids: ['1636466497217-26a8cbeaf0aa', '1451187580459-43490279c0fa', '1532187863486-abf9dbad1b69'] },
  { name: 'biology', ids: ['1576086213369-97a306d36557', '1532187863486-abf9dbad1b69', '1530026186672-2cd00ffc50fe'] },
  { name: 'thai', ids: ['1481627834876-b7833e8f5570', '1495446815901-a7297e633e8d', '1512820790803-83ca734da794'] },
  { name: 'english', ids: ['1543269865-cbf427effbad', '1434030216411-0b793f4b4173', '1524178232363-1fb2b075b655'] },
  { name: 'history', ids: ['1528181304800-259b08848526', '1563492065599-3520f775eeed', '1552465011-b4e21bf6e79a'] },
  { name: 'chemistry', ids: ['1532634922-8fe0b757fb13', '1507413245164-6160d8298b31', '1581092160562-40aa08e78837'] },
  { name: 'geography', ids: ['1451187580459-43490279c0fa', '1526778548025-fa2f459cd5c1', '1502920917128-1aa500764cbd'] },

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

console.log(`\n${failed === 0 ? 'ครบทุกภาพ' : `ขาด ${failed} ภาพ`} · ${credits.length} ไฟล์ใน ${OUT}/`);
process.exit(failed === 0 ? 0 : 1);
