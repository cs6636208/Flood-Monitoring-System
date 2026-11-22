import type { FloodCase } from "../../types";
import { Icon } from "../../components/Icon";

interface CommunityReportsProps {
  reports: FloodCase[];
  onReport: () => void;
}

export function CommunityReports({ reports, onReport }: CommunityReportsProps) {
  return (
    <section className="report-section panel">
      <div className="report-heading"><div><div className="eyebrow eyebrow-muted">COMMUNITY REPORTS</div><h2>รายงานจากชุมชน</h2><p>ช่วยกันแจ้งจุดเสี่ยง ข้อมูลใหม่จะยังไม่ยืนยันจนกว่าจะได้รับการตรวจสอบ</p></div><button className="button button-outline" type="button" onClick={onReport}><Icon name="alert" />แจ้งเหตุ</button></div>
      <div className="report-list">{reports.length ? reports.slice(0, 4).map((report) => {
        const verified = ["ถึงจุดเกิดเหตุ", "ช่วยเหลือแล้ว"].includes(report.status);
        return <article className="report-card" key={report.id}><span className={`report-status ${verified ? "status-confirmed" : "status-review"}`}>{verified ? "ตรวจสอบแล้ว" : report.status === "กำลังตรวจสอบ" ? "กำลังตรวจสอบ" : "รอตรวจสอบ"}</span><div className="report-main"><b>{report.title}</b><span><Icon name="pin" />{report.location} · รายงานเมื่อ {report.time}</span></div><span className="report-type">{report.urgency === "เร่งด่วน" ? "เร่งด่วน" : "รายงานชุมชน"}</span></article>;
      }) : <div className="empty-cases">ยังไม่มีรายงานในตัวอย่างนี้</div>}</div>
    </section>
  );
}
