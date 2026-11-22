import { useState } from "react";
import { Icon } from "../../components/Icon";

interface AlertSettingsProps {
  onNotice: (title: string, detail: string) => void;
}

export function AlertSettings({ onNotice }: AlertSettingsProps) {
  const [enabled, setEnabled] = useState({ area: true, journey: false, local: true, line: true, sms: true });
  function toggle(key: keyof typeof enabled) {
    setEnabled((value) => ({ ...value, [key]: !value[key] }));
  }

  return (
    <section className="alert-settings panel" id="alerts-section" aria-labelledby="alert-settings-title">
      <div className="settings-heading"><span className="settings-icon"><Icon name="rain" /></span><div><span className="eyebrow eyebrow-muted">ALERT PREFERENCES · DEMO</span><h2 id="alert-settings-title">ตั้งค่าการแจ้งเตือน</h2><p>เลือกพื้นที่และช่องทางรับการเตือนล่วงหน้า</p></div></div>
      <label className="settings-field"><span>เบอร์โทรศัพท์ <small>(ไม่บังคับ)</small></span><input type="tel" placeholder="08X-XXX-XXXX" /></label>
      <label className="settings-field"><span>ข้อความแจ้งเตือน <small>ใช้ส่ง SMS (จำลอง)</small></span><input type="text" placeholder="เช่น ขอรับแจ้งเตือนน้ำท่วม" /></label>
      <div className="settings-group"><b>พื้นที่ที่ติดตาม</b>
        <button className="setting-row" type="button" aria-pressed={enabled.area} onClick={() => toggle("area")}><span><b>บ้าน</b><small>แขวงบางซื่อ เขตบางซื่อ</small></span><i className={enabled.area ? "toggle-on" : ""} /></button>
        <button className="setting-row" type="button" aria-pressed={enabled.journey} onClick={() => toggle("journey")}><span><b>ที่ทำงาน</b><small>ยังไม่ได้ตั้งค่า</small></span><i className={enabled.journey ? "toggle-on" : ""} /></button>
      </div>
      <div className="settings-group"><b>ช่องทางแจ้งเตือน</b>
        <button className="setting-row" type="button" aria-pressed={enabled.local} onClick={() => toggle("local")}><span><b>แจ้งเตือนในแอป</b><small>แสดงประกาศสำคัญในหน้านี้</small></span><i className={enabled.local ? "toggle-on" : ""} /></button>
        <button className="setting-row" type="button" aria-pressed={enabled.line} onClick={() => toggle("line")}><span><b>LINE</b><small>การเชื่อมต่อจำลอง</small></span><i className={enabled.line ? "toggle-on" : ""} /></button>
        <button className="setting-row" type="button" aria-pressed={enabled.sms} onClick={() => toggle("sms")}><span><b>SMS</b><small>ไม่มีการส่งข้อความจริง</small></span><i className={enabled.sms ? "toggle-on" : ""} /></button>
      </div>
      <button className="button button-primary settings-save" type="button" onClick={() => onNotice("บันทึกค่าตัวอย่างแล้ว", "ยังไม่มีการส่ง LINE หรือ SMS จริง")}>บันทึกการตั้งค่า</button>
    </section>
  );
}
