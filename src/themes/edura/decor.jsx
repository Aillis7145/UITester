/** decor slot ของธีม Edura */

/** แผงสถิติข้างการ์ดล็อกอิน — เทมเพลตสายองค์กรชอบโชว์ตัวเลขความน่าเชื่อถือ */
export function LoginAside() {
  const stats = [
    { icon: 'users', value: '16,500+', label: 'ผู้เรียนที่กำลังเรียนอยู่' },
    { icon: 'play', value: '7,500+', label: 'วิดีโอบทเรียนออนไลน์' },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
      <style>{`
        @keyframes edura-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-14px) } }
      `}</style>

      {stats.map((s, i) => (
        <div
          key={s.value}
          className="ui-surface absolute flex items-center gap-3 p-3.5"
          style={{
            left: i === 0 ? '9%' : '16%',
            top: i === 0 ? '30%' : '58%',
            animation: `edura-float ${5 + i * 1.6}s ease-in-out ${i * 0.7}s infinite`,
          }}
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-on-primary">
            <Ico name={s.icon} />
          </span>
          <span>
            <span className="ui-heading block text-xl leading-none">{s.value}</span>
            <span className="mt-1 block text-xs text-muted">{s.label}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

const PATHS = {
  users: 'M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20M9 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm13 9.5v-1.5a4 4 0 0 0-3-3.87M16 3.6a4 4 0 0 1 0 7.75',
  play: 'M7 4.5v15l13-7.5-13-7.5Z',
};

function Ico({ name }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

/*
 * ธีมนี้ไม่มี Celebration โดยตั้งใจ
 *
 * เคยลองสองแบบแล้วไม่เข้ากับตัวตนของธีม:
 *   1. ริบบิ้นร่วง — กลไกเดียวกับคอนเฟตติของธีม school แยกไม่ออกว่ากำลังดูแบบไหน
 *   2. วงเล็บสี่มุม — ขนาดกรอบไม่ล็อกกับการ์ดผลสอบ เพราะการ์ดสูงไม่คงที่
 *      (ความสูงขึ้นกับจำนวนป้ายและความยาวชื่อแบบทดสอบ) การ fix ความสูงไว้จึงเพี้ยนเสมอ
 *
 * ธีมสายองค์กรไม่จำเป็นต้องฉลอง การ์ดผลคะแนนกับป้าย "ผ่าน" สื่อสารครบอยู่แล้ว
 * ResultsScreen เรียกแบบ `decor.Celebration && <decor.Celebration />` อยู่แล้ว
 * การไม่ export ตัวนี้จึงพอ ไม่ต้องแก้หน้าจอ — นี่คือประโยชน์ของ decor slot
 */
