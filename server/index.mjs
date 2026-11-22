import fastify from "fastify";

const app = fastify({ logger: true });
const caseStatuses = ["รับเรื่องแล้ว", "รอตรวจสอบ", "กำลังตรวจสอบ", "จ่ายงาน", "กำลังเดินทาง", "ถึงจุดเกิดเหตุ", "ช่วยเหลือแล้ว"];

let nextId = 2405;
const cases = [
  { id: "FM-DEMO-2401", kind: "help", title: "ขออพยพผู้สูงอายุ", location: "จุดตัวอย่าง C", urgency: "เร่งด่วน", time: "14:12 น.", status: "รับเรื่องแล้ว", detail: "มีผู้สูงอายุ 1 คน ต้องการความช่วยเหลือในการเดินทาง" },
  { id: "FM-DEMO-2402", kind: "report", title: "มีน้ำขังบนถนนชุมชน", location: "จุดตัวอย่าง A", urgency: "ปกติ", time: "14:08 น.", status: "รอตรวจสอบ", detail: "รายงานชุมชนตัวอย่าง · ยังไม่ยืนยัน" },
  { id: "FM-DEMO-2403", kind: "report", title: "น้ำเริ่มเอ่อใกล้ทางแยก", location: "จุดตัวอย่าง B", urgency: "เฝ้าระวัง", time: "13:52 น.", status: "รอตรวจสอบ", detail: "รายงานชุมชนตัวอย่าง · ยังไม่ยืนยัน" },
  { id: "FM-DEMO-2404", kind: "supply", title: "ขอถุงยังชีพ 1 ชุด", location: "จุดตัวอย่าง E", urgency: "ปกติ", time: "13:40 น.", status: "รับเรื่องแล้ว", detail: "รองรับผู้รับ 1 คน · คำขอตัวอย่าง" },
];

const places = [
  { id: "PLACE-DEMO-01", name: "ศูนย์พักพิงชุมชน", type: "shelter", location: { lat: 18.795, lng: 98.99 }, status: "เปิดให้บริการ", updatedAt: "14:20 น. · ข้อมูลจำลอง", capacity: "ตัวอย่าง" },
  { id: "PLACE-DEMO-02", name: "จุดจอดรถยกระดับ", type: "parking", location: { lat: 18.801, lng: 98.982 }, status: "มีพื้นที่จอด", updatedAt: "14:15 น. · ข้อมูลจำลอง", capacity: "ตัวอย่าง" },
  { id: "PLACE-DEMO-03", name: "จุดรวมพลโรงเรียน", type: "assembly-point", location: { lat: 18.789, lng: 99.004 }, status: "กำลังตรวจสอบ", updatedAt: "13:55 น. · ข้อมูลจำลอง", capacity: "ตัวอย่าง" },
];

const sensors = [
  { id: "SENSOR-DEMO-01", name: "สถานีวัดระดับน้ำ · จุดตัวอย่าง D", status: "offline", lastSeenMinutes: 18, confidence: "ลดความเชื่อมั่น", location: { lat: 18.8, lng: 98.99 } },
  { id: "SENSOR-DEMO-02", name: "เครื่องวัดฝน · จุดตัวอย่าง A", status: "online", lastSeenMinutes: 1, confidence: "ปกติ", location: { lat: 18.792, lng: 98.976 } },
];

const forecasts = [
  { id: "FC-DEMO-01", area: "พื้นที่ตัวอย่าง A", period: "อีก 3–4 ชั่วโมง", risk: "เฝ้าระวัง", confidence: "จำลอง", source: "ตัวอย่างเพื่อสาธิต", updatedAt: "14:20 น." },
  { id: "FC-DEMO-02", area: "พื้นที่ตัวอย่าง B", period: "อีก 3–4 ชั่วโมง", risk: "มีโอกาสท่วม", confidence: "จำลอง", source: "ตัวอย่างเพื่อสาธิต", updatedAt: "14:20 น." },
];

// Deliberately synthetic history. Values are for UI exploration, not sensor readings.
const waterLevelHistory = [
  { time: "08:00", levelCm: 42, confidence: "จำลอง" },
  { time: "09:00", levelCm: 44, confidence: "จำลอง" },
  { time: "10:00", levelCm: 47, confidence: "จำลอง" },
  { time: "11:00", levelCm: 51, confidence: "จำลอง" },
  { time: "12:00", levelCm: 55, confidence: "จำลอง" },
  { time: "13:00", levelCm: 61, confidence: "จำลอง" },
  { time: "14:00", levelCm: 64, confidence: "จำลอง" },
];

