import { useEffect, useState } from "react";
import { Icon } from "../../components/Icon";
import { floodApi, type ReservoirSummary, type WaterHistory } from "../../services/api";

export function WaterInsights() {
  const [history, setHistory] = useState<WaterHistory | null>(null);
  const [reservoirs, setReservoirs] = useState<ReservoirSummary[]>([]);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    let active = true;
    void Promise.all([floodApi.waterHistory(), floodApi.reservoirs()])
      .then(([waterData, reservoirData]) => {
        if (!active) return;
        setHistory(waterData);
        setReservoirs(reservoirData);
      })
      .catch(() => { if (active) setAvailable(false); });
    return () => { active = false; };
  }, []);

  const points = history?.points ?? [];
  const min = Math.min(...points.map((point) => point.levelCm), 0);
  const max = Math.max(...points.map((point) => point.levelCm), 80);
  const chartPoints = points.map((point, index) => {
    const x = points.length === 1 ? 50 : (index / (points.length - 1)) * 100;
    const y = 88 - ((point.levelCm - min) / Math.max(max - min, 1)) * 72;
    return { ...point, x, y };
  });
  const chartPath = chartPoints.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
  const chartArea = chartPath ? `${chartPath} L 100 100 L 0 100 Z` : "";

  return (
    <section className="water-insights" aria-labelledby="water-insights-title">
      <div className="insights-heading">
        <div><span className="eyebrow eyebrow-muted">WATER WATCH</span><h2 id="water-insights-title">แนวโน้มระดับน้ำและเขื่อน</h2><p>ดูแนวโน้มย้อนหลังประกอบการเฝ้าระวัง</p></div>
        <span className="insights-demo"><i />ข้อมูลจำลอง</span>
      </div>
      {!available ? <div className="insights-offline">เชื่อมต่อ API ไม่ได้ · ลองเปิดระบบใหม่อีกครั้ง</div> : <div className="insights-grid">
        <article className="water-chart-card">
          <div className="chart-title"><span><b>{history?.station ?? "สถานีวัดระดับน้ำตัวอย่าง"}</b><small>{history?.window ?? "กำลังโหลดข้อมูล"}</small></span><span className="chart-current">{points.at(-1)?.levelCm ?? "—"} <small>ซม.</small></span></div>
          <div className="chart-wrap" role="img" aria-label="กราฟแนวโน้มระดับน้ำจำลองย้อนหลัง 6 ชั่วโมง">
            <div className="chart-grid-lines"><i /><i /><i /></div>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <defs><linearGradient id="water-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#12836d" stopOpacity=".24" /><stop offset="100%" stopColor="#12836d" stopOpacity=".015" /></linearGradient></defs>
              {chartArea && <path d={chartArea} fill="url(#water-fill)" />}
              {chartPath && <path d={chartPath} fill="none" stroke="#10816a" strokeWidth="1.7" vectorEffect="non-scaling-stroke" />}
              {chartPoints.map((point) => <circle key={point.time} cx={point.x} cy={point.y} r="1.8" fill="#fff" stroke="#10816a" strokeWidth="1.2" vectorEffect="non-scaling-stroke"><title>{point.time} · {point.levelCm} ซม.</title></circle>)}
            </svg>
          </div>
          <div className="chart-labels">{points.map((point) => <span key={point.time}>{point.time}</span>)}</div>
          <p className="chart-disclaimer"><Icon name="alert" />{history?.source ?? "ค่าตัวอย่าง ไม่ใช่ข้อมูลจากเซนเซอร์จริง"}</p>
        </article>
        <article className="reservoir-card">
          <div className="reservoir-heading"><span className="reservoir-icon"><Icon name="water" /></span><div><b>สถานะอ่างเก็บน้ำ</b><small>แสดงระดับตัวอย่าง</small></div></div>
          <div className="reservoir-list">{reservoirs.map((reservoir) => <div className="reservoir-item" key={reservoir.id}>
            <div className="reservoir-item-top"><b>{reservoir.name}</b><span>{reservoir.levelPercent}%</span></div>
            <div className="reservoir-progress"><i style={{ width: `${reservoir.levelPercent}%` }} /></div>
            <small>{reservoir.trend} · {reservoir.updatedAt}</small>
          </div>)}</div>
          <p className="reservoir-disclaimer">ตัวเลขและเวลาเป็นข้อมูลสังเคราะห์เพื่อสาธิต</p>
        </article>
      </div>}
    </section>
  );
}
