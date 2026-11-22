import { useState, type FormEvent } from "react";
import { routeEvaluations } from "../../data/demoData";
import type { RouteEvaluation, VehicleType } from "../../types";
import { Icon } from "../../components/Icon";
import { floodApi } from "../../services/api";

interface RoutePlannerProps {
  onNotice: (title: string, detail: string) => void;
}

const vehicles: { id: VehicleType; label: string; icon: "car" | "boat"; glyph?: string }[] = [
  { id: "car", label: "รถเก๋ง", icon: "car" },
  { id: "motorcycle", label: "มอเตอร์ไซค์", icon: "car", glyph: "◉" },
  { id: "pickup", label: "กระบะยกสูง", icon: "car", glyph: "▰" },
  { id: "bus", label: "รถเมล์", icon: "car", glyph: "▤" },
  { id: "boat", label: "เรือ", icon: "boat" },
];

export function RoutePlanner({ onNotice }: RoutePlannerProps) {
  const [vehicle, setVehicle] = useState<VehicleType>("car");
  const [destination, setDestination] = useState("");
  const [route, setRoute] = useState<RouteEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  async function submitRoute(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!destination.trim()) return;
    setIsEvaluating(true);
    try {
      setRoute(await floodApi.evaluateRoute(vehicle, destination.trim()));
    } catch {
      setRoute(routeEvaluations[vehicle]);
    } finally {
      setIsEvaluating(false);
    }
    onNotice("แสดงการประเมินเส้นทางจำลอง", "ไม่ใช่ข้อมูลนำทางหรือสภาพถนนจริง");
  }

  return (
    <section className="panel route-panel" aria-labelledby="route-title">
      <div className="section-heading compact-heading"><div><div className="eyebrow eyebrow-muted">SAFE ROUTE</div><h2 id="route-title">ตรวจสอบเส้นทาง</h2></div><span className="mini-icon"><Icon name="route" /></span></div>
      <form className="route-form" onSubmit={submitRoute}>
        <label className="field-label" htmlFor="route-from">จุดเริ่มต้น</label><div className="input-with-icon"><Icon name="pin" /><input id="route-from" value="ตำแหน่งของฉัน" readOnly /></div>
        <label className="field-label" htmlFor="route-to">ปลายทาง</label><div className="input-with-icon"><Icon name="pin" /><input id="route-to" value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="เช่น ศูนย์พักพิง" required /></div>
        <span className="field-label">เดินทางด้วย</span>
        <div className="vehicle-select" role="group" aria-label="เลือกประเภทรถ">
          {vehicles.map((item) => <button aria-pressed={vehicle === item.id} className={`vehicle-option${vehicle === item.id ? " selected" : ""}`} data-vehicle={item.id} key={item.id} onClick={() => setVehicle(item.id)} type="button">{item.glyph ? <span className="vehicle-emoji">{item.glyph}</span> : <Icon name={item.icon} />}<span>{item.label}</span></button>)}
        </div>
        <button className="button button-primary route-submit" type="submit" disabled={isEvaluating}>{isEvaluating ? "กำลังประเมิน…" : <>ค้นหาเส้นทางปลอดภัย <span>→</span></>}</button>
      </form>
      <div className="route-result" aria-live="polite">
        {route ? <div className="route-result-card"><div className="route-result-top"><b>{route.vehicleLabel} · ไป {destination}</b><span className="route-badge">{route.status}</span></div><div className="route-details"><span>{route.distance}</span><span>{route.duration}</span></div><div className={`route-warning${route.caution ? " warn-red" : ""}`}>{route.warning}</div><div className="route-steps">{route.steps}</div></div> : <div className="result-placeholder"><span className="route-empty-icon"><Icon name="route" /></span><span>กรอกปลายทางเพื่อดูตัวอย่างการประเมินเส้นทาง</span></div>}
      </div>
      <p className="fine-print">ข้อมูลเส้นทางจำลอง โปรดตรวจสอบสภาพจริง และหลีกเลี่ยงกระแสน้ำเชี่ยว</p>
    </section>
  );
}
