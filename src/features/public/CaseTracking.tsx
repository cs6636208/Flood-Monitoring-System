import type { FloodCase } from "../../types";

interface CaseTrackingProps {
  cases: FloodCase[];
}

const progress: Record<string, number> = {
  "รับเรื่องแล้ว": 0,
  "รอตรวจสอบ": 0,
  "กำลังตรวจสอบ": 1,
  "จ่ายงาน": 2,
  "กำลังเดินทาง": 2,
  "ถึงจุดเกิดเหตุ": 3,
  "ช่วยเหลือแล้ว": 4,
};

const steps = ["รับเรื่อง", "มอบหมาย", "กำลังไป", "ถึงพื้นที่", "เสร็จสิ้น"];

export function CaseTracking({ cases }: CaseTrackingProps) {
  const activeCases = cases.filter((item) => item.kind !== "report").slice(0, 4);
  return (
    <section className="tracking-section panel" id="tracking-section">
      <div className="tracking-heading"><div><span className="eyebrow eyebrow-muted">REQUEST STATUS · DEMO</span><h2>ติดตามคำขอของฉัน</h2><p>ดูความคืบหน้าจากเลขเคส โดยไม่ต้องสมัครสมาชิก</p></div><span className="tracking-count">{activeCases.length} รายการ</span></div>
      <div className="tracking-list">{activeCases.length ? activeCases.map((item) => {
        const currentStep = progress[item.status] ?? 0;
        return <article className="tracking-item" key={item.id}>
          <div className="tracking-item-top"><div><b>{item.title}</b><small>{item.id} · {item.location} · {item.time}</small></div><span className={item.urgency === "เร่งด่วน" ? "tracking-priority urgent" : "tracking-priority"}>{item.urgency === "เร่งด่วน" ? "เร่งด่วน" : item.status}</span></div>
          <div className="tracking-steps">{steps.map((step, index) => <span className={index <= currentStep ? "step-done" : ""} key={step}><i />{step}</span>)}</div>
          <div className="tracking-item-foot"><span>สถานะล่าสุด</span><b>{item.status}</b></div>
        </article>;
      }) : <p className="tracking-empty">ยังไม่มีคำขอ · หากต้องการความช่วยเหลือ กดปุ่มขอความช่วยเหลือด้านบน</p>}</div>
    </section>
  );
}
