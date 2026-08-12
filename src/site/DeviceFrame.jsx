import { cn } from '@/lib/cn';

export const DEVICES = {
  mobile: { id: 'mobile', width: 390, icon: 'menu', labelKey: 'compare.mobile' },
  tablet: { id: 'tablet', width: 768, icon: 'grid', labelKey: 'compare.tablet' },
  desktop: { id: 'desktop', width: 1280, icon: 'layers', labelKey: 'compare.desktop' },
};
export const DEVICE_IDS = Object.keys(DEVICES);

/**
 * กรอบเครื่อง — เส้นแบ่งสายตาระหว่างเปลือกสตูดิโอกับหน้าจอที่กำลังประเมิน
 * ถ้าไม่มีกรอบนี้ ธีมมืดจะกลืนไปกับเปลือกจนแยกไม่ออกว่าอะไรเป็นของใคร
 *
 * ตั้ง width จริงบนเนื้อหาแล้วค่อย scale ทั้งกรอบ
 * เพื่อให้ breakpoint ของ Tailwind ข้างในทำงานตามความกว้างจริง ไม่ใช่ความกว้างหลังย่อ
 */
export function DeviceFrame({ width, scale = 1, height, className, children }) {
  return (
    <div
      className={cn('shrink-0', className)}
      style={{ width: width * scale, height: height ? height * scale : undefined }}
    >
      <div
        className="device-frame bg-black"
        style={{
          width,
          height,
          transform: scale === 1 ? undefined : `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default DeviceFrame;
