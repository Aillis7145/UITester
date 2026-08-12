import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// จำนวนและความทึบตั้งไว้ต่ำโดยตั้งใจ — พื้นหลังต้องอ่านเป็น "บรรยากาศ"
// ไม่ใช่สิ่งที่แย่งสายตาไปจากบทเรียนที่กำลังอ่านอยู่
const PARTICLE_COUNT = 1400;
const TARGET_FPS = 30; // พื้นหลังตกแต่งไม่ต้องการ 60fps
const FIELD = { x: 60, y: 34, z: 90 };

/** อ่านสีจาก CSS custom property ของธีม → ปรับ tech.css แล้วเลเยอร์ 3D ตามเอง */
function tokenColor(el, name, fallback) {
  const raw = getComputedStyle(el).getPropertyValue(name).trim();
  if (!raw) return new THREE.Color(fallback);
  try {
    return new THREE.Color(raw);
  } catch {
    return new THREE.Color(fallback);
  }
}

/** จุดกลมนุ่มเป็น texture — ไม่งั้น THREE.Points จะเป็นสี่เหลี่ยมแข็ง */
function makeDotTexture() {
  const size = 64;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * สนามอนุภาค + กริดลู่เข้าเส้นขอบฟ้า
 *
 * กฎ perf ที่บังคับทุกข้อ (ดู README ส่วน three.js):
 *   pixelRatio เพดาน 1.5 · ไม่ใช้ antialias · หยุด rAF เมื่อพ้นจอหรือสลับแท็บ
 *   จำกัด ~30fps · teardown ครบทุกชิ้นไม่งั้นสลับธีมไปมาแล้ว WebGL context รั่ว
 */
export default function Backdrop3D({ paused = false }) {
  const hostRef = useRef(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      });
    } catch {
      return; // ไม่มี WebGL — BackdropFallback ที่อยู่ข้างล่างรับหน้าที่ต่อ
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(host.clientWidth || 1, host.clientHeight || 1, false);
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 260);
    camera.position.set(0, 4, 46);

    const primary = tokenColor(host, '--color-primary', '#22d3ee');
    const accent = tokenColor(host, '--color-accent', '#c084fc');

    // ---------- อนุภาค ----------
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const drift = new Float32Array(PARTICLE_COUNT);
    const mixColor = new THREE.Color();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * FIELD.x * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * FIELD.y * 2;
      positions[i * 3 + 2] = -Math.random() * FIELD.z;
      drift[i] = 0.6 + Math.random() * 1.6;

      mixColor.copy(primary).lerp(accent, Math.random());
      colors[i * 3] = mixColor.r;
      colors[i * 3 + 1] = mixColor.g;
      colors[i * 3 + 2] = mixColor.b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const dot = makeDotTexture();
    const pMat = new THREE.PointsMaterial({
      size: 0.34,
      map: dot,
      vertexColors: true,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // ---------- กริดลู่เข้าเส้นขอบฟ้า ----------
    const grid = new THREE.GridHelper(220, 44, primary, primary);
    grid.material.transparent = true;
    grid.material.opacity = 0.055;
    grid.material.depthWrite = false;
    grid.position.set(0, -16, -40);
    scene.add(grid);

    // ---------- ลูป ----------
    let raf = 0;
    let last = 0;
    const frameGap = 1000 / TARGET_FPS;
    const clock = new THREE.Clock();
    const pos = pGeo.attributes.position;

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (pausedRef.current) return;
      if (now - last < frameGap) return;
      last = now;

      const dt = Math.min(clock.getDelta(), 0.1);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        let z = pos.array[i * 3 + 2] + drift[i] * dt * 4;
        if (z > 16) z = -FIELD.z; // วนกลับไปหลังกล้อง
        pos.array[i * 3 + 2] = z;
      }
      pos.needsUpdate = true;

      points.rotation.y += dt * 0.02;
      grid.position.z = ((grid.position.z + dt * 4 + 40) % 10) - 40;

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    // ---------- ปรับขนาดตามกรอบ (ไม่ใช่ window — device frame ย่อขยายได้) ----------
    const ro = new ResizeObserver(() => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(host);

    // ---------- หยุดเมื่อสลับแท็บ ----------
    const onVisibility = () => {
      pausedRef.current = document.hidden || paused;
    };
    document.addEventListener('visibilitychange', onVisibility);

    // ---------- teardown ครบ ไม่งั้น WebGL context รั่วจนชนเพดาน ~16 ของเบราว์เซอร์ ----------
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
      ro.disconnect();
      scene.remove(points, grid);
      pGeo.dispose();
      pMat.dispose();
      dot.dispose();
      grid.geometry.dispose();
      grid.material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [paused]);

  return <div ref={hostRef} className="absolute inset-0" />;
}
