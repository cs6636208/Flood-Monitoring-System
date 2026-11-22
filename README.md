# น้ำทัน — Flood Monitor Thailand

โปรเจกต์ต้นแบบ Mock Full Stack สำหรับระบบเฝ้าระวังน้ำท่วมในประเทศไทย มีหน้าประชาชน หน้าทีมช่วยเหลือ และ API จำลอง ใช้ React, TypeScript, Vite, Tailwind CSS และ Fastify

## เปิดโปรเจกต์ใน VS Code

เปิดไฟล์ `Flood-Monitoring-System.code-workspace` หรือเลือก **File → Open Folder...** แล้วเลือกโฟลเดอร์นี้

## เริ่มทำงาน

ต้องใช้ Node.js 20.19 ขึ้นไป และ npm เปิด Terminal ใน VS Code ที่โฟลเดอร์โปรเจกต์ แล้วรัน:

```powershell
npm install
npm run dev
```

คำสั่งนี้เปิดทั้งเว็บและ Mock API พร้อมกัน:

- เว็บ: `http://127.0.0.1:5173`
- Mock API: `http://127.0.0.1:8787/api/health`

กด `Ctrl+C` ใน Terminal เพื่อหยุดทั้งสองส่วน

ถ้าต้องการเปิดแยกกัน ให้ใช้ `npm run dev:api` และ `npm run dev:web` ในคนละ Terminal

สร้างรุ่นสำหรับเผยแพร่และเปิดดูในเครื่อง:

```powershell
npm run build
npm run preview
```

## โครงสร้าง

```text
.
├─ .vscode/                  # การตั้งค่า workspace และส่วนขยายแนะนำ
├─ archive/static-prototype/ # ต้นแบบ HTML เดิมที่เก็บไว้เป็นข้อมูลอ้างอิง
├─ docs/                     # เอกสารออกแบบระบบ
├─ public/                   # ไฟล์สาธารณะ เช่น favicon
├─ src/
│  ├─ components/            # ส่วนประกอบที่ใช้ร่วมกัน
│  ├─ data/                  # ข้อมูลจำลองและตัวอย่างเส้นทาง
│  ├─ features/
│  │  ├─ public/             # ประสบการณ์ประชาชน
│  │  └─ team/               # หน้าทีมช่วยเหลือ
│  ├─ hooks/                 # สถานะและ logic ของหน้าจอ
│  ├─ services/api.ts         # จุดเชื่อมต่อระหว่างหน้าเว็บกับ API
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ styles.css
├─ server/index.mjs           # Fastify Mock API และข้อมูลในหน่วยความจำ
├─ scripts/dev.mjs            # เปิดเว็บกับ API ในคำสั่งเดียว
├─ .env.example
├─ Flood-Monitoring-System.code-workspace
├─ index.html
├─ package.json
├─ tsconfig.json
└─ vite.config.ts
```

## ความสามารถที่ทดลองได้

- ดูแผนที่ตัวอย่าง จุดเฝ้าระวัง จุดปลอดภัย และรายงานจากชุมชน
- ค้นหาเส้นทางตัวอย่าง พร้อมคำเตือนแยกตามรถเก๋ง มอเตอร์ไซค์ รถกระบะยกสูง รถเมล์ และเรือ
- ส่งรายงานเหตุ ขอความช่วยเหลือ หรือขอถุงยังชีพได้โดยไม่สมัครบัญชี
- เปิดหน้าทีมช่วยเหลือ กรองเคส และเปลี่ยนสถานะงาน
- ดูตัวอย่างสุขภาพเซนเซอร์ ขยายแผนที่ และอ่านคำแนะนำความปลอดภัย
- ดูกราฟแนวโน้มระดับน้ำย้อนหลังและระดับอ่างเก็บน้ำตัวอย่างที่โหลดผ่าน API

## Mock API ที่ทดลองได้

- `GET /api/health`, `/api/overview`, `/api/cases`, `/api/cases/:id`
- `POST /api/reports`, `/api/help-requests`, `/api/supply-requests`
- `PATCH /api/cases/:id/status`
- `GET /api/places`, `/api/forecasts`, `/api/sensors`
- `GET /api/water-levels/history`, `/api/reservoirs`
- `POST /api/sensors/:id/acknowledge`
- `GET /api/routes/evaluate?vehicle=car&destination=...`

หน้าเว็บโหลดรายการเคส สร้างเคส และเปลี่ยนสถานะผ่าน HTTP API ส่วนเส้นทางเรียก API เพื่อเลือกผลจำลองตามประเภทรถ แถบด้านบนแสดงสถานะการเชื่อมต่อ หาก API ไม่พร้อม หน้าเว็บจะใช้ข้อมูลตัวอย่างในเครื่องเพื่อให้ยังทดลองหน้าจอได้

## ขอบเขตของต้นแบบ

API เก็บข้อมูลในหน่วยความจำ ข้อมูลที่สร้างหรือแก้ไขจะหายเมื่อปิดหรือเริ่ม API ใหม่ ทั้งเว็บและ API ใช้ข้อมูลจำลองเท่านั้น ไม่มีข้อมูลน้ำหรืออากาศจริง การนำทางจริง GPS การอัปโหลดภาพ การส่ง LINE/SMS การแจ้งหน่วยงาน หรือการ dispatch ทีมกู้ภัย ห้ามใช้ต้นแบบนี้วางแผนการเดินทางหรือรับมือเหตุจริง

หน้าทีมช่วยเหลือยังไม่ต้องล็อกอินเพื่อให้ทดลองได้ ก่อนใช้งานจริงต้องเพิ่มฐานข้อมูลถาวร การยืนยันตัวตนเจ้าหน้าที่และสิทธิ์ตามบทบาท audit log การจัดเก็บข้อมูลอย่างปลอดภัย ผู้ให้บริการแผนที่/เส้นทาง แหล่งข้อมูลและแบบจำลองที่ผ่านการตรวจสอบ ตลอดจนช่องทางแจ้งเตือนและการประสานทีมภาคสนาม

เอกสารข้อกำหนดและภาพรวมระบบอยู่ใน [docs/FLOOD_MONITORING_SYSTEM_DESIGN.md](docs/FLOOD_MONITORING_SYSTEM_DESIGN.md)
ตารางตรวจ requirement ทั้ง 29 ข้อและช่องว่างก่อนใช้งานจริงอยู่ใน [docs/REQUIREMENTS_TRACEABILITY.md](docs/REQUIREMENTS_TRACEABILITY.md)
