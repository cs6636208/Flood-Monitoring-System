import { useState } from "react";
import { Icon } from "../../components/Icon";
import type { CaseKind, CaseStatus, FloodCase } from "../../types";
import type { IconName } from "../../components/Icon";

interface TeamDashboardProps {
  cases: FloodCase[];
  metrics: { openCases: number; urgentCases: number; supplyCases: number; pendingReports: number };
  onStatusChange: (id: string, status: CaseStatus) => void;
  onOpenPublic: () => void;
  onNotice: (title: string, detail: string) => void;
}

const statuses: CaseStatus[] = ["รับเรื่องแล้ว", "รอตรวจสอบ", "กำลังตรวจสอบ", "จ่ายงาน", "กำลังเดินทาง", "ถึงจุดเกิดเหตุ", "ช่วยเหลือแล้ว"];

function caseIcon(item: FloodCase): IconName {
  if (item.kind === "supply") return "box";
  if (item.kind === "report") return item.title.includes("น้ำ") ? "water" : "alert";
  return "phone";
}

export function TeamDashboard({ cases, metrics, onStatusChange, onOpenPublic, onNotice }: TeamDashboardProps) {
  const [filter, setFilter] = useState<"all" | CaseKind>("all");
  const [query, setQuery] = useState("");
  const urgencyRank = { เร่งด่วน: 0, เฝ้าระวัง: 1, ปกติ: 2 };
  const visibleCases = cases
    .filter((item) => filter === "all" || item.kind === filter)
    .filter((item) => !query || `${item.title} ${item.location} ${item.id}`.toLocaleLowerCase("th").includes(query.toLocaleLowerCase("th")))
    .sort((a, b) => urgencyRank[a.urgency] - urgencyRank[b.urgency]);

  return (
    <section className="team-view">
      <div className="team-topline"><div><div className="eyebrow eyebrow-muted"><span className="team-live-dot" />RESPONSE OPERATIONS · DEMO</div><h1>ศูนย์ประสานงานช่วยเหลือ</h1><p>จัดลำดับเหตุเร่งด่วน ติดตามสถานะ และประสานงานในพื้นที่</p></div><button className="button button-outline" type="button" onClick={onOpenPublic}>← กลับหน้าประชาชน</button></div>
      <div className="team-warning"><Icon name="alert" /><span><b>โหมดสาธิต</b>ไม่มีเจ้าหน้าที่รับแจ้งจริง และไม่มีการส่งเคสออกนอกอุปกรณ์นี้</span></div>
      <div className="team-metrics"><article><small>เคสที่ยังเปิด</small><b>{metrics.openCases}</b><span>กำลังติดตาม</span></article><article><small>เคสเร่งด่วน</small><b className="metric-red">{metrics.urgentCases}</b><span>จัดลำดับก่อน</span></article><article><small>คำขอถุงยังชีพ</small><b>{metrics.supplyCases}</b><span>รอการจัดส่ง</span></article><article><small>เซนเซอร์ขาดสัญญาณ</small><b className="metric-amber">1</b><span>ต้องตรวจสอบ</span></article></div>
      <div className="team-layout"><section className="panel incident-panel"><div className="team-panel-heading"><div><h2>รายการเคส</h2><p>เคสเร่งด่วนจะแสดงก่อน</p></div><div className="case-tools"><label className="case-search"><Icon name="search" /><input aria-label="ค้นหาเคส" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาตำแหน่งหรือเลขเคส" /></label><label className="sr-only" htmlFor="case-filter">กรองรายการเคส</label><select id="case-filter" value={filter} onChange={(event) => setFilter(event.target.value as "all" | CaseKind)}><option value="all">ทุกเคส</option><option value="help">ขอความช่วยเหลือ</option><option value="report">รายงานเหตุ</option><option value="supply">ถุงยังชีพ</option></select></div></div>
        <div className="incident-list">{visibleCases.length ? visibleCases.map((item) => {
          const priorityClass = item.urgency === "เร่งด่วน" ? "" : item.urgency === "เฝ้าระวัง" ? " priority-amber" : " priority-green";
          const statusClass = item.status === "ช่วยเหลือแล้ว" ? " case-done" : item.status === "กำลังเดินทาง" ? " case-enroute" : item.urgency === "เร่งด่วน" ? " case-red" : "";
          const kindLabel = item.kind === "help" ? "ขอความช่วยเหลือ" : item.kind === "report" ? "รายงานเหตุ" : "ถุงยังชีพ";
          return <article className="incident-item" key={item.id}><span className={`incident-priority${priorityClass}`}><Icon name={caseIcon(item)} /></span><div className="incident-copy"><div className="incident-title">{item.title}</div><div className="incident-meta"><span>{kindLabel}</span><span>·</span><span>{item.location}</span><span>·</span><span>{item.time}</span><span>·</span><span>{item.id}</span></div><p className="incident-description">{item.detail || "ยังไม่มีรายละเอียดเพิ่มเติม"}</p></div><div className="incident-actions"><span className={`case-status${statusClass}`}>{item.status}</span><select aria-label={`อัปเดตสถานะ ${item.id}`} value={item.status} onChange={(event) => onStatusChange(item.id, event.target.value as CaseStatus)}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></div></article>;
        }) : <div className="empty-cases">ไม่มีเคสในหมวดนี้</div>}</div>
      </section>
      <aside className="team-aside"><section className="panel sensor-panel"><div className="team-panel-heading"><div><h2>สุขภาพเซนเซอร์</h2><p>ตัวอย่างการตรวจสัญญาณ</p></div><span className="sensor-badge">1 ต้องตรวจสอบ</span></div><div className="sensor-row"><span className="sensor-light sensor-down" /><div><b>สถานีวัดระดับน้ำ · จุดตัวอย่าง D</b><small>ขาดสัญญาณ 18 นาที · ข้อมูลถูกลดความเชื่อมั่น</small></div><button className="icon-button" type="button" aria-label="ยืนยันตรวจเซนเซอร์" onClick={() => onNotice("บันทึกผลตรวจเซนเซอร์แล้ว", "การเปลี่ยนแปลงนี้เป็นข้อมูลจำลอง")}><Icon name="check" /></button></div><div className="sensor-row"><span className="sensor-light" /><div><b>เครื่องวัดฝน · จุดตัวอย่าง A</b><small>ทำงานปกติ · ข้อมูลสาธิต</small></div><span className="sensor-ok">ปกติ</span></div></section>
        <section className="panel team-map-card"><div className="team-panel-heading"><div><h2>ภาพรวมพื้นที่</h2><p>ตำแหน่งและขอบเขตจำลอง</p></div><span className="live-pill"><i />DEMO</span></div><div className="mini-map"><div className="mini-river" /><span className="mini-point mini-p1">!</span><span className="mini-point mini-p2">!</span><span className="mini-point mini-p3">+</span><span className="mini-map-label">พื้นที่สาธิต</span></div><div className="team-map-foot"><span>รายงานที่รอตรวจสอบ <b>{metrics.pendingReports}</b></span><button className="text-button" type="button" onClick={onOpenPublic}>เปิดแผนที่ →</button></div></section></aside></div>
      <footer className="team-footer">น้ำทัน · ศูนย์ประสานงานช่วยเหลือ · หน้าจอสาธิต · ไม่มีข้อมูลบุคคลจริง</footer>
    </section>
  );
}
