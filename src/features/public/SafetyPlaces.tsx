import { Icon } from "../../components/Icon";

interface SafetyPlacesProps {
  onNotice: (title: string, detail: string) => void;
}

const places = [
  { name: "ศูนย์พักพิงชุมชน", state: "เปิดให้บริการ · สถานะตัวอย่าง", distance: "1.2", icon: "shelter" as const, className: "place-green" },
  { name: "จุดจอดรถยกระดับ", state: "มีพื้นที่จอด · สถานะตัวอย่าง", distance: "1.8", icon: "car" as const, className: "place-blue" },
  { name: "จุดรวมพลโรงเรียน", state: "กำลังตรวจสอบสถานะ", distance: "2.4", icon: "phone" as const, className: "place-violet" },
];

export function SafetyPlaces({ onNotice }: SafetyPlacesProps) {
  return (
    <section className="panel nearby-panel" id="safe-section">
      <div className="section-heading compact-heading"><div><div className="eyebrow eyebrow-muted">NEAR YOU</div><h2>จุดปลอดภัยใกล้เคียง</h2></div><button className="text-button" type="button" onClick={() => onNotice("จุดปลอดภัยในพื้นที่สาธิต", "มีข้อมูลตัวอย่าง 3 แห่ง · โปรดยืนยันสถานะก่อนเดินทาง")}>ดูทั้งหมด →</button></div>
      <div className="place-list">{places.map((place) => <article className="place-card" key={place.name}><span className={`place-icon ${place.className}`}><Icon name={place.icon} /></span><div className="place-info"><b>{place.name}</b><small>{place.state}</small></div><span className="place-distance">{place.distance} <small>กม.</small></span></article>)}</div>
    </section>
  );
}
