import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import os from 'node:os';

/**
 * รายชื่อ host ที่อนุญาตให้เปิดเว็บได้
 *
 * Vite บล็อก request ที่ Host header ไม่อยู่ในรายการนี้ (กัน DNS rebinding)
 * ถ้าไม่ใส่ การเข้าผ่านชื่อเครื่องจะได้ 403 ทั้งที่เข้าผ่าน IP ได้
 *
 * หาค่าเองจากระบบ ไม่ hardcode ชื่อเครื่องไว้ในไฟล์
 * เพราะโปรเจคนี้ต้องรันได้บนเครื่องอื่นด้วย
 * เพิ่มเองได้ผ่าน env: PREVIEW_HOSTS=demo.example.com,foo.local
 */
const hostname = os.hostname();
const dnsDomain = process.env.USERDNSDOMAIN; // มีเฉพาะเครื่องที่อยู่ใน Windows domain

const allowedHosts = [
  ...new Set(
    [
      'localhost',
      hostname,
      ...(dnsDomain ? [`${hostname}.${dnsDomain}`, `.${dnsDomain}`] : []),
      '.local', // ชื่อแบบ mDNS ที่ Mac/Linux ในวงเดียวกันใช้เรียก
      ...(process.env.PREVIEW_HOSTS?.split(',').map((h) => h.trim()).filter(Boolean) ?? []),
    ]
      // เบราว์เซอร์ส่ง Host header เป็นตัวพิมพ์เล็กเสมอ แต่ชื่อเครื่องบน Windows เป็นตัวใหญ่
      // ถ้าไม่ใส่ทั้งสองแบบ การเข้าผ่านชื่อสั้นจะได้ 403 ทั้งที่ FQDN เข้าได้
      .flatMap((h) => [h, h.toLowerCase()]),
  ),
];

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },

  /* ---------- เซิร์ฟเวอร์ตอนพัฒนา ---------- */
  server: {
    // ล็อกพอร์ตไว้ ไม่ให้เลื่อนไป 5174 เองเวลาพอร์ตชน
    // strictPort ทำให้ error แทนที่จะเปลี่ยนพอร์ตเงียบๆ ซึ่งทำให้ URL ที่ส่งให้คนอื่นใช้ไม่ได้
    port: 5173,
    strictPort: true,
    allowedHosts,
  },

  /* ---------- เซิร์ฟเวอร์สำหรับให้คนอื่นเปิดดู ---------- */
  preview: {
    // host: true = ผูกกับทุก network interface เครื่องอื่นในวงแลนจึงเข้าได้
    host: true,
    port: 4173,
    strictPort: true,
    allowedHosts,
  },

  build: {
    rollupOptions: {
      output: {
        // three.js must land in its own chunk so non-3D themes never fetch it
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
        },
      },
    },
  },
});
