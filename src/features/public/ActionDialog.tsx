import { useState, type FormEvent } from "react";
import { guideCopy } from "../../data/demoData";
import type { CreateCaseInput, ModalState } from "../../types";
import { Icon } from "../../components/Icon";
import { ModalDialog } from "../../components/ModalDialog";

interface ActionDialogProps {
  modal: ModalState | null;
  onClose: () => void;
  onCreate: (draft: CreateCaseInput) => Promise<string>;
  onNotice: (title: string, detail?: string) => void;
}

export function ActionDialog({ modal, onClose, onCreate, onNotice }: ActionDialogProps) {
  const [helpType, setHelpType] = useState("ติดค้าง / อพยพ");
  if (!modal) return null;

  const title = modal.type === "guide" ? modal.title : modal.type === "help" ? "แจ้งเหตุฉุกเฉิน" : modal.type === "report" ? "แจ้งจุดเสี่ยงหรือเหตุ" : modal.type === "supply" ? "แจ้งจุดรับความช่วยเหลือ" : modal.type === "alerts" ? "การแจ้งเตือนพื้นที่" : "คุณควบคุมข้อมูลตำแหน่ง";
  const eyebrow = modal.type === "help" ? "ขอความช่วยเหลือ" : modal.type === "report" ? "รายงานจากชุมชน" : modal.type === "supply" ? "ขอรับถุงยังชีพ" : modal.type === "alerts" ? "ตัวอย่างประกาศ" : modal.type === "privacy" ? "ความเป็นส่วนตัว" : modal.type === "guide" ? "คำแนะนำเพื่อความปลอดภัย" : "ข้อมูลพื้นที่";
  const icon = modal.type === "help" ? "phone" : modal.type === "report" ? "alert" : modal.type === "supply" ? "box" : "water";
  const iconClass = modal.type === "help" || modal.type === "report" ? "modal-icon-red" : modal.type === "supply" || modal.type === "privacy" ? "modal-icon-green" : "modal-icon-amber";

  async function submitHelp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const type = String(values.get("type"));
    const people = String(values.get("people") || "1");
    const detail = String(values.get("detail") || "").trim();
    const hasContact = Boolean(String(values.get("contact") || "").trim());
    const sharing = values.get("share-location") === "on";
    const id = await onCreate({ kind: "help", title: `ขอความช่วยเหลือ: ${type}`, location: String(values.get("location")), urgency: "เร่งด่วน", detail: `${people} คน${hasContact ? " · มีเบอร์ติดต่อ" : ""}${detail ? ` · ${detail}` : ""}${sharing ? " · ยินยอมแชร์ตำแหน่ง (จำลอง)" : ""}` });
    onClose();
    onNotice("สร้างเคสตัวอย่างแล้ว", `${id} · ยังไม่มีทีมช่วยเหลือได้รับแจ้ง`);
    form.reset();
    setHelpType("ติดค้าง / อพยพ");
  }

  async function submitReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const type = String(values.get("type"));
    const detail = String(values.get("detail") || "").trim();
    const urgency = type.includes("ไฟรั่ว") || type.includes("สายไฟ") ? "เร่งด่วน" : "ปกติ";
    const id = await onCreate({ kind: "report", title: detail || type, location: String(values.get("location")), urgency, status: "รอตรวจสอบ", detail: `${type} · ${detail || "รอข้อมูลเพิ่มเติม"} · ยังไม่ยืนยัน` });
    onClose();
    onNotice("เพิ่มรายงานตัวอย่างแล้ว", `${id} · อยู่ระหว่างรอตรวจสอบ`);
    form.reset();
  }

  async function submitSupply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const count = String(values.get("count") || "1");
    const people = String(values.get("people") || "1");
    const needs = String(values.get("needs") || "").trim();
    const id = await onCreate({ kind: "supply", title: `ขอถุงยังชีพ ${count} ชุด`, location: String(values.get("location")), detail: `ผู้รับ ${people} คน${needs ? ` · ต้องการ ${needs}` : ""} · คำขอตัวอย่าง` });
    onClose();
    onNotice("เพิ่มคำขอถุงยังชีพตัวอย่างแล้ว", `${id} · ยังไม่มีทีมจัดส่งได้รับแจ้ง`);
    form.reset();
  }

  const demoCallout = <div className="demo-callout"><b>หน้าจอสาธิต</b>{modal.type === "help" ? "การส่งข้อมูลนี้จะสร้างเคสตัวอย่างในหน้านี้เท่านั้น ยังไม่มีทีมกู้ภัยได้รับแจ้ง" : modal.type === "report" ? "เหตุการณ์จะถูกบันทึกในตัวอย่างนี้เท่านั้น ไม่ได้ส่งถึงหน่วยงานหรือเจ้าหน้าที่จริง" : "คำขอนี้ยังไม่ได้ส่งให้ทีมจัดส่งจริง"}</div>;

  return (
    <ModalDialog onClose={onClose}>
      <div className="modal-card" aria-labelledby="dialog-title">
        <button className="modal-close" type="button" aria-label="ปิด" onClick={onClose}><Icon name="close" /></button>
        <div className="modal-eyebrow"><span className={`modal-icon ${iconClass}`}><Icon name={icon} /></span>{eyebrow}</div>
        <h2 id="dialog-title">{title}</h2>
        {modal.type === "help" && <><p className="modal-intro">แจ้งตำแหน่งและรายละเอียดให้ทีมช่วยเหลือ โดยไม่ต้องสมัครสมาชิก</p>{demoCallout}<form onSubmit={submitHelp}>
          <label className="field-label" htmlFor="help-type">ต้องการความช่วยเหลือเรื่อง</label><select id="help-type" name="type" onChange={(event) => setHelpType(event.target.value)} value={helpType}><option>ติดค้าง / อพยพ</option><option>ผู้บาดเจ็บ</option><option>สัตว์อันตราย</option><option>ไฟรั่ว / สายไฟตก</option><option>อื่น ๆ</option></select>
          {helpType === "สัตว์อันตราย" && <div className="inline-safety">อย่าเข้าใกล้สัตว์ ถ่ายภาพจากระยะปลอดภัยและรอทีมที่ได้รับมอบหมาย</div>}
          <label className="field-label" htmlFor="help-location">ตำแหน่ง</label><div className="input-action"><input id="help-location" name="location" defaultValue="ตำแหน่งตัวอย่าง · ปักหมุดบนแผนที่" required /><button type="button" onClick={() => onNotice("ต้นแบบนี้ไม่ได้เปิดใช้ GPS", "โปรดแก้ไขตำแหน่งตัวอย่างด้วยตนเอง")}>ใช้ตำแหน่งฉัน</button></div><small className="field-hint">ต้นแบบนี้ไม่ได้เชื่อม GPS จริง คุณสามารถแก้ไขตำแหน่งตัวอย่างได้</small>
          <div className="form-two"><div><label className="field-label" htmlFor="help-people">จำนวนผู้ประสบภัย</label><input id="help-people" name="people" type="number" min="1" defaultValue="1" required /></div><div><label className="field-label" htmlFor="help-contact">เบอร์ติดต่อ (ไม่บังคับ)</label><input id="help-contact" name="contact" type="tel" placeholder="08X-XXX-XXXX" /></div></div>
          <label className="field-label" htmlFor="help-detail">รายละเอียดเพิ่มเติม</label><textarea id="help-detail" name="detail" rows={3} placeholder="เช่น มีผู้สูงอายุ ผู้ป่วย หรือเด็กเล็ก" />
          <label className="consent-row"><input name="share-location" type="checkbox" /><span><b>ยินยอมแชร์ตำแหน่งระหว่างช่วยเหลือ</b><small>ตำแหน่งสดจะใช้เฉพาะเคสนี้และหยุดเมื่อปิดเคส · ในต้นแบบไม่มีการติดตามจริง</small></span></label>
          <button className="button button-danger modal-submit" type="submit"><Icon name="alert" />ส่งคำขอช่วยเหลือ</button>
        </form></>}
        {modal.type === "report" && <><p className="modal-intro">รายงานจะขึ้นสถานะรอตรวจสอบก่อนใช้ประกอบการแจ้งเตือน</p>{demoCallout}<form onSubmit={submitReport}>
          <label className="field-label" htmlFor="report-type">ประเภทเหตุ</label><select id="report-type" name="type"><option>น้ำท่วม / น้ำขัง</option><option>ถนนผ่านไม่ได้</option><option>ไฟรั่ว / สายไฟตก</option><option>พบสัตว์อันตราย</option><option>อื่น ๆ</option></select>
          <label className="field-label" htmlFor="report-location">ตำแหน่ง</label><input id="report-location" name="location" defaultValue="จุดตัวอย่าง C" required />
          <label className="field-label" htmlFor="report-detail">รายละเอียด</label><textarea id="report-detail" name="detail" rows={3} placeholder="บอกสิ่งที่พบและเวลาที่พบ" />
          <label className="field-label" htmlFor="report-photo">แนบภาพ (ไม่บังคับ)</label><input className="file-input" id="report-photo" type="file" accept="image/*" /><small className="field-hint">ต้นแบบนี้ไม่อัปโหลดหรือจัดเก็บไฟล์ภาพ</small>
          <button className="button button-primary modal-submit" type="submit">ส่งรายงานตัวอย่าง <span>→</span></button>
        </form></>}
        {modal.type === "supply" && <><p className="modal-intro">ระบุจำนวนชุดและคนที่ต้องการรับ ทีมช่วยเหลือจะพิจารณาจัดส่งตามความพร้อม</p>{demoCallout}<form onSubmit={submitSupply}>
          <label className="field-label" htmlFor="supply-location">ตำแหน่งที่ต้องการรับ</label><input id="supply-location" name="location" defaultValue="ตำแหน่งตัวอย่าง · ปักหมุดบนแผนที่" required />
          <div className="form-two"><div><label className="field-label" htmlFor="supply-count">จำนวนถุงยังชีพ</label><input id="supply-count" name="count" type="number" min="1" defaultValue="1" required /></div><div><label className="field-label" htmlFor="supply-people">จำนวนผู้รับ</label><input id="supply-people" name="people" type="number" min="1" defaultValue="1" required /></div></div>
          <label className="field-label" htmlFor="supply-needs">สิ่งจำเป็นเพิ่มเติม (ไม่บังคับ)</label><textarea id="supply-needs" name="needs" rows={2} placeholder="เช่น นมเด็ก ยาประจำตัว น้ำดื่ม" />
          <label className="field-label" htmlFor="supply-contact">เบอร์ติดต่อ (ไม่บังคับ)</label><input id="supply-contact" name="contact" type="tel" placeholder="08X-XXX-XXXX" />
          <button className="button button-primary modal-submit" type="submit">ส่งคำขอตัวอย่าง <span>→</span></button>
        </form></>}
        {modal.type === "alerts" && <><div className="alert-detail"><b>เฝ้าระวังฝนตกหนักและน้ำเพิ่ม</b><p>พื้นที่สาธิต · ตัวอย่างการคาดการณ์ช่วง 3–4 ชั่วโมง ข้อมูลนี้ไม่ได้อ้างอิงสภาพอากาศจริง</p><small><Icon name="clock" />ข้อมูลตัวอย่าง · 14:20 น. · ความเชื่อมั่นจำลอง</small></div><div className="alert-detail alert-detail-soft"><b>รายงานจากชุมชน</b><p>ทั้งสองรายการยังไม่ผ่านการตรวจสอบ กรุณาใช้ความระมัดระวังและสังเกตสภาพจริง</p></div><button className="button button-primary modal-submit" type="button" onClick={onClose}>รับทราบ</button></>}
        {modal.type === "guide" && <><div className="guide-modal-content"><ul>{(guideCopy[modal.title] ?? []).map((line) => <li key={line}>{line}</li>)}</ul></div><p className="fine-print">เนื้อหาในต้นแบบเป็นคำแนะนำทั่วไป โปรดทำตามประกาศและคำแนะนำจากผู้เชี่ยวชาญในพื้นที่</p></>}
        {modal.type === "privacy" && <><p>ต้นแบบนี้ไม่ส่งข้อมูลออกจากเครื่อง ไม่ใช้ GPS จริง และไม่อัปโหลดภาพ การแชร์ตำแหน่งสดในระบบจริงควรเริ่มเมื่อผู้ใช้ร้องขอและยินยอมเท่านั้น พร้อมจำกัดผู้เข้าถึงและหยุดแชร์เมื่อปิดเคส</p><button className="button button-primary modal-submit" type="button" onClick={onClose}>เข้าใจแล้ว</button></>}
      </div>
    </ModalDialog>
  );
}