const reservoirs = [
  { id: "DAM-DEMO-01", name: "อ่างเก็บน้ำตัวอย่างเหนือ", levelPercent: 68, trend: "เพิ่มขึ้น", updatedAt: "14:00 น. · จำลอง", confidence: "ไม่ใช่ข้อมูลจริง" },
  { id: "DAM-DEMO-02", name: "อ่างเก็บน้ำตัวอย่างตะวันตก", levelPercent: 54, trend: "ทรงตัว", updatedAt: "13:30 น. · จำลอง", confidence: "ไม่ใช่ข้อมูลจริง" },
];

const routeEvaluations = {
  car: { vehicleLabel: "รถเก๋ง", status: "เส้นทางตัวอย่าง · ควรตรวจสอบซ้ำ", distance: "ประมาณ 4.8 กม.", duration: "18 นาที*", warning: "หลีกเลี่ยงถนนชุมชนริมน้ำ เส้นทางนี้เป็นการจำลอง ไม่มีข้อมูลถนนจริง", steps: "ถนนสายหลัก → ทางยกระดับ → ปลายทาง", caution: false },
  motorcycle: { vehicleLabel: "มอเตอร์ไซค์", status: "มีจุดเสี่ยง · ควรระวัง", distance: "ประมาณ 5.1 กม.", duration: "17 นาที*", warning: "หลีกเลี่ยงบริเวณน้ำขังและกระแสน้ำ รถจักรยานยนต์เสียการทรงตัวได้ง่าย", steps: "เส้นทางเหนือ → จุดกลับรถ → ปลายทาง", caution: true },
  pickup: { vehicleLabel: "รถกระบะยกสูง", status: "ข้อมูลไม่พอสำหรับยืนยัน", distance: "ประมาณ 4.8 กม.", duration: "18 นาที*", warning: "รถยกสูงไม่ได้แปลว่าผ่านน้ำท่วมหรือกระแสน้ำได้อย่างปลอดภัย อย่าฝ่าจุดน้ำท่วม", steps: "มีทางเลือกบนถนนหลัก · ตรวจสอบหน้างาน", caution: true },
  bus: { vehicleLabel: "รถเมล์", status: "เส้นทางตัวอย่าง · จำกัดการเข้าถึง", distance: "ประมาณ 6.2 กม.", duration: "25 นาที*", warning: "ต้องยืนยันถนนที่รถใหญ่ผ่านได้และสถานะปลายทางก่อนเดินทาง", steps: "ถนนสายหลัก → จุดจอดที่กำหนด → ปลายทาง", caution: true },
  boat: { vehicleLabel: "เรือ", status: "ไม่มีข้อมูลเส้นทางเรือ", distance: "ยังคำนวณไม่ได้", duration: "—", warning: "ไม่มีข้อมูลกระแสน้ำและสิ่งกีดขวางที่ตรวจสอบได้ ห้ามใช้ถนนเป็นเส้นทางเรือ", steps: "ติดต่อทีมปฏิบัติการในพื้นที่ก่อนออกเรือ", caution: true },
};

function getTimestamp() {
  return `${new Intl.DateTimeFormat("th-TH", { hour: "2-digit", minute: "2-digit" }).format(new Date())} น.`;
}

function validateCaseBody(body) {
  if (!body || typeof body !== "object") return "ต้องส่งข้อมูลเป็น JSON object";
  if (!body.title || typeof body.title !== "string" || !body.title.trim()) return "กรุณาระบุหัวข้อ";
  if (!body.location || typeof body.location !== "string" || !body.location.trim()) return "กรุณาระบุตำแหน่ง";
  if (body.title.length > 180 || body.location.length > 240) return "ข้อความยาวเกินกำหนด";
  return null;
}

