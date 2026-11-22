import { useEffect, useState } from "react";
import { SiteHeader } from "./components/SiteHeader";
import { ActionDialog } from "./features/public/ActionDialog";
import { PublicDashboard } from "./features/public/PublicDashboard";
import { TeamDashboard } from "./features/team/TeamDashboard";
import { useDemoCases } from "./hooks/useDemoCases";
import type { ModalState } from "./types";

interface ToastMessage {
  title: string;
  detail: string;
}

export function App() {
  const [view, setView] = useState<"public" | "team">("public");
  const [modal, setModal] = useState<ModalState | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const { cases, createCase, updateCaseStatus, metrics, backendStatus } = useDemoCases();

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function notify(title: string, detail = "") {
    setToast({ title, detail });
  }

  async function addCase(input: Parameters<typeof createCase>[0]) {
    return (await createCase(input)).id;
  }

  function openModal(next: ModalState) {
    setModal(next);
  }

  return (
    <>
      {view === "public" && <><SiteHeader backendStatus={backendStatus} onOpenTeam={() => setView("team")} onOpenHelp={() => openModal({ type: "help" })} /><PublicDashboard cases={cases} onOpenModal={openModal} onNotice={notify} /></>}
      {view === "team" && <TeamDashboard cases={cases} metrics={metrics} onStatusChange={updateCaseStatus} onOpenPublic={() => setView("public")} onNotice={notify} />}
      <ActionDialog modal={modal} onClose={() => setModal(null)} onCreate={addCase} onNotice={notify} />
      <div className="toast-region" role="status" aria-live="polite">{toast && <div className="toast">{toast.title}{toast.detail && <small>{toast.detail}</small>}</div>}</div>
    </>
  );
}
