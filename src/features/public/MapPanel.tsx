import { useEffect, useState } from "react";
import { Icon } from "../../components/Icon";

interface MapPanelProps {
  timestamp: string;
  onNotice: (title: string, detail: string) => void;
}

const markers = [
  { id: "flood-a", label: "จุดรายงานน้ำท่วม", icon: "water" as const, className: "marker-danger", style: { left: "48%", top: "46%" } },
  { id: "flood-b", label: "จุดเฝ้าระวังน้ำเพิ่ม", icon: "alert" as const, className: "marker-danger marker-two", style: { left: "66%", top: "29%" } },
  { id: "shelter-a", label: "ศูนย์พักพิงชุมชน", icon: "shelter" as const, className: "marker-safe marker-three", style: { left: "73%", top: "68%" } },
  { id: "parking-a", label: "จุดจอดรถปลอดภัย", icon: "car" as const, className: "marker-safe marker-four", style: { left: "23%", top: "34%" } },
];

export function MapPanel({ timestamp, onNotice }: MapPanelProps) {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("map-open", fullscreen);
    return () => document.body.classList.remove("map-open");
  }, [fullscreen]);

  useEffect(() => {
    if (!fullscreen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [fullscreen]);

  return (
    <section className="map-panel panel" aria-labelledby="map-title" id="map-section">
      <div className="section-heading map-heading">
        <div><div className="eyebrow eyebrow-muted">SITUATION MAP</div><h2 id="map-title">แผนที่ความเสี่ยง</h2><p>พื้นที่สาธิต · อ.เมืองเชียงใหม่</p></div>
        <div className="map-controls"><button className="select-button" type="button" onClick={() => onNotice("พื้นที่แผนที่สาธิต", "ข้อมูลไม่ได้เชื่อมกับตำแหน่งจริง")}>⌖ <span>พื้นที่ตัวอย่าง</span><b>⌄</b></button><button className="icon-button map-expand" type="button" aria-label={fullscreen ? "ย่อแผนที่" : "ขยายแผนที่"} onClick={() => setFullscreen((value) => !value)}>{fullscreen ? "×" : "⤢"}</button></div>
      </div>
      <div className={`map-view${fullscreen ? " map-fullscreen" : ""}`} role="group" aria-label="แผนที่สาธิต">
        <div className="map-grid" />
        <svg className="map-art" viewBox="0 0 900 570" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <path className="map-block" d="M0 0h900v570H0z" />
          <path className="park" d="M571 17c44 10 74 50 54 88-19 37-39 56-19 91 18 32-4 69-47 63-41-6-55-34-72-70-18-39-48-64-31-108C473 39 522 5 571 17Z" />
          <path className="park" d="M91 346c36-15 63 5 77 34 13 28 4 57-28 73-34 17-72 4-81-24-9-29-2-69 32-83Z" />
          <path className="road road-major" d="M-30 117C149 148 233 180 370 157s274-79 564-27" /><path className="road road-major" d="M104-34c-6 135 69 213 124 300s81 166 66 343" /><path className="road road-major" d="M-30 433c180-63 319-68 450-40s262 85 521 55" />
          <path className="road" d="M29 242c116 13 187 42 260 27s148-68 220-60 173 52 330 21" /><path className="road" d="M373-20c21 109 46 186 44 260s-25 154 17 349" /><path className="road" d="M692-12c-34 84-41 165-21 242s71 144 73 255" /><path className="road" d="M8 511c116-69 193-109 301-106s221 61 306 43 179-89 316-106" />
          <path className="road-local" d="M35 48c93 33 138 70 196 80m-175 176c70-34 130-52 195-47m83-220c-20 57-24 103-2 151m45 298c-11-70-6-116 28-173m145-263c49 19 92 36 138 31m82 164c46-10 103-10 166 6M508 328c54-24 101-28 154-13M196 512c29-47 63-74 113-91" />
          <path className="river" d="M-40 301c99-37 153-16 230 12s129 48 204 29 131-74 217-77 164 36 226 18 77-43 108-55" />
          <path className="river-highlight" d="M-40 301c99-37 153-16 230 12s129 48 204 29 131-74 217-77 164 36 226 18 77-43 108-55" />
          <path className="flood-zone" d="M283 228c40-35 100-41 144-22 35 15 51 50 29 82-28 39-68 54-123 50-49-3-89-33-87-63 1-19 17-35 37-47Z" />
          <path className="flood-zone flood-zone-light" d="M630 360c46-27 106-25 130 8s11 72-27 92-93 16-120-12-19-65 17-88Z" />
          <path className="route-line route-safe" d="M122 186c76 22 112 46 152 81s68 64 125 66 106-22 141-57 55-78 105-102 110-13 168 13" />
          <path className="route-line route-caution" d="M122 186c52 21 92 22 130 44s75 45 92 78 10 66-17 95-71 50-93 84" />
          <g className="map-label"><rect x="356" y="265" width="96" height="27" rx="8" /><text x="404" y="283" textAnchor="middle">ลำน้ำตัวอย่าง</text></g>
          <g className="map-label map-label-muted"><rect x="590" y="65" width="105" height="26" rx="8" /><text x="642" y="82" textAnchor="middle">สวนสาธารณะ</text></g>
        </svg>
        <span className="map-road-label road-label-one">ถนนสายหลัก</span><span className="map-road-label road-label-two">ถนนชุมชน</span>
        {markers.map((marker) => <button className={`map-marker ${marker.className}`} key={marker.id} style={marker.style} type="button" aria-label={marker.label} onClick={() => onNotice(marker.label, "ตำแหน่งและสถานะเป็นข้อมูลจำลอง")}><span><Icon name={marker.icon} /></span></button>)}
        <div className="map-legend"><span><i className="legend-dot dot-danger" />เฝ้าระวัง</span><span><i className="legend-dot dot-safe" />จุดปลอดภัย</span><span><i className="legend-line" />เส้นทางแนะนำ</span></div>
        <div className="map-compass">N<br /><span>↑</span></div>
        {fullscreen && <button className="map-close" type="button" onClick={() => setFullscreen(false)}>ย่อแผนที่ ×</button>}
        <div className="map-watermark">แผนที่จำลอง · ไม่ใช่แผนที่นำทางจริง</div>
      </div>
      <div className="map-footer"><span className="freshness"><i className="fresh-dot" />ข้อมูลสาธิต · อัปเดต {timestamp}</span><span className="text-button">ข้อมูลจำลอง</span></div>
    </section>
  );
}
