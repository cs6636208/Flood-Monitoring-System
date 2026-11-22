import { useEffect, useState } from "react";
import { Icon } from "./Icon";

interface SiteHeaderProps {
  backendStatus: "connecting" | "connected" | "offline";
  onOpenTeam: () => void;
  onOpenHelp: () => void;
}

const backendLabels = { connecting: "กำลังเชื่อม Mock API", connected: "Mock API พร้อมใช้", offline: "โหมดข้อมูลในหน้าเว็บ" };

export function SiteHeader({ backendStatus, onOpenTeam, onOpenHelp }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("map-section");

  useEffect(() => {
    const sectionIds = ["map-section", "safe-section", "guide-section"];

    function updateActiveSection() {
      const headerBottom = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 78;
      const activationLine = headerBottom + 26;
      let currentSection = sectionIds[0];

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= activationLine) currentSection = id;
      }

      const pageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
      if (pageBottom) currentSection = "guide-section";
      setActiveSection((current) => current === currentSection ? current : currentSection);
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  const navItems = [
    { id: "map-section", label: "แผนที่" },
    { id: "safe-section", label: "จุดปลอดภัย" },
    { id: "guide-section", label: "คำแนะนำ" },
  ];

  return (
    <>
      <div className="demo-ribbon"><span className="demo-dot" />ตัวอย่างระบบ · ข้อมูลจำลอง ไม่ใช่สถานการณ์จริง <span className={`api-state api-${backendStatus}`} aria-live="polite">{backendLabels[backendStatus]}</span></div>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="น้ำทัน หน้าหลัก">
          <span className="brand-mark"><Icon name="water" /></span>
          <span><b>น้ำทัน</b><small>FLOOD MONITOR THAILAND</small></span>
        </a>
        <nav className={`main-nav${menuOpen ? " nav-open" : ""}`} aria-label="เมนูหลัก">
          {navItems.map((item) => <a
            className={`nav-link${activeSection === item.id ? " active" : ""}`}
            href={`#${item.id}`}
            key={item.id}
            aria-current={activeSection === item.id ? "location" : undefined}
            onClick={() => { setActiveSection(item.id); setMenuOpen(false); }}
          >{item.label}</a>)}
        </nav>
        <div className="header-actions">
          <button className="icon-button mobile-menu" type="button" aria-label="เปิดเมนู" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><Icon name="menu" /></button>
          <button className="button button-quiet team-toggle" type="button" onClick={onOpenTeam}><span className="team-status" />หน้าทีมช่วยเหลือ</button>
          <button className="button button-danger header-sos" type="button" onClick={onOpenHelp}><Icon name="alert" />ขอความช่วยเหลือ</button>
        </div>
      </header>
    </>
  );
}
