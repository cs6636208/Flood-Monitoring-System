import { useState } from "react";
import type { FloodCase, ModalState } from "../../types";
import { Icon } from "../../components/Icon";
import { CommunityReports } from "./CommunityReports";
import { MapPanel } from "./MapPanel";
import { RoutePlanner } from "./RoutePlanner";
import { SafetyPlaces } from "./SafetyPlaces";
import { WaterInsights } from "./WaterInsights";
import { AlertSettings } from "./AlertSettings";
import { CaseTracking } from "./CaseTracking";

interface PublicDashboardProps {
  cases: FloodCase[];
  onOpenModal: (modal: ModalState) => void;
  onNotice: (title: string, detail: string) => void;
}

export function PublicDashboard({ cases, onOpenModal, onNotice }: PublicDashboardProps) {
  const [timestamp, setTimestamp] = useState("14:20 น.");
  const reports = cases.filter((item) => item.kind === "report");
  const pendingReports = reports.filter((item) => !["ถึงจุดเกิดเหตุ", "ช่วยเหลือแล้ว"].includes(item.status)).length;

  function refreshDemo() {
    const time = new Intl.DateTimeFormat("th-TH", { hour: "2-digit", minute: "2-digit" }).format(new Date());
    setTimestamp(`${time} น.`);
    onNotice("รีเฟรชหน้าจอตัวอย่างแล้ว", "ไม่มีการดึงข้อมูลสถานการณ์จริง");
  }

  return (
    <main id="home">
      <section className="dashboard-intro">
        <div className="dashboard-title">
          <div className="eyebrow"><span className="pulse" />FLOOD SITUATION · DEMO</div>
          <h1>สถานการณ์น้ำท่วม <span>ประเทศไทย</span></h1>
          <p>ตรวจสอบพื้นที่เสี่ยง จุดปลอดภัย และเส้นทางก่อนออกจากบ้าน</p>
        </div>
        <div className="dashboard-controls">
          <button className="area-select" type="button" onClick={() => onNotice("พื้นที่ตัวอย่าง", "ในต้นแบบนี้แสดงพื้นที่สาธิต อ.เมืองเชียงใหม่")}><Icon name="pin" /><span><small>พื้นที่ที่เลือก</small><b>อ.เมืองเชียงใหม่</b></span><i>⌄</i></button>
          <div className="updated-indicator"><span className="updated-dot" /><span><small>ข้อมูลจำลอง</small><b>อัปเดต {timestamp}</b></span></div>
        </div>
      </section>

      <section className="alert-strip" aria-label="ประกาศเฝ้าระวัง"><div className="alert-symbol"><Icon name="alert" /></div><div className="alert-text"><b>เฝ้าระวังฝนตกหนักในพื้นที่ตัวอย่าง</b><span>เป็นข้อมูลจำลองเพื่อสาธิตหน้าจอ · โปรดตรวจสอบสภาพจริงก่อนเดินทาง</span></div><button className="alert-more" type="button" onClick={() => onOpenModal({ type: "alerts" })}>ดูการแจ้งเตือน <span>→</span></button></section>

      <section className="quick-stats" aria-label="สรุปสถานการณ์ตัวอย่าง"><article className="stat-card"><span className="stat-icon stat-amber"><Icon name="water" /></span><div><small>พื้นที่เฝ้าระวัง</small><b>4 <span>จุด</span></b></div><span className="stat-note">ข้อมูลจำลอง</span></article><article className="stat-card"><span className="stat-icon stat-red"><Icon name="alert" /></span><div><small>รายงานที่ต้องตรวจสอบ</small><b>{pendingReports} <span>รายการ</span></b></div><span className="stat-note">ยังไม่ยืนยัน</span></article><article className="stat-card"><span className="stat-icon stat-green"><Icon name="shelter" /></span><div><small>จุดปลอดภัยใกล้เคียง</small><b>3 <span>แห่ง</span></b></div><span className="stat-note">สถานะตัวอย่าง</span></article><article className="stat-card"><span className="stat-icon stat-blue"><Icon name="route" /></span><div><small>เส้นทางที่ตรวจสอบ</small><b>2 <span>เส้นทาง</span></b></div><span className="stat-note">จำลองตามประเภทรถ</span></article></section>

      <section className="content-grid"><MapPanel timestamp={timestamp} onNotice={onNotice} /><aside className="side-column"><RoutePlanner onNotice={onNotice} /><SafetyPlaces onNotice={onNotice} /></aside></section>

      <WaterInsights />

      <div className="map-refresh-row"><span>แผนที่สาธิต · สภาพจริงอาจต่างจากตัวอย่าง</span><button className="text-button" type="button" onClick={refreshDemo}>↻ รีเฟรชข้อมูลตัวอย่าง</button></div>

      <CommunityReports reports={reports} onReport={() => onOpenModal({ type: "report" })} />

      <CaseTracking cases={cases} />

      <section className="guide-section" id="guide-section"><div className="guide-heading"><div><div className="eyebrow eyebrow-muted">BE FLOOD READY</div><h2>เตรียมพร้อม ลดความเสี่ยง</h2></div><span className="guide-note">คำแนะนำทั่วไป · ทำตามคำแนะนำจากผู้เชี่ยวชาญในพื้นที่</span></div><div className="guide-grid"><article className="guide-card"><span className="guide-num">01</span><span className="guide-icon guide-amber"><Icon name="alert" /></span><h3>ก่อนออกเดินทาง</h3><p>ตรวจเส้นทางและสถานะปลายทาง เตรียมยา น้ำดื่ม โทรศัพท์ และแบตเตอรี่สำรอง</p><button type="button" onClick={() => onOpenModal({ type: "guide", title: "ก่อนออกเดินทาง" })}>อ่านคำแนะนำ <span>→</span></button></article><article className="guide-card"><span className="guide-num">02</span><span className="guide-icon guide-blue"><Icon name="water" /></span><h3>เมื่อเจอน้ำท่วม</h3><p>อย่าฝ่ากระแสน้ำหรือขับผ่านจุดที่มองไม่เห็นพื้นถนน หากไม่มั่นใจให้หยุดในที่ปลอดภัย</p><button type="button" onClick={() => onOpenModal({ type: "guide", title: "เมื่อเจอน้ำท่วม" })}>อ่านคำแนะนำ <span>→</span></button></article><article className="guide-card"><span className="guide-num">03</span><span className="guide-icon guide-red"><Icon name="phone" /></span><h3>ไฟฟ้าและสัตว์อันตราย</h3><p>หลีกเลี่ยงสายไฟที่ตกหรือบริเวณไฟรั่ว อย่าเข้าใกล้สัตว์อันตราย แจ้งเหตุจากระยะปลอดภัย</p><button type="button" onClick={() => onOpenModal({ type: "guide", title: "ไฟฟ้าและสัตว์อันตราย" })}>อ่านคำแนะนำ <span>→</span></button></article></div></section>

      <AlertSettings onNotice={onNotice} />

      <section className="community-cta"><span className="cta-mark"><Icon name="box" /></span><div><b>ต้องการถุงยังชีพ?</b><p>ปักจุดรับและระบุจำนวนที่ต้องการ ทีมช่วยเหลือจะอัปเดตสถานะคำขอให้</p></div><button className="button button-white" type="button" onClick={() => onOpenModal({ type: "supply" })}>ขอถุงยังชีพ <span>→</span></button></section>

      <footer className="site-footer"><div className="footer-brand"><span className="brand-mark"><Icon name="water" /></span><b>น้ำทัน</b></div><p>Flood Monitor Thailand · ช่วยให้ทุกคนเข้าถึงข้อมูลและความช่วยเหลือได้ง่ายขึ้น</p><div className="footer-meta"><span>ไม่ต้องสมัครสมาชิก</span><span>•</span><span>ข้อมูลจำลองเพื่อสาธิต</span><button type="button" onClick={() => onOpenModal({ type: "privacy" })}>ความเป็นส่วนตัว</button></div></footer>
      <nav className="mobile-bottom-nav" aria-label="เมนูหลัก">
        <a href="#map-section"><Icon name="pin" /><span>แผนที่</span></a>
        <a href="#safe-section"><Icon name="shelter" /><span>จุดปลอดภัย</span></a>
        <a href="#guide-section"><Icon name="check" /><span>คำแนะนำ</span></a>
        <a href="#alerts-section"><Icon name="rain" /><span>แจ้งเตือน</span></a>
      </nav>
    </main>
  );
}