function createCase(kind, body) {
  const invalid = validateCaseBody(body);
  if (invalid) return { error: invalid };
  const item = {
    id: `FM-DEMO-${nextId++}`,
    kind,
    title: body.title.trim(),
    location: body.location.trim(),
    urgency: body.urgency ?? "ปกติ",
    time: getTimestamp(),
    status: body.status ?? (kind === "report" ? "รอตรวจสอบ" : "รับเรื่องแล้ว"),
    detail: typeof body.detail === "string" ? body.detail.slice(0, 600) : "",
  };
  cases.unshift(item);
  return { case: item };
}

app.get("/api/health", async () => ({ status: "ok", mode: "mock", message: "Mock API พร้อมใช้งาน", dataResetsOnRestart: true }));

app.get("/api/overview", async () => ({
  mode: "mock",
  watchAreas: 4,
  pendingReports: cases.filter((item) => item.kind === "report" && item.status === "รอตรวจสอบ").length,
  safePlaces: places.length,
  forecasts: forecasts.length,
  updatedAt: getTimestamp(),
}));

app.get("/api/cases", async (request) => {
  const kind = request.query?.kind;
  return { cases: kind ? cases.filter((item) => item.kind === kind) : cases };
});

app.get("/api/cases/:id", async (request, reply) => {
  const item = cases.find((entry) => entry.id === request.params.id);
  if (!item) return reply.code(404).send({ error: "ไม่พบเคสตัวอย่างนี้" });
  return { case: item };
});

app.post("/api/reports", async (request, reply) => {
  const result = createCase("report", request.body);
  if (result.error) return reply.code(400).send({ error: result.error });
  return reply.code(201).send(result);
});

app.post("/api/help-requests", async (request, reply) => {
  const result = createCase("help", { ...request.body, urgency: "เร่งด่วน", status: "รับเรื่องแล้ว" });
  if (result.error) return reply.code(400).send({ error: result.error });
  return reply.code(201).send(result);
});

app.post("/api/supply-requests", async (request, reply) => {
  const result = createCase("supply", { ...request.body, urgency: "ปกติ", status: "รับเรื่องแล้ว" });
  if (result.error) return reply.code(400).send({ error: result.error });
  return reply.code(201).send(result);
});

app.patch("/api/cases/:id/status", async (request, reply) => {
  const { status } = request.body ?? {};
  if (!caseStatuses.includes(status)) return reply.code(400).send({ error: "สถานะไม่ถูกต้อง" });
  const item = cases.find((entry) => entry.id === request.params.id);
  if (!item) return reply.code(404).send({ error: "ไม่พบเคสตัวอย่างนี้" });
  item.status = status;
  item.updatedAt = getTimestamp();
  return { case: item };
});

app.get("/api/places", async () => ({ places }));
app.get("/api/forecasts", async () => ({ forecasts, horizonHours: 4, mode: "mock" }));
app.get("/api/sensors", async () => ({ sensors }));
app.get("/api/water-levels/history", async () => ({
  station: "สถานีวัดระดับน้ำตัวอย่าง D",
  unit: "cm",
  window: "ย้อนหลัง 6 ชั่วโมง",
  points: waterLevelHistory,
  mode: "mock",
  source: "ข้อมูลสังเคราะห์เพื่อสาธิต ไม่ใช่ค่าจากเซนเซอร์",
}));
app.get("/api/reservoirs", async () => ({ reservoirs, mode: "mock" }));

app.post("/api/sensors/:id/acknowledge", async (request, reply) => {
  const sensor = sensors.find((item) => item.id === request.params.id);
  if (!sensor) return reply.code(404).send({ error: "ไม่พบเซนเซอร์ตัวอย่างนี้" });
  return { sensor, message: "บันทึกการตรวจสอบตัวอย่างแล้ว" };
});

app.get("/api/routes/evaluate", async (request, reply) => {
  const { vehicle = "car", destination = "ปลายทางตัวอย่าง" } = request.query ?? {};
  const evaluation = routeEvaluations[vehicle];
  if (!evaluation) return reply.code(400).send({ error: "ประเภทรถไม่รองรับ" });
  if (typeof destination !== "string" || destination.length > 160) return reply.code(400).send({ error: "ปลายทางไม่ถูกต้อง" });
  return { evaluation: { ...evaluation, destination }, mode: "mock", warning: "ไม่ใช่ข้อมูลนำทางจริง" };
});

const port = Number(process.env.API_PORT ?? 8787);
const host = process.env.API_HOST ?? "127.0.0.1";

try {
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
