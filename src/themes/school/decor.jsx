/** decor slot ของธีม School */

/** มาสคอตข้างการ์ดล็อกอิน (ซ่อนบนจอเล็ก) */
export function LoginAside() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
      <style>{`
        @keyframes school-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }
        @keyframes school-wave { 0%,100% { transform: rotate(-8deg) } 50% { transform: rotate(14deg) } }
      `}</style>
      <div
        className="absolute left-[12%] top-1/2 -translate-y-1/2"
        style={{ animation: 'school-bob 3.6s ease-in-out infinite' }}
      >
        <svg width="240" height="240" viewBox="0 0 200 200" fill="none">
          {/* แขนโบก — วาดก่อนตัวเพื่อให้โคนแขนถูกลำตัวบัง ดูเป็นชิ้นเดียวกัน */}
          <g
            style={{
              transformOrigin: '138px 126px',
              animation: 'school-wave 1.8s ease-in-out infinite',
            }}
          >
            <rect x="126" y="118" width="52" height="16" rx="8" fill="var(--color-primary)" />
            <circle cx="176" cy="126" r="11" fill="var(--color-primary)" />
          </g>
          {/* แขนซ้ายแนบตัว */}
          <rect x="34" y="124" width="40" height="16" rx="8" fill="var(--color-primary)" />

          {/* ตัว */}
          <ellipse cx="100" cy="132" rx="50" ry="46" fill="var(--color-primary)" />
          {/* หนังสือที่ถือไว้ */}
          <rect x="72" y="140" width="56" height="16" rx="3" fill="var(--color-accent)" />
          <line
            x1="100"
            y1="140"
            x2="100"
            y2="156"
            stroke="oklch(99% 0.02 80)"
            strokeWidth="2.5"
          />

          {/* หัว */}
          <circle cx="100" cy="74" r="40" fill="var(--color-primary)" />
          <circle cx="100" cy="80" r="29" fill="oklch(99% 0.02 80)" />
          <circle cx="90" cy="76" r="4.5" fill="oklch(30% 0.05 265)" />
          <circle cx="110" cy="76" r="4.5" fill="oklch(30% 0.05 265)" />
          <path
            d="M89 89 Q100 98 111 89"
            stroke="oklch(30% 0.05 265)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* แก้มแดง */}
          <ellipse cx="79" cy="86" rx="6" ry="4" fill="var(--color-primary)" opacity="0.35" />
          <ellipse cx="121" cy="86" rx="6" ry="4" fill="var(--color-primary)" opacity="0.35" />

          {/* หมวกบัณฑิต */}
          <path d="M56 46 L100 28 L144 46 L100 64 Z" fill="oklch(32% 0.06 265)" />
          <path d="M84 55 L84 70 Q100 78 116 70 L116 55" fill="oklch(32% 0.06 265)" />
          <line x1="140" y1="48" x2="140" y2="70" stroke="var(--color-warn)" strokeWidth="3" />
          <circle cx="140" cy="73" r="6" fill="var(--color-warn)" />
        </svg>
      </div>
    </div>
  );
}

/** คอนเฟตติตอนแสดงผลสอบ */
export function Celebration() {
  const pieces = Array.from({ length: 28 }, (_, i) => i);
  const colors = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-warn)', 'var(--color-success)'];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes school-confetti {
          0%   { transform: translateY(-10vh) rotate(0deg);   opacity: 0 }
          12%  { opacity: 1 }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0 }
        }
      `}</style>
      {pieces.map((i) => (
        <span
          key={i}
          className="absolute top-0 block"
          style={{
            left: `${(i * 37) % 100}%`,
            width: i % 3 === 0 ? 8 : 11,
            height: i % 3 === 0 ? 14 : 11,
            borderRadius: i % 3 === 0 ? 2 : '50%',
            background: colors[i % colors.length],
            animation: `school-confetti ${3 + (i % 5) * 0.45}s linear ${(i % 7) * 0.28}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
